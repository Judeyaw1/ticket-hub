import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { format } from 'date-fns';
import { Calendar, Download, MapPin, Share2, Ticket as TicketIcon } from 'lucide-react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { apiGet } from '../lib/api';
import { getCurrentUserId } from '../lib/auth';
import type { Ticket } from '../types';

export function MyTicketsPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);

  useEffect(() => {
    apiGet<{ tickets: Ticket[] }>(`/api/tickets?userId=${getCurrentUserId()}`).then((data) => {
      setTickets(data.tickets);
    });
  }, []);

  const upcomingTickets = tickets.filter((ticket) => ticket.status === 'upcoming');
  const usedTickets = tickets.filter((ticket) => ticket.status === 'used');

  return (
    <div className="min-h-screen bg-[#f6f1e8] text-slate-950">
      <div className="container mx-auto px-4 py-10 sm:px-6 lg:px-8">
        <section className="rounded-[2rem] bg-[radial-gradient(circle_at_top_left,_rgba(244,184,96,0.16),_transparent_24%),linear-gradient(135deg,_#172033_0%,_#22304d_42%,_#0f172a_100%)] p-8 text-white shadow-2xl sm:p-10">
          <div className="grid gap-8 lg:grid-cols-[1fr_320px] lg:items-end">
            <div>
              <div className="inline-flex rounded-full border border-white/15 bg-white/8 px-4 py-2 text-sm text-slate-200 backdrop-blur">
                Ticket wallet
              </div>
              <h1 className="mt-6 text-5xl font-semibold tracking-[-0.05em]">Your tickets, ready at the door.</h1>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-200">
                Keep upcoming QR access close, review past entries, and move through check-in without
                hunting for confirmation emails.
              </p>
            </div>
            <Card className="border-white/10 bg-white/8 p-6 text-white backdrop-blur-xl">
              <div className="text-sm uppercase tracking-[0.22em] text-slate-300">Overview</div>
              <div className="mt-6 grid grid-cols-2 gap-3">
                <TicketMetric label="Upcoming" value={String(upcomingTickets.length)} />
                <TicketMetric label="Past" value={String(usedTickets.length)} />
              </div>
            </Card>
          </div>
        </section>

        <Tabs defaultValue="upcoming" className="mt-8 space-y-6">
          <TabsList className="h-auto rounded-full bg-transparent p-0">
            <TabsTrigger value="upcoming" className="rounded-full border border-black/10 bg-white/80 px-5 py-2.5">
              Upcoming ({upcomingTickets.length})
            </TabsTrigger>
            <TabsTrigger value="past" className="rounded-full border border-black/10 bg-white/80 px-5 py-2.5">
              Past ({usedTickets.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming" className="space-y-5">
            {upcomingTickets.length > 0 ? (
              upcomingTickets.map((ticket) => <TicketCard key={ticket.id} ticket={ticket} />)
            ) : (
              <EmptyState
                title="No upcoming tickets"
                description="You haven’t booked anything yet. Browse the event feed and claim your next plan."
                actionLabel="Browse events"
                actionHref="/events"
              />
            )}
          </TabsContent>

          <TabsContent value="past" className="space-y-5">
            {usedTickets.length > 0 ? (
              usedTickets.map((ticket) => <TicketCard key={ticket.id} ticket={ticket} isPast />)
            ) : (
              <EmptyState title="No past tickets" description="Completed event entries will show up here." />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function TicketCard({ ticket, isPast }: { ticket: Ticket; isPast?: boolean }) {
  return (
    <Card className="overflow-hidden border-black/5 bg-white/85 shadow-sm">
      <div className="grid gap-0 lg:grid-cols-[260px_1fr]">
        <div className="relative min-h-[220px]">
          <img src={ticket.event.imageUrl} alt={ticket.event.title} className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/45 to-transparent" />
          <div className="absolute left-4 top-4 flex gap-2">
            <Badge className="border-0 bg-white/95 text-slate-900">{ticket.event.category}</Badge>
            {ticket.event.isVerified && <Badge className="border-0 bg-emerald-100 text-emerald-700">Verified</Badge>}
          </div>
        </div>

        <div className="p-6 sm:p-7">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-2xl">
              <h2 className="text-3xl font-semibold tracking-[-0.04em]">{ticket.event.title}</h2>
              <div className="mt-4 space-y-2 text-sm text-slate-600">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  {format(new Date(ticket.event.date), 'EEEE, MMMM d, yyyy')} at {ticket.event.time}
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  {ticket.event.location}
                </div>
              </div>
            </div>

            {!isPast && (
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="bg-[#172033] hover:bg-[#22304d]">View QR code</Button>
                </DialogTrigger>
                <DialogContent className="border-black/5 bg-white">
                  <DialogHeader>
                    <DialogTitle>Your ticket</DialogTitle>
                  </DialogHeader>
                  <div className="py-4">
                    <div className="flex items-center justify-center rounded-[1.5rem] bg-[#f6f1e8] p-8">
                      <div className="flex h-64 w-64 flex-col items-center justify-center rounded-2xl border-2 border-dashed border-black/10 bg-white">
                        <TicketIcon className="h-16 w-16 text-slate-400" />
                        <div className="mt-3 text-sm text-slate-600">QR Code</div>
                        <div className="mt-1 text-xs text-slate-400">{ticket.qrCode}</div>
                      </div>
                    </div>
                    <p className="mt-4 text-center text-sm text-slate-600">Show this code at the event entrance.</p>
                    <div className="mt-5 grid grid-cols-2 gap-3">
                      <Button variant="outline" className="border-black/10 bg-[#fbf8f3]">
                        <Download className="mr-2 h-4 w-4" />
                        Download
                      </Button>
                      <Button variant="outline" className="border-black/10 bg-[#fbf8f3]">
                        <Share2 className="mr-2 h-4 w-4" />
                        Share
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </div>

          <div className="mt-6 grid gap-4 rounded-[1.5rem] bg-[#fbf8f3] p-5 text-sm text-slate-600 sm:grid-cols-3">
            <div>
              <div className="text-xs uppercase tracking-[0.18em] text-slate-500">Ticket ID</div>
              <div className="mt-2 font-mono text-slate-900">{ticket.id}</div>
            </div>
            <div>
              <div className="text-xs uppercase tracking-[0.18em] text-slate-500">Purchased</div>
              <div className="mt-2 font-medium text-slate-900">{format(new Date(ticket.purchaseDate), 'MMM d, yyyy')}</div>
            </div>
            <div>
              <div className="text-xs uppercase tracking-[0.18em] text-slate-500">Price paid</div>
              <div className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-slate-900">${ticket.price}</div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

function TicketMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/8 p-4 text-center">
      <div className="text-3xl font-semibold tracking-[-0.04em]">{value}</div>
      <div className="mt-1 text-xs uppercase tracking-[0.2em] text-slate-300">{label}</div>
    </div>
  );
}

function EmptyState({
  title,
  description,
  actionLabel,
  actionHref,
}: {
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
}) {
  return (
    <Card className="border-black/5 bg-white/80 p-12 text-center shadow-sm">
      <div className="mx-auto max-w-md">
        <div className="mx-auto mb-4 flex h-18 w-18 items-center justify-center rounded-full bg-[#efe4d3]">
          <TicketIcon className="h-8 w-8 text-slate-500" />
        </div>
        <h3 className="text-2xl font-semibold tracking-[-0.03em]">{title}</h3>
        <p className="mt-3 text-slate-600">{description}</p>
        {actionLabel && actionHref && (
          <Link to={actionHref}>
            <Button className="mt-6 bg-[#172033] hover:bg-[#22304d]">{actionLabel}</Button>
          </Link>
        )}
      </div>
    </Card>
  );
}
