import { Routes, Route } from 'react-router-dom'
import ProtectedRoute from './components/auth/ProtectedRoute';
import LandingPage from './pages/LandingPage'
import AuthPage from './pages/AuthPage'
import LoginPage from './pages/LoginPage' // We'll create this next
import RegisterPage from './pages/RegisterPage' // We'll create this next
import CustomerDashboard from './pages/CustomerDashboard'


function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/welcome" element={<AuthPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route
        path="/dashboard/customer"
        element={
          <ProtectedRoute allowedRoles={['ROLE_CUSTOMER']}>
            <CustomerDashboard/>
          </ProtectedRoute>
        }
      />

    </Routes>
  )
}

export default App