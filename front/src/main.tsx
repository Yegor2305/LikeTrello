import { createRoot } from 'react-dom/client'

import App from './App.tsx'
import {Provider} from "react-redux";
import {store} from "./store/store.ts";
import { QueryClient, QueryClientProvider } from 'react-query';

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
      <QueryClientProvider client={queryClient}>
          <App />
      </QueryClientProvider>
  </Provider>,
)
