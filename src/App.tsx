import { Routes, Route } from 'react-router-dom';
import { AuthBootstrap } from '@components/auth/AuthBootstrap';
import { AuthLayout } from '@components/auth/AuthLayout';
import { LoginPage } from '@pages/LoginPage';
import { RegisterPage } from '@pages/RegisterPage';
import { ForgotPasswordPage } from '@pages/ForgotPasswordPage';

function App() {
  return (
    <AuthBootstrap>
      <Routes>
        <Route path="/" element={<AuthLayout />}>
          <Route index element={<LoginPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="forgot-password" element={<ForgotPasswordPage />} />
        </Route>
      </Routes>
    </AuthBootstrap>
  );
}

export default App;
