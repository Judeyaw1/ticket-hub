import { Link } from 'react-router';
import { Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t bg-gray-50 mt-auto">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600">
                <span className="text-lg font-bold text-white">P</span>
              </div>
              <span className="text-xl font-semibold">Pulse</span>
            </div>
            <p className="text-sm text-gray-600">
              Discover and attend amazing events. Trusted by thousands of event-goers worldwide.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-600 hover:text-violet-600 transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-600 hover:text-violet-600 transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-600 hover:text-violet-600 transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-600 hover:text-violet-600 transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Discover */}
          <div>
            <h3 className="font-semibold mb-4">Discover</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/events" className="text-sm text-gray-600 hover:text-violet-600 transition-colors">
                  Browse Events
                </Link>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-600 hover:text-violet-600 transition-colors">
                  Categories
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-600 hover:text-violet-600 transition-colors">
                  Trending
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-600 hover:text-violet-600 transition-colors">
                  Near You
                </a>
              </li>
            </ul>
          </div>

          {/* Organizers */}
          <div>
            <h3 className="font-semibold mb-4">For Organizers</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/organizer" className="text-sm text-gray-600 hover:text-violet-600 transition-colors">
                  Organizer Dashboard
                </Link>
              </li>
              <li>
                <Link to="/organizer/create-event" className="text-sm text-gray-600 hover:text-violet-600 transition-colors">
                  Create Event
                </Link>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-600 hover:text-violet-600 transition-colors">
                  Pricing
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-600 hover:text-violet-600 transition-colors">
                  Resources
                </a>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-sm text-gray-600 hover:text-violet-600 transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-600 hover:text-violet-600 transition-colors">
                  Contact
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-600 hover:text-violet-600 transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-600 hover:text-violet-600 transition-colors">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t text-center">
          <p className="text-sm text-gray-600">
            © {new Date().getFullYear()} Pulse. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
