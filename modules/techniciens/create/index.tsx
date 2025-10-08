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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { supabase } from "@modules/shared/supabase";
import { useProfile } from "@modules/shared/api/profile";
import { Routes } from "@modules/shared/routes";

interface CreateTechnicianForm {
  displayName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const TechnicianCreate = () => {
  const navigate = useNavigate();
  const { profile } = useProfile();

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState<CreateTechnicianForm>({
    displayName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleInputChange = (
    field: keyof CreateTechnicianForm,
    value: string,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const generatePassword = () => {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
    let password = "";
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setFormData((prev) => ({
      ...prev,
      password: password,
      confirmPassword: password,
    }));
  };

  const validateForm = (): boolean => {
    if (!formData.displayName.trim()) {
      toast.error("Display name is required.");
      return false;
    }

    if (!formData.email.trim()) {
      toast.error("Email is required.");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Please enter a valid email address.");
      return false;
    }

    if (!formData.password) {
      toast.error("Password is required.");
      return false;
    }

    if (formData.password.length < 8) {
      toast.error("Password must be at least 8 characters long.");
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match.");
      return false;
    }

    return true;
  };

  const handleCreateTechnician = async () => {
    if (!validateForm()) {
      toast.error("Please fix the form errors before submitting.");
      return;
    }

    if (!profile?.org_id) {
      toast.error("Unable to determine your organization. Please refresh the page or contact support.");
      return;
    }

    setLoading(true);
    try {
      // Call the edge function to create the technician
      const { data, error } = await supabase.functions.invoke(
        "create-technician",
        {
          body: {
            displayName: formData.displayName,
            email: formData.email,
            password: formData.password,
          },
          headers: {
            Authorization: `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
          },
        },
      );

      if (error) {
        throw error;
      }

      if (data?.error) {
        throw new Error(data.error);
      }

      toast.success(`${formData.displayName} has been successfully created as a technician. They can now log in with their email and password.`);

      // Navigate back to technicians list
      navigate(Routes.TECHNICIANS);
    } catch (error) {
      console.error("Error creating technician:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to create technician. Please try again.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
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
            <div className="space-y-2">
              <Label htmlFor="displayName">Display Name *</Label>
              <Input
                id="displayName"
                type="text"
                placeholder="Enter technician's full name"
                value={formData.displayName}
                onChange={(e) =>
                  handleInputChange("displayName", e.target.value)
                }
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter technician's email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password *</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={generatePassword}
                  disabled={loading}
                >
                  Generate Password
                </Button>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter password"
                  value={formData.password}
                  onChange={(e) =>
                    handleInputChange("password", e.target.value)
                  }
                  disabled={loading}
                />
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
              <Label htmlFor="confirmPassword">Confirm Password *</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm password"
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    handleInputChange("confirmPassword", e.target.value)
                  }
                  disabled={loading}
                />
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
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => navigate(Routes.TECHNICIANS)}
            disabled={loading}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            onClick={handleCreateTechnician}
            disabled={
              loading ||
              !formData.displayName ||
              !formData.email ||
              !formData.password ||
              !formData.confirmPassword
            }
            className="flex-1"
          >
            {loading ? (
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