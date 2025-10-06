import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@modules/shared/supabase";
import { QueryKeys } from "./const";

export interface UploadOptions {
  bucket?: string;
  inspectionId?: string;
  context?: string;
  checkItemId?: string;
  maxSize?: number; // in bytes
  allowedTypes?: string[];
}

export interface UploadResult {
  path: string;
  signedUrl: string | null;
  attachmentId?: string;
}

export interface Attachment {
  id: string;
  inspection_id: string;
  org_id: string;
  storage_path: string;
  context: string;
  check_item_id: string | null;
  uploaded_by: string;
  created_at: string;
}

class ImageUploadService {
  private defaultOptions: Required<UploadOptions> = {
    bucket: "attachments",
    inspectionId: "",
    context: "general",
    checkItemId: "",
    maxSize: 5 * 1024 * 1024, // 5MB
    allowedTypes: ["image/jpeg", "image/png", "image/webp", "image/jpg"],
  };

  /**
   * Upload an image file to Supabase storage
   */
  async uploadImage(
    file: File,
    options: UploadOptions = {},
  ): Promise<UploadResult> {
    const opts = { ...this.defaultOptions, ...options };

    // Validate file
    this.validateFile(file, opts);

    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      throw new Error("You must be logged in to upload images");
    }

    // Get user's org_id
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("org_id")
      .eq("id", user.id)
      .single();

    if (profileError) {
      throw new Error(`Failed to get user profile: ${profileError.message}`);
    }

    // Create structured file path: orgId/inspectionId/uuid.ext
    const fileExt = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const uuid = crypto.randomUUID();
    const fileName = opts.inspectionId
      ? `${profile.org_id}/${opts.inspectionId}/${uuid}.${fileExt}`
      : `${profile.org_id}/${uuid}.${fileExt}`;

    // Upload to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from(opts.bucket)
      .upload(fileName, file);

    if (uploadError) {
      throw new Error(`Upload failed: ${uploadError.message}`);
    }

    // Create attachment record in database if inspectionId is provided
    let attachmentId: string | undefined;
    if (opts.inspectionId) {
      try {
        const isUuid = this.isValidUUID(opts.checkItemId);
        const { data: attachmentData, error: attachmentError } = await supabase
          .from("attachments")
          .insert({
            inspection_id: opts.inspectionId,
            org_id: profile.org_id,
            storage_path: fileName,
            context: opts.context,
            check_item_id: isUuid ? opts.checkItemId : null,
            uploaded_by: user.id,
          })
          .select("id")
          .single();

        if (attachmentError) {
          console.error("Error creating attachment record:", attachmentError);
          // Don't throw here - the file is uploaded, just log the error
        } else {
          attachmentId = attachmentData.id;
        }
      } catch (error) {
        console.error("Failed to create attachment record:", error);
      }
    }

    // Generate signed URL for preview
    const { data: signedUrlData } = await supabase.storage
      .from(opts.bucket)
      .createSignedUrl(fileName, 3600); // 1 hour expiry

