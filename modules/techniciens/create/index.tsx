import { useState } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, UserPlus, User, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import { useCreateTechnician } from "@modules/shared/api";
import { Routes } from "@modules/shared/routes";
import { useCreateForm } from "@modules/shared/components/form/use-form";
import { z } from "zod";

const createTechnicianSchema = z.object({
  displayName: z.string().min(1, "Display name is required"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type CreateTechnicianForm = z.infer<typeof createTechnicianSchema>;

const TechnicianCreate = () => {
  const navigate = useNavigate();
  const { mutateAsync: createTechnician, isPending } = useCreateTechnician();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { createField, Form, form } = useCreateForm(createTechnicianSchema, {
    defaultValues: {
      displayName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const generatePassword = () => {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
    let password = "";
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    // Update both password fields with the generated password
    form.setValue("password", password);
    form.setValue("confirmPassword", password);
    
    toast.success("Password generated successfully!");
  };

  const handleCreateTechnician = async (data: CreateTechnicianForm) => {
    try {
      await createTechnician({
        displayName: data.displayName,
        email: data.email,
        password: data.password,
      });

      toast.success(`${data.displayName} has been successfully created as a technician. They can now log in with their email and password.`);
      navigate(Routes.TECHNICIANS);
    } catch (error) {
      console.error("Error creating technician:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to create technician. Please try again.";
      toast.error(errorMessage);
    }
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(Routes.TECHNICIANS)}
            className="p-2"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Create Technician</h1>
            <p className="text-muted-foreground">
              Create a new technician account for your organization
            </p>
          </div>
        </div>

        {/* Create Technician Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Technician Account Details
            </CardTitle>
            <CardDescription>
              Enter the details for the new technician account
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Form submitHandler={handleCreateTechnician} id="technician-form" className="space-y-6">
              {createField("displayName", "text", {
                label: "Display Name *",
                placeholder: "Enter technician's full name",
                disabled: isPending,
              })}

              {createField("email", "text", {
                label: "Email Address *",
                placeholder: "Enter technician's email",
                disabled: isPending,
              })}

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Password *</label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={generatePassword}
                    disabled={isPending}
                  >
                    Generate Password
                  </Button>
                </div>
                <div className="relative">
                  {createField("password", "text", {
                    label: "",
                    type: showPassword ? "text" : "password",
                    placeholder: "Enter password",
                    disabled: isPending,
                  })}
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <div className="relative">
                  {createField("confirmPassword", "text", {
                    label: "Confirm Password *",
                    type: showConfirmPassword ? "text" : "password",
                    placeholder: "Confirm password",
                    disabled: isPending,
                  })}
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </Form>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => navigate(Routes.TECHNICIANS)}
            disabled={isPending}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            form="technician-form"
            disabled={isPending}
            className="flex-1"
          >
            {isPending ? (
              <>
                <User className="mr-2 h-4 w-4 animate-spin" />
                Creating Account...
              </>
            ) : (
              <>
                <UserPlus className="mr-2 h-4 w-4" />
                Create Technician
              </>
            )}
          </Button>
        </div>

        {/* Info Card */}
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <UserPlus className="h-5 w-5 text-blue-600 mt-0.5" />
              <div className="space-y-1">
                <h3 className="font-medium text-blue-900">
                  Creating Technician Accounts
                </h3>
                <p className="text-sm text-blue-700">
                  This will create a new user account in the system. The
                  technician will be able to log in immediately using their
                  email and the password you set. They will have access to
                  assigned inspections and can update inspection details.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TechnicianCreate;