import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import { BazaarProvider } from './context/BazaarContext';
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

import ShopDashboard from './pages/ShopDashboard';
import AdminDashboard from './pages/AdminDashboard';
import AdminShops from './pages/AdminShops';
import AdminOrders from './pages/AdminOrders';
import AdminShopDetails from './pages/AdminShopDetails';

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
    <BazaarProvider>
      <BrowserRouter>
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
          </Route>

          {/* Login Route (standalone) */}
          <Route path="/login" element={<Login />} />

          {/* Dashboard Panel Routes */}
          <Route path="/dashboard/shop" element={<ShopDashboard />} />
          <Route path="/dashboard/admin" element={<AdminDashboard />} />
          <Route path="/dashboard/admin/shops" element={<AdminShops />} />
          <Route path="/dashboard/admin/orders" element={<AdminOrders />} />
          <Route path="/dashboard/admin/shop/:id" element={<AdminShopDetails />} />
        </Routes>
      </BrowserRouter>
    </BazaarProvider>
  );
}
