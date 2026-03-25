import { useState } from 'react';
import { Link } from 'react-router';
import { ArrowRight, CheckCircle2, Sparkles, Ticket, Users } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card } from '../components/ui/card';
import { Separator } from '../components/ui/separator';
import { Checkbox } from '../components/ui/checkbox';
import { setCurrentUserId, setUserAuthenticated } from '../lib/auth';

const joinReasons = [
  {
    icon: Sparkles,
    title: 'Discover better events',
    description: 'Browse curated listings with stronger trust and quality signals.',
  },
  {
    icon: Ticket,
    title: 'Keep every ticket in one place',
    description: 'Purchases, QR access, and upcoming plans stay attached to your account.',
  },
  {
    icon: Users,
    title: 'Move like a regular',
    description: 'Build a profile that makes future discovery faster and more relevant.',
  },
];

export function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setUserAuthenticated(true);
    setCurrentUserId('user-1');
    window.location.href = '/dashboard';
  };

  return (
    <div className="min-h-screen bg-[#f6f1e8] text-slate-950 lg:grid lg:grid-cols-[0.95fr_1.05fr]">
      <div className="flex items-center justify-center p-6 sm:p-8 lg:p-12">
        <Card className="w-full max-w-lg border-black/5 bg-white/80 p-8 shadow-xl backdrop-blur sm:p-10">
          <div className="mb-8">
            <Link to="/" className="inline-flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#172033] text-lg font-semibold text-white">
                P
              </div>
              <span className="text-2xl font-semibold tracking-[-0.03em]">Pulse</span>
            </Link>
            <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#efe4d3] px-3 py-1 text-xs uppercase tracking-[0.22em] text-slate-600">
              <Sparkles className="h-3.5 w-3.5" />
              New account
            </div>
            <h1 className="mt-4 text-4xl font-semibold tracking-[-0.04em]">Create your account</h1>
            <p className="mt-3 text-slate-600">
              Join Pulse to manage tickets, save favorites, and keep your next plans within reach.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="name">Full name</Label>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="h-12 rounded-xl border-black/10 bg-[#fbf8f3]"
                required
              />
            </div>

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
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="h-12 rounded-xl border-black/10 bg-[#fbf8f3]"
                required
              />
              <p className="text-xs text-slate-500">Use at least 8 characters for the mock flow.</p>
            </div>

            <div className="flex items-start gap-3 rounded-2xl bg-[#fbf8f3] p-4">
              <Checkbox
                id="terms"
                checked={agreedToTerms}
                onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
              />
              <label htmlFor="terms" className="text-sm leading-6 text-slate-600">
                I agree to the{' '}
                <a href="#" className="text-[#9a442e] hover:underline">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="#" className="text-[#9a442e] hover:underline">
                  Privacy Policy
                </a>
                .
              </label>
            </div>

            <Button
              type="submit"
              size="lg"
              disabled={!agreedToTerms}
              className="h-12 w-full bg-[#172033] hover:bg-[#22304d]"
            >
              Create account
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
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-[#9a442e] hover:underline">
              Sign in
            </Link>
          </p>
        </Card>
      </div>

      <div className="relative hidden overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(244,184,96,0.22),_transparent_26%),linear-gradient(145deg,_#101827_0%,_#1d2a41_42%,_#7d3226_100%)] p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:74px_74px] opacity-20" />
        <div className="relative">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/8 px-4 py-2 text-sm text-slate-200 backdrop-blur">
            <Users className="h-4 w-4 text-[#f4b860]" />
            Join the network
          </div>
          <h2 className="mt-6 max-w-xl text-5xl font-semibold tracking-[-0.05em]">
            Build a better event life from one account.
          </h2>
          <p className="mt-5 max-w-xl text-lg leading-8 text-slate-200">
            Save what stands out, book faster, and keep a cleaner record of where you’re going next.
          </p>
        </div>

        <div className="relative grid gap-4">
          {joinReasons.map((reason) => (
            <div key={reason.title} className="rounded-3xl border border-white/10 bg-white/8 p-5 backdrop-blur">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#f4b860] text-slate-950">
                <reason.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-2xl font-semibold tracking-[-0.03em]">{reason.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-200">{reason.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
