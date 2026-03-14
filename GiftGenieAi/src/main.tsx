mport React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BlinkProvider, BlinkAuthProvider } from '@blinkdotnew/react';
import App from './App';
import './index.css';

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BlinkProvider projectId={import.meta.env.VITE_BLINK_PROJECT_ID || 'giftgenie-ai-agent-al0j6wfi'}>
        <BlinkAuthProvider>
          <App />
        </BlinkAuthProvider>
      </BlinkProvider>
    </QueryClientProvider>
  </React.StrictMode>,
);