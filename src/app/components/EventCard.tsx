import { Link } from 'react-router';
import { Event } from '../types';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Calendar, MapPin, TrendingUp, Shield } from 'lucide-react';
import { format } from 'date-fns';

interface EventCardProps {
  event: Event;
}

export function EventCard({ event }: EventCardProps) {
  const availableTickets = event.capacity - event.ticketsSold;
  const percentageSold = (event.ticketsSold / event.capacity) * 100;
  const isAlmostSoldOut = percentageSold > 85;

  return (
    <Link to={`/events/${event.id}`}>
      <Card className="group overflow-hidden border-0 shadow-sm hover:shadow-lg transition-all duration-300 bg-white">
        {/* Image */}
        <div className="relative aspect-[16/10] overflow-hidden bg-gray-100">
          <img
            src={event.imageUrl}
            alt={event.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute top-3 left-3 flex gap-2">
            {event.isTrending && (
              <Badge className="bg-gradient-to-r from-orange-500 to-pink-500 text-white border-0 gap-1">
                <TrendingUp className="h-3 w-3" />
                Trending
              </Badge>
            )}
            {event.isVerified && (
              <Badge className="bg-white/95 text-gray-900 border-0 gap-1">
                <Shield className="h-3 w-3" />
                Verified
              </Badge>
            )}
          </div>
          {isAlmostSoldOut && (
            <div className="absolute top-3 right-3">
              <Badge variant="destructive" className="border-0">
                {availableTickets} left
              </Badge>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4 space-y-3">
          {/* Category */}
          <Badge variant="outline" className="text-xs">
            {event.category}
          </Badge>

          {/* Title */}
          <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-violet-600 transition-colors">
            {event.title}
          </h3>

          {/* Date & Location */}
          <div className="space-y-1.5 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 flex-shrink-0" />
              <span>
                {format(new Date(event.date), 'EEE, MMM d')} • {event.time}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 flex-shrink-0" />
              <span className="truncate">{event.location}</span>
            </div>
          </div>

          {/* Organizer & Price */}
          <div className="flex items-center justify-between pt-2 border-t">
            <div className="flex items-center gap-2">
              <img
                src={event.organizer.avatar}
                alt={event.organizer.name}
                className="h-6 w-6 rounded-full"
              />
              <span className="text-sm text-gray-600 truncate max-w-[120px]">
                {event.organizer.name}
              </span>
            </div>
            <div className="font-semibold text-lg">
              ${event.price}
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}
