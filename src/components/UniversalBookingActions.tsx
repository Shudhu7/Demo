import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { 
  Download, 
  Star, 
  Receipt,
  FileText
} from 'lucide-react';

// Types for booking data
interface UserBooking {
  id: string;
  eventId: string;
  eventTitle: string;
  eventDate: string;
  eventTime: string;
  eventLocation: string;
  eventImage?: string;
  numberOfTickets: number;
  totalAmount: number;
  bookingDate: string;
  status: 'confirmed' | 'pending' | 'cancelled';
  category: string;
  ticketId: string;
}

interface BookingActionsProps {
  booking: UserBooking;
  onRatingSubmit?: (bookingId: string, rating: number, review: string) => void;
  onDownloadComplete?: (bookingId: string) => void;
  showToast?: (title: string, description: string, variant?: 'default' | 'destructive') => void;
}

// Universal Rating Dialog Component
const UniversalRatingDialog: React.FC<{
  booking: UserBooking;
  onSubmit: (rating: number, review: string) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}> = ({ booking, onSubmit, isOpen, setIsOpen }) => {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [hoveredRating, setHoveredRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (rating === 0) return;
    
    setIsSubmitting(true);
    try {
      await onSubmit(rating, review);
      setIsOpen(false);
      setRating(0);
      setReview('');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getRatingText = (rating: number) => {
    const texts = ['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'];
    return texts[rating] || '';
  };

  return (
    <DialogContent className="max-w-md">
      <DialogHeader>
        <DialogTitle>Rate Your Experience</DialogTitle>
      </DialogHeader>
      <div className="space-y-6">
        <div>
          <h4 className="font-medium text-gray-900 mb-2">{booking.eventTitle}</h4>
          <p className="text-sm text-gray-600">
            {new Date(booking.eventDate).toLocaleDateString()} • {booking.eventLocation}
          </p>
        </div>
        
        <div>
          <Label className="text-sm font-medium">Your Rating</Label>
          <div className="flex items-center gap-1 mt-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                className="p-1 hover:scale-110 transition-transform focus:outline-none"
              >
                <Star
                  className={`h-6 w-6 ${
                    (hoveredRating || rating) >= star
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-300'
                  }`}
                />
              </button>
            ))}
          </div>
          {(hoveredRating || rating) > 0 && (
            <p className="text-sm text-gray-600 mt-1">
              {getRatingText(hoveredRating || rating)}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="review" className="text-sm font-medium">
            Your Review (Optional)
          </Label>
          <Textarea
            id="review"
            value={review}
            onChange={(e) => setReview(e.target.value)}
            placeholder="Share your experience with other attendees..."
            className="mt-2"
            rows={4}
          />
        </div>

        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={rating === 0 || isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Rating'}
          </Button>
        </div>
      </div>
    </DialogContent>
  );
};

// Universal Receipt Dialog Component
const UniversalReceiptDialog: React.FC<{
  booking: UserBooking;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}> = ({ booking, isOpen, setIsOpen }) => {
  const serviceFee = 5;
  const subtotal = booking.totalAmount - serviceFee;

  const handlePrintReceipt = () => {
    const receiptContent = `
<!DOCTYPE html>
<html>
<head>
    <title>EventHub Receipt - ${booking.ticketId}</title>
    <style>
        body { 
            font-family: Arial, sans-serif; 
            margin: 20px; 
            line-height: 1.4;
            max-width: 400px;
            margin: 0 auto;
        }
        .header { 
            text-align: center; 
            border-bottom: 2px solid #ccc; 
            padding-bottom: 15px; 
            margin-bottom: 20px; 
        }
        .section { margin-bottom: 15px; }
        .flex { 
            display: flex; 
            justify-content: space-between; 
            margin-bottom: 5px;
        }
        .total { 
            font-weight: bold; 
            font-size: 1.1em; 
            border-top: 1px solid #ccc; 
            padding-top: 10px; 
            margin-top: 10px;
        }
        .footer {
            text-align: center;
            font-size: 0.9em;
            color: #666;
            border-top: 1px solid #ccc;
            padding-top: 15px;
            margin-top: 20px;
        }
        h1 { margin: 0; font-size: 1.5em; }
        h4 { margin: 5px 0; }
    </style>
</head>
<body>
    <div class="header">
        <h1>EventHub</h1>
        <p>Payment Receipt</p>
        <p><strong>Receipt #${booking.ticketId}</strong></p>
    </div>
    
    <div class="section">
        <h4>${booking.eventTitle}</h4>
        <p>${booking.category}</p>
    </div>
    
    <div class="section">
        <div class="flex">
            <span>Date:</span>
            <span>${new Date(booking.eventDate).toLocaleDateString()}</span>
        </div>
        <div class="flex">
            <span>Time:</span>
            <span>${booking.eventTime}</span>
        </div>
        <div class="flex">
            <span>Location:</span>
            <span>${booking.eventLocation}</span>
        </div>
    </div>
    
    <div class="section">
        <div class="flex">
            <span>Booking ID:</span>
            <span>${booking.ticketId}</span>
        </div>
        <div class="flex">
            <span>Booking Date:</span>
            <span>${new Date(booking.bookingDate).toLocaleDateString()}</span>
        </div>
        <div class="flex">
            <span>Status:</span>
            <span>${booking.status.toUpperCase()}</span>
        </div>
    </div>
    
    <div class="section">
        <div class="flex">
            <span>Tickets (${booking.numberOfTickets}x):</span>
            <span>$${subtotal}</span>
        </div>
        <div class="flex">
            <span>Service Fee:</span>
            <span>$${serviceFee}</span>
        </div>
        <div class="flex total">
            <span>Total Paid:</span>
            <span>$${booking.totalAmount}</span>
        </div>
    </div>
    
    <div class="footer">
        <p>Thank you for choosing EventHub!</p>
        <p>Questions? Contact support@eventhub.com</p>
    </div>
</body>
</html>
    `;

    const newWindow = window.open('', '_blank');
    if (newWindow) {
      newWindow.document.write(receiptContent);
      newWindow.document.close();
      newWindow.print();
      newWindow.close();
    }
  };

  return (
    <DialogContent className="max-w-md">
      <DialogHeader>
        <DialogTitle>Payment Receipt</DialogTitle>
      </DialogHeader>
      <div id="receipt-content" className="space-y-6">
        {/* Header */}
        <div className="text-center border-b pb-4">
          <h3 className="text-lg font-bold">EventHub</h3>
          <p className="text-sm text-gray-600">Payment Receipt</p>
          <p className="text-xs text-gray-500">Receipt #{booking.ticketId}</p>
        </div>

        {/* Event Details */}
        <div className="space-y-3">
          <div>
            <h4 className="font-medium text-gray-900">{booking.eventTitle}</h4>
            <p className="text-sm text-gray-600">{booking.category}</p>
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Date:</span>
              <p className="font-medium">{new Date(booking.eventDate).toLocaleDateString()}</p>
            </div>
            <div>
              <span className="text-gray-600">Time:</span>
              <p className="font-medium">{booking.eventTime}</p>
            </div>
            <div className="col-span-2">
              <span className="text-gray-600">Location:</span>
              <p className="font-medium">{booking.eventLocation}</p>
            </div>
          </div>
        </div>

        {/* Booking Details */}
        <div className="border-t border-b py-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span>Booking ID:</span>
            <span className="font-mono">{booking.ticketId}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Booking Date:</span>
            <span>{new Date(booking.bookingDate).toLocaleDateString()}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Status:</span>
            <Badge variant={booking.status === 'confirmed' ? 'default' : 'secondary'}>
              {booking.status}
            </Badge>
          </div>
        </div>

        {/* Payment Breakdown */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Tickets ({booking.numberOfTickets}x)</span>
            <span>${subtotal}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Service Fee</span>
            <span>${serviceFee}</span>
          </div>
          <div className="flex justify-between font-bold text-lg border-t pt-2">
            <span>Total Paid</span>
            <span>${booking.totalAmount}</span>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-xs text-gray-500 border-t pt-4">
          <p>Thank you for choosing EventHub!</p>
          <p>Questions? Contact support@eventhub.com</p>
        </div>
      </div>

      <div className="flex justify-end space-x-2 border-t pt-4">
        <Button variant="outline" onClick={() => setIsOpen(false)}>
          Close
        </Button>
        <Button onClick={handlePrintReceipt}>
          <FileText className="h-4 w-4 mr-2" />
          Print Receipt
        </Button>
      </div>
    </DialogContent>
  );
};

// Universal PDF Ticket Generator Function
const generateUniversalPDFTicket = async (booking: UserBooking) => {
  // Create a canvas for PDF generation
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  // Set canvas dimensions (A4 size in pixels at 72 DPI)
  canvas.width = 595;
  canvas.height = 842;
  
  if (!ctx) throw new Error('Could not get canvas context');
  
  // Set white background
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Colors
  const primaryColor = '#1E40AF'; // Blue
  const secondaryColor = '#6B7280'; // Gray
  const accentColor = '#F59E0B'; // Amber
  
  // Helper function to draw text with word wrapping
  const drawWrappedText = (text: string, x: number, y: number, maxWidth: number, lineHeight: number) => {
    const words = text.split(' ');
    let line = '';
    let currentY = y;
    
    for (let i = 0; i < words.length; i++) {
      const testLine = line + words[i] + ' ';
      const metrics = ctx.measureText(testLine);
      const testWidth = metrics.width;
      
      if (testWidth > maxWidth && i > 0) {
        ctx.fillText(line, x, currentY);
        line = words[i] + ' ';
        currentY += lineHeight;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, x, currentY);
    return currentY + lineHeight;
  };
  
  // Draw header with EventHub branding
  ctx.fillStyle = primaryColor;
  ctx.fillRect(0, 0, canvas.width, 80);
  
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 32px Arial, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('🎫 EventHub', canvas.width / 2, 50);
  
  // Draw ticket border
  ctx.strokeStyle = primaryColor;
  ctx.lineWidth = 3;
  ctx.strokeRect(30, 100, canvas.width - 60, canvas.height - 180);
  
  // Add decorative corner elements
  ctx.fillStyle = accentColor;
  const cornerSize = 20;
  // Top corners
  ctx.fillRect(30, 100, cornerSize, cornerSize);
  ctx.fillRect(canvas.width - 50, 100, cornerSize, cornerSize);
  // Bottom corners
  ctx.fillRect(30, canvas.height - 100, cornerSize, cornerSize);
  ctx.fillRect(canvas.width - 50, canvas.height - 100, cornerSize, cornerSize);
  
  let yPosition = 150;
  
  // Event Title
  ctx.fillStyle = primaryColor;
  ctx.font = 'bold 24px Arial, sans-serif';
  ctx.textAlign = 'center';
  yPosition = drawWrappedText(booking.eventTitle.toUpperCase(), canvas.width / 2, yPosition, 500, 30);
  yPosition += 10;
  
  // Category
  ctx.fillStyle = secondaryColor;
  ctx.font = '16px Arial, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(booking.category, canvas.width / 2, yPosition);
  yPosition += 40;
  
  // Draw separator line
  ctx.strokeStyle = secondaryColor;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(60, yPosition);
  ctx.lineTo(canvas.width - 60, yPosition);
  ctx.stroke();
  yPosition += 30;
  
  // Event Details Section
  ctx.fillStyle = '#000000';
  ctx.font = 'bold 18px Arial, sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('📅 EVENT DETAILS', 60, yPosition);
  yPosition += 30;
  
  const detailsStartY = yPosition;
  
  // Left column - Date & Time
  ctx.font = '14px Arial, sans-serif';
  ctx.fillStyle = secondaryColor;
  ctx.fillText('Date:', 60, yPosition);
  ctx.fillStyle = '#000000';
  ctx.font = 'bold 14px Arial, sans-serif';
  const eventDate = new Date(booking.eventDate).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  drawWrappedText(eventDate, 60, yPosition + 20, 220, 18);
  
  ctx.font = '14px Arial, sans-serif';
  ctx.fillStyle = secondaryColor;
  ctx.fillText('Time:', 60, yPosition + 50);
  ctx.fillStyle = '#000000';
  ctx.font = 'bold 14px Arial, sans-serif';
  ctx.fillText(booking.eventTime, 60, yPosition + 70);
  
  // Right column - Location
  ctx.font = '14px Arial, sans-serif';
  ctx.fillStyle = secondaryColor;
  ctx.fillText('Location:', 320, yPosition);
  ctx.fillStyle = '#000000';
  ctx.font = 'bold 14px Arial, sans-serif';
  drawWrappedText(booking.eventLocation, 320, yPosition + 20, 220, 18);
  
  yPosition += 110;
  
  // Draw separator line
  ctx.strokeStyle = secondaryColor;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(60, yPosition);
  ctx.lineTo(canvas.width - 60, yPosition);
  ctx.stroke();
  yPosition += 30;
  
  // Ticket Information Section
  ctx.fillStyle = '#000000';
  ctx.font = 'bold 18px Arial, sans-serif';
  ctx.fillText('🎟️  TICKET INFORMATION', 60, yPosition);
  yPosition += 30;
  
  // Ticket details in two columns
  const ticketDetails = [
    ['Ticket ID:', booking.ticketId],
    ['Number of Tickets:', booking.numberOfTickets.toString()],
    ['Status:', booking.status.toUpperCase()],
    ['Total Amount:', `$${booking.totalAmount}`]
  ];
  
  ticketDetails.forEach((detail, index) => {
    const x = index % 2 === 0 ? 60 : 320;
    const y = yPosition + Math.floor(index / 2) * 30;
    
    ctx.font = '14px Arial, sans-serif';
    ctx.fillStyle = secondaryColor;
    ctx.fillText(detail[0], x, y);
    ctx.fillStyle = '#000000';
    ctx.font = 'bold 14px Arial, sans-serif';
    ctx.fillText(detail[1], x + 120, y);
  });
  
  yPosition += 80;
  
  // Draw separator line
  ctx.strokeStyle = secondaryColor;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(60, yPosition);
  ctx.lineTo(canvas.width - 60, yPosition);
  ctx.stroke();
  yPosition += 30;
  
  // Important Information Section
  ctx.fillStyle = accentColor;
  ctx.font = 'bold 16px Arial, sans-serif';
  ctx.fillText('⚠️  IMPORTANT INFORMATION', 60, yPosition);
  yPosition += 25;
  
  const importantInfo = [
    '• Present this ticket at the venue entrance',
    '• Arrive 30 minutes before event start time',
    '• This ticket is non-transferable and non-refundable',
    '• Keep this ticket safe and accessible',
    '• Contact support for issues: support@eventhub.com'
  ];
  
  ctx.fillStyle = '#000000';
  ctx.font = '12px Arial, sans-serif';
  importantInfo.forEach((info) => {
    ctx.fillText(info, 60, yPosition);
    yPosition += 18;
  });
  
  // QR Code placeholder (you can replace with actual QR code generation)
  yPosition += 20;
  ctx.strokeStyle = primaryColor;
  ctx.lineWidth = 2;
  ctx.strokeRect(canvas.width - 150, yPosition - 100, 80, 80);
  ctx.fillStyle = primaryColor;
  ctx.font = '10px Arial, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('QR CODE', canvas.width - 110, yPosition - 55);
  ctx.fillText('PLACEHOLDER', canvas.width - 110, yPosition - 45);
  
  // Footer
  ctx.fillStyle = primaryColor;
  ctx.fillRect(0, canvas.height - 60, canvas.width, 60);
  
  ctx.fillStyle = '#FFFFFF';
  ctx.font = '12px Arial, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('🌐 EventHub - Your Gateway to Amazing Experiences', canvas.width / 2, canvas.height - 35);
  ctx.fillText(`Generated: ${new Date().toLocaleString()}`, canvas.width / 2, canvas.height - 15);
  
  // Convert canvas to PDF and download
  const dataURL = canvas.toDataURL('image/png', 1.0);
  
  // Create a simple PDF structure
  const pdfContent = `%PDF-1.4
1 0 obj
<<
/Type /Catalog
/Pages 2 0 R
>>
endobj

2 0 obj
<<
/Type /Pages
/Kids [3 0 R]
/Count 1
>>
endobj

3 0 obj
<<
/Type /Page
/Parent 2 0 R
/MediaBox [0 0 595 842]
/Contents 4 0 R
/Resources 5 0 R
>>
endobj

4 0 obj
<<
/Length 44
>>
stream
q
595 0 0 842 0 0 cm
/Im1 Do
Q
endstream
endobj

5 0 obj
<<
/XObject <<
/Im1 6 0 R
>>
>>
endobj

6 0 obj
<<
/Type /XObject
/Subtype /Image
/Width ${canvas.width}
/Height ${canvas.height}
/ColorSpace /DeviceRGB
/BitsPerComponent 8
/Filter /DCTDecode
/Length ${dataURL.split(',')[1].length}
>>
stream
${dataURL.split(',')[1]}
endstream
endobj

xref
0 7
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000225 00000 n 
0000000319 00000 n 
0000000375 00000 n 
trailer
<<
/Size 7
/Root 1 0 R
>>
startxref
${500 + dataURL.split(',')[1].length}
%%EOF`;

  // For better PDF generation, we'll use the print functionality instead
  const printContent = `
<!DOCTYPE html>
<html>
<head>
    <title>EventHub Ticket - ${booking.ticketId}</title>
    <style>
        @page {
            size: A4;
            margin: 15mm;
        }
        body { 
            font-family: Arial, sans-serif; 
            margin: 0;
            padding: 0;
            background: white;
            font-size: 13px;
            line-height: 1.3;
        }
        .ticket-container {
            border: 2px solid #1E40AF;
            border-radius: 10px;
            padding: 20px;
            background: white;
            position: relative;
            overflow: hidden;
            max-height: 100vh;
        }
        .ticket-container::before {
            content: '🎫';
            position: absolute;
            top: -15px;
            right: -15px;
            font-size: 60px;
            opacity: 0.08;
            transform: rotate(15deg);
        }
        .header { 
            text-align: center; 
            background: #1E40AF;
            color: white;
            margin: -20px -20px 15px -20px;
            padding: 15px;
            border-radius: 8px 8px 0 0;
        }
        .header h1 { 
            margin: 0; 
            font-size: 1.8em; 
            font-weight: bold;
        }
        .header p { 
            margin: 3px 0 0 0; 
            font-size: 0.9em; 
        }
        .event-title {
            font-size: 1.5em;
            font-weight: bold;
            color: #1E40AF;
            text-align: center;
            margin: 12px 0 8px 0;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        .category {
            text-align: center;
            color: #6B7280;
            font-size: 0.95em;
            margin-bottom: 15px;
        }
        .main-content {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 15px;
            margin-bottom: 15px;
        }
        .section { 
            background: #F9FAFB;
            border-radius: 6px;
            border-left: 3px solid #F59E0B;
            padding: 12px;
        }
        .section-title {
            font-size: 1em;
            font-weight: bold;
            color: #1F2937;
            margin-bottom: 8px;
            display: flex;
            align-items: center;
            gap: 5px;
        }
        .details-grid {
            display: grid;
            gap: 8px;
        }
        .detail-item {
            display: flex;
            flex-direction: column;
        }
        .detail-label {
            font-size: 0.8em;
            color: #6B7280;
            margin-bottom: 2px;
        }
        .detail-value {
            font-weight: bold;
            font-size: 0.9em;
            color: #1F2937;
        }
        .ticket-id {
            background: #1E40AF;
            color: white;
            padding: 8px 12px;
            border-radius: 4px;
            font-family: monospace;
            font-size: 0.95em;
            text-align: center;
            margin: 10px 0;
        }
        .status-badge {
            display: inline-block;
            padding: 3px 8px;
            border-radius: 15px;
            font-size: 0.75em;
            font-weight: bold;
            text-transform: uppercase;
        }
        .status-confirmed {
            background: #10B981;
            color: white;
        }
        .status-pending {
            background: #F59E0B;
            color: white;
        }
        .status-cancelled {
            background: #EF4444;
            color: white;
        }
        .important-info {
            background: #FEF3C7;
            border: 1px solid #F59E0B;
            border-radius: 6px;
            padding: 12px;
            margin: 12px 0;
            grid-column: 1 / -1;
        }
        .important-info h3 {
            color: #92400E;
            margin: 0 0 8px 0;
            font-size: 0.95em;
            display: flex;
            align-items: center;
            gap: 5px;
        }
        .important-list {
            margin: 0;
            padding-left: 15px;
            columns: 2;
            column-gap: 20px;
        }
        .important-list li {
            margin-bottom: 4px;
            color: #78350F;
            font-size: 0.8em;
            break-inside: avoid;
        }
        .bottom-section {
            display: grid;
            grid-template-columns: 1fr auto;
            gap: 15px;
            align-items: center;
            margin-top: 15px;
        }
        .footer {
            text-align: left;
            padding: 10px;
            background: #1E40AF;
            color: white;
            border-radius: 6px;
            font-size: 0.8em;
        }
        .footer p {
            margin: 2px 0;
        }
        .qr-placeholder {
            width: 70px;
            height: 70px;
            border: 2px solid #1E40AF;
            border-radius: 6px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #F3F4F6;
            color: #1E40AF;
            font-weight: bold;
            font-size: 0.7em;
            text-align: center;
            line-height: 1.1;
        }
        @media print {
            .ticket-container {
                box-shadow: none;
            }
            body {
                print-color-adjust: exact;
                -webkit-print-color-adjust: exact;
            }
        }
    </style>
</head>
<body>
    <div class="ticket-container">
        <div class="header">
            <h1>🎫 EventHub</h1>
            <p>Digital Event Ticket</p>
        </div>
        
        <div class="event-title">${booking.eventTitle}</div>
        <div class="category">${booking.category}</div>
        
        <div class="section">
            <div class="section-title">📅 Event Details</div>
            <div class="details-grid">
                <div class="detail-item">
                    <div class="detail-label">Time</div>
                    <div class="detail-value">${booking.eventTime}</div>
                </div>
                <div class="detail-item" style="grid-column: 1 / -1;">
                    <div class="detail-label">Location</div>
                    <div class="detail-value">${booking.eventLocation}</div>
                </div>
            </div>
        </div>
        
        <div class="section">
            <div class="section-title">🎟️ Ticket Information</div>
            <div class="ticket-id">Ticket ID: ${booking.ticketId}</div>
            <div class="details-grid">
                <div class="detail-item">
                    <div class="detail-label">Number of Tickets</div>
                    <div class="detail-value">${booking.numberOfTickets}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Total Amount</div>
                    <div class="detail-value">${booking.totalAmount}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Booking Date</div>
                    <div class="detail-value">${new Date(booking.bookingDate).toLocaleDateString()}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Status</div>
                    <div class="detail-value">
                        <span class="status-badge status-${booking.status}">${booking.status.toUpperCase()}</span>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="important-info">
            <h3>⚠️ Important Information</h3>
            <ul>
                <li>Present this ticket at the venue entrance</li>
                <li>Arrive 30 minutes before event start time</li>
                <li>This ticket is non-transferable and non-refundable</li>
                <li>Keep this ticket safe and accessible on your device</li>
                <li>Screenshot or print this ticket as backup</li>
                <li>Entry may be denied if ticket is damaged or unreadable</li>
                <li>Contact support for any issues: support@eventhub.com</li>
            </ul>
        </div>
        
        <div class="qr-placeholder">
            QR CODE<br>PLACEHOLDER
        </div>
        
        <div class="footer">
            <p><strong>🌐 EventHub - Your Gateway to Amazing Experiences</strong></p>
            <p>📧 support@eventhub.com | 🌍 www.eventhub.com</p>
            <p style="margin-top: 10px; font-size: 0.9em;">Generated: ${new Date().toLocaleString()}</p>
        </div>
    </div>
</body>
</html>
  `;

  const newWindow = window.open('', '_blank');
  if (newWindow) {
    newWindow.document.write(printContent);
    newWindow.document.close();
    
    // Wait for content to load then trigger print dialog
    setTimeout(() => {
      newWindow.print();
      // Note: Window will close automatically after print dialog
    }, 500);
  }
};

// Main Universal Booking Actions Component
const UniversalBookingActions: React.FC<BookingActionsProps> = ({ 
  booking, 
  onRatingSubmit, 
  onDownloadComplete, 
  showToast 
}) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [isRatingOpen, setIsRatingOpen] = useState(false);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);

  // Check if event is in the past (for rating)
  const isEventPast = new Date(booking.eventDate) < new Date();

  const handleDownloadTicket = async () => {
    setIsDownloading(true);
    try {
      // Simulate download processing
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      await generateUniversalPDFTicket(booking);
      
      // Call the completion callback
      if (onDownloadComplete) {
        onDownloadComplete(booking.id);
      }
      
      // Show success message
      if (showToast) {
        showToast(
          "PDF Ticket Ready",
          `PDF ticket for "${booking.eventTitle}" is ready for download/print!`
        );
      }
    } catch (error) {
      if (showToast) {
        showToast(
          "Download Failed",
          "There was an error generating your PDF ticket. Please try again.",
          "destructive"
        );
      }
    } finally {
      setIsDownloading(false);
    }
  };

  const handleRatingSubmit = async (rating: number, review: string) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Call the rating callback
      if (onRatingSubmit) {
        onRatingSubmit(booking.id, rating, review);
      }
      
      // Show success message
      if (showToast) {
        showToast(
          "Rating Submitted",
          `Thank you for rating "${booking.eventTitle}" with ${rating} stars!`
        );
      }
    } catch (error) {
      if (showToast) {
        showToast(
          "Rating Failed",
          "There was an error submitting your rating. Please try again.",
          "destructive"
        );
      }
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      {/* Download PDF Ticket Button - Available for confirmed bookings */}
      {booking.status === 'confirmed' && (
        <Button
          variant="default"
          size="sm"
          onClick={handleDownloadTicket}
          disabled={isDownloading}
          className="flex items-center gap-1"
        >
          <Download className="h-4 w-4" />
          {isDownloading ? 'Generating PDF...' : 'Download PDF Ticket'}
        </Button>
      )}
      
      {/* Rate Event Button - Only for past confirmed events */}
      {booking.status === 'confirmed' && isEventPast && (
        <Dialog open={isRatingOpen} onOpenChange={setIsRatingOpen}>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1"
            >
              <Star className="h-4 w-4" />
              Rate Event
            </Button>
          </DialogTrigger>
          <UniversalRatingDialog
            booking={booking}
            onSubmit={handleRatingSubmit}
            isOpen={isRatingOpen}
            setIsOpen={setIsRatingOpen}
          />
        </Dialog>
      )}
      
      {/* View Receipt Button - Available for all bookings */}
      <Dialog open={isReceiptOpen} onOpenChange={setIsReceiptOpen}>
        <DialogTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center gap-1"
          >
            <Receipt className="h-4 w-4" />
            View Receipt
          </Button>
        </DialogTrigger>
        <UniversalReceiptDialog
          booking={booking}
          isOpen={isReceiptOpen}
          setIsOpen={setIsReceiptOpen}
        />
      </Dialog>
    </div>
  );
};

export default UniversalBookingActions;