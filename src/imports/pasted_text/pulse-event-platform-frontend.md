You are a senior frontend engineer and product designer.

Build a polished, production-quality frontend for a modern event discovery and ticketing platform called "Pulse".

Tech Stack:
- Next.js
- React
- TypeScript
- Tailwind CSS
- Shadcn/ui for components
- Lucide React for icons

Goal:
Create a clean, premium, mobile-first frontend that feels more modern, trustworthy, and intelligent than apps like Posh. The app should look launch-ready, even if the backend is not yet connected.

Design Direction:
- Premium, minimal, modern UI
- Clean spacing and strong visual hierarchy
- Smooth interactions and subtle animations
- Trustworthy look, not nightclub chaos
- Style inspired by Apple, Stripe, Linear, and modern fintech dashboards
- Use rounded cards, soft shadows, elegant typography, and responsive layouts
- Avoid clutter, random bright colors, and cheap-looking gradients

Core Screens to Build:

1. Landing Page
- Strong hero section with headline, subheadline, and CTA buttons
- Featured events section
- “How it works” section
- Trust-focused section explaining verified organizers and safe ticketing
- Footer

2. Authentication Pages
- Sign in page
- Sign up page
- Clean split-screen or centered card layout
- Social login buttons UI included

3. Event Discovery Page
- Search bar
- Filter section:
  - Location
  - Date
  - Category
  - Price
- Tabs or toggle for:
  - Trending
  - Recommended
  - Nearby
- Responsive event card grid

4. Event Card Component
Each card should show:
- Event image
- Event title
- Date and time
- Location
- Price
- Organizer
- Trust badge or verification label
- Subtle hover effect

5. Event Details Page
- Large event banner/image
- Title, date, time, location
- Organizer info
- Ticket price
- Trust score / verified organizer section
- About event section
- Attendees preview
- CTA to buy ticket
- Sticky purchase panel on desktop
- Bottom fixed CTA on mobile

6. User Dashboard
- Welcome header
- Upcoming tickets
- Recommended events
- Saved events
- Simple profile summary

7. My Tickets Page
- Ticket cards with:
  - Event info
  - QR code placeholder
  - Ticket status
- Clean layout for upcoming vs used tickets

8. Organizer Dashboard
- Dashboard overview cards:
  - Total events
  - Tickets sold
  - Revenue
- Event list table or cards
- “Create Event” button
- Analytics placeholders with elegant charts/cards
- Recent activity panel

9. Create Event Page
- Form with fields for:
  - Event title
  - Description
  - Date and time
  - Location
  - Ticket price
  - Capacity
  - Upload cover image
- Well-structured form layout
- Validation states in UI

10. Check-in / Scanner Page UI
- Simple clean page for organizers
- Camera/scanner placeholder
- Manual ticket code entry
- Success / invalid ticket states

Component Requirements:
- Reusable navbar
- Mobile bottom navigation or responsive menu
- Reusable buttons, badges, cards, inputs, tabs, and modals
- Skeleton loaders
- Empty states
- Error states
- Toast UI patterns
- Modal for ticket purchase confirmation

Frontend Behavior:
- Use mock data only
- Use realistic fake content
- Add loading, hover, active, disabled, and empty states
- Make navigation feel real
- Use local state where needed
- Organize mock data cleanly
- Include responsive behavior for mobile, tablet, and desktop

Code Quality Requirements:
- Clean folder structure
- Reusable components
- Strong TypeScript typing
- Modular and scalable architecture
- Keep code readable and production-like
- Separate pages, components, hooks, and mock data clearly

Suggested Folder Structure:
- app/
- components/
- components/ui/
- lib/
- hooks/
- types/
- data/

Pages/Routes to Include:
- /
- /login
- /signup
- /events
- /events/[id]
- /dashboard
- /tickets
- /organizer
- /organizer/create-event
- /organizer/check-in

Mock Data:
Create realistic sample data for:
- Events
- Organizers
- Tickets
- Categories
- Users

Extra UI Details:
- Add subtle animation where appropriate
- Use iconography consistently
- Include status badges like Verified, Trending, Sold Out, Limited
- Include realistic empty states such as “No saved events yet”
- Build dark mode-ready structure, but default to light mode

What to Output:
1. Full frontend code
2. All pages and reusable components
3. Mock data
4. Setup instructions
5. Notes showing where backend/API integration will connect later

Important:
- Do not build backend logic
- Do not leave pages half done
- Do not make this look like a template
- Make the product feel distinctive and premium
- Prioritize UX clarity, trust, and conversion