import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { EditProfilePage } from './pages/EditProfilePage'
import { IntroPage } from './pages/IntroPage'
import { LoginPage } from './pages/LoginPage'
import { MainPage } from './pages/MainPage'
import { MyPage } from './pages/MyPage'
import { MyRecommendationPage } from './pages/MyRecommendationPage'
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage'
import { RecommendPage } from './pages/RecommendPage'
import { SignupPage } from './pages/SignupPage'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem('token')
  if (!token) return <Navigate to="/login" replace />
  return <>{children}</>
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/privacy" element={<PrivacyPolicyPage />} />
        <Route path="/recommend" element={<ProtectedRoute><RecommendPage /></ProtectedRoute>} />
        <Route path="/my" element={<ProtectedRoute><MyPage /></ProtectedRoute>} />
        <Route path="/my/recommendations/:itemId" element={<ProtectedRoute><MyRecommendationPage /></ProtectedRoute>} />
        <Route path="/my/edit" element={<ProtectedRoute><EditProfilePage /></ProtectedRoute>} />
        <Route path="/books/:id/intro" element={<IntroPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
