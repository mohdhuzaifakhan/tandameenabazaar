import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Outlet, useLocation } from 'react-router-dom';
import { BazaarProvider } from './context/BazaarContext';
import { AuthProvider } from './context/AuthContext';
import { ImageModalProvider } from './context/ImageModalContext';
import Header from './components/Header';
import Footer from './components/Footer';
import MobileDrawer from './components/MobileDrawer';

import Home from './pages/Home';
import Shops from './pages/Shops';
import ShopDetails from './pages/ShopDetails';
import ProductDetails from './pages/ProductDetails';
import SavedProducts from './pages/SavedProducts';
import AboutUs from './pages/AboutUs';
import ContactUs from './pages/ContactUs';
import Login from './pages/Login';

import ProtectedRoute from './components/ProtectedRoute';

import CustomerDashboard from './pages/CustomerDashboard';
import ShopDashboard from './pages/ShopDashboard';
import AdminDashboard from './pages/AdminDashboard';
import AdminShops from './pages/AdminShops';
import AdminCategoriesMarkets from './pages/AdminCategoriesMarkets';
import AdminShopDetails from './pages/AdminShopDetails';

// Global ScrollToTop helper for route changes
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);

  return null;
}

// Layout wrapper for public pages
function PublicLayout() {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <>
      <Header onOpenDrawer={() => setDrawerOpen(true)} />
      <main className="max-w-7xl mx-auto px-4 md:px-6 w-full" style={{ minHeight: '80vh', paddingBottom: '40px' }}>
        <Outlet />
      </main>
      <Footer onOpenDrawer={() => setDrawerOpen(true)} />
      <MobileDrawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BazaarProvider>
        <ImageModalProvider>
          <BrowserRouter>
            <ScrollToTop />
            <Routes>
              {/* Public Storefront Routes */}
              <Route element={<PublicLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="/shops" element={<Shops />} />
                <Route path="/shop/:id" element={<ShopDetails />} />
                <Route path="/product/:id" element={<ProductDetails />} />
                <Route path="/saved" element={<SavedProducts />} />
                <Route path="/about" element={<AboutUs />} />
                <Route path="/contact" element={<ContactUs />} />
                <Route
                  path="/dashboard/customer"
                  element={
                    <ProtectedRoute allowedRoles={['customer', 'shop_owner', 'admin']}>
                      <CustomerDashboard />
                    </ProtectedRoute>
                  }
                />
              </Route>

              {/* Login Route (standalone) */}
              <Route path="/login" element={<Login />} />

              {/* Dashboard Panel Routes with Role Protection */}
              <Route
                path="/dashboard/shop"
                element={
                  <ProtectedRoute allowedRoles={['shop_owner', 'admin']}>
                    <ShopDashboard />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/dashboard/admin"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/admin/shops"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminShops />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/admin/categories"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminCategoriesMarkets />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/admin/shop/:id"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminShopDetails />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </BrowserRouter>
        </ImageModalProvider>
      </BazaarProvider>
    </AuthProvider>
  );
}
