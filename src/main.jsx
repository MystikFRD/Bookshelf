//import "./diagnostic.jsx";
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { RouterProvider } from 'react-router-dom';
import router from './router.jsx'; // Deine Routen-Konfiguration
import { Provider } from 'react-redux';
import store from './Store/store.jsx'; // Dein Redux-Store

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <Provider store={store}>
            <RouterProvider router={router}>
                <App />
            </RouterProvider>
        </Provider>
    </StrictMode>
);
createRoot(document.getElementById('root')).render(
  <ErrorBoundary>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </ErrorBoundary>
);

