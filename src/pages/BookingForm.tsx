import React, { useState } from 'react';
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import Navbar from '@/components/Navbar';
import { events } from '@/data/events';
import { useAuth } from '@/contexts/AuthContext';
import { ArrowLeft, Ticket, CreditCard, Calendar, MapPin, QrCode } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { UserBooking } from '@/types/event';
import { initializeUserStorage } from '@/utils/localStorageCleanup';
import EnhancedFooter from '@/components/EnhancedFooter';

const BookingForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const tickets = location.state?.tickets || 1;
  const event = events.find(e => e.id === id);
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    // Card payment fields
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    nameOnCard: '',
    // UPI fields
    upiId: ''
  });
  
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('card');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Payment methods configuration
  const paymentMethods = [
    {
      id: 'card',
      name: 'Credit/Debit Card',
      icon: <CreditCard className="h-5 w-5" />,
      description: 'Pay securely with your card'
    },
    {
      id: 'upi',
      name: 'UPI ID',
      icon: <QrCode className="h-5 w-5 text-orange-600" />,
      description: 'Pay using any UPI app'
    }
  ];

  if (!event) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Event Not Found</h1>
            <Button asChild>
              <Link to="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Events
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const eventDate = new Date(event.date);
  const formattedDate = eventDate.toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
  const totalAmount = event.price * tickets;
  const serviceFee = 5;
  const convenienceFee = selectedPaymentMethod === 'card' ? 2 : 0;
  const finalAmount = totalAmount + serviceFee + convenienceFee;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const saveBookingToStorage = (booking: UserBooking) => {
    if (!user) return;
    
    initializeUserStorage(user.id);
    
    const existingBookings = localStorage.getItem(`bookings_${user.id}`);
    let bookings: UserBooking[] = [];
    
    if (existingBookings) {
      try {
        bookings = JSON.parse(existingBookings);
        if (!Array.isArray(bookings)) {
          bookings = [];
        }
      } catch (error) {
        console.error('Error parsing existing bookings:', error);
        bookings = [];
      }
    }
    
    bookings.unshift(booking);
    localStorage.setItem(`bookings_${user.id}`, JSON.stringify(bookings));
  };

  const generateTicketId = (eventTitle: string) => {
    const prefix = eventTitle.substring(0, 3).toUpperCase();
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.random().toString(36).substring(2, 5).toUpperCase();
    return `${prefix}-${timestamp}-${random}`;
  };

  const processPayment = async (paymentMethod: string, amount: number) => {
    // Simulate different payment processing based on method
    switch (paymentMethod) {
      case 'upi':
        // In a real app, this would generate UPI payment link
        await new Promise(resolve => setTimeout(resolve, 2000));
        return { success: true, transactionId: 'UPI' + Date.now() };
      
      case 'card':
      default:
        // In a real app, this would process card payment
        await new Promise(resolve => setTimeout(resolve, 2000));
        return { success: true, transactionId: 'CARD' + Date.now() };
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validate payment method specific fields
      if (selectedPaymentMethod === 'card') {
        if (!formData.cardNumber || !formData.expiryDate || !formData.cvv || !formData.nameOnCard) {
          throw new Error('Please fill in all card details');
        }
      } else if (selectedPaymentMethod === 'upi') {
        if (!formData.upiId) {
          throw new Error('Please enter your UPI ID');
        }
      }

      // Process payment
      const paymentResult = await processPayment(selectedPaymentMethod, finalAmount);
      
      if (!paymentResult.success) {
        throw new Error('Payment failed. Please try again.');
      }
      
      // Create booking object with unique ID
      const bookingId = `booking_${user!.id}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      const newBooking: UserBooking = {
        id: bookingId,
        eventId: event.id,
        eventTitle: event.title,
        eventDate: event.date,
        eventTime: event.time,
        eventLocation: event.location,
        eventImage: event.image,
        numberOfTickets: tickets,
        totalAmount: finalAmount,
        bookingDate: new Date().toISOString(),
        status: 'confirmed',
        category: event.category,
        ticketId: generateTicketId(event.title)
      };

      // Save booking to localStorage
      saveBookingToStorage(newBooking);

      toast({
        title: "Booking Confirmed!",
        description: `Your booking for ${event.title} has been confirmed. Transaction ID: ${paymentResult.transactionId}`,
      });

      // Navigate to my-bookings page after successful booking
      navigate('/my-bookings', { replace: true });
    } catch (error) {
      toast({
        title: "Booking Failed",
        description: error instanceof Error ? error.message : "There was an error processing your booking. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderPaymentFields = () => {
    switch (selectedPaymentMethod) {
      case 'card':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="nameOnCard">Name on Card *</Label>
              <Input
                id="nameOnCard"
                name="nameOnCard"
                value={formData.nameOnCard}
                onChange={handleInputChange}
                required
                placeholder="Enter name as it appears on card"
              />
            </div>
            <div>
              <Label htmlFor="cardNumber">Card Number *</Label>
              <Input
                id="cardNumber"
                name="cardNumber"
                value={formData.cardNumber}
                onChange={handleInputChange}
                required
                placeholder="1234 5678 9012 3456"
                maxLength={19}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="expiryDate">Expiry Date *</Label>
                <Input
                  id="expiryDate"
                  name="expiryDate"
                  value={formData.expiryDate}
                  onChange={handleInputChange}
                  required
                  placeholder="MM/YY"
                  maxLength={5}
                />
              </div>
              <div>
                <Label htmlFor="cvv">CVV *</Label>
                <Input
                  id="cvv"
                  name="cvv"
                  value={formData.cvv}
                  onChange={handleInputChange}
                  required
                  placeholder="123"
                  maxLength={3}
                />
              </div>
            </div>
            {convenienceFee > 0 && (
              <div className="text-sm text-gray-600 bg-yellow-50 p-3 rounded-md">
                <strong>Note:</strong> A convenience fee of ${convenienceFee} applies for card payments.
              </div>
            )}
          </div>
        );

      case 'upi':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="upiId">UPI ID *</Label>
              <Input
                id="upiId"
                name="upiId"
                value={formData.upiId}
                onChange={handleInputChange}
                required
                placeholder="yourname@upi"
              />
            </div>
            <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded-md">
              <strong>Note:</strong> You'll receive a payment request on your UPI app after clicking "Complete Booking".
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Button variant="ghost" asChild className="mb-6">
          <Link to={`/event/${event.id}`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Event Details
          </Link>
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Ticket className="mr-2 h-5 w-5" />
                  Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="aspect-video rounded-lg overflow-hidden">
                  <img 
                    src={event.image} 
                    alt={event.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div>
                  <h3 className="font-semibold text-lg">{event.title}</h3>
                  <div className="space-y-2 mt-2 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2" />
                      {formattedDate} at {event.time}
                    </div>
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-2" />
                      {event.location}
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Tickets ({tickets}x)</span>
                    <span>${event.price * tickets}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Service Fee</span>
                    <span>${serviceFee}</span>
                  </div>
                  {convenienceFee > 0 && (
                    <div className="flex justify-between">
                      <span>Convenience Fee</span>
                      <span>${convenienceFee}</span>
                    </div>
                  )}
                  <Separator />
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>${finalAmount}</span>
                  </div>
                </div>

                <div className="text-xs text-gray-500 space-y-1">
                  <p>• Secure payment processing</p>
                  <p>• Instant booking confirmation</p>
                  <p>• Mobile tickets available</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Booking Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Complete Your Booking</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Personal Information */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Full Name *</Label>
                        <Input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                          placeholder="Enter your full name"
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          placeholder="Enter your email"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <Label htmlFor="phone">Phone Number *</Label>
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={handleInputChange}
                          required
                          placeholder="Enter your phone number"
                        />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Payment Method Selection */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Select Payment Method</h3>
                    <RadioGroup value={selectedPaymentMethod} onValueChange={setSelectedPaymentMethod}>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {paymentMethods.map((method) => (
                          <Label
                            key={method.id}
                            htmlFor={method.id}
                            className={`flex items-center space-x-3 p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                              selectedPaymentMethod === method.id
                                ? 'border-blue-500 bg-blue-50'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <RadioGroupItem value={method.id} id={method.id} />
                            <div className="flex items-center space-x-3 flex-1">
                              {method.icon}
                              <div>
                                <div className="font-medium">{method.name}</div>
                                <div className="text-sm text-gray-600">{method.description}</div>
                              </div>
                            </div>
                          </Label>
                        ))}
                      </div>
                    </RadioGroup>
                  </div>

                  <Separator />

                  {/* Payment Information */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">
                      Payment Information
                    </h3>
                    {renderPaymentFields()}
                  </div>

                  <div className="pt-4">
                    <Button 
                      type="submit" 
                      size="lg" 
                      className="w-full"
                      disabled={isSubmitting}
                    >
                      {isSubmitting 
                        ? 'Processing Payment...' 
                        : `Complete Booking - $${finalAmount}`
                      }
                    </Button>
                    <p className="text-sm text-gray-600 mt-2 text-center">
                      By completing this purchase, you agree to our Terms of Service and Privacy Policy.
                    </p>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingForm;