import { Outlet, useLocation } from 'react-router';
import { Navbar } from './Navbar';
import { Footer } from './Footer';

export function Layout() {
  const location = useLocation();
  
  // Don't show navbar/footer on auth pages
  const hideNavAndFooter = ['/login', '/signup'].includes(location.pathname);

  return (
    <div className="flex flex-col min-h-screen">
      {!hideNavAndFooter && <Navbar />}
      <main className="flex-1">
        <Outlet />
      </main>
      {!hideNavAndFooter && <Footer />}
    </div>
  );
}
