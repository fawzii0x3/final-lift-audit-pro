import React, { useState, useRef, useEffect, use } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Upload, X, Eye } from "lucide-react";
import { AuthContext } from "@modules/shared/auth/context.tsx";
import {
  getImageUrl,
  uploadImage,
  removeImage,
} from "@modules/shared/api/image.tsx";

interface ImageUploadProps {
  value?: string;
  onChange: (imagePath: string | undefined) => void;
  bucket?: string;
  disabled?: boolean;
  className?: string;
  inspectionId?: string;
  context?: string;
  checkItemId?: string;
  onUploaded?: () => void;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  value,
  onChange,
  bucket = "attachments",
  disabled = false,
  className = "",
  inspectionId,
  context = "general",
  checkItemId,
  onUploaded,
}) => {
  const { user } = use(AuthContext);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [attachmentId, setAttachmentId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load existing attachment and generate signed URL
  useEffect(() => {
    const loadAttachment = async () => {
      if (value) {
        if (value.startsWith("http")) {
          // If value is already a signed URL, use it directly
          setPreview(value);
        } else if (value.includes("/")) {
          // If value contains a path, generate signed URL
          try {
            const signedUrl = await getImageUrl(value, bucket);
            if (signedUrl) {
              setPreview(signedUrl);
            }
          } catch (error) {
            console.error("Error generating signed URL:", error);
          }
        }
      }
    };

    loadAttachment();
  }, [value, bucket]);

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!user) {
      return; // User validation handled by service
    }

    setUploading(true);

    try {
      const result = await uploadImage(file, {
        bucket,
        inspectionId,
        context,
        checkItemId,
      });

      setPreview(result.signedUrl);
      setAttachmentId(result.attachmentId);
      onChange(result.path);
      try {
        onUploaded?.();
      } catch {}
    } catch (error) {
      console.error("Upload error:", error);
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = async () => {
    if (value) {
      try {
        await removeImage(value, {
          bucket,
          inspectionId,
        });
      } catch (error) {
        console.error("Error removing file:", error);
      }
    }

    setPreview(null);
    setAttachmentId(null);
    onChange(undefined);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={className}>
      <Input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        disabled={disabled || uploading}
        className="hidden"
      />

      {preview ? (
        <Card className="relative">
          <CardContent className="p-4">
            <div className="relative group">
              <img
                src={preview}
                alt="Preview"
                className="w-full h-32 object-cover rounded cursor-pointer"
              />
              <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded flex items-center justify-center gap-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      disabled={disabled || uploading}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl max-h-[90vh] p-0">
                    <div className="flex items-center justify-center p-4">
                      <img
                        src={preview}
                        alt="Full size preview"
                        className="max-w-full max-h-[80vh] object-contain rounded"
                      />
                    </div>
                  </DialogContent>
                </Dialog>
                {context !== "checklist_issue" && !disabled && (
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={handleRemove}
                    disabled={disabled || uploading}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-dashed">
          <CardContent className="p-4">
            <div
              className="flex flex-col items-center justify-center py-6 cursor-pointer hover:bg-muted/50 rounded transition-colors"
              onClick={handleUploadClick}
            >
              {uploading ? (
                <div className="flex flex-col items-center space-y-2">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  <Label className="text-sm text-muted-foreground">
                    Uploading...
                  </Label>
                </div>
              ) : (
                <div className="flex flex-col items-center space-y-2">
                  <Upload className="h-8 w-8 text-muted-foreground" />
                  <Label className="text-sm text-muted-foreground cursor-pointer">
                    Click to upload image
                  </Label>
                  <Label className="text-xs text-muted-foreground">
                    Max 5MB, JPEG/PNG/WebP
                  </Label>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
