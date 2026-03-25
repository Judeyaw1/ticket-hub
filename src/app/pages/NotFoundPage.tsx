import { Link } from 'react-router';
import { Button } from '../components/ui/button';
import { Home, Search, Compass } from 'lucide-react';

export function NotFoundPage() {
  return (
    <div className="min-h-screen bg-[#f6f1e8] px-4 py-16 text-slate-950">
      <div className="mx-auto flex min-h-[70vh] max-w-5xl items-center">
        <div className="grid w-full gap-8 overflow-hidden rounded-[2rem] bg-[radial-gradient(circle_at_top_left,_rgba(244,184,96,0.18),_transparent_24%),linear-gradient(135deg,_#172033_0%,_#22304d_45%,_#0f172a_100%)] p-8 text-white shadow-2xl sm:p-12 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="flex flex-col justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/8 px-4 py-2 text-sm text-slate-200 backdrop-blur">
                <Compass className="h-4 w-4 text-[#f4b860]" />
                Route missing
              </div>
              <div className="mt-8 text-7xl font-semibold tracking-[-0.08em] sm:text-8xl">404</div>
            </div>
            <div className="mt-8 grid grid-cols-2 gap-4">
              <div className="rounded-3xl border border-white/10 bg-white/8 p-4 backdrop-blur">
                <div className="text-2xl font-semibold tracking-[-0.04em]">Home</div>
                <div className="mt-1 text-sm text-slate-300">Back to the main feed</div>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/8 p-4 backdrop-blur">
                <div className="text-2xl font-semibold tracking-[-0.04em]">Events</div>
                <div className="mt-1 text-sm text-slate-300">Browse active listings</div>
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-center">
            <h1 className="text-4xl font-semibold tracking-[-0.05em] sm:text-5xl">
              That page isn’t on tonight’s lineup.
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-8 text-slate-200">
              The link may be out of date, or the page may have moved. Head back to the landing page
              or jump straight into the event feed.
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link to="/">
                <Button size="lg" className="w-full bg-[#f4b860] text-slate-950 hover:bg-[#f7c87f] sm:w-auto">
                  <Home className="mr-2 h-5 w-5" />
                  Back to home
                </Button>
              </Link>
              <Link to="/events">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full border-white/20 bg-white/5 text-white hover:bg-white/10 sm:w-auto"
                >
                  <Search className="mr-2 h-5 w-5" />
                  Browse events
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
