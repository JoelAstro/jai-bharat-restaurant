import React from 'react';
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.js';
import { RestaurantProvider } from './context/RestaurantContext.js';
import { CartProvider } from './context/CartContext.js';

// Layouts
import { Navbar } from './components/layout/Navbar.js';
import { Footer } from './components/layout/Footer.js';
import { CartDrawer } from './components/cart/CartDrawer.js';
import { AdminLayout } from './components/layout/AdminLayout.js';

// Customer Pages
import { HomePage } from './pages/customer/HomePage.js';
import { MenuPage } from './pages/customer/MenuPage.js';
import { OffersPage } from './pages/customer/OffersPage.js';
import { CheckoutPage } from './pages/customer/CheckoutPage.js';
import { OrderTrackingPage } from './pages/customer/OrderTrackingPage.js';
import { OrderHistoryPage } from './pages/customer/OrderHistoryPage.js';
import { FavoritesPage } from './pages/customer/FavoritesPage.js';
import { ProfilePage } from './pages/customer/ProfilePage.js';
import { AuthPage } from './pages/customer/AuthPage.js';

// Admin Pages
import { AdminLoginPage } from './pages/admin/AdminLoginPage.js';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage.js';
import { AdminOrdersPage } from './pages/admin/AdminOrdersPage.js';
import { AdminMenuPage } from './pages/admin/AdminMenuPage.js';
import { AdminCustomersPage } from './pages/admin/AdminCustomersPage.js';
import { AdminCouponsPage } from './pages/admin/AdminCouponsPage.js';
import { AdminReportsPage } from './pages/admin/AdminReportsPage.js';
import { AdminSettingsPage } from './pages/admin/AdminSettingsPage.js';

const CustomerLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#fdfbf7]">
      <Navbar />
      <CartDrawer />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <RestaurantProvider>
          <CartProvider>
            <Routes>
              {/* Customer Routes with Header & Footer */}
              <Route path="/" element={<CustomerLayout />}>
                <Route index element={<HomePage />} />
                <Route path="menu" element={<MenuPage />} />
                <Route path="offers" element={<OffersPage />} />
                <Route path="checkout" element={<CheckoutPage />} />
                <Route path="orders" element={<OrderHistoryPage />} />
                <Route path="orders/:id" element={<OrderTrackingPage />} />
                <Route path="favorites" element={<FavoritesPage />} />
                <Route path="profile" element={<ProfilePage />} />
                <Route path="auth" element={<AuthPage />} />
              </Route>

              {/* Admin Login */}
              <Route path="/admin/login" element={<AdminLoginPage />} />

              {/* Protected Admin Management Portal */}
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminDashboardPage />} />
                <Route path="orders" element={<AdminOrdersPage />} />
                <Route path="menu" element={<AdminMenuPage />} />
                <Route path="customers" element={<AdminCustomersPage />} />
                <Route path="coupons" element={<AdminCouponsPage />} />
                <Route path="reports" element={<AdminReportsPage />} />
                <Route path="settings" element={<AdminSettingsPage />} />
              </Route>
            </Routes>
          </CartProvider>
        </RestaurantProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
