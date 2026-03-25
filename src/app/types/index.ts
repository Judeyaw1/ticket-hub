export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  address: string;
  price: number;
  capacity: number;
  ticketsSold: number;
  category: Category;
  imageUrl: string;
  organizerId: string;
  organizer: Organizer;
  isTrending?: boolean;
  isVerified?: boolean;
  attendees?: User[];
  trustScore?: number;
}

export interface Organizer {
  id: string;
  name: string;
  bio: string;
  avatar: string;
  isVerified: boolean;
  eventsHosted: number;
  rating: number;
}

export interface Ticket {
  id: string;
  eventId: string;
  event: Event;
  userId: string;
  purchaseDate: string;
  qrCode: string;
  status: 'upcoming' | 'used' | 'cancelled';
  price: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  savedEvents: string[];
}

export type Category = 
  | 'Music' 
  | 'Sports' 
  | 'Arts' 
  | 'Food & Drink' 
  | 'Tech' 
  | 'Business' 
  | 'Wellness' 
  | 'Community';

export interface OrganizerStats {
  totalEvents: number;
  ticketsSold: number;
  revenue: number;
  activeEvents: number;
}
