import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import {
  ArrowRight,
  CheckCircle2,
  Compass,
  Globe,
  Radio,
  Search,
  ShieldCheck,
  Sparkles,
  Ticket,
  Users,
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { EventCard } from '../components/EventCard';
import { apiGet } from '../lib/api';
import type { Event } from '../types';

const cityNotes = [
  'Rooftop sets in New York',
  'Chef-led tastings in Seattle',
  'Late-night dance floors in Miami',
  'Founder rooms in San Francisco',
];

const platformSignals = [
  { label: 'Curated drops', value: '120+' },
  { label: 'Verified organizers', value: '5K+' },
  { label: 'Tickets secured', value: '500K+' },
  { label: 'Average trust score', value: '94/100' },
];

const experiencePillars = [
  {
    icon: Compass,
    title: 'Editorial discovery',
    description: 'Find nights with a point of view instead of scrolling endless generic listings.',
  },
  {
    icon: ShieldCheck,
    title: 'Proof before purchase',
    description: 'Organizer verification, trust scores, and clear event signals are visible upfront.',
  },
  {
    icon: Ticket,
    title: 'Fast ticket flow',
    description: 'Go from discovery to digital ticket in a few taps with a checkout built to stay out of the way.',
  },
];

export function LandingPage() {
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    apiGet<{ events: Event[] }>('/api/events').then((data) => setEvents(data.events));
  }, []);

  const trendingEvents = events.filter((event) => event.isTrending).slice(0, 3);
  const latestEvents = [...events]
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 4);
  const heroEvent = trendingEvents[0] || latestEvents[0];

  if (!heroEvent) {
    return (
      <div className="min-h-screen bg-[#f6f1e8] px-4 py-20">
        <div className="container mx-auto">
          <Card className="border-black/5 bg-white/80 p-12 text-center shadow-sm">
            <h1 className="text-3xl font-semibold tracking-[-0.03em]">Loading events</h1>
            <p className="mt-3 text-slate-600">Fetching live event data from the database.</p>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f6f1e8] text-slate-950">
      <section className="relative overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(245,158,11,0.22),_transparent_28%),radial-gradient(circle_at_80%_20%,_rgba(14,165,233,0.18),_transparent_24%),linear-gradient(135deg,_#111827_0%,_#1f2937_35%,_#0f172a_100%)] text-white">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:72px_72px] opacity-20" />
        <div className="absolute left-[-8rem] top-16 h-56 w-56 rounded-full bg-amber-400/20 blur-3xl" />
        <div className="absolute right-[-4rem] top-36 h-64 w-64 rounded-full bg-sky-400/20 blur-3xl" />

        <div className="container relative mx-auto px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/8 px-4 py-2 text-sm text-white/85 backdrop-blur">
                <Radio className="h-4 w-4 text-amber-300" />
                Live event discovery for people who care where they spend their nights
              </div>

              <div className="space-y-5">
                <h1 className="max-w-3xl text-5xl font-semibold leading-[0.95] tracking-[-0.04em] sm:text-6xl lg:text-7xl">
                  The city feels different when you know where to go next.
                </h1>
                <p className="max-w-2xl text-lg leading-8 text-slate-200 sm:text-xl">
                  Pulse turns event browsing into a curated signal. Discover verified experiences,
                  book faster, and move from “what’s happening?” to “I’m in.”
                </p>
              </div>

              <div className="flex flex-col gap-4 sm:flex-row">
                <Link to="/events">
                  <Button
                    size="lg"
                    className="w-full bg-[#f4b860] px-7 text-slate-950 hover:bg-[#f7c87f] sm:w-auto"
                  >
                    Explore events
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/organizer">
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full border-white/20 bg-white/5 px-7 text-white hover:bg-white/10 sm:w-auto"
                  >
                    Launch an event
                  </Button>
                </Link>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {cityNotes.map((note) => (
                  <div
                    key={note}
                    className="rounded-2xl border border-white/12 bg-white/6 px-4 py-3 text-sm text-slate-200 backdrop-blur"
                  >
                    {note}
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="absolute -left-6 top-10 hidden h-28 w-28 rounded-full border border-white/15 bg-white/8 backdrop-blur lg:block" />
              <Card className="relative overflow-hidden border-white/10 bg-white/8 p-3 shadow-2xl backdrop-blur-xl">
                <div className="overflow-hidden rounded-[1.6rem] border border-white/10 bg-slate-950/50">
                  <div className="relative aspect-[4/5]">
                    <img
                      src={heroEvent.imageUrl}
                      alt={heroEvent.title}
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/25 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 p-6">
                      <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/12 px-3 py-1 text-xs uppercase tracking-[0.24em] text-white/85">
                        <Sparkles className="h-3.5 w-3.5 text-amber-300" />
                        Editor’s pick
                      </div>
                      <h2 className="text-3xl font-semibold tracking-[-0.03em] text-white">
                        {heroEvent.title}
                      </h2>
                      <div className="mt-4 grid gap-3 text-sm text-slate-200 sm:grid-cols-3">
                        <div className="rounded-2xl bg-white/10 px-3 py-3">
                          <div className="text-white/60">Category</div>
                          <div className="mt-1 font-medium text-white">{heroEvent.category}</div>
                        </div>
                        <div className="rounded-2xl bg-white/10 px-3 py-3">
                          <div className="text-white/60">Trust score</div>
                          <div className="mt-1 font-medium text-white">{heroEvent.trustScore}/100</div>
                        </div>
                        <div className="rounded-2xl bg-white/10 px-3 py-3">
                          <div className="text-white/60">Venue</div>
                          <div className="mt-1 font-medium text-white">{heroEvent.location}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-black/5 bg-[#efe4d3]">
        <div className="container mx-auto grid gap-6 px-4 py-6 sm:px-6 md:grid-cols-2 lg:grid-cols-4 lg:px-8">
          {platformSignals.map((signal) => (
            <div key={signal.label} className="flex items-end justify-between gap-4">
              <div>
                <div className="text-3xl font-semibold tracking-[-0.04em] text-slate-950">
                  {signal.value}
                </div>
                <div className="mt-1 text-sm text-slate-600">{signal.label}</div>
              </div>
              <div className="h-10 w-px bg-slate-300 last:hidden md:block" />
            </div>
          ))}
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
            <Card className="border-0 bg-[#192534] p-8 text-white shadow-xl">
              <div className="mb-5 inline-flex rounded-full bg-white/10 px-3 py-1 text-xs uppercase tracking-[0.22em] text-slate-200">
                Discovery built as signal
              </div>
              <h2 className="max-w-md text-3xl font-semibold tracking-[-0.04em]">
                Find what feels worth leaving home for.
              </h2>
              <p className="mt-4 max-w-lg text-slate-300">
                Trending music, founder-heavy rooms, food weekends, culture drops, and last-minute
                tickets all sit in one place with enough context to make a decision quickly.
              </p>
              <div className="mt-8 grid gap-4">
                {experiencePillars.map((pillar) => (
                  <div
                    key={pillar.title}
                    className="rounded-2xl border border-white/10 bg-white/6 p-4"
                  >
                    <div className="flex items-center gap-3">
                      <div className="rounded-2xl bg-[#f4b860] p-2 text-slate-950">
                        <pillar.icon className="h-5 w-5" />
                      </div>
                      <h3 className="text-lg font-medium text-white">{pillar.title}</h3>
                    </div>
                    <p className="mt-3 text-sm leading-6 text-slate-300">{pillar.description}</p>
                  </div>
                ))}
              </div>
            </Card>

            <div className="grid gap-6 sm:grid-cols-2">
              <Card className="border-black/5 bg-white/80 p-7 shadow-sm">
                <div className="flex items-center gap-3 text-sm uppercase tracking-[0.22em] text-slate-500">
                  <Globe className="h-4 w-4" />
                  Pulse cities
                </div>
                <div className="mt-5 space-y-4">
                  {cityNotes.map((note, index) => (
                    <div
                      key={note}
                      className="flex items-center justify-between rounded-2xl bg-[#f6f1e8] px-4 py-4"
                    >
                      <span className="text-sm text-slate-500">0{index + 1}</span>
                      <span className="text-right font-medium text-slate-900">{note}</span>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="border-black/5 bg-[#a33b2b] p-7 text-white shadow-sm">
                <div className="flex items-center gap-3 text-sm uppercase tracking-[0.22em] text-white/75">
                  <Users className="h-4 w-4" />
                  For organizers
                </div>
                <h3 className="mt-5 text-3xl font-semibold tracking-[-0.03em]">
                  Put your event in front of people already looking for their next plan.
                </h3>
                <p className="mt-4 text-sm leading-6 text-white/80">
                  Verified profiles, clearer trust signals, and a cleaner event presentation help the
                  right crowd convert faster.
                </p>
                <Link to="/organizer" className="mt-8 inline-flex">
                  <Button className="bg-white text-[#7d2f24] hover:bg-[#f8e3de]">
                    Open organizer dashboard
                  </Button>
                </Link>
              </Card>

              <Card className="border-black/5 bg-[#f8fbff] p-7 shadow-sm sm:col-span-2">
                <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
                  <div>
                    <div className="flex items-center gap-2 text-sm uppercase tracking-[0.22em] text-slate-500">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                      Confidence layer
                    </div>
                    <h3 className="mt-4 text-3xl font-semibold tracking-[-0.03em] text-slate-950">
                      Trust is visible before checkout, not buried after it.
                    </h3>
                    <p className="mt-3 max-w-2xl text-slate-600">
                      Verified organizer badges, venue details, and trust scores reduce guesswork so
                      users can book with more certainty.
                    </p>
                  </div>
                  <div className="grid gap-3 text-sm">
                    <div className="rounded-2xl bg-white px-4 py-3 shadow-sm">Organizer verification</div>
                    <div className="rounded-2xl bg-white px-4 py-3 shadow-sm">Digital ticket delivery</div>
                    <div className="rounded-2xl bg-white px-4 py-3 shadow-sm">Real venue and timing data</div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#fbf8f3] py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="text-sm uppercase tracking-[0.26em] text-slate-500">Trending now</div>
              <h2 className="mt-3 text-4xl font-semibold tracking-[-0.04em] text-slate-950">
                High-signal events with momentum.
              </h2>
              <p className="mt-3 max-w-2xl text-slate-600">
                A tighter front page selection focused on events already drawing real attention.
              </p>
            </div>
            <Link to="/events">
              <Button variant="outline" className="border-slate-300 bg-transparent">
                Browse all events
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {trendingEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
            <div className="text-sm uppercase tracking-[0.26em] text-slate-500">Coming up next</div>
            <h2 className="mt-3 text-4xl font-semibold tracking-[-0.04em] text-slate-950">
              Upcoming plans with range.
            </h2>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            {latestEvents.map((event) => (
              <Link
                key={event.id}
                to={`/events/${event.id}`}
                className="group rounded-[1.75rem] border border-black/5 bg-white/75 p-5 shadow-sm transition-transform duration-300 hover:-translate-y-1"
              >
                <div className="grid gap-5 sm:grid-cols-[180px_1fr]">
                  <div className="overflow-hidden rounded-[1.25rem]">
                    <img
                      src={event.imageUrl}
                      alt={event.title}
                      className="h-44 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="flex flex-col justify-between">
                    <div>
                      <div className="text-sm uppercase tracking-[0.2em] text-slate-500">
                        {event.category}
                      </div>
                      <h3 className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-slate-950">
                        {event.title}
                      </h3>
                      <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-600">
                        {event.description}
                      </p>
                    </div>
                    <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-slate-600">
                      <span>{event.date}</span>
                      <span className="h-1 w-1 rounded-full bg-slate-400" />
                      <span>{event.location}</span>
                      <span className="h-1 w-1 rounded-full bg-slate-400" />
                      <span>${event.price}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="overflow-hidden border-0 bg-[linear-gradient(135deg,_#0f172a_0%,_#172554_45%,_#7c2d12_100%)] p-8 text-white shadow-2xl sm:p-12">
            <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <div className="inline-flex rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs uppercase tracking-[0.22em] text-slate-200">
                  Start here
                </div>
                <h2 className="mt-5 max-w-2xl text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">
                  Make your next ticket feel intentional, not accidental.
                </h2>
                <p className="mt-4 max-w-2xl text-slate-200">
                  Browse what’s trending, check the signals that matter, and book in minutes. Or
                  publish your own event and reach a better-qualified audience.
                </p>
              </div>
              <div className="flex flex-col gap-4 sm:flex-row lg:flex-col">
                <Link to="/signup">
                  <Button size="lg" className="w-full bg-[#f4b860] text-slate-950 hover:bg-[#f7c87f]">
                    Create account
                  </Button>
                </Link>
                <Link to="/events">
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full border-white/20 bg-white/5 text-white hover:bg-white/10"
                  >
                    View events
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
}
