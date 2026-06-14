import { RouterProvider } from 'react-router';
import { router } from './routes';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import { CartProvider } from './context/CartContext';
import { GoogleOAuthProvider } from '@react-oauth/google';

const GOOGLE_CLIENT_ID = "928594621204-i3149tke2lllu0muf0n7pd6v4d3ee79k.apps.googleusercontent.com";

export default function App() {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <LanguageProvider>
        <AuthProvider>
          <DataProvider>
            <CartProvider>
              <RouterProvider router={router} />
            </CartProvider>
          </DataProvider>
        </AuthProvider>
      </LanguageProvider>
    </GoogleOAuthProvider>
  );
}