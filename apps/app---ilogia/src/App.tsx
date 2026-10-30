import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { RequireAuth, useAuth } from '@ilogia/auth';
import { Spinner, useI18n } from '@ilogia/ui';
import { Shell } from './components/Shell';
import { DashboardProvider } from './data/useDashboard';

const Login = lazy(() => import('./pages/auth/Login'));
const Register = lazy(() => import('./pages/auth/Register'));
const Forgot = lazy(() => import('./pages/auth/Forgot'));
const Home = lazy(() => import('./pages/Home'));
const Services = lazy(() => import('./pages/Services'));
const Notifications = lazy(() => import('./pages/Notifications'));
const ProfilePage = lazy(() => import('./pages/Profile'));
const Settings = lazy(() => import('./pages/Settings'));
const NotFound = lazy(() => import('./pages/NotFound'));

export function FullLoader() {
  const { t } = useI18n();
  return <div className="grid min-h-dvh place-items-center"><Spinner label={t('loading')} className="h-7 w-7" /></div>;
}

function GuestOnly({ children }: { children: JSX.Element }) {
  const { status } = useAuth();
  if (status === 'loading') return <FullLoader />;
  if (status === 'signed_in' || status === 'demo') return <Navigate to="/" replace />;
  return children;
}

export function App() {
  return (
    <Suspense fallback={<FullLoader />}>
      <Routes>
        <Route path="/login" element={<GuestOnly><Login /></GuestOnly>} />
        <Route path="/register" element={<GuestOnly><Register /></GuestOnly>} />
        <Route path="/forgot" element={<GuestOnly><Forgot /></GuestOnly>} />
        <Route element={<RequireAuth fallback={<FullLoader />}><DashboardProvider><Shell /></DashboardProvider></RequireAuth>}>
          <Route index element={<Home />} />
          <Route path="services" element={<Services />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="settings" element={<Settings />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
