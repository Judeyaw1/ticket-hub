import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router';
import { format } from 'date-fns';
import {
  Calendar,
  CheckCircle,
  CreditCard,
  Clock,
  MapPin,
  Share2,
  Shield,
  Sparkles,
  TrendingUp,
  Users,
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { apiGet, apiPost } from '../lib/api';
import { getCurrentUserId, isUserAuthenticated } from '../lib/auth';
import { toast } from 'sonner';
import type { Event } from '../types';

export function EventDetailsPage() {
  const { id } = useParams();
  const [event, setEvent] = useState<Event | null>(null);
  const [ticketQuantity, setTicketQuantity] = useState(1);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentError, setPaymentError] = useState('');
  const [paymentData, setPaymentData] = useState({
    cardholderName: '',
    cardNumber: '',
    expiry: '',
    cvc: '',
    email: '',
  });

  useEffect(() => {
    if (!id) {
      return;
    }

    apiGet<Event>(`/api/events/${id}`).then(setEvent).catch(() => setEvent(null));
  }, [id]);

  if (!event) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f6f1e8] px-4">
        <Card className="border-black/5 bg-white/80 p-8 text-center shadow-xl">
          <h1 className="text-3xl font-semibold tracking-[-0.04em]">Event not found</h1>
          <p className="mt-3 text-slate-600">This listing may have been moved or removed.</p>
          <Link to="/events">
            <Button className="mt-6 bg-[#172033] hover:bg-[#22304d]">Back to events</Button>
          </Link>
        </Card>
      </div>
    );
  }

  const availableTickets = event.capacity - event.ticketsSold;
  const subtotal = event.price * ticketQuantity;
  const total = subtotal * 1.05;

  const handlePaymentChange = (field: keyof typeof paymentData, value: string) => {
    setPaymentData((previous) => ({ ...previous, [field]: value }));
  };

  const validatePayment = () => {
    if (!paymentData.cardholderName.trim()) return 'Enter the cardholder name.';
    if (paymentData.cardNumber.replace(/\s/g, '').length < 12) return 'Enter a valid card number.';
    if (!/^\d{2}\/\d{2}$/.test(paymentData.expiry.trim())) return 'Use card expiry in MM/YY format.';
    if (!/^\d{3,4}$/.test(paymentData.cvc.trim())) return 'Enter a valid security code.';
    if (!paymentData.email.trim()) return 'Enter an email for the receipt.';
    return '';
  };

  const handlePurchase = async () => {
    if (!isUserAuthenticated()) {
      window.location.href = '/login';
      return;
    }

    const validationError = validatePayment();
    if (validationError) {
      setPaymentError(validationError);
      toast.error(validationError);
      return;
    }

    setPaymentError('');
    setIsProcessingPayment(true);

    try {
      await apiPost('/api/purchase-ticket', {
        eventId: event.id,
        userId: getCurrentUserId(),
        quantity: ticketQuantity,
      });

      toast.success('Payment successful. Your ticket is ready.');
      setShowPurchaseModal(false);
      window.location.href = '/tickets';
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Payment failed.';
      setPaymentError(message);
      toast.error(message);
    } finally {
      setIsProcessingPayment(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f6f1e8] text-slate-950">
      <section className="relative overflow-hidden bg-slate-950 text-white">
        <div className="absolute inset-0">
          <img src={event.imageUrl} alt={event.title} className="h-full w-full object-cover opacity-55" />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,_rgba(15,23,42,0.25)_0%,_rgba(15,23,42,0.82)_55%,_#0f172a_100%)]" />
        </div>

        <div className="container relative mx-auto px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <Link to="/events" className="inline-flex text-sm text-slate-200 hover:text-white">
            Back to events
          </Link>

          <div className="mt-6 grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
            <div>
              <div className="flex flex-wrap gap-2">
                <Badge className="border-0 bg-white/12 text-white">{event.category}</Badge>
                {event.isTrending && (
                  <Badge className="border-0 bg-gradient-to-r from-orange-500 to-pink-500 text-white">
                    <TrendingUp className="mr-1 h-3 w-3" />
                    Trending
                  </Badge>
                )}
                {event.isVerified && (
                  <Badge className="border-0 bg-emerald-500/20 text-emerald-100">
                    <Shield className="mr-1 h-3 w-3" />
                    Verified
                  </Badge>
                )}
              </div>

              <h1 className="mt-6 max-w-4xl text-5xl font-semibold tracking-[-0.05em] sm:text-6xl">
                {event.title}
              </h1>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-200">{event.description}</p>

              <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <InfoChip label="Date" value={format(new Date(event.date), 'EEEE, MMM d')} icon={Calendar} />
                <InfoChip label="Time" value={event.time} icon={Clock} />
                <InfoChip label="Venue" value={event.location} icon={MapPin} />
                <InfoChip label="Attendance" value={`${event.ticketsSold}/${event.capacity}`} icon={Users} />
              </div>
            </div>

            <Card className="border-white/10 bg-white/8 p-6 text-white backdrop-blur-xl">
              <div className="text-sm uppercase tracking-[0.24em] text-slate-300">Trust layer</div>
              <div className="mt-6 text-5xl font-semibold tracking-[-0.05em]">{event.trustScore}</div>
              <div className="mt-2 text-sm text-slate-300">Pulse trust score</div>
              <div className="mt-6 space-y-3 text-sm text-slate-100">
                <div className="rounded-2xl border border-white/10 bg-white/8 p-4">Organizer identity verified</div>
                <div className="rounded-2xl border border-white/10 bg-white/8 p-4">Secure payment flow</div>
                <div className="rounded-2xl border border-white/10 bg-white/8 p-4">Venue and schedule visible upfront</div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      <section className="-mt-8 pb-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="space-y-6">
              <Card className="border-black/5 bg-white/80 p-7 shadow-xl">
                <div className="flex items-center gap-2 text-sm uppercase tracking-[0.22em] text-slate-500">
                  <Sparkles className="h-4 w-4 text-[#9a442e]" />
                  Event overview
                </div>
                <h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em]">What to expect</h2>
                <p className="mt-4 leading-8 text-slate-600">{event.description}</p>
                <div className="mt-6 rounded-[1.5rem] bg-[#fbf8f3] p-5">
                  <div className="text-sm text-slate-500">Address</div>
                  <div className="mt-2 font-medium text-slate-900">{event.address}</div>
                  <Button variant="link" className="mt-3 h-auto p-0 text-[#9a442e]">
                    View on map
                  </Button>
                </div>
              </Card>

              <Card className="border-black/5 bg-white/80 p-7 shadow-sm">
                <h2 className="text-2xl font-semibold tracking-[-0.04em]">Hosted by {event.organizer.name}</h2>
                <div className="mt-5 flex flex-col gap-5 sm:flex-row sm:items-center">
                  <img src={event.organizer.avatar} alt={event.organizer.name} className="h-18 w-18 rounded-full bg-[#efe4d3]" />
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <div className="text-lg font-medium">{event.organizer.name}</div>
                      {event.organizer.isVerified && (
                        <Badge className="border-0 bg-emerald-100 text-emerald-700">
                          <CheckCircle className="mr-1 h-3 w-3" />
                          Verified
                        </Badge>
                      )}
                    </div>
                    <p className="mt-2 text-slate-600">{event.organizer.bio}</p>
                    <div className="mt-4 flex flex-wrap gap-6 text-sm text-slate-600">
                      <span>{event.organizer.eventsHosted} events hosted</span>
                      <span>{event.organizer.rating} rating</span>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            <div className="lg:pt-10">
              <div className="sticky top-20">
                <Card className="border-black/5 bg-[#172033] p-7 text-white shadow-xl">
                  <div className="flex items-end justify-between gap-4">
                    <div>
                      <div className="text-sm text-slate-300">Starting at</div>
                      <div className="mt-2 text-5xl font-semibold tracking-[-0.05em]">${event.price}</div>
                    </div>
                    {availableTickets < 50 && (
                      <Badge className="border-0 bg-[#9a442e] text-white">Only {availableTickets} left</Badge>
                    )}
                  </div>

                  <div className="mt-8 space-y-5">
                    <div>
                      <label className="text-sm text-slate-300">Number of tickets</label>
                      <div className="mt-3 flex items-center gap-3">
                        <Button
                          variant="outline"
                          size="icon"
                          className="border-white/15 bg-white/5 text-white hover:bg-white/10"
                          onClick={() => setTicketQuantity(Math.max(1, ticketQuantity - 1))}
                        >
                          -
                        </Button>
                        <div className="w-14 text-center text-2xl font-semibold">{ticketQuantity}</div>
                        <Button
                          variant="outline"
                          size="icon"
                          className="border-white/15 bg-white/5 text-white hover:bg-white/10"
                          onClick={() => setTicketQuantity(Math.min(10, ticketQuantity + 1))}
                        >
                          +
                        </Button>
                      </div>
                    </div>

                    <div className="rounded-[1.5rem] bg-white/8 p-5">
                      <div className="flex items-center justify-between text-sm text-slate-300">
                        <span>Subtotal</span>
                        <span className="text-white">${subtotal.toFixed(2)}</span>
                      </div>
                      <div className="mt-2 flex items-center justify-between text-sm text-slate-300">
                        <span>Service fee</span>
                        <span className="text-white">${(subtotal * 0.05).toFixed(2)}</span>
                      </div>
                      <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-4">
                        <span className="font-medium text-white">Total</span>
                        <span className="text-2xl font-semibold text-white">${total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  <Dialog open={showPurchaseModal} onOpenChange={setShowPurchaseModal}>
                    <DialogTrigger asChild>
                      <Button
                        size="lg"
                        className="mt-6 h-12 w-full bg-[#f4b860] text-slate-950 hover:bg-[#f7c87f]"
                        onClick={() => setShowPurchaseModal(true)}
                      >
                        Purchase tickets
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="border-black/5 bg-white">
                      <DialogHeader>
                        <DialogTitle>Payment</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-6 py-2">
                        <div className="rounded-[1.5rem] bg-[#f6f1e8] p-5">
                          <div className="text-sm uppercase tracking-[0.2em] text-slate-500">Order summary</div>
                          <div className="mt-3 text-xl font-semibold text-slate-900">{event.title}</div>
                          <div className="mt-2 flex items-center justify-between text-sm text-slate-600">
                            <span>{ticketQuantity} ticket{ticketQuantity > 1 ? 's' : ''}</span>
                            <span>${subtotal.toFixed(2)}</span>
                          </div>
                          <div className="mt-2 flex items-center justify-between text-sm text-slate-600">
                            <span>Service fee</span>
                            <span>${(subtotal * 0.05).toFixed(2)}</span>
                          </div>
                          <div className="mt-4 flex items-center justify-between border-t border-black/10 pt-4 text-base font-semibold text-slate-900">
                            <span>Total</span>
                            <span>${total.toFixed(2)}</span>
                          </div>
                        </div>

                        <div className="grid gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="cardholderName">Cardholder name</Label>
                            <Input
                              id="cardholderName"
                              value={paymentData.cardholderName}
                              onChange={(event) => handlePaymentChange('cardholderName', event.target.value)}
                              placeholder="Jane Doe"
                              className="h-12 rounded-xl border-black/10 bg-[#fbf8f3]"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="checkoutEmail">Receipt email</Label>
                            <Input
                              id="checkoutEmail"
                              type="email"
                              value={paymentData.email}
                              onChange={(event) => handlePaymentChange('email', event.target.value)}
                              placeholder="you@example.com"
                              className="h-12 rounded-xl border-black/10 bg-[#fbf8f3]"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="cardNumber">Card number</Label>
                            <div className="relative">
                              <CreditCard className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                              <Input
                                id="cardNumber"
                                value={paymentData.cardNumber}
                                onChange={(event) => handlePaymentChange('cardNumber', event.target.value)}
                                placeholder="4242 4242 4242 4242"
                                className="h-12 rounded-xl border-black/10 bg-[#fbf8f3] pl-10"
                              />
                            </div>
                          </div>
                          <div className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                              <Label htmlFor="cardExpiry">Expiry</Label>
                              <Input
                                id="cardExpiry"
                                value={paymentData.expiry}
                                onChange={(event) => handlePaymentChange('expiry', event.target.value)}
                                placeholder="MM/YY"
                                className="h-12 rounded-xl border-black/10 bg-[#fbf8f3]"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="cardCvc">CVC</Label>
                              <Input
                                id="cardCvc"
                                value={paymentData.cvc}
                                onChange={(event) => handlePaymentChange('cvc', event.target.value)}
                                placeholder="123"
                                className="h-12 rounded-xl border-black/10 bg-[#fbf8f3]"
                              />
                            </div>
                          </div>
                        </div>

                        {paymentError && (
                          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                            {paymentError}
                          </div>
                        )}

                        <Button
                          size="lg"
                          className="h-12 w-full bg-[#172033] hover:bg-[#22304d]"
                          onClick={handlePurchase}
                          disabled={isProcessingPayment}
                        >
                          {isProcessingPayment ? 'Processing payment...' : `Pay $${total.toFixed(2)} and get tickets`}
                        </Button>
                        <p className="text-center text-xs text-slate-500">
                          Demo payment flow. Successful payment will place the ticket in your ticket wallet.
                        </p>
                      </div>
                    </DialogContent>
                  </Dialog>

                  <Button
                    variant="outline"
                    className="mt-3 w-full border-white/15 bg-white/5 text-white hover:bg-white/10"
                  >
                    <Share2 className="mr-2 h-4 w-4" />
                    Share event
                  </Button>

                  <div className="mt-6 border-t border-white/10 pt-6 text-center text-sm text-slate-300">
                    <Shield className="mx-auto mb-2 h-5 w-5 text-emerald-300" />
                    Secure payment with buyer protection
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

interface InfoChipProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}

function InfoChip({ icon: Icon, label, value }: InfoChipProps) {
  return (
    <div className="rounded-[1.5rem] border border-white/10 bg-white/8 p-4 backdrop-blur">
      <div className="flex items-center gap-2 text-sm text-slate-300">
        <Icon className="h-4 w-4" />
        {label}
      </div>
      <div className="mt-2 font-medium text-white">{value}</div>
    </div>
  );
}
