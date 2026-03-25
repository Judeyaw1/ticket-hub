import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { format } from 'date-fns';
import { Calendar, Heart, Ticket, TrendingUp, ArrowRight } from 'lucide-react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { EventCard } from '../components/EventCard';
import { apiGet } from '../lib/api';
import { getCurrentUserId } from '../lib/auth';
import type { Event, Ticket as TicketType, User } from '../types';

export function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [upcomingTickets, setUpcomingTickets] = useState<TicketType[]>([]);
  const [savedEvents, setSavedEvents] = useState<Event[]>([]);
  const [recommendedEvents, setRecommendedEvents] = useState<Event[]>([]);

  useEffect(() => {
    apiGet<{
      user: User | null;
      upcomingTickets: TicketType[];
      savedEvents: Event[];
      recommendedEvents: Event[];
    }>(`/api/dashboard?userId=${getCurrentUserId()}`).then((data) => {
      setUser(data.user);
      setUpcomingTickets(data.upcomingTickets);
      setSavedEvents(data.savedEvents);
      setRecommendedEvents(data.recommendedEvents);
    });
  }, []);

  if (!user) {
    return <div className="min-h-screen bg-[#f6f1e8]" />;
  }

  return (
    <div className="min-h-screen bg-[#f6f1e8] text-slate-950">
      <div className="container mx-auto px-4 py-10 sm:px-6 lg:px-8">
        <section className="overflow-hidden rounded-[2rem] bg-[radial-gradient(circle_at_top_left,_rgba(244,184,96,0.18),_transparent_24%),linear-gradient(135deg,_#172033_0%,_#22304d_42%,_#0f172a_100%)] p-8 text-white shadow-2xl sm:p-10">
          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
            <div>
              <div className="inline-flex rounded-full border border-white/15 bg-white/8 px-4 py-2 text-sm text-slate-200 backdrop-blur">
                Your attendee dashboard
              </div>
              <h1 className="mt-6 text-5xl font-semibold tracking-[-0.05em]">
                Welcome back, {user.name.split(' ')[0]}.
              </h1>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-200">
                Upcoming tickets, saved events, and the next set of recommendations are all in one
                place so you can plan faster.
              </p>
            </div>

            <Card className="border-white/10 bg-white/8 p-6 text-white backdrop-blur-xl">
              <div className="flex items-center gap-4">
                <img src={user.avatar} alt={user.name} className="h-16 w-16 rounded-full bg-white/10" />
                <div>
                  <div className="text-lg font-medium">{user.name}</div>
                  <div className="text-sm text-slate-300">{user.email}</div>
                </div>
              </div>
              <div className="mt-6 grid grid-cols-3 gap-3 text-center">
                <MetricCard label="Upcoming" value={String(upcomingTickets.length)} />
                <MetricCard label="Saved" value={String(savedEvents.length)} />
                <MetricCard label="Attended" value="12" />
              </div>
            </Card>
          </div>
        </section>

        <section className="mt-8 grid gap-6 md:grid-cols-3">
          <QuickCard
            icon={Ticket}
            title="Upcoming tickets"
            value={String(upcomingTickets.length)}
            description="Ready for your next plans"
            href="/tickets"
          />
          <QuickCard
            icon={Heart}
            title="Saved events"
            value={String(savedEvents.length)}
            description="Listings you marked to revisit"
          />
          <QuickCard
            icon={Calendar}
            title="This month"
            value={upcomingTickets[0] ? format(new Date(upcomingTickets[0].event.date), 'MMM d') : 'None'}
            description="Nearest event on your calendar"
          />
        </section>

        {upcomingTickets.length > 0 && (
          <section className="mt-12">
            <div className="mb-6 flex items-end justify-between gap-4">
              <div>
                <div className="text-sm uppercase tracking-[0.22em] text-slate-500">Upcoming</div>
                <h2 className="mt-2 text-3xl font-semibold tracking-[-0.04em]">Your next events</h2>
              </div>
              <Link to="/tickets">
                <Button variant="outline" className="rounded-full border-black/10 bg-white/75">
                  View all tickets
                </Button>
              </Link>
            </div>
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {upcomingTickets.slice(0, 3).map((ticket) => (
                <EventCard key={ticket.id} event={ticket.event} />
              ))}
            </div>
          </section>
        )}

        {savedEvents.length > 0 && (
          <section className="mt-12">
            <div className="mb-6">
              <div className="text-sm uppercase tracking-[0.22em] text-slate-500">Saved</div>
              <h2 className="mt-2 text-3xl font-semibold tracking-[-0.04em]">Events worth revisiting</h2>
            </div>
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {savedEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          </section>
        )}

        <section className="mt-12">
          <div className="mb-6 flex items-center gap-3">
            <TrendingUp className="h-6 w-6 text-[#9a442e]" />
            <div>
              <div className="text-sm uppercase tracking-[0.22em] text-slate-500">Recommended</div>
              <h2 className="mt-1 text-3xl font-semibold tracking-[-0.04em]">Picked for your next night out</h2>
            </div>
          </div>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {recommendedEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/8 p-4">
      <div className="text-2xl font-semibold tracking-[-0.04em]">{value}</div>
      <div className="mt-1 text-xs uppercase tracking-[0.2em] text-slate-300">{label}</div>
    </div>
  );
}

function QuickCard({
  icon: Icon,
  title,
  value,
  description,
  href,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  value: string;
  description: string;
  href?: string;
}) {
  const content = (
    <Card className="border-black/5 bg-white/80 p-6 shadow-sm transition-transform duration-300 hover:-translate-y-1">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-sm uppercase tracking-[0.2em] text-slate-500">{title}</div>
          <div className="mt-3 text-4xl font-semibold tracking-[-0.04em]">{value}</div>
          <div className="mt-2 text-sm text-slate-600">{description}</div>
        </div>
        <div className="rounded-2xl bg-[#efe4d3] p-3 text-[#9a442e]">
          <Icon className="h-5 w-5" />
        </div>
      </div>
      {href && (
        <div className="mt-5 inline-flex items-center text-sm font-medium text-[#9a442e]">
          Open
          <ArrowRight className="ml-2 h-4 w-4" />
        </div>
      )}
    </Card>
  );

  return href ? <Link to={href}>{content}</Link> : content;
}
