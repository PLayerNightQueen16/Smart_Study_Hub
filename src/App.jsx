import { useState, useEffect } from "react";
import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Layout } from "@/components/Layout";
import { Dashboard } from "@/pages/Dashboard";
import { Library } from "@/pages/Library";
import { Analytics } from "@/pages/Analytics";
import { AddResource } from "@/pages/AddResource";
import { ResourceDetail } from "@/pages/ResourceDetail";
import { Auth } from "@/pages/Auth";
import NotFound from "@/pages/not-found";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";

const queryClient = new QueryClient();

function Router() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      // During signup, we sign the user in then out immediately.
      // We check this flag to prevent the dashboard from flickering.
      const isRegistering = localStorage.getItem('learnos_signup_in_progress') === 'true';
      
      if (user && isRegistering) {
        setIsAuthenticated(false);
      } else {
        setIsAuthenticated(!!user);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Auth />;
  }

  return (
    <Layout>
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/resources/new" component={AddResource} />
        <Route path="/resources/:id">
          {(params) => <ResourceDetail id={params.id} />}
        </Route>
        <Route path="/resources" component={Library} />
        <Route path="/analytics" component={Analytics} />
        <Route component={NotFound} />
      </Switch>
    </Layout>);

}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>);

}

export default App;