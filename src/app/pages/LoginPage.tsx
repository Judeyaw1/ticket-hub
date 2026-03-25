import { useState } from 'react';
import { Link } from 'react-router';
import { ArrowRight, CheckCircle2, Compass, ShieldCheck } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card } from '../components/ui/card';
import { Separator } from '../components/ui/separator';
import { setCurrentUserId, setUserAuthenticated } from '../lib/auth';

const signals = [
  'Verified organizers and trust signals on every listing',
  'Digital ticket access the moment checkout is complete',
  'A cleaner event feed built around quality, not clutter',
];

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setUserAuthenticated(true);
    setCurrentUserId('user-1');
    window.location.href = '/dashboard';
  };

  return (
    <div className="min-h-screen bg-[#f6f1e8] text-slate-950 lg:grid lg:grid-cols-[1.05fr_0.95fr]">
      <div className="relative hidden overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(244,184,96,0.25),_transparent_25%),linear-gradient(145deg,_#101827_0%,_#1d2a41_45%,_#7d3226_100%)] p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:74px_74px] opacity-20" />
        <div className="relative">
          <Link to="/" className="inline-flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 text-lg font-semibold backdrop-blur">
              P
            </div>
            <span className="text-2xl font-semibold tracking-[-0.03em]">Pulse</span>
          </Link>
        </div>

        <div className="relative max-w-xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/8 px-4 py-2 text-sm text-slate-200 backdrop-blur">
            <Compass className="h-4 w-4 text-[#f4b860]" />
            Attendee access
          </div>
          <h1 className="mt-6 text-5xl font-semibold tracking-[-0.05em]">
            Step back into the city with your plans already lined up.
          </h1>
          <p className="mt-5 text-lg leading-8 text-slate-200">
            Sign in to manage tickets, keep track of upcoming nights, and pick up where your event
            browsing left off.
          </p>

          <div className="mt-10 grid gap-4">
            {signals.map((signal) => (
              <div key={signal} className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/6 p-4 backdrop-blur">
                <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#f4b860]" />
                <span className="text-sm text-slate-100">{signal}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative grid grid-cols-2 gap-4">
          <div className="rounded-3xl border border-white/10 bg-white/8 p-5 backdrop-blur">
            <div className="text-3xl font-semibold tracking-[-0.04em]">500K+</div>
            <div className="mt-2 text-sm text-slate-300">Tickets delivered</div>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/8 p-5 backdrop-blur">
            <div className="text-3xl font-semibold tracking-[-0.04em]">94/100</div>
            <div className="mt-2 text-sm text-slate-300">Average trust score</div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center p-6 sm:p-8 lg:p-12">
        <Card className="w-full max-w-lg border-black/5 bg-white/80 p-8 shadow-xl backdrop-blur sm:p-10">
          <div className="mb-8">
            <Link to="/" className="inline-flex items-center gap-3 lg:hidden">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#172033] text-lg font-semibold text-white">
                P
              </div>
              <span className="text-2xl font-semibold tracking-[-0.03em]">Pulse</span>
            </Link>
            <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#efe4d3] px-3 py-1 text-xs uppercase tracking-[0.22em] text-slate-600">
              <ShieldCheck className="h-3.5 w-3.5" />
              Secure sign in
            </div>
            <h2 className="mt-4 text-4xl font-semibold tracking-[-0.04em]">Welcome back</h2>
            <p className="mt-3 text-slate-600">Sign in to see your tickets, saved events, and upcoming plans.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="h-12 rounded-xl border-black/10 bg-[#fbf8f3]"
                required
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <a href="#" className="text-sm text-[#9a442e] hover:underline">
                  Forgot password?
                </a>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="h-12 rounded-xl border-black/10 bg-[#fbf8f3]"
                required
              />
            </div>

            <Button type="submit" size="lg" className="h-12 w-full bg-[#172033] hover:bg-[#22304d]">
              Sign in
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </form>

          <div className="my-7">
            <Separator className="relative">
              <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-3 text-sm text-slate-500">
                Or continue with
              </span>
            </Separator>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" className="h-12 rounded-xl border-black/10 bg-[#fbf8f3]">
              Google
            </Button>
            <Button variant="outline" className="h-12 rounded-xl border-black/10 bg-[#fbf8f3]">
              GitHub
            </Button>
          </div>

          <p className="mt-7 text-center text-sm text-slate-600">
            Don&apos;t have an account?{' '}
            <Link to="/signup" className="font-medium text-[#9a442e] hover:underline">
              Create one
            </Link>
          </p>
        </Card>
      </div>
    </div>
  );
}
