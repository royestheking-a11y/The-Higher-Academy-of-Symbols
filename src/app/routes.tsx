import { createBrowserRouter } from 'react-router';
import Root from './layouts/Root';
import DashboardRoot from './layouts/DashboardRoot';
import Home from './pages/Home';
import About from './pages/About';
import Lectures from './pages/Lectures';
import LectureDetail from './pages/LectureDetail';
import Articles from './pages/Articles';
import ArticleDetail from './pages/ArticleDetail';
import AreasOfStudy, { AreaDetail } from './pages/AreasOfStudy';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Register from './pages/Register';
import StudentDashboard from './pages/StudentDashboard';
import AdminDashboard from './pages/AdminDashboard';
import AdminLogin from './pages/AdminLogin';
import SearchPage from './pages/Search';
import Checkout from './pages/Checkout';
import NotFound from './pages/NotFound';

export const router = createBrowserRouter([
  // ── Main website (with Navbar + Footer) ──────────────────────────────────
  {
    path: '/',
    Component: Root,
    children: [
      { index: true, Component: Home },
      { path: 'about', Component: About },
      { path: 'lectures', Component: Lectures },
      { path: 'lectures/:slug', Component: LectureDetail },
      { path: 'articles', Component: Articles },
      { path: 'articles/:slug', Component: ArticleDetail },
      { path: 'checkout/:slug', Component: Checkout },
      { path: 'areas-of-study', Component: AreasOfStudy },
      { path: 'areas/:slug', Component: AreaDetail },
      { path: 'contact', Component: Contact },
      { path: 'login', Component: Login },
      { path: 'register', Component: Register },
      { path: 'search', Component: SearchPage },
      { path: '*', Component: NotFound },
    ],
  },

  // ── Standalone dashboard pages (no Navbar/Footer) ────────────────────────
  {
    Component: DashboardRoot,
    children: [
      { path: '/dashboard', Component: StudentDashboard },
      { path: '/admin', Component: AdminDashboard },
      { path: '/admin-login', Component: AdminLogin },
    ],
  },
]);