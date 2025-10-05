import { use, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CheckCircle, Building, User } from "lucide-react";
import { toast } from "sonner";
import { AuthContext } from "@modules/shared/auth/context.tsx";
import { useProfile } from "@modules/shared/api";
import { supabase } from "@modules/shared/supabase";

const onboardingSchema = z.object({
  // Organization step
  orgChoice: z.enum(["join", "create"]),
  orgName: z.string().optional(),

  // Profile step
  displayName: z.string().min(2, "Display name must be at least 2 characters"),
  role: z.enum(["org_admin", "org_technician"]),
});

type OnboardingForm = z.infer<typeof onboardingSchema>;

export function Onboarding() {
  const { user } = use(AuthContext);
  const { refetch } = useProfile();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [availableOrgs, setAvailableOrgs] = useState<
    Array<{ id: string; name: string }>
  >([]);

  const form = useForm<OnboardingForm>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      orgChoice: "create",
      displayName: user?.email?.split("@")[0] || "",
      role: "org_admin",
    },
  });

  const orgChoice = form.watch("orgChoice");

  React.useEffect(() => {
    // Fetch available organizations when component mounts
    const fetchOrgs = async () => {
      const { data } = await supabase.from("orgs").select("id, name");
      setAvailableOrgs(data || []);
    };
    fetchOrgs();
  }, []);

  const onSubmit = async (data: OnboardingForm) => {
    if (!user) return;

    setLoading(true);
    try {
      let orgId: string;

      if (data.orgChoice === "create") {
        if (!data.orgName) {
          toast({
            title: "Error",
            description: "Organization name is required",
            variant: "destructive",
          });
          setLoading(false);
          return;
        }

        // Create new organization
        const { data: orgData, error: orgError } = await supabase
          .from("orgs")
          .insert({
            name: data.orgName,
          })
          .select()
          .single();

        if (orgError) {
          toast({
            title: "Error creating organization",
            description: orgError.message,
            variant: "destructive",
          });
          setLoading(false);
          return;
        }

        orgId = orgData.id;
      } else {
        // For now, use the first available org or create a default one
        if (availableOrgs.length > 0) {
          orgId = availableOrgs[0].id;
        } else {
          toast({
            title: "Error",
            description: "No organizations available to join",
            variant: "destructive",
          });
          setLoading(false);
          return;
        }
      }

      // Create user profile
      const { error: profileError } = await supabase.from("profiles").insert({
        id: user.id,
        email: user.email!,
        display_name: data.displayName,
        role: data.role,
        org_id: orgId,
      });

      if (profileError) {
        toast({
          title: "Error creating profile",
          description: profileError.message,
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      toast({
        title: "Welcome!",
        description: "Your account has been set up successfully.",
      });

      refetch();

      // Redirect to main app
      window.location.href = "/";
    } catch (error) {
      console.error("Onboarding error:", error);
      toast({
        title: "Error",
        description: "Something went wrong during setup",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-secondary/5 p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 1 ? "bg-primary text-primary-foreground" : "bg-muted"}`}
            >
              {step > 1 ? (
                <CheckCircle className="h-5 w-5" />
              ) : (
                <Building className="h-5 w-5" />
              )}
            </div>
            <div className="h-px bg-border flex-1" />
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 2 ? "bg-primary text-primary-foreground" : "bg-muted"}`}
            >
              <User className="h-5 w-5" />
            </div>
          </div>
          <CardTitle className="text-2xl">
            Welcome to Crane Inspect Pro
          </CardTitle>
          <CardDescription>
            Let's get your account set up to start managing inspections
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Organization Setup */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <Building className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-semibold">Organization Setup</h3>
                </div>

                <FormField
                  control={form.control}
                  name="orgChoice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Choose your organization setup</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select an option" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="create">
                            Create new organization
                          </SelectItem>
                          {availableOrgs.length > 0 && (
                            <SelectItem value="join">
                              Join existing organization
                            </SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {orgChoice === "create" && (
                  <FormField
                    control={form.control}
                    name="orgName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Organization Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter your organization name"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {orgChoice === "join" && availableOrgs.length > 0 && (
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground mb-2">
                      Available organizations:
                    </p>
                    <ul className="space-y-1">
                      {availableOrgs.map((org) => (
                        <li key={org.id} className="text-sm">
                          • {org.name}
                        </li>
                      ))}
                    </ul>
                    <p className="text-xs text-muted-foreground mt-2">
                      You will be added to: {availableOrgs[0]?.name}
                    </p>
                  </div>
                )}
              </div>

              {/* Profile Setup */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <User className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-semibold">Profile Setup</h3>
                </div>

                <FormField
                  control={form.control}
                  name="displayName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Display Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter your display name"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Your Role</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select your role" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="org_admin">
                            Administrator
                          </SelectItem>
                          <SelectItem value="org_technician">
                            Technician
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Setting up your account..." : "Complete Setup"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
