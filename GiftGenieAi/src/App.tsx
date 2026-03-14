import { createRouter, createRoute, createRootRoute, RouterProvider, Link, Outlet } from '@tanstack/react-router';
import { Toaster } from 'react-hot-toast';
import { useAuth } from './hooks/useAuth';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import Home from './pages/Home';
import Wizard from './pages/Wizard';
import Results from './pages/Results';
import SavedGifts from './pages/SavedGifts';

const rootRoute = createRootRoute({
  component: () => (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <Toaster position="top-right" />
    </div>
  ),
});

const indexRoute = createRoute({ getParentRoute: () => rootRoute, path: '/', component: Home });
const wizardRoute = createRoute({ getParentRoute: () => rootRoute, path: '/wizard', component: Wizard });
const resultsRoute = createRoute({ getParentRoute: () => rootRoute, path: '/results', component: Results });
const savedGiftsRoute = createRoute({ getParentRoute: () => rootRoute, path: '/saved', component: SavedGifts });

const routeTree = rootRoute.addChildren([indexRoute, wizardRoute, resultsRoute, savedGiftsRoute]);
const router = createRouter({ routeTree });

export default function App() {
  return <RouterProvider router={router} />;
}