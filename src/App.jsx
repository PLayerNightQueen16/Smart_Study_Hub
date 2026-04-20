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
import NotFound from "@/pages/not-found";

const queryClient = new QueryClient();

function Router() {
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