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
import { useTranslation } from "react-i18next";

export function Landing() {
  const { user } = use(AuthContext);
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const features = [
    {
      icon: Shield,
      title: t("landing.features.secureInspections.title"),
      description: t("landing.features.secureInspections.description"),
    },
    {
      icon: Camera,
      title: t("landing.features.integratedPhotos.title"),
      description: t("landing.features.integratedPhotos.description"),
    },
    {
      icon: FileText,
      title: t("landing.features.pdfReports.title"),
      description: t("landing.features.pdfReports.description"),
    },
    {
      icon: Users,
      title: t("landing.features.teamManagement.title"),
      description: t("landing.features.teamManagement.description"),
    },
  ];

  const steps = [
    {
      number: "01",
      title: t("landing.howItWorks.createAccount.title"),
      description: t("landing.howItWorks.createAccount.description"),
    },
    {
      number: "02",
      title: t("landing.howItWorks.addClients.title"),
      description: t("landing.howItWorks.addClients.description"),
    },
    {
      number: "03",
      title: t("landing.howItWorks.scheduleInspections.title"),
      description: t("landing.howItWorks.scheduleInspections.description"),
    },
  ];

  const toggleLanguage = () => {
    const newLang = i18n.language === "fr" ? "en" : "fr";
    i18n.changeLanguage(newLang);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <div className="flex items-center space-x-2">
            <Building2 className="h-6 w-6 text-primary" />
            <span className="font-bold">{t("landing.brand")}</span>
          </div>

          <div className="ml-auto flex items-center space-x-4">
            <Button variant="ghost" size="sm" onClick={toggleLanguage}>
              <Globe className="h-4 w-4 mr-2" />
              {t("landing.language").toUpperCase()}
            </Button>
            {user ? (
              <Button onClick={() => navigate("/")}>
                <LayoutDashboard className="h-4 w-4 mr-2" />
                {t("landing.dashboard")}
              </Button>
            ) : (
              <Button variant="outline" onClick={() => navigate("/auth")}>
                {t("landing.signIn")}
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
              {t("landing.professionalSolution")}
            </Badge>

            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
              {t("landing.hero.title")}
            </h1>

            <p className="mx-auto max-w-[600px] text-xl text-muted-foreground">
              {t("landing.hero.description")}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {user ? (
                <Button size="lg" onClick={() => navigate("/")}>
                  <LayoutDashboard className="h-4 w-4 mr-2" />
                  {t("landing.goToDashboard")}
                </Button>
              ) : (
                <Button size="lg" onClick={() => navigate("/auth")}>
                  {t("landing.getStarted")}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              )}
              <Button variant="outline" size="lg">
                {t("landing.viewDemo")}
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
              {t("landing.features.title")}
            </h2>
            <p className="text-xl text-muted-foreground max-w-[600px] mx-auto">
              {t("landing.features.subtitle")}
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
              {t("landing.howItWorks.title")}
            </h2>
            <p className="text-xl text-muted-foreground max-w-[600px] mx-auto">
              {t("landing.howItWorks.subtitle")}
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
              {t("landing.cta.title")}
            </h2>
            <p className="text-xl text-primary-foreground/80 max-w-[600px] mx-auto">
              {t("landing.cta.subtitle")}
            </p>
            {user ? (
              <Button
                size="lg"
                variant="secondary"
                onClick={() => navigate("/")}
              >
                <LayoutDashboard className="h-4 w-4 mr-2" />
                {t("landing.goToDashboard")}
              </Button>
            ) : (
              <Button
                size="lg"
                variant="secondary"
                onClick={() => navigate("/auth")}
              >
                {t("landing.getStartedNow")}
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
              <span className="font-semibold">{t("landing.brand")}</span>
            </div>

            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" onClick={toggleLanguage}>
                <Globe className="h-4 w-4 mr-2" />
                {t("landing.language")}
              </Button>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
            © 2024 {t("landing.brand")}.{" "}
            {t("landing.footer.allRightsReserved")}
          </div>
        </div>
      </footer>
    </div>
  );
}
