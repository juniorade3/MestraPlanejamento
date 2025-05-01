import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import LandingPage from "@/pages/landing-page";
import DashboardPage from "@/pages/dashboard-page";
import AuthPage from "@/pages/auth-page";
import CreatePlanPage from "@/pages/create-plan-page";
import MyPlansPage from "@/pages/my-plans-page";
import PlanEditorPage from "@/pages/plan-editor-page";
import TemplatesPage from "@/pages/templates-page";
import { ProtectedRoute } from "./lib/protected-route";
import { AuthProvider } from "./hooks/use-auth";

function Router() {
  return (
    <Switch>
      <Route path="/" component={LandingPage} />
      <Route path="/auth" component={AuthPage} />
      <ProtectedRoute path="/dashboard" component={DashboardPage} />
      <ProtectedRoute path="/create-plan" component={CreatePlanPage} />
      <ProtectedRoute path="/my-plans" component={MyPlansPage} />
      <ProtectedRoute path="/plan/:id" component={PlanEditorPage} />
      <ProtectedRoute path="/templates" component={TemplatesPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
