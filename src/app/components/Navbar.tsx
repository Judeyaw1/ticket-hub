import { Link, useLocation } from 'react-router';
import { Button } from './ui/button';
import { Menu, User, Ticket, CalendarDays, LayoutDashboard } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';
import { getCurrentUserId, isUserAuthenticated } from '../lib/auth';
import { apiGet } from '../lib/api';

type NavbarProfile = {
  name: string;
  avatar: string;
};

export function Navbar() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(isUserAuthenticated);
  const [profile, setProfile] = useState<NavbarProfile | null>(null);

  const isOrganizer = location.pathname.includes('/organizer');
  const isProfileRoute = location.pathname === '/profile';

  useEffect(() => {
    setIsAuthenticated(isUserAuthenticated());
  }, [location.pathname]);

  useEffect(() => {
    if (!isAuthenticated) {
      setProfile(null);
      return;
    }

    apiGet<{ user: NavbarProfile }>(`/api/profile?userId=${getCurrentUserId()}`)
      .then((data) => setProfile(data.user))
      .catch(() => setProfile(null));
  }, [isAuthenticated, location.pathname]);

  const organizerHref = isAuthenticated ? '/organizer' : '/login';
  const dashboardHref = isAuthenticated ? '/dashboard' : '/login';
  const profileHref = isAuthenticated ? '/profile' : '/login';
  const ticketsHref = isAuthenticated ? '/tickets' : '/login';
  const profileInitials = (profile?.name || 'Profile')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');

  const navLinks = isOrganizer
    ? [
        { to: organizerHref, label: 'Dashboard', icon: LayoutDashboard },
        { to: isAuthenticated ? '/organizer/create-event' : '/login', label: 'Create Event', icon: CalendarDays },
        { to: isAuthenticated ? '/organizer/check-in' : '/login', label: 'Check-in', icon: Ticket },
      ]
    : [
        { to: '/events', label: 'Events', icon: CalendarDays },
        { to: dashboardHref, label: 'Dashboard', icon: LayoutDashboard },
        { to: ticketsHref, label: 'My Tickets', icon: Ticket },
      ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600">
              <span className="text-lg font-bold text-white">P</span>
            </div>
            <span className="text-xl font-semibold">Pulse</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.to;
              return (
                <Link key={link.to} to={link.to}>
                  <Button
                    variant={isActive ? 'secondary' : 'ghost'}
                    className="gap-2"
                  >
                    <Icon className="h-4 w-4" />
                    {link.label}
                  </Button>
                </Link>
              );
            })}
          </div>

          {/* Right side actions */}
          <div className="flex items-center space-x-2">
            {isAuthenticated ? (
              <>
                <Link to={profileHref} className="block">
                  <Button
                    variant="ghost"
                    className={`h-10 rounded-full px-2 ${isProfileRoute ? 'bg-slate-100' : ''}`}
                  >
                    <span className="flex items-center gap-2">
                      {profile?.avatar ? (
                        <img
                          src={profile.avatar}
                          alt={profile?.name || 'Profile'}
                          className="h-7 w-7 rounded-full object-cover"
                        />
                      ) : (
                        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#172033] text-xs font-semibold text-white">
                          {profileInitials || <User className="h-4 w-4" />}
                        </span>
                      )}
                      <span className="hidden max-w-[8rem] truncate text-sm font-medium md:block">
                        {profile?.name || 'Profile'}
                      </span>
                    </span>
                  </Button>
                </Link>
                {!isOrganizer && (
                  <Link to={organizerHref} className="hidden md:block">
                    <Button variant="outline" size="sm">
                      Switch to Organizer
                    </Button>
                  </Link>
                )}
                {isOrganizer && (
                  <Link to="/events" className="hidden md:block">
                    <Button variant="outline" size="sm">
                      Switch to User
                    </Button>
                  </Link>
                )}
              </>
            ) : (
              <div className="hidden md:flex md:items-center md:space-x-2">
                <Link to="/login">
                  <Button variant="ghost">Sign in</Button>
                </Link>
                <Link to="/signup">
                  <Button>Get Started</Button>
                </Link>
              </div>
            )}

            {/* Mobile menu */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <div className="flex flex-col space-y-4 mt-8">
                  {isAuthenticated && (
                    <Link to={profileHref} onClick={() => setIsOpen(false)}>
                      <Button
                        variant={location.pathname === profileHref ? 'secondary' : 'ghost'}
                        className="w-full justify-start gap-2"
                      >
                        {profile?.avatar ? (
                          <img
                            src={profile.avatar}
                            alt={profile?.name || 'Profile'}
                            className="h-5 w-5 rounded-full object-cover"
                          />
                        ) : (
                          <User className="h-4 w-4" />
                        )}
                        {profile?.name || 'Profile'}
                      </Button>
                    </Link>
                  )}
                  {navLinks.map((link) => {
                    const Icon = link.icon;
                    const isActive = location.pathname === link.to;
                    return (
                      <Link
                        key={link.to}
                        to={link.to}
                        onClick={() => setIsOpen(false)}
                      >
                        <Button
                          variant={isActive ? 'secondary' : 'ghost'}
                          className="w-full justify-start gap-2"
                        >
                          <Icon className="h-4 w-4" />
                          {link.label}
                        </Button>
                      </Link>
                    );
                  })}
                  <div className="pt-4 border-t">
                    {!isOrganizer && (
                      <Link to={organizerHref} onClick={() => setIsOpen(false)}>
                        <Button variant="outline" className="w-full">
                          Switch to Organizer
                        </Button>
                      </Link>
                    )}
                    {isOrganizer && (
                      <Link to="/events" onClick={() => setIsOpen(false)}>
                        <Button variant="outline" className="w-full">
                          Switch to User
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
