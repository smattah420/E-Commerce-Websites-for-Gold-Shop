import { Navigate, Route, Routes } from 'react-router-dom'
import { AppShell } from './components/AppShell'
import { CartPage } from './pages/CartPage'
import { CheckoutPage } from './pages/CheckoutPage'
import { HomePage } from './pages/HomePage'
import { NotFound } from './pages/NotFound'
import { ProductDetailPage } from './pages/ProductDetailPage'
import { ProductListingPage } from './pages/ProductListingPage'
import { WishlistPage } from './pages/WishlistPage'
import { LoginPage } from './pages/LoginPage'
import { SignupPage } from './pages/SignupPage'
import { AdminUserPage } from './pages/AdminUserPage'
import { AdminProductPage } from './pages/AdminProductPage'
import { StoreProvider } from './store/StoreContext'
import { GoldPriceProvider } from './store/GoldPriceContext'
import { AuthProvider } from './store/AuthContext'

import { NotificationProvider } from './store/NotificationContext'
import { NotificationHost } from './components/NotificationHost'

function App() {
  return (
    <NotificationProvider>
      <AuthProvider>
        <GoldPriceProvider>
          <StoreProvider>
            <NotificationHost />
            <Routes>
              <Route element={<AppShell />}>
                <Route index element={<Navigate to="/home" replace />} />
                <Route path="/home" element={<HomePage />} />
                <Route path="/products" element={<ProductListingPage />} />
                <Route path="/product/:id" element={<ProductDetailPage />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/wishlist" element={<WishlistPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/admin/users" element={<AdminUserPage />} />
                <Route path="/admin/products" element={<AdminProductPage />} />
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </StoreProvider>
        </GoldPriceProvider>
      </AuthProvider>
    </NotificationProvider>
  )
}

export default App
