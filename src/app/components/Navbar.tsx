import { Link, useLocation } from 'react-router';
import { Button } from './ui/button';
import { Menu, User, Ticket, CalendarDays, LayoutDashboard } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';
import { clearCurrentSession, isCurrentUserOrganizer, isUserAuthenticated } from '../lib/auth';

export function Navbar() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(isUserAuthenticated);
  const [hasOrganizerAccess, setHasOrganizerAccess] = useState(isCurrentUserOrganizer);

  const isOrganizerArea = location.pathname.includes('/organizer');
  const organizerHref = isAuthenticated && hasOrganizerAccess ? '/organizer' : '/signup';
  const dashboardHref = isAuthenticated ? '/dashboard' : '/login';
  const profileHref = isAuthenticated ? '/profile' : '/login';
  const ticketsHref = isAuthenticated ? '/tickets' : '/login';

  useEffect(() => {
    setIsAuthenticated(isUserAuthenticated());
    setHasOrganizerAccess(isCurrentUserOrganizer());
  }, [location.pathname]);

  const handleLogout = () => {
    clearCurrentSession();
    setIsAuthenticated(false);
    setHasOrganizerAccess(false);
    setIsOpen(false);
    window.location.href = '/login';
  };

  const navLinks = isOrganizerArea && hasOrganizerAccess
    ? [
        { to: organizerHref, label: 'Dashboard', icon: LayoutDashboard },
        { to: isAuthenticated && hasOrganizerAccess ? '/organizer/create-event' : '/signup', label: 'Create Event', icon: CalendarDays },
        { to: isAuthenticated && hasOrganizerAccess ? '/organizer/check-in' : '/signup', label: 'Check-in', icon: Ticket },
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
          <Link to="/" className="flex items-center space-x-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600">
              <span className="text-lg font-bold text-white">P</span>
            </div>
            <span className="text-xl font-semibold">Pulse</span>
          </Link>

          <div className="hidden md:flex md:items-center md:space-x-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.to;

              return (
                <Link key={link.to} to={link.to}>
                  <Button variant={isActive ? 'secondary' : 'ghost'} className="gap-2">
                    <Icon className="h-4 w-4" />
                    {link.label}
                  </Button>
                </Link>
              );
            })}
          </div>

          <div className="flex items-center space-x-2">
            {isAuthenticated ? (
              <>
                <Link to={profileHref} aria-label="Profile">
                  <Button
                    variant={location.pathname === '/profile' ? 'secondary' : 'ghost'}
                    size="icon"
                    className="rounded-full"
                  >
                    <User className="h-5 w-5" />
                  </Button>
                </Link>
                {hasOrganizerAccess && !isOrganizerArea && (
                  <Link to={organizerHref} className="hidden md:block">
                    <Button variant="outline" size="sm">
                      Switch to Organizer
                    </Button>
                  </Link>
                )}
                {isOrganizerArea && hasOrganizerAccess && (
                  <Link to="/events" className="hidden md:block">
                    <Button variant="outline" size="sm">
                      Switch to User
                    </Button>
                  </Link>
                )}
                <Button variant="ghost" size="sm" onClick={handleLogout} className="hidden md:inline-flex">
                  Log out
                </Button>
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

            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <div className="mt-8 flex flex-col space-y-4">
                  {isAuthenticated && (
                    <Link to={profileHref} onClick={() => setIsOpen(false)}>
                      <Button
                        variant={location.pathname === '/profile' ? 'secondary' : 'ghost'}
                        className="w-full justify-start gap-2"
                      >
                        <User className="h-4 w-4" />
                        Profile
                      </Button>
                    </Link>
                  )}
                  {navLinks.map((link) => {
                    const Icon = link.icon;
                    const isActive = location.pathname === link.to;

                    return (
                      <Link key={link.to} to={link.to} onClick={() => setIsOpen(false)}>
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
                  <div className="border-t pt-4">
                    {hasOrganizerAccess && !isOrganizerArea && (
                      <Link to={organizerHref} onClick={() => setIsOpen(false)}>
                        <Button variant="outline" className="w-full">
                          Switch to Organizer
                        </Button>
                      </Link>
                    )}
                    {isOrganizerArea && hasOrganizerAccess && (
                      <Link to="/events" onClick={() => setIsOpen(false)}>
                        <Button variant="outline" className="w-full">
                          Switch to User
                        </Button>
                      </Link>
                    )}
                    {isAuthenticated && (
                      <Button variant="ghost" className="w-full" onClick={handleLogout}>
                        Log out
                      </Button>
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
