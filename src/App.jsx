import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import ScrollToTop from './components/ScrollToTop';
import { CartProvider } from '@/lib/CartContext';
import { AltPathProvider } from '@/lib/AltPath';
import SiteLayout from '@/components/site/SiteLayout';
import Home from '@/pages/Home';
import Shop from '@/pages/Shop';
import Category from '@/pages/Category';
import Product from '@/pages/Product';
import Cart from '@/pages/Cart';
import Checkout from '@/pages/Checkout';
import OrderConfirmation from '@/pages/OrderConfirmation';
import Quote from '@/pages/Quote';
import About from '@/pages/About';
import Contact from '@/pages/Contact';
import Faq from '@/pages/Faq';
import Policy from '@/pages/Policy';
import Guides from '@/pages/Guides';
import GuideDetail from '@/pages/GuideDetail';
import Admin from '@/pages/Admin';

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();

  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    } else if (authError.type === 'auth_required') {
      navigateToLogin();
      return null;
    }
  }

  return (
    <Routes>
      <Route path="/admin" element={<Admin />} />
      <Route element={<SiteLayout />}>
        {/* Danish (root) */}
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/containere/:slug" element={<Category />} />
        <Route path="/produkt/:slug" element={<Product />} />
        <Route path="/kurv" element={<Cart />} />
        <Route path="/kasse" element={<Checkout />} />
        <Route path="/ordrebekraeftelse" element={<OrderConfirmation />} />
        <Route path="/tilbud" element={<Quote />} />
        <Route path="/om-os" element={<About />} />
        <Route path="/kontakt" element={<Contact />} />
        <Route path="/faq" element={<Faq />} />
        <Route path="/politik/:slug" element={<Policy />} />
        <Route path="/viden" element={<Guides />} />
        <Route path="/viden/:slug" element={<GuideDetail />} />

        {/* English */}
        <Route path="/en" element={<Home />} />
        <Route path="/en/shop" element={<Shop />} />
        <Route path="/en/containers/:slug" element={<Category />} />
        <Route path="/en/product/:slug" element={<Product />} />
        <Route path="/en/cart" element={<Cart />} />
        <Route path="/en/checkout" element={<Checkout />} />
        <Route path="/en/order-confirmation" element={<OrderConfirmation />} />
        <Route path="/en/quote" element={<Quote />} />
        <Route path="/en/about-us" element={<About />} />
        <Route path="/en/contact" element={<Contact />} />
        <Route path="/en/faqs" element={<Faq />} />
        <Route path="/en/policy/:slug" element={<Policy />} />
        <Route path="/en/guides" element={<Guides />} />
        <Route path="/en/guides/:slug" element={<GuideDetail />} />
      </Route>
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <ScrollToTop />
          <AltPathProvider>
            <CartProvider>
              <AuthenticatedApp />
            </CartProvider>
          </AltPathProvider>
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App