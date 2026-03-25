import { useEffect, useMemo, useState } from 'react';
import { EventCard } from '../components/EventCard';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Search, SlidersHorizontal, Sparkles, Flame, MapPinned } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '../components/ui/sheet';
import { Label } from '../components/ui/label';
import { Slider } from '../components/ui/slider';
import { Card } from '../components/ui/card';
import { apiGet } from '../lib/api';
import type { Event } from '../types';

export function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [priceRange, setPriceRange] = useState([0, 500]);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    apiGet<{ events: Event[]; categories: string[] }>('/api/events').then((data) => {
      setEvents(data.events);
      setCategories(data.categories);
    });
  }, []);

  const filteredEvents = useMemo(
    () =>
      events.filter((event) => {
        const matchesSearch =
          event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          event.location.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'all' || event.category === selectedCategory;
        const matchesPrice = event.price >= priceRange[0] && event.price <= priceRange[1];
        const matchesTab =
          activeTab === 'all' ||
          (activeTab === 'trending' && event.isTrending) ||
          (activeTab === 'recommended' && event.trustScore >= 94) ||
          activeTab === 'nearby';

        return matchesSearch && matchesCategory && matchesPrice && matchesTab;
      }),
    [activeTab, events, priceRange, searchQuery, selectedCategory]
  );

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setPriceRange([0, 500]);
    setActiveTab('all');
  };

  return (
    <div className="min-h-screen bg-[#f6f1e8] text-slate-950">
      <section className="bg-[radial-gradient(circle_at_top_left,_rgba(244,184,96,0.28),_transparent_26%),linear-gradient(135deg,_#172033_0%,_#23314d_45%,_#0f172a_100%)] text-white">
        <div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <div className="grid gap-10 lg:grid-cols-[1fr_340px] lg:items-end">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/8 px-4 py-2 text-sm text-slate-200 backdrop-blur">
                <Sparkles className="h-4 w-4 text-[#f4b860]" />
                Discovery feed
              </div>
              <h1 className="mt-5 max-w-3xl text-5xl font-semibold tracking-[-0.05em] sm:text-6xl">
                Browse by momentum, taste, and trust.
              </h1>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-200">
                Pulse surfaces the events already drawing attention and gives enough context to book
                without second-guessing the room, the organizer, or the ticket flow.
              </p>
            </div>

            <Card className="border-white/10 bg-white/8 p-6 text-white backdrop-blur-xl">
              <div className="text-sm uppercase tracking-[0.24em] text-slate-300">Right now</div>
              <div className="mt-6 grid gap-4">
                <div>
                  <div className="text-3xl font-semibold tracking-[-0.04em]">{events.length}</div>
                  <div className="text-sm text-slate-300">Active listings</div>
                </div>
                <div>
                  <div className="text-3xl font-semibold tracking-[-0.04em]">
                    {events.filter((event) => event.isTrending).length}
                  </div>
                  <div className="text-sm text-slate-300">Trending picks</div>
                </div>
                <div>
                  <div className="text-3xl font-semibold tracking-[-0.04em]">$0 - $500</div>
                  <div className="text-sm text-slate-300">Price window</div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      <section className="-mt-8 pb-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="border-black/5 bg-white/80 p-5 shadow-xl backdrop-blur sm:p-6">
            <div className="grid gap-4 lg:grid-cols-[1fr_220px_280px]">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <Input
                  placeholder="Search events, cities, venues..."
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  className="h-13 rounded-2xl border-black/10 bg-[#fbf8f3] pl-12"
                />
              </div>

              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="h-13 rounded-2xl border-black/10 bg-[#fbf8f3]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="hidden items-center gap-3 rounded-2xl border border-black/10 bg-[#fbf8f3] px-4 lg:flex">
                <Label className="whitespace-nowrap text-sm text-slate-600">
                  ${priceRange[0]} - ${priceRange[1]}
                </Label>
                <Slider value={priceRange} onValueChange={setPriceRange} max={500} step={10} />
              </div>

              <div className="lg:hidden">
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline" className="w-full rounded-2xl border-black/10 bg-[#fbf8f3]">
                      <SlidersHorizontal className="mr-2 h-4 w-4" />
                      Filters
                    </Button>
                  </SheetTrigger>
                  <SheetContent className="bg-[#fbf8f3]">
                    <SheetHeader>
                      <SheetTitle>Refine events</SheetTitle>
                    </SheetHeader>
                    <div className="mt-8 space-y-6">
                      <div className="space-y-3">
                        <Label>Price range</Label>
                        <div className="text-sm text-slate-600">
                          ${priceRange[0]} - ${priceRange[1]}
                        </div>
                        <Slider value={priceRange} onValueChange={setPriceRange} max={500} step={10} />
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </div>
          </Card>

          <div className="mt-8 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="h-auto flex-wrap gap-2 rounded-full bg-transparent p-0">
                <TabsTrigger value="all" className="rounded-full border border-black/10 bg-white/75 px-5 py-2.5">
                  All events
                </TabsTrigger>
                <TabsTrigger value="trending" className="rounded-full border border-black/10 bg-white/75 px-5 py-2.5">
                  <Flame className="mr-2 h-4 w-4" />
                  Trending
                </TabsTrigger>
                <TabsTrigger value="recommended" className="rounded-full border border-black/10 bg-white/75 px-5 py-2.5">
                  <Sparkles className="mr-2 h-4 w-4" />
                  Recommended
                </TabsTrigger>
                <TabsTrigger value="nearby" className="rounded-full border border-black/10 bg-white/75 px-5 py-2.5">
                  <MapPinned className="mr-2 h-4 w-4" />
                  Nearby
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="flex items-center gap-3">
              <div className="text-sm text-slate-600">
                {filteredEvents.length} {filteredEvents.length === 1 ? 'event' : 'events'} found
              </div>
              <Button variant="outline" className="rounded-full border-black/10 bg-white/75" onClick={clearFilters}>
                Reset
              </Button>
            </div>
          </div>

          {filteredEvents.length > 0 ? (
            <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
              {filteredEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          ) : (
            <Card className="mt-10 border-black/5 bg-white/80 p-12 text-center shadow-sm">
              <div className="mx-auto max-w-md">
                <div className="mx-auto mb-4 flex h-18 w-18 items-center justify-center rounded-full bg-[#efe4d3]">
                  <Search className="h-8 w-8 text-slate-500" />
                </div>
                <h3 className="text-2xl font-semibold tracking-[-0.03em]">No events match this mix.</h3>
                <p className="mt-3 text-slate-600">
                  Adjust the category, widen the price range, or clear the search to open the feed back up.
                </p>
                <Button onClick={clearFilters} className="mt-6 bg-[#172033] hover:bg-[#22304d]">
                  Clear filters
                </Button>
              </div>
            </Card>
          )}
        </div>
      </section>
    </div>
  );
}
