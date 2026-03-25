import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { format } from 'date-fns';
import { BarChart, Bar, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Calendar, DollarSign, MoreHorizontal, Plus, Ticket, TrendingUp } from 'lucide-react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../components/ui/dropdown-menu';
import { apiGet } from '../lib/api';
import type { Event, OrganizerStats } from '../types';

export function OrganizerDashboardPage() {
  const [myEvents, setMyEvents] = useState<Event[]>([]);
  const [stats, setStats] = useState<OrganizerStats>({
    totalEvents: 0,
    ticketsSold: 0,
    revenue: 0,
    activeEvents: 0,
  });
  const [salesData, setSalesData] = useState<{ month: string; sales: number }[]>([]);
  const [revenueData, setRevenueData] = useState<{ month: string; revenue: number }[]>([]);

  useEffect(() => {
    apiGet<{
      stats: OrganizerStats;
      events: Event[];
      salesData: { month: string; sales: number }[];
      revenueData: { month: string; revenue: number }[];
    }>('/api/organizer/dashboard?organizerId=org-1').then((data) => {
      setStats(data.stats);
      setMyEvents(data.events);
      setSalesData(data.salesData);
      setRevenueData(data.revenueData);
    });
  }, []);

  return (
    <div className="min-h-screen bg-[#f6f1e8] text-slate-950">
      <div className="container mx-auto px-4 py-10 sm:px-6 lg:px-8">
        <section className="rounded-[2rem] bg-[radial-gradient(circle_at_top_left,_rgba(244,184,96,0.18),_transparent_24%),linear-gradient(135deg,_#172033_0%,_#22304d_42%,_#0f172a_100%)] p-8 text-white shadow-2xl sm:p-10">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="inline-flex rounded-full border border-white/15 bg-white/8 px-4 py-2 text-sm text-slate-200 backdrop-blur">
                Organizer workspace
              </div>
              <h1 className="mt-6 text-5xl font-semibold tracking-[-0.05em]">Build events with better signal.</h1>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-200">
                Track performance, watch sales momentum, and manage every live listing from one control room.
              </p>
            </div>
            <Link to="/organizer/create-event">
              <Button size="lg" className="bg-[#f4b860] text-slate-950 hover:bg-[#f7c87f]">
                <Plus className="mr-2 h-5 w-5" />
                Create event
              </Button>
            </Link>
          </div>
        </section>

        <section className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          <OrganizerMetric icon={Calendar} label="Total events" value={String(stats.totalEvents)} accent="bg-[#efe4d3] text-[#9a442e]" />
          <OrganizerMetric icon={Ticket} label="Tickets sold" value={stats.ticketsSold.toLocaleString()} accent="bg-[#e5efff] text-[#1d4ed8]" />
          <OrganizerMetric icon={DollarSign} label="Revenue" value={`$${stats.revenue.toLocaleString()}`} accent="bg-[#e4f7ee] text-[#047857]" />
          <OrganizerMetric icon={TrendingUp} label="Active events" value={String(stats.activeEvents)} accent="bg-[#ffe8d6] text-[#c2410c]" />
        </section>

        <section className="mt-10 grid gap-6 xl:grid-cols-2">
          <Card className="border-black/5 bg-white/85 p-6 shadow-sm">
            <div className="mb-6">
              <div className="text-sm uppercase tracking-[0.22em] text-slate-500">Ticket sales</div>
              <h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em]">Momentum by month</h2>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip />
                <Bar dataKey="sales" fill="#9a442e" radius={[10, 10, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          <Card className="border-black/5 bg-white/85 p-6 shadow-sm">
            <div className="mb-6">
              <div className="text-sm uppercase tracking-[0.22em] text-slate-500">Revenue</div>
              <h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em]">Income trend</h2>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip />
                <Line type="monotone" dataKey="revenue" stroke="#172033" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </section>

        <section className="mt-10 grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
          <Card className="overflow-hidden border-black/5 bg-white/85 shadow-sm">
            <div className="border-b border-black/5 p-6">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <div className="text-sm uppercase tracking-[0.22em] text-slate-500">Live listings</div>
                  <h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em]">Your events</h2>
                </div>
                <Link to="/organizer/create-event">
                  <Button variant="outline" className="rounded-full border-black/10 bg-[#fbf8f3]">
                    New listing
                  </Button>
                </Link>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[780px]">
                <thead className="bg-[#fbf8f3]">
                  <tr className="text-left text-xs uppercase tracking-[0.18em] text-slate-500">
                    <th className="px-6 py-4">Event</th>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4">Sales</th>
                    <th className="px-6 py-4">Revenue</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {myEvents.map((event) => {
                    const percentageSold = (event.ticketsSold / event.capacity) * 100;
                    const revenue = event.ticketsSold * event.price;

                    return (
                      <tr key={event.id} className="border-t border-black/5">
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-4">
                            <img src={event.imageUrl} alt={event.title} className="h-14 w-14 rounded-2xl object-cover" />
                            <div>
                              <div className="font-medium">{event.title}</div>
                              <div className="mt-1 text-sm text-slate-500">{event.location}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5 text-sm text-slate-600">
                          <div>{format(new Date(event.date), 'MMM d, yyyy')}</div>
                          <div className="mt-1">{event.time}</div>
                        </td>
                        <td className="px-6 py-5 text-sm text-slate-600">
                          <div className="font-medium text-slate-900">{event.ticketsSold} / {event.capacity}</div>
                          <div className="mt-1">{percentageSold.toFixed(0)}% sold</div>
                        </td>
                        <td className="px-6 py-5 font-medium">${revenue.toLocaleString()}</td>
                        <td className="px-6 py-5">
                          {percentageSold > 90 ? (
                            <Badge variant="destructive">Almost sold out</Badge>
                          ) : percentageSold > 50 ? (
                            <Badge className="border-0 bg-emerald-100 text-emerald-700">Selling well</Badge>
                          ) : (
                            <Badge variant="secondary">Available</Badge>
                          )}
                        </td>
                        <td className="px-6 py-5">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>View details</DropdownMenuItem>
                              <DropdownMenuItem>Edit event</DropdownMenuItem>
                              <DropdownMenuItem>View analytics</DropdownMenuItem>
                              <DropdownMenuItem className="text-red-600">Cancel event</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>

          <Card className="border-black/5 bg-white/85 p-6 shadow-sm">
            <div className="text-sm uppercase tracking-[0.22em] text-slate-500">Recent activity</div>
            <h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em]">What changed lately</h2>
            <div className="mt-6 space-y-4">
              {[
                { title: `${stats.ticketsSold} tickets sold`, subtitle: 'Live data from your organizer inventory', time: 'Live', tone: 'bg-[#e4f7ee] text-[#047857]', icon: Ticket },
                { title: `${stats.totalEvents} events in database`, subtitle: 'Organizer listings currently stored', time: 'Live', tone: 'bg-[#e5efff] text-[#1d4ed8]', icon: Calendar },
                { title: `${stats.activeEvents} active events`, subtitle: 'Upcoming events still on sale', time: 'Live', tone: 'bg-[#efe4d3] text-[#9a442e]', icon: TrendingUp },
              ].map((item) => (
                <div key={item.title} className="flex items-start gap-4 rounded-[1.5rem] bg-[#fbf8f3] p-4">
                  <div className={`rounded-2xl p-3 ${item.tone}`}>
                    <item.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="font-medium">{item.title}</div>
                    <div className="mt-1 text-sm text-slate-600">{item.subtitle}</div>
                    <div className="mt-2 text-xs uppercase tracking-[0.16em] text-slate-400">{item.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </section>
      </div>
    </div>
  );
}

function OrganizerMetric({
  icon: Icon,
  label,
  value,
  accent,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  accent: string;
}) {
  return (
    <Card className="border-black/5 bg-white/85 p-6 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-sm uppercase tracking-[0.2em] text-slate-500">{label}</div>
          <div className="mt-3 text-4xl font-semibold tracking-[-0.04em]">{value}</div>
        </div>
        <div className={`rounded-2xl p-3 ${accent}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </Card>
  );
}
