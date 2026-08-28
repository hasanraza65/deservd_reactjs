import { Route, Routes } from 'react-router-dom'
import { RequireAdmin } from './components/RequireAdmin'
import { AdminLayout } from './components/AdminLayout'
import AdminLogin from './pages/AdminLogin'
import Dashboard from './pages/Dashboard'
import ProductsList from './pages/ProductsList'
import ProductForm from './pages/ProductForm'
import Categories from './pages/Categories'
import CustomersList from './pages/CustomersList'
import CustomerDetail from './pages/CustomerDetail'
import OrdersList from './pages/OrdersList'
import OrderDetail from './pages/OrderDetail'
import Coupons from './pages/Coupons'
import Reviews from './pages/Reviews'
import Inventory from './pages/Inventory'
import Settings from './pages/Settings'
import NotFound from '@/pages/NotFound'

/** The entire React admin panel, mounted at /admin — a second frontend over the same /api/v1/admin/* JSON API the Blade admin uses. */
export function AdminApp() {
  return (
    <Routes>
      <Route path="login" element={<AdminLogin />} />

      <Route element={<RequireAdmin />}>
        <Route element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="orders" element={<OrdersList />} />
          <Route path="orders/:id" element={<OrderDetail />} />
          <Route path="products" element={<ProductsList />} />
          <Route path="products/new" element={<ProductForm />} />
          <Route path="products/:id/edit" element={<ProductForm />} />
          <Route path="categories" element={<Categories />} />
          <Route path="customers" element={<CustomersList />} />
          <Route path="customers/:id" element={<CustomerDetail />} />
          <Route path="coupons" element={<Coupons />} />
          <Route path="reviews" element={<Reviews />} />
          <Route path="inventory" element={<Inventory />} />
          <Route path="settings" element={<Settings />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Route>
    </Routes>
  )
}
