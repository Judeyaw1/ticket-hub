import { useEffect, useRef, useState } from 'react';
import { BrowserQRCodeReader, type IScannerControls } from '@zxing/browser';
import { motion, AnimatePresence } from 'motion/react';
import { Camera, CheckCircle, QrCode, Search, XCircle } from 'lucide-react';
import { Link } from 'react-router';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Badge } from '../components/ui/badge';
import { apiGet, apiPost } from '../lib/api';
import { getCurrentUserId } from '../lib/auth';
import { toast } from 'sonner';
import type { Event } from '../types';

type CheckInStatus = 'idle' | 'valid' | 'invalid' | 'already-used';

export function CheckInPage() {
  const [myEvents, setMyEvents] = useState<Event[]>([]);
  const [recentCheckins, setRecentCheckins] = useState<{ name: string; time: string }[]>([]);
  const [selectedEvent, setSelectedEvent] = useState('');
  const [ticketCode, setTicketCode] = useState('');
  const [checkInStatus, setCheckInStatus] = useState<CheckInStatus>('idle');
  const [scannerActive, setScannerActive] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [doorStats, setDoorStats] = useState({ checkedIn: 0, totalTickets: 0 });
  const [scannerError, setScannerError] = useState('');
  const [isScannerSupported, setIsScannerSupported] = useState(false);
  const organizerId = getCurrentUserId();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const scannerControlsRef = useRef<IScannerControls | null>(null);
  const scannerReaderRef = useRef<BrowserQRCodeReader | null>(null);

  useEffect(() => {
    apiGet<{ events: Event[]; recentCheckins: { name: string; time: string }[] }>(
      `/api/organizer/dashboard?organizerId=${organizerId}`
    ).then((data) => {
      setMyEvents(data.events);
      setRecentCheckins(data.recentCheckins);
      if (data.events.length > 0) {
        setSelectedEvent((current) => current || data.events[0].id);
      }
      setDoorStats({
        checkedIn: data.recentCheckins.length,
        totalTickets: data.events.reduce((sum, event) => sum + event.ticketsSold, 0),
      });
    });
  }, [organizerId]);

  const currentEvent = myEvents.find((event) => event.id === selectedEvent);

  useEffect(() => {
    setIsScannerSupported(Boolean(navigator.mediaDevices?.getUserMedia && window.isSecureContext));
  }, []);

  useEffect(() => {
    return () => {
      stopScanner();
    };
  }, []);

  const stopScanner = () => {
    scannerControlsRef.current?.stop();
    scannerControlsRef.current = null;
    scannerReaderRef.current = null;
    BrowserQRCodeReader.releaseAllStreams();

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  const handleManualCheckIn = async (codeOverride?: string) => {
    const code = codeOverride || ticketCode;
    if (!code || !selectedEvent) return;

    setIsSubmitting(true);

    try {
      const result = await apiPost<{
        status: CheckInStatus;
        message: string;
        stats?: { checkedIn: number; totalTickets: number };
        recentCheckins?: { name: string; time: string }[];
      }>('/api/organizer/check-in', {
        organizerId,
        eventId: selectedEvent,
        qrCode: code,
      });

      setCheckInStatus(result.status);
      setStatusMessage(result.message);
      if (result.stats) {
        setDoorStats(result.stats);
      }
      if (result.recentCheckins) {
        setRecentCheckins(result.recentCheckins);
      }

      if (result.status === 'valid') {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to verify ticket.';
      setCheckInStatus('invalid');
      setStatusMessage(message);
      toast.error(message);
    } finally {
      setIsSubmitting(false);
      setTimeout(() => {
        setCheckInStatus('idle');
        setStatusMessage('');
        setTicketCode('');
      }, 3000);
    }
  };

  const startScanner = async () => {
    if (!selectedEvent) {
      toast.error('Select an event before starting the scanner.');
      return;
    }

    if (!navigator.mediaDevices?.getUserMedia || !window.isSecureContext) {
      setScannerError('Live QR scanning needs camera access in a secure browser context. Use HTTPS or localhost, or verify the ticket manually.');
      setScannerActive(false);
      return;
    }

    try {
      setScannerError('');
      stopScanner();

      const reader = new BrowserQRCodeReader(undefined, {
        delayBetweenScanAttempts: 250,
        delayBetweenScanSuccess: 1500,
        tryPlayVideoTimeout: 5000,
      });

      scannerReaderRef.current = reader;
      scannerControlsRef.current = await reader.decodeFromConstraints(
        {
          audio: false,
          video: {
            facingMode: { ideal: 'environment' },
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
        },
        videoRef.current,
        async (result, error, controls) => {
          scannerControlsRef.current = controls;

          const scannedValue = result?.getText().trim();
          if (scannedValue && !isSubmitting) {
            setTicketCode(scannedValue);
            stopScanner();
            setScannerActive(false);
            await handleManualCheckIn(scannedValue);
            return;
          }

          if (error && !scannerError) {
            setScannerError('');
          }
        }
      );
    } catch (error) {
      const message =
        error instanceof Error && error.message
          ? error.message
          : 'Camera access was denied or is unavailable on this device.';
      setScannerError(message);
      stopScanner();
      setScannerActive(false);
    }
  };

  const toggleScanner = async () => {
    if (scannerActive) {
      stopScanner();
      setScannerActive(false);
      return;
    }

    setScannerActive(true);
    await startScanner();
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
                <SelectTrigger id="event" className="mt-2 h-12 rounded-xl border-black/10 bg-[#fbf8f3]" disabled={myEvents.length === 0}>
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
              {myEvents.length === 0 && (
                <div className="mt-4 rounded-2xl bg-[#fbf8f3] p-4 text-sm text-slate-600">
                  You do not have any organizer events yet. Create one first, then return here to check in attendees.
                  <div className="mt-3">
                    <Link to="/organizer/create-event">
                      <Button className="bg-[#172033] hover:bg-[#22304d]">Create event</Button>
                    </Link>
                  </div>
                </div>
              )}
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
                      onClick={toggleScanner}
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
                        <video ref={videoRef} playsInline muted className="absolute inset-0 h-full w-full object-cover opacity-80" />
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
                        <div className="mt-2 text-sm text-white/70">
                          {isScannerSupported
                            ? 'Turn on the scanner to start live check-in on desktop or mobile.'
                            : 'Enable camera access in a secure browser context, or use manual verification.'}
                        </div>
                      </div>
                    )}
                  </div>
                  {scannerError && (
                    <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                      {scannerError}
                    </div>
                  )}
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
                    <Button onClick={handleManualCheckIn} className="h-12 bg-[#172033] hover:bg-[#22304d]" disabled={isSubmitting}>
                      <Search className="mr-2 h-4 w-4" />
                      {isSubmitting ? 'Verifying...' : 'Verify'}
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
                        <StatusCard status={checkInStatus} message={statusMessage} />
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
                    <ProgressRow
                      label="Checked in"
                      value={String(doorStats.checkedIn)}
                      width={
                        doorStats.totalTickets > 0
                          ? `${Math.min(100, (doorStats.checkedIn / doorStats.totalTickets) * 100)}%`
                          : '0%'
                      }
                    />
                    <ProgressRow label="Total tickets" value={String(doorStats.totalTickets)} width="100%" />
                    <div className="flex items-center justify-between rounded-2xl bg-[#fbf8f3] px-4 py-4">
                      <span className="text-sm text-slate-600">Check-in rate</span>
                      <Badge className="border-0 bg-emerald-100 text-emerald-700">
                        {doorStats.totalTickets > 0
                          ? `${Math.round((doorStats.checkedIn / doorStats.totalTickets) * 100)}%`
                          : '0%'}
                      </Badge>
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

function StatusCard({ status, message }: { status: CheckInStatus; message: string }) {
  const statusMap = {
    valid: {
      title: 'Valid ticket',
      description: message || 'Attendee checked in successfully.',
      tone: 'border-emerald-500 bg-emerald-50 text-emerald-900',
      icon: CheckCircle,
    },
    invalid: {
      title: 'Invalid ticket',
      description: message || 'This code does not match a valid ticket.',
      tone: 'border-red-500 bg-red-50 text-red-900',
      icon: XCircle,
    },
    'already-used': {
      title: 'Already used',
      description: message || 'This ticket has already been scanned.',
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
