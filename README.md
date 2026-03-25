# Pulse - Event Discovery & Ticketing Platform

A modern, premium event discovery and ticketing platform built with React, TypeScript, and Tailwind CSS.

## Features

### User Features
- **Landing Page**: Beautiful hero section with featured events and trust indicators
- **Event Discovery**: Advanced search and filtering with multiple categories
- **Event Details**: Comprehensive event information with trust scores
- **User Dashboard**: Personal dashboard with upcoming events and recommendations
- **Ticket Management**: Digital tickets with QR codes for easy check-in
- **Authentication**: Modern sign-in/sign-up pages with social login UI

### Organizer Features
- **Organizer Dashboard**: Analytics and performance metrics with charts
- **Create Events**: Comprehensive event creation form with preview
- **Check-in Scanner**: QR code scanning interface for event entry
- **Event Management**: Track sales, revenue, and attendee statistics

## Tech Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **React Router 7** - Navigation and routing
- **Tailwind CSS v4** - Styling
- **Radix UI** - Accessible component primitives
- **Lucide React** - Icons
- **Recharts** - Data visualization
- **Motion** - Animations
- **date-fns** - Date formatting

## Design Philosophy

Pulse follows a premium, modern design approach inspired by:
- **Apple** - Clean, minimal aesthetics
- **Stripe** - Trustworthy, professional interface
- **Linear** - Smooth interactions and animations

### Design Principles
- Premium, minimal, modern UI
- Clean spacing and strong visual hierarchy
- Smooth interactions with subtle animations
- Trustworthy look with verified organizer badges
- Mobile-first responsive design
- Elegant typography and rounded cards
- Soft shadows and clean layouts

## Project Structure

```
src/
├── app/
│   ├── components/
│   │   ├── ui/              # Reusable UI components (Shadcn/ui)
│   │   ├── EventCard.tsx    # Event card component
│   │   ├── Navbar.tsx       # Navigation bar
│   │   ├── Footer.tsx       # Footer component
│   │   └── Layout.tsx       # Layout wrapper
│   ├── pages/
│   │   ├── LandingPage.tsx           # Home/landing page
│   │   ├── LoginPage.tsx             # Sign in page
│   │   ├── SignupPage.tsx            # Sign up page
│   │   ├── EventsPage.tsx            # Event discovery page
│   │   ├── EventDetailsPage.tsx      # Single event details
│   │   ├── DashboardPage.tsx         # User dashboard
│   │   ├── MyTicketsPage.tsx         # User's tickets
│   │   ├── OrganizerDashboardPage.tsx # Organizer dashboard
│   │   ├── CreateEventPage.tsx       # Create new event
│   │   ├── CheckInPage.tsx           # Check-in scanner
│   │   └── NotFoundPage.tsx          # 404 page
│   ├── data/
│   │   └── mock-data.ts     # Mock data for events, organizers, tickets
│   ├── types/
│   │   └── index.ts         # TypeScript type definitions
│   ├── routes.tsx           # Route configuration
│   └── App.tsx              # Main app component
└── styles/
    ├── tailwind.css         # Tailwind imports
    ├── theme.css            # Design tokens and theme
    ├── fonts.css            # Font imports
    └── index.css            # Global styles
```

## Routes

### Public Routes
- `/` - Landing page
- `/login` - Sign in
- `/signup` - Sign up
- `/events` - Browse events
- `/events/:id` - Event details

### User Routes
- `/dashboard` - User dashboard
- `/tickets` - My tickets

### Organizer Routes
- `/organizer` - Organizer dashboard
- `/organizer/create-event` - Create new event
- `/organizer/check-in` - Check-in scanner

## Mock Data

The application uses realistic mock data including:
- 12 sample events across various categories
- 5 verified organizers
- Sample tickets with QR codes
- User profile data
- Organizer statistics and analytics

All mock data is defined in `/src/app/data/mock-data.ts` and can be easily replaced with real API calls.

## Key Components

### EventCard
Reusable event card component with:
- Event image
- Category badge
- Trending/verified indicators
- Date, time, and location
- Organizer info
- Price
- Hover effects

### Navbar
Responsive navigation with:
- Dynamic links based on user role (user vs organizer)
- Mobile menu with sheet/drawer
- Role switching
- Profile access

### Dashboard Analytics
Organizer dashboard includes:
- Revenue and sales charts (Recharts)
- Event management table
- Recent activity feed
- Quick stats cards

## Future Backend Integration

When connecting to a real backend, replace mock data with API calls:

1. **Authentication**: Replace mock auth in LoginPage/SignupPage
2. **Events API**: Replace `mockEvents` with API fetches
3. **Tickets API**: Connect ticket purchase and retrieval
4. **Organizer API**: Connect event creation and management
5. **Check-in API**: Connect QR code validation

Example integration points are marked with comments like:
```typescript
// In a real app, this would call an API
// TODO: Replace with actual API call
```

## State Management

Currently uses local component state. For a production app, consider:
- **Context API** for global state (user auth, theme)
- **React Query** for server state management
- **Zustand/Redux** for complex client state

## Customization

### Colors
Update the color scheme in `/src/styles/theme.css`:
- Primary color: Currently violet-600
- Adjust CSS variables for your brand

### Fonts
Add custom fonts in `/src/styles/fonts.css`

### Components
All UI components use Tailwind v4 and can be customized via utility classes

## Notes

- All images use Unsplash for demo purposes
- QR codes are placeholders - implement real QR generation for production
- Payment processing is mocked - integrate with Stripe/PayPal for real payments
- Email notifications not implemented - add transactional email service
- No actual camera/scanner implementation - use a QR scanning library

## Production Considerations

Before deploying:
1. Implement real authentication with JWT/sessions
2. Connect to a real database (PostgreSQL, MongoDB)
3. Add payment processing (Stripe, PayPal)
4. Implement real QR code generation and validation
5. Add email notifications (SendGrid, AWS SES)
6. Implement proper error handling and logging
7. Add analytics tracking (Google Analytics, Mixpanel)
8. Optimize images and lazy loading
9. Add SEO metadata
10. Implement rate limiting and security measures

## Database Connection

This project now includes a server-side Neon/Postgres connection for Vercel functions.

- Set `DATABASE_URL` locally in `.env.local`
- Set the same `DATABASE_URL` in your Vercel project environment variables
- The example serverless route is available at `/api/db-status`

The database connection is intentionally kept out of the React client bundle. Do not expose the Postgres connection string through `import.meta.env` in frontend code.

## License

This is a demo project built for educational purposes.
