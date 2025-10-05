import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Shield,
  Camera,
  FileText,
  Users,
  Globe,
  ArrowRight,
  Building2,
  LayoutDashboard,
} from "lucide-react";
import { useNavigate } from "react-router";
import { use } from "react";
import { AuthContext } from "../auth/context";

export function Landing() {
  const { user } = use(AuthContext);
  const navigate = useNavigate();
  const language = "fr";

  const features = [
    {
      icon: Shield,
      title:
        language === "fr" ? "Inspections sécurisées" : "Secure Inspections",
      description:
        language === "fr"
          ? "Système d'inspection robuste avec authentification et contrôle d'accès"
          : "Robust inspection system with authentication and access control",
    },
    {
      icon: Camera,
      title: language === "fr" ? "Photos intégrées" : "Integrated Photos",
      description:
        language === "fr"
          ? "Téléchargez et organisez des photos directement dans vos rapports"
          : "Upload and organize photos directly in your reports",
    },
    {
      icon: FileText,
      title: language === "fr" ? "Rapports PDF" : "PDF Reports",
      description:
        language === "fr"
          ? "Générez des rapports professionnels avec votre logo et vos données"
          : "Generate professional reports with your logo and data",
    },
    {
      icon: Users,
      title: language === "fr" ? "Gestion d'équipe" : "Team Management",
      description:
        language === "fr"
          ? "Gérez les administrateurs et techniciens avec des permissions spécifiques"
          : "Manage administrators and technicians with specific permissions",
    },
  ];

  const steps = [
    {
      number: "01",
      title: language === "fr" ? "Créer votre compte" : "Create your account",
      description:
        language === "fr"
          ? "Inscrivez-vous et configurez votre organisation"
          : "Sign up and configure your organization",
    },
    {
      number: "02",
      title: language === "fr" ? "Ajouter vos clients" : "Add your clients",
      description:
        language === "fr"
          ? "Importez ou créez vos fiches clients avec toutes les informations nécessaires"
          : "Import or create your client records with all necessary information",
    },
    {
      number: "03",
      title:
        language === "fr"
          ? "Programmer des inspections"
          : "Schedule inspections",
      description:
        language === "fr"
          ? "Planifiez et assignez des inspections à vos techniciens"
          : "Plan and assign inspections to your technicians",
    },
  ];

  const toggleLanguage = () => {};

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <div className="flex items-center space-x-2">
            <Building2 className="h-6 w-6 text-primary" />
            <span className="font-bold">Crane Inspect Pro</span>
          </div>

          <div className="ml-auto flex items-center space-x-4">
            <Button variant="ghost" size="sm" onClick={toggleLanguage}>
              <Globe className="h-4 w-4 mr-2" />
              {language.toUpperCase()}
            </Button>
            {user ? (
              <Button onClick={() => navigate("/")}>
                <LayoutDashboard className="h-4 w-4 mr-2" />
                {language === "fr" ? "Tableau de bord" : "Dashboard"}
              </Button>
            ) : (
              <Button variant="outline" onClick={() => navigate("/auth")}>
                {language === "fr" ? "Connexion" : "Sign In"}
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-24 lg:py-32">
        <div className="container">
          <div className="text-center space-y-6">
            <Badge variant="secondary" className="text-sm">
              {language === "fr"
                ? "Solution professionnelle"
                : "Professional Solution"}
            </Badge>

            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
              {language === "fr"
                ? "Inspections de grues professionnelles"
                : "Professional Crane Inspections"}
            </h1>

            <p className="mx-auto max-w-[600px] text-xl text-muted-foreground">
              {language === "fr"
                ? "Gérez vos inspections de grues avec une solution complète : rapports PDF, photos intégrées, gestion d'équipe et conformité réglementaire."
                : "Manage your crane inspections with a complete solution: PDF reports, integrated photos, team management, and regulatory compliance."}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {user ? (
                <Button size="lg" onClick={() => navigate("/")}>
                  <LayoutDashboard className="h-4 w-4 mr-2" />
                  {language === "fr"
                    ? "Aller au tableau de bord"
                    : "Go to Dashboard"}
                </Button>
              ) : (
                <Button size="lg" onClick={() => navigate("/auth")}>
                  {language === "fr"
                    ? "Commencer gratuitement"
                    : "Get Started Free"}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              )}
              <Button variant="outline" size="lg">
                {language === "fr" ? "Voir la démo" : "View Demo"}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-muted/50">
        <div className="container">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl font-bold">
              {language === "fr"
                ? "Fonctionnalités principales"
                : "Key Features"}
            </h2>
            <p className="text-xl text-muted-foreground max-w-[600px] mx-auto">
              {language === "fr"
                ? "Tout ce dont vous avez besoin pour gérer efficacement vos inspections"
                : "Everything you need to efficiently manage your inspections"}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-sm">
                <CardHeader>
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24">
        <div className="container">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl font-bold">
              {language === "fr" ? "Comment ça marche" : "How it works"}
            </h2>
            <p className="text-xl text-muted-foreground max-w-[600px] mx-auto">
              {language === "fr"
                ? "Commencez à utiliser Crane Inspect Pro en 3 étapes simples"
                : "Get started with Crane Inspect Pro in 3 simple steps"}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="text-center space-y-4">
                <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-2xl font-bold mx-auto">
                  {step.number}
                </div>
                <h3 className="text-xl font-semibold">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-primary">
        <div className="container">
          <div className="text-center space-y-6">
            <h2 className="text-3xl font-bold text-primary-foreground">
              {language === "fr"
                ? "Prêt à moderniser vos inspections ?"
                : "Ready to modernize your inspections?"}
            </h2>
            <p className="text-xl text-primary-foreground/80 max-w-[600px] mx-auto">
              {language === "fr"
                ? "Rejoignez les professionnels qui font confiance à Crane Inspect Pro"
                : "Join the professionals who trust Crane Inspect Pro"}
            </p>
            {user ? (
              <Button
                size="lg"
                variant="secondary"
                onClick={() => navigate("/")}
              >
                <LayoutDashboard className="h-4 w-4 mr-2" />
                {language === "fr"
                  ? "Aller au tableau de bord"
                  : "Go to Dashboard"}
              </Button>
            ) : (
              <Button
                size="lg"
                variant="secondary"
                onClick={() => navigate("/auth")}
              >
                {language === "fr" ? "Commencer maintenant" : "Get Started Now"}
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-2">
              <Building2 className="h-5 w-5 text-primary" />
              <span className="font-semibold">Crane Inspect Pro</span>
            </div>

            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" onClick={toggleLanguage}>
                <Globe className="h-4 w-4 mr-2" />
                {language === "fr" ? "Français" : "English"}
              </Button>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
            © 2024 Crane Inspect Pro.{" "}
            {language === "fr"
              ? "Tous droits réservés."
              : "All rights reserved."}
          </div>
        </div>
      </footer>
    </div>
  );
}
