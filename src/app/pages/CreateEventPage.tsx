import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Calendar, DollarSign, Image, MapPin, Save, Users } from 'lucide-react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { apiPost } from '../lib/api';

const categories = [
  'Music',
  'Sports',
  'Arts',
  'Food & Drink',
  'Tech',
  'Business',
  'Wellness',
  'Community',
];

export function CreateEventPage() {
  const navigate = useNavigate();
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    address: '',
    category: '',
    price: '',
    capacity: '',
    imageUrl: '',
  });

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!formData.imageUrl) {
      return;
    }

    apiPost('/api/organizer/events', formData).then(() => {
      navigate('/organizer');
    });
  };

  const handleChange = (field: string, value: string) => {
    setFormData((previous) => ({ ...previous, [field]: value }));
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setIsUploadingImage(true);

    const reader = new FileReader();
    reader.onload = () => {
      handleChange('imageUrl', String(reader.result || ''));
      setIsUploadingImage(false);
    };
    reader.onerror = () => {
      setIsUploadingImage(false);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="min-h-screen bg-[#f6f1e8] text-slate-950">
      <div className="container mx-auto px-4 py-10 sm:px-6 lg:px-8">
        <section className="rounded-[2rem] bg-[radial-gradient(circle_at_top_left,_rgba(244,184,96,0.18),_transparent_24%),linear-gradient(135deg,_#172033_0%,_#22304d_42%,_#0f172a_100%)] p-8 text-white shadow-2xl sm:p-10">
          <div className="max-w-3xl">
            <div className="inline-flex rounded-full border border-white/15 bg-white/8 px-4 py-2 text-sm text-slate-200 backdrop-blur">
              New listing
            </div>
            <h1 className="mt-6 text-5xl font-semibold tracking-[-0.05em]">Shape the event before you publish it.</h1>
            <p className="mt-5 text-lg leading-8 text-slate-200">
              Good listings make the room feel real before anyone buys. Add enough detail to create confidence quickly.
            </p>
          </div>
        </section>

        <form onSubmit={handleSubmit} className="mt-8 grid gap-8 xl:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-6">
            <Card className="border-black/5 bg-white/85 p-6 shadow-sm">
              <h2 className="text-2xl font-semibold tracking-[-0.04em]">Basics</h2>
              <div className="mt-5 space-y-4">
                <div>
                  <Label htmlFor="title">Event title</Label>
                  <Input id="title" value={formData.title} onChange={(event) => handleChange('title', event.target.value)} placeholder="Enter event title" className="mt-2 h-12 rounded-xl border-black/10 bg-[#fbf8f3]" required />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" value={formData.description} onChange={(event) => handleChange('description', event.target.value)} placeholder="Describe what the experience feels like, who it is for, and what happens on arrival." rows={7} className="mt-2 rounded-xl border-black/10 bg-[#fbf8f3]" required />
                </div>
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select value={formData.category} onValueChange={(value) => handleChange('category', value)}>
                    <SelectTrigger id="category" className="mt-2 h-12 rounded-xl border-black/10 bg-[#fbf8f3]">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </Card>

            <Card className="border-black/5 bg-white/85 p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-[#efe4d3] p-3 text-[#9a442e]">
                  <Calendar className="h-5 w-5" />
                </div>
                <h2 className="text-2xl font-semibold tracking-[-0.04em]">Timing</h2>
              </div>
              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="date">Event date</Label>
                  <Input id="date" type="date" value={formData.date} onChange={(event) => handleChange('date', event.target.value)} className="mt-2 h-12 rounded-xl border-black/10 bg-[#fbf8f3]" required />
                </div>
                <div>
                  <Label htmlFor="time">Start time</Label>
                  <Input id="time" type="time" value={formData.time} onChange={(event) => handleChange('time', event.target.value)} className="mt-2 h-12 rounded-xl border-black/10 bg-[#fbf8f3]" required />
                </div>
              </div>
            </Card>

            <Card className="border-black/5 bg-white/85 p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-[#efe4d3] p-3 text-[#9a442e]">
                  <MapPin className="h-5 w-5" />
                </div>
                <h2 className="text-2xl font-semibold tracking-[-0.04em]">Venue</h2>
              </div>
              <div className="mt-5 space-y-4">
                <div>
                  <Label htmlFor="location">Venue name</Label>
                  <Input id="location" value={formData.location} onChange={(event) => handleChange('location', event.target.value)} placeholder="Central Park Amphitheater" className="mt-2 h-12 rounded-xl border-black/10 bg-[#fbf8f3]" required />
                </div>
                <div>
                  <Label htmlFor="address">Full address</Label>
                  <Input id="address" value={formData.address} onChange={(event) => handleChange('address', event.target.value)} placeholder="Street address, city, state, zip code" className="mt-2 h-12 rounded-xl border-black/10 bg-[#fbf8f3]" required />
                </div>
              </div>
            </Card>

            <Card className="border-black/5 bg-white/85 p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-[#efe4d3] p-3 text-[#9a442e]">
                  <DollarSign className="h-5 w-5" />
                </div>
                <h2 className="text-2xl font-semibold tracking-[-0.04em]">Pricing and capacity</h2>
              </div>
              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="price">Ticket price</Label>
                  <Input id="price" type="number" min="0" step="0.01" value={formData.price} onChange={(event) => handleChange('price', event.target.value)} placeholder="0.00" className="mt-2 h-12 rounded-xl border-black/10 bg-[#fbf8f3]" required />
                </div>
                <div>
                  <Label htmlFor="capacity">Capacity</Label>
                  <Input id="capacity" type="number" min="1" value={formData.capacity} onChange={(event) => handleChange('capacity', event.target.value)} placeholder="100" className="mt-2 h-12 rounded-xl border-black/10 bg-[#fbf8f3]" required />
                </div>
              </div>
            </Card>

            <Card className="border-black/5 bg-white/85 p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-[#efe4d3] p-3 text-[#9a442e]">
                  <Image className="h-5 w-5" />
                </div>
                <h2 className="text-2xl font-semibold tracking-[-0.04em]">Cover image</h2>
              </div>
              <div className="mt-5">
                <Label htmlFor="imageUrl">Image URL</Label>
                <Input
                  id="imageUrl"
                  type="url"
                  value={formData.imageUrl.startsWith('data:') ? '' : formData.imageUrl}
                  onChange={(event) => handleChange('imageUrl', event.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className="mt-2 h-12 rounded-xl border-black/10 bg-[#fbf8f3]"
                />
                <div className="my-4 flex items-center gap-3 text-xs uppercase tracking-[0.18em] text-slate-400">
                  <div className="h-px flex-1 bg-black/10" />
                  Or upload
                  <div className="h-px flex-1 bg-black/10" />
                </div>
                <Input
                  id="imageUpload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="h-12 rounded-xl border-black/10 bg-[#fbf8f3] file:mr-4 file:border-0 file:bg-[#efe4d3] file:px-4 file:py-2 file:text-sm file:font-medium file:text-[#9a442e]"
                />
                <p className="mt-2 text-sm text-slate-500">
                  Paste a public image URL or upload a JPG, PNG, or WebP file.
                </p>
                {isUploadingImage && (
                  <p className="mt-2 text-sm text-slate-500">Processing selected image...</p>
                )}
                {formData.imageUrl && (
                  <div className="mt-4 overflow-hidden rounded-[1.5rem]">
                    <img
                      src={formData.imageUrl}
                      alt="Preview"
                      className="h-56 w-full object-cover"
                      onError={(event) => {
                        event.currentTarget.src = 'https://via.placeholder.com/1200x675?text=Invalid+Image+URL';
                      }}
                    />
                  </div>
                )}
              </div>
            </Card>
          </div>

          <div className="space-y-6 xl:pt-2">
            <Card className="sticky top-20 border-black/5 bg-[#172033] p-6 text-white shadow-xl">
              <div className="text-sm uppercase tracking-[0.22em] text-slate-300">Preview snapshot</div>
              <div className="mt-6 space-y-5">
                <PreviewRow label="Title" value={formData.title || 'Not set'} />
                <PreviewRow label="Category" value={formData.category || 'Not set'} />
                <PreviewRow label="Date and time" value={formData.date && formData.time ? `${formData.date} at ${formData.time}` : 'Not set'} />
                <PreviewRow label="Venue" value={formData.location || 'Not set'} />
                <PreviewRow label="Price" value={formData.price ? `$${formData.price}` : 'Not set'} />
                <PreviewRow label="Capacity" value={formData.capacity || 'Not set'} />
              </div>

              <div className="mt-6 rounded-[1.5rem] bg-white/8 p-5 text-sm text-slate-200">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-[#f4b860]" />
                  Tips for stronger conversion
                </div>
                <ul className="mt-3 space-y-2 leading-6">
                  <li>Use a title that signals the format, not just the theme.</li>
                  <li>Describe what happens in the first 15 minutes after arrival.</li>
                  <li>Show a real venue and a real image to boost confidence.</li>
                </ul>
              </div>

              <div className="mt-6 space-y-3">
                <Button type="submit" size="lg" className="w-full bg-[#f4b860] text-slate-950 hover:bg-[#f7c87f]">
                  <Save className="mr-2 h-4 w-4" />
                  Create event
                </Button>
                <Button type="button" variant="outline" className="w-full border-white/15 bg-white/5 text-white hover:bg-white/10" onClick={() => navigate('/organizer')}>
                  Cancel
                </Button>
              </div>
            </Card>
          </div>
        </form>
      </div>
    </div>
  );
}

function PreviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-white/8 p-4">
      <div className="text-xs uppercase tracking-[0.18em] text-slate-300">{label}</div>
      <div className="mt-2 font-medium text-white">{value}</div>
    </div>
  );
}
