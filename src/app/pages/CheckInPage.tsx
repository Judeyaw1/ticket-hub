import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Camera, CheckCircle, QrCode, Search, XCircle } from 'lucide-react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Badge } from '../components/ui/badge';
import { apiGet } from '../lib/api';
import type { Event } from '../types';

type CheckInStatus = 'idle' | 'valid' | 'invalid' | 'already-used';

export function CheckInPage() {
  const [myEvents, setMyEvents] = useState<Event[]>([]);
  const [recentCheckins, setRecentCheckins] = useState<{ name: string; time: string }[]>([]);
  const [selectedEvent, setSelectedEvent] = useState('');
  const [ticketCode, setTicketCode] = useState('');
  const [checkInStatus, setCheckInStatus] = useState<CheckInStatus>('idle');
  const [scannerActive, setScannerActive] = useState(false);

  useEffect(() => {
    apiGet<{ events: Event[]; recentCheckins: { name: string; time: string }[] }>(
      '/api/organizer/dashboard?organizerId=org-1'
    ).then((data) => {
      setMyEvents(data.events);
      setRecentCheckins(data.recentCheckins);
    });
  }, []);

  const currentEvent = myEvents.find((event) => event.id === selectedEvent);

  const handleManualCheckIn = () => {
    if (!ticketCode) return;

    const isValid = ticketCode.startsWith('QR');
    const isAlreadyUsed = ticketCode === 'QR000000000';

    if (isAlreadyUsed) {
      setCheckInStatus('already-used');
    } else if (isValid) {
      setCheckInStatus('valid');
    } else {
      setCheckInStatus('invalid');
    }

    setTimeout(() => {
      setCheckInStatus('idle');
      setTicketCode('');
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-[#f6f1e8] text-slate-950">
      <div className="container mx-auto px-4 py-10 sm:px-6 lg:px-8">
        <section className="rounded-[2rem] bg-[radial-gradient(circle_at_top_left,_rgba(244,184,96,0.18),_transparent_24%),linear-gradient(135deg,_#172033_0%,_#22304d_42%,_#0f172a_100%)] p-8 text-white shadow-2xl sm:p-10">
          <div className="grid gap-8 lg:grid-cols-[1fr_320px] lg:items-end">
            <div>
              <div className="inline-flex rounded-full border border-white/15 bg-white/8 px-4 py-2 text-sm text-slate-200 backdrop-blur">
                Entry control
              </div>
              <h1 className="mt-6 text-5xl font-semibold tracking-[-0.05em]">Fast check-in for a real door line.</h1>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-200">
                Scan or verify manually, track event progress, and keep staff focused on flow instead of guesswork.
              </p>
            </div>
            <Card className="border-white/10 bg-white/8 p-6 text-white backdrop-blur-xl">
              <div className="text-sm uppercase tracking-[0.22em] text-slate-300">Session</div>
              <div className="mt-4 text-3xl font-semibold tracking-[-0.04em]">
                {currentEvent ? currentEvent.title : 'No event selected'}
              </div>
              <div className="mt-3 text-sm text-slate-300">
                {currentEvent ? `${currentEvent.date} • ${currentEvent.location}` : 'Choose an event to begin.'}
              </div>
            </Card>
          </div>
        </section>

        <div className="mt-8 grid gap-8 xl:grid-cols-[1.15fr_0.85fr]">
          <div className="space-y-6">
            <Card className="border-black/5 bg-white/85 p-6 shadow-sm">
              <Label htmlFor="event">Select event</Label>
              <Select value={selectedEvent} onValueChange={setSelectedEvent}>
                <SelectTrigger id="event" className="mt-2 h-12 rounded-xl border-black/10 bg-[#fbf8f3]">
                  <SelectValue placeholder="Choose an event to check in attendees" />
                </SelectTrigger>
                <SelectContent>
                  {myEvents.map((event) => (
                    <SelectItem key={event.id} value={event.id}>
                      {event.title} - {event.date}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Card>

            {selectedEvent ? (
              <>
                <Card className="border-black/5 bg-white/85 p-6 shadow-sm">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <div className="text-sm uppercase tracking-[0.22em] text-slate-500">Scanner</div>
                      <h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em]">QR capture</h2>
                    </div>
                    <Button
                      onClick={() => setScannerActive((value) => !value)}
                      variant={scannerActive ? 'destructive' : 'default'}
                      className={scannerActive ? '' : 'bg-[#172033] hover:bg-[#22304d]'}
                    >
                      <Camera className="mr-2 h-4 w-4" />
                      {scannerActive ? 'Stop scanner' : 'Start scanner'}
                    </Button>
                  </div>

                  <div className="mt-6 relative overflow-hidden rounded-[1.75rem] bg-slate-950" style={{ aspectRatio: '16/10' }}>
                    {scannerActive ? (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="relative h-64 w-64 rounded-2xl border-4 border-[#f4b860]">
                          <div className="absolute left-0 top-0 h-8 w-8 rounded-tl-lg border-l-4 border-t-4 border-white" />
                          <div className="absolute right-0 top-0 h-8 w-8 rounded-tr-lg border-r-4 border-t-4 border-white" />
                          <div className="absolute bottom-0 left-0 h-8 w-8 rounded-bl-lg border-b-4 border-l-4 border-white" />
                          <div className="absolute bottom-0 right-0 h-8 w-8 rounded-br-lg border-b-4 border-r-4 border-white" />
                          <motion.div
                            className="absolute left-0 h-1 w-full bg-[#f4b860]/70"
                            animate={{ y: [0, 252, 0] }}
                            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                          />
                        </div>
                        <div className="absolute bottom-5 text-sm text-white/80">Position the QR code inside the frame</div>
                      </div>
                    ) : (
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                        <Camera className="h-16 w-16 opacity-50" />
                        <div className="mt-4 text-lg">Camera inactive</div>
                        <div className="mt-2 text-sm text-white/70">Turn on the scanner to start live check-in.</div>
                      </div>
                    )}
                  </div>
                </Card>

                <Card className="border-black/5 bg-white/85 p-6 shadow-sm">
                  <div className="text-sm uppercase tracking-[0.22em] text-slate-500">Manual verification</div>
                  <h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em]">Enter a ticket code</h2>
                  <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                    <Input
                      value={ticketCode}
                      onChange={(event) => setTicketCode(event.target.value)}
                      onKeyDown={(event) => {
                        if (event.key === 'Enter') {
                          event.preventDefault();
                          handleManualCheckIn();
                        }
                      }}
                      placeholder="QR123456789"
                      className="h-12 rounded-xl border-black/10 bg-[#fbf8f3]"
                    />
                    <Button onClick={handleManualCheckIn} className="h-12 bg-[#172033] hover:bg-[#22304d]">
                      <Search className="mr-2 h-4 w-4" />
                      Verify
                    </Button>
                  </div>

                  <AnimatePresence mode="wait">
                    {checkInStatus !== 'idle' && (
                      <motion.div
                        key={checkInStatus}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -12 }}
                        className="mt-5"
                      >
                        <StatusCard status={checkInStatus} />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Card>
              </>
            ) : (
              <Card className="border-black/5 bg-white/85 p-12 text-center shadow-sm">
                <div className="mx-auto mb-4 flex h-18 w-18 items-center justify-center rounded-full bg-[#efe4d3]">
                  <QrCode className="h-8 w-8 text-slate-500" />
                </div>
                <h3 className="text-2xl font-semibold tracking-[-0.03em]">Select an event to begin</h3>
                <p className="mt-3 text-slate-600">Choose a listing above to unlock scanner and manual check-in tools.</p>
              </Card>
            )}
          </div>

          <div className="space-y-6">
            {selectedEvent && (
              <>
                <Card className="border-black/5 bg-white/85 p-6 shadow-sm">
                  <div className="text-sm uppercase tracking-[0.22em] text-slate-500">Live stats</div>
                  <h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em]">Door progress</h2>
                  <div className="mt-6 space-y-5">
                    <ProgressRow label="Checked in" value="245" width="65%" />
                    <ProgressRow label="Total tickets" value="378" width="100%" />
                    <div className="flex items-center justify-between rounded-2xl bg-[#fbf8f3] px-4 py-4">
                      <span className="text-sm text-slate-600">Check-in rate</span>
                      <Badge className="border-0 bg-emerald-100 text-emerald-700">65%</Badge>
                    </div>
                  </div>
                </Card>

                <Card className="border-black/5 bg-white/85 p-6 shadow-sm">
                  <div className="text-sm uppercase tracking-[0.22em] text-slate-500">Recent entries</div>
                  <h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em]">Latest check-ins</h2>
                  <div className="mt-6 space-y-3">
                    {recentCheckins.map((entry) => (
                      <div key={entry.name} className="flex items-center justify-between rounded-2xl bg-[#fbf8f3] px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#efe4d3] font-semibold text-[#9a442e]">
                            {entry.name.charAt(0)}
                          </div>
                          <div>
                            <div className="font-medium">{entry.name}</div>
                            <div className="text-sm text-slate-500">{entry.time}</div>
                          </div>
                        </div>
                        <CheckCircle className="h-5 w-5 text-emerald-600" />
                      </div>
                    ))}
                  </div>
                </Card>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function ProgressRow({ label, value, width }: { label: string; value: string; width: string }) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-sm">
        <span className="text-slate-600">{label}</span>
        <span className="font-medium text-slate-900">{value}</span>
      </div>
      <div className="h-3 rounded-full bg-[#efe4d3]">
        <div className="h-3 rounded-full bg-[#172033]" style={{ width }} />
      </div>
    </div>
  );
}

function StatusCard({ status }: { status: CheckInStatus }) {
  const statusMap = {
    valid: {
      title: 'Valid ticket',
      description: 'Attendee checked in successfully.',
      tone: 'border-emerald-500 bg-emerald-50 text-emerald-900',
      icon: CheckCircle,
    },
    invalid: {
      title: 'Invalid ticket',
      description: 'This code does not match a valid ticket.',
      tone: 'border-red-500 bg-red-50 text-red-900',
      icon: XCircle,
    },
    'already-used': {
      title: 'Already used',
      description: 'This ticket has already been scanned.',
      tone: 'border-orange-500 bg-orange-50 text-orange-900',
      icon: XCircle,
    },
    idle: {
      title: '',
      description: '',
      tone: '',
      icon: CheckCircle,
    },
  } as const;

  const config = statusMap[status];
  const Icon = config.icon;

  return (
    <div className={`rounded-[1.5rem] border-2 p-6 text-center ${config.tone}`}>
      <Icon className="mx-auto h-14 w-14" />
      <h3 className="mt-4 text-2xl font-semibold tracking-[-0.03em]">{config.title}</h3>
      <p className="mt-2">{config.description}</p>
    </div>
  );
}