    return {
      path: fileName,
      signedUrl: signedUrlData?.signedUrl || null,
      attachmentId,
    };
  }

  /**
   * Remove an image from storage and database
   */
  async removeImage(path: string, options: UploadOptions = {}): Promise<void> {
    const opts = { ...this.defaultOptions, ...options };

    try {
      // Remove from storage
      const { error: storageError } = await supabase.storage
        .from(opts.bucket)
        .remove([path]);

      if (storageError) {
        console.warn("Failed to remove file from storage:", storageError);
      }

      // Remove attachment record from database
      if (opts.inspectionId) {
        const { error: dbError } = await supabase
          .from("attachments")
          .delete()
          .eq("storage_path", path)
          .eq("inspection_id", opts.inspectionId);

        if (dbError) {
          console.warn("Failed to remove attachment record:", dbError);
        }
      }
    } catch (error) {
      console.error("Error removing image:", error);
      throw new Error("Failed to remove image completely");
    }
  }

  /**
   * Get signed URL for an existing image
   */
  async getSignedUrl(
    path: string,
    bucket: string = "attachments",
    expiresIn: number = 3600,
  ): Promise<string | null> {
    try {
      const { data } = await supabase.storage
        .from(bucket)
        .createSignedUrl(path, expiresIn);

      return data?.signedUrl || null;
    } catch (error) {
      console.error("Error generating signed URL:", error);
      return null;
    }
  }

  /**
   * Get attachments for an inspection
   */
  async getAttachments(
    inspectionId: string,
    context?: string,
  ): Promise<Attachment[]> {
    const { data, error } = await supabase
      .from("attachments")
      .select("*")
      .eq("inspection_id", inspectionId)
      .eq(context ? "context" : "id", context || "id")
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch attachments: ${error.message}`);
    }

    return data || [];
  }

  /**
   * Validate file before upload
   */
  private validateFile(file: File, options: Required<UploadOptions>): void {
    // Check file type
    if (!options.allowedTypes.includes(file.type)) {
      throw new Error(
        `Invalid file type. Allowed types: ${options.allowedTypes.join(", ")}`,
      );
    }

    // Check file size
    if (file.size > options.maxSize) {
      const maxSizeMB = Math.round(options.maxSize / (1024 * 1024));
      throw new Error(`File too large. Maximum size: ${maxSizeMB}MB`);
    }

    // Check if file has content
    if (file.size === 0) {
      throw new Error("File is empty");
    }
  }

  /**
   * Check if string is a valid UUID
   */
  private isValidUUID(str: string): boolean {
    return (
      typeof str === "string" &&
      /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/.test(
        str,
      )
    );
  }
}

// Export singleton instance
export const imageUploadService = new ImageUploadService();

// React Query Hooks

/**
 * Hook to upload an image
 */
export function useUploadImage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      file,
      options,
    }: {
      file: File;
      options?: UploadOptions;
    }) => {
      const result = await imageUploadService.uploadImage(file, options);
      return result;
    },
    onSuccess: (_data, variables) => {
      toast.success("Image uploaded successfully");

      // Invalidate attachments query if inspectionId is provided
      if (variables.options?.inspectionId) {
        queryClient.invalidateQueries({
          queryKey: [QueryKeys.ATTACHMENTS, variables.options.inspectionId],
        });
      }
    },
    onError: (error) => {
      const message =
        error instanceof Error ? error.message : "Failed to upload image";
      toast.error(message);
    },
  });
}

/**
 * Hook to remove an image
 */
export function useRemoveImage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      path,
      options,
    }: {
      path: string;
      options?: UploadOptions;
    }) => {
      await imageUploadService.removeImage(path, options);
    },
    onSuccess: (_, variables) => {
      toast.success("Image removed successfully");

      // Invalidate attachments query if inspectionId is provided
      if (variables.options?.inspectionId) {
        queryClient.invalidateQueries({
          queryKey: [QueryKeys.ATTACHMENTS, variables.options.inspectionId],
        });
      }
    },
    onError: (error) => {
      const message =
        error instanceof Error ? error.message : "Failed to remove image";
      toast.error(message);
    },
  });
}

/**
 * Hook to get signed URL for an image
 */
export function useImageUrl(path: string, bucket?: string, expiresIn?: number) {
  return useQuery({
    queryKey: [QueryKeys.IMAGE_URL, path, bucket, expiresIn],
    queryFn: async () => {
      return await imageUploadService.getSignedUrl(path, bucket, expiresIn);
    },
    enabled: !!path,
    staleTime: 30 * 60 * 1000, // 30 minutes
    gcTime: 60 * 60 * 1000, // 1 hour
  });
}

/**
 * Hook to get attachments for an inspection
 */
export function useAttachments(inspectionId: string, context?: string) {
  return useQuery({
    queryKey: [QueryKeys.ATTACHMENTS, inspectionId, context],
    queryFn: async () => {
      return await imageUploadService.getAttachments(inspectionId, context);
    },
    enabled: !!inspectionId,
  });
}

/**
 * Hook to get attachments with signed URLs
 */
export function useAttachmentsWithUrls(inspectionId: string, context?: string) {
  const { data: attachments, ...rest } = useAttachments(inspectionId, context);

  // Get all unique storage paths
  const storagePaths =
    attachments?.map((attachment) => attachment.storage_path) || [];
  const uniquePaths = [...new Set(storagePaths)];

  // Use a single query to get all signed URLs
  const { data: urlData, isLoading: isLoadingUrls } = useQuery({
    queryKey: [QueryKeys.IMAGE_URL, "multiple", uniquePaths],
    queryFn: async () => {
      const urlPromises = uniquePaths.map((path) =>
        imageUploadService.getSignedUrl(path),
      );
      const urls = await Promise.all(urlPromises);
      return urls;
    },
    enabled: uniquePaths.length > 0,
    staleTime: 30 * 60 * 1000, // 30 minutes
    gcTime: 60 * 60 * 1000, // 1 hour
  });

  // Create a map of path to signed URL for quick lookup
  const pathToUrlMap = new Map<string, string | null>();
  uniquePaths.forEach((path, index) => {
    pathToUrlMap.set(path, urlData?.[index] || null);
  });

  const attachmentsWithUrls = attachments?.map((attachment) => {
    const signedUrl = pathToUrlMap.get(attachment.storage_path);
    return {
      ...attachment,
      signedUrl,
      isLoadingUrl: isLoadingUrls,
    };
  });

  return {
    attachments: attachmentsWithUrls,
    ...rest,
    isLoading: rest.isLoading || isLoadingUrls,
  };
}

// Export convenience functions (for backward compatibility)
export async function uploadImage(
  file: File,
  options?: UploadOptions,
): Promise<UploadResult> {
  try {
    const result = await imageUploadService.uploadImage(file, options);
    toast.success("Image uploaded successfully");
    return result;
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to upload image";
    toast.error(message);
    throw error;
  }
}

export async function removeImage(
  path: string,
  options?: UploadOptions,
): Promise<void> {
  try {
    await imageUploadService.removeImage(path, options);
    toast.success("Image removed successfully");
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to remove image";
    toast.error(message);
    throw error;
  }
}

export async function getImageUrl(
  path: string,
  bucket?: string,
): Promise<string | null> {
  return imageUploadService.getSignedUrl(path, bucket);
}
