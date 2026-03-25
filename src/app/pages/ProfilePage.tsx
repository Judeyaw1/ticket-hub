import { useEffect, useState } from 'react';
import { Camera, Save, UserRound } from 'lucide-react';
import { Card } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Button } from '../components/ui/button';
import { apiGet, apiPatch } from '../lib/api';
import { getCurrentUserId } from '../lib/auth';
import { toast } from 'sonner';

type ProfileUser = {
  id: string;
  name: string;
  email: string;
  avatar: string;
};

export function ProfilePage() {
  const [user, setUser] = useState<ProfileUser | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [avatar, setAvatar] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    apiGet<{ user: ProfileUser }>(`/api/profile?userId=${getCurrentUserId()}`).then((data) => {
      setUser(data.user);
      setName(data.user.name);
      setEmail(data.user.email);
      setAvatar(data.user.avatar);
    });
  }, []);

  const handleSave = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSaving(true);

    try {
      const data = await apiPatch<{ user: ProfileUser }>('/api/profile', {
        userId: getCurrentUserId(),
        name,
        email,
        avatar,
      });

      setUser(data.user);
      setAvatar(data.user.avatar);
      toast.success('Profile updated.');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to update profile.');
    } finally {
      setIsSaving(false);
    }
  };

  if (!user) {
    return <div className="min-h-screen bg-[#f6f1e8]" />;
  }

  return (
    <div className="min-h-screen bg-[#f6f1e8] text-slate-950">
      <div className="container mx-auto px-4 py-10 sm:px-6 lg:px-8">
        <section className="rounded-[2rem] bg-[radial-gradient(circle_at_top_left,_rgba(244,184,96,0.18),_transparent_24%),linear-gradient(135deg,_#172033_0%,_#22304d_42%,_#0f172a_100%)] p-8 text-white shadow-2xl sm:p-10">
          <div className="max-w-3xl">
            <div className="inline-flex rounded-full border border-white/15 bg-white/8 px-4 py-2 text-sm text-slate-200 backdrop-blur">
              Account profile
            </div>
            <h1 className="mt-6 text-5xl font-semibold tracking-[-0.05em]">Your profile, cleaned up.</h1>
            <p className="mt-5 text-lg leading-8 text-slate-200">
              Manage the identity tied to your tickets, dashboard, and future event activity.
            </p>
          </div>
        </section>

        <form onSubmit={handleSave} className="mt-8 grid gap-8 xl:grid-cols-[0.8fr_1.2fr]">
          <Card className="border-black/5 bg-white/85 p-6 shadow-sm">
            <div className="flex flex-col items-center text-center">
              {avatar ? (
                <img src={avatar} alt={name} className="h-28 w-28 rounded-full object-cover" />
              ) : (
                <div className="flex h-28 w-28 items-center justify-center rounded-full bg-[#efe4d3] text-[#9a442e]">
                  <UserRound className="h-10 w-10" />
                </div>
              )}
              <h2 className="mt-4 text-2xl font-semibold tracking-[-0.03em]">{name || 'Your profile'}</h2>
              <p className="mt-2 text-sm text-slate-600">{email}</p>
            </div>
          </Card>

          <Card className="border-black/5 bg-white/85 p-6 shadow-sm">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold tracking-[-0.03em]">Edit details</h2>
              <p className="mt-2 text-sm text-slate-600">Update your name, email, and avatar image.</p>
            </div>

            <div className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="profileName">Full name</Label>
                <Input
                  id="profileName"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  className="h-12 rounded-xl border-black/10 bg-[#fbf8f3]"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="profileEmail">Email</Label>
                <Input
                  id="profileEmail"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="h-12 rounded-xl border-black/10 bg-[#fbf8f3]"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="profileAvatar">Avatar URL</Label>
                <div className="relative">
                  <Camera className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    id="profileAvatar"
                    value={avatar}
                    onChange={(event) => setAvatar(event.target.value)}
                    placeholder="https://example.com/avatar.jpg"
                    className="h-12 rounded-xl border-black/10 bg-[#fbf8f3] pl-10"
                  />
                </div>
              </div>

              <Button type="submit" size="lg" disabled={isSaving} className="w-full bg-[#172033] hover:bg-[#22304d]">
                <Save className="mr-2 h-4 w-4" />
                {isSaving ? 'Saving...' : 'Save profile'}
              </Button>
            </div>
          </Card>
        </form>
      </div>
    </div>
  );
}
