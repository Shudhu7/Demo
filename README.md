# EventHub 🎫

A modern, responsive event booking platform built with React, TypeScript, and Tailwind CSS. EventHub allows users to discover, book, and manage event tickets with an intuitive interface and comprehensive admin dashboard.

## ✨ Features

### 🎯 User Features
- **Event Discovery**: Browse and search events by category, date, location, and price
- **Smart Filtering**: Advanced search with multiple filters and sorting options
- **Event Booking**: Complete booking flow with ticket selection and payment processing
- **User Dashboard**: Manage bookings, download tickets, and view booking history
- **Wishlist**: Save favorite events for later
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Dark/Light Theme**: Toggle between themes with system preference detection
- **PDF Tickets**: Download professional PDF tickets with QR codes

### 👨‍💼 Admin Features
- **Event Management**: Create, edit, and delete events
- **User Management**: Comprehensive user administration with role management
- **Analytics Dashboard**: View booking statistics and revenue metrics
- **Booking Overview**: Monitor all bookings and their statuses

### 🛍️ E-commerce Integration
- **Product Catalog**: Browse fashion items and merchandise
- **Shopping Cart**: Add items with size and color selection
- **Multi-platform**: Integrated shopping experience alongside event booking

## 🚀 Live Demo

- **User Account**: `user@example.com` / `password`
- **Admin Account**: `admin@example.com` / `password`

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern React with hooks and functional components
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Shadcn/ui** - High-quality, accessible UI components

### State Management
- **React Context** - For authentication and global state
- **React Hooks** - For local component state
- **Local Storage** - For data persistence (development)

### Key Libraries
- **React Router** - Client-side routing
- **React Hook Form** - Form handling and validation
- **Date-fns** - Date manipulation and formatting
- **Lucide React** - Beautiful icons
- **Sonner** - Toast notifications

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Setup

1. **Clone the repository**
```bash
git clone https://github.com/your-username/eventhub.git
cd eventhub
```

2. **Install dependencies**
```bash
npm install
# or
yarn install
```

3. **Start development server**
```bash
npm run dev
# or
yarn dev
```

4. **Open your browser**
Navigate to `http://localhost:5173`

## 🗂️ Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Base UI components (buttons, inputs, etc.)
│   ├── EventCard.tsx   # Event display component
│   ├── Navbar.tsx      # Navigation component
│   └── ...
├── contexts/           # React Context providers
│   ├── AuthContext.tsx # Authentication state
│   ├── ThemeContext.tsx # Theme management
│   └── WishlistContext.tsx # Wishlist state
├── pages/              # Page components
│   ├── Home.tsx        # Homepage with event grid
│   ├── EventDetails.tsx # Individual event page
│   ├── BookingForm.tsx # Booking checkout
│   ├── Dashboard.tsx   # User/Admin dashboard
│   └── ...
├── data/               # Mock data and constants
│   ├── events.ts       # Sample events data
│   └── products.ts     # Sample products data
├── types/              # TypeScript type definitions
│   ├── event.ts        # Event-related types
│   └── product.ts      # Product-related types
├── hooks/              # Custom React hooks
├── lib/                # Utility libraries
├── utils/              # Helper functions
└── App.tsx             # Main app component
```

## 🎨 Key Components

### Event Management
- **EventCard**: Displays event information with booking options
- **EventDetails**: Full event page with detailed information
- **BookingForm**: Multi-step booking process
- **EnhancedSearchFilter**: Advanced filtering and search

### User Interface
- **Navbar**: Responsive navigation with user menu
- **ThemeToggle**: Light/dark theme switcher
- **LoadingStates**: Skeleton loaders and loading indicators
- **WishlistButton**: Add/remove events from wishlist

### Admin Dashboard
- **AdminUserManagement**: User administration interface
- **EventManagement**: Create and manage events
- **Analytics**: Booking statistics and metrics

## 🔐 Authentication

The app includes a mock authentication system for demonstration:

### User Roles
- **User**: Can browse events, make bookings, manage wishlist
- **Admin**: All user permissions plus event and user management

### Demo Accounts
```
User Account:
Email: user@example.com
Password: password

Admin Account:
Email: admin@example.com
Password: password
```

## 📱 Responsive Design

EventHub is fully responsive with:
- **Mobile-first approach** with breakpoint optimization
- **Touch-friendly interfaces** for mobile devices
- **Adaptive layouts** that work on all screen sizes
- **Mobile navigation** with collapsible menus

## 🎯 Booking Flow

1. **Browse Events**: Users can filter and search events
2. **Event Details**: View comprehensive event information
3. **Ticket Selection**: Choose number of tickets
4. **User Authentication**: Login or register if needed
5. **Booking Form**: Enter personal and payment details
6. **Confirmation**: Receive booking confirmation and tickets
7. **Management**: View and manage bookings in dashboard

## 🛡️ Data Management

### Local Storage Structure
```javascript
// User authentication
localStorage.token
localStorage.user

// User-specific bookings
localStorage.bookings_${userId}

// Registered users
localStorage.registered_users
```

### Data Models
```typescript
interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  price: number;
  totalSeats: number;
  availableSeats: number;
  image: string;
  category: string;
}

interface UserBooking {
  id: string;
  eventId: string;
  eventTitle: string;
  numberOfTickets: number;
  totalAmount: number;
  status: 'confirmed' | 'pending' | 'cancelled';
  ticketId: string;
  // ... additional fields
}
```

## 🎨 Theming

EventHub supports multiple themes:
- **Light Theme**: Clean, bright interface
- **Dark Theme**: Easy on the eyes for low-light environments
- **System Theme**: Automatically matches user's system preference

Theme switching is handled by the ThemeContext with CSS custom properties.

## 📋 Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript compiler

# Testing (if implemented)
npm run test         # Run unit tests
npm run test:e2e     # Run end-to-end tests
```

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the root directory:
```env
VITE_API_URL=http://localhost:3001/api
VITE_APP_NAME=EventHub
VITE_APP_VERSION=1.0.0
```

### Tailwind Configuration
Custom theme configuration in `tailwind.config.js`:
```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: 'hsl(var(--primary))',
        secondary: 'hsl(var(--secondary))',
        // ... custom colors
      },
    },
  },
};
```

## 🚀 Deployment

### Vercel (Recommended)
```bash
npm install -g vercel
vercel
```

### Netlify
```bash
npm run build
# Upload dist/ folder to Netlify
```

### GitHub Pages
```bash
npm install --save-dev gh-pages
npm run build
npm run deploy
```

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit changes**: `git commit -m 'Add amazing feature'`
4. **Push to branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### Development Guidelines
- Follow TypeScript best practices
- Use conventional commit messages
- Ensure responsive design
- Add proper error handling
- Include appropriate tests

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Shadcn/ui** for the beautiful component library
- **Lucide** for the comprehensive icon set
- **Tailwind CSS** for the utility-first CSS framework
- **Vite** for the blazing-fast development experience

## 📞 Support

If you have any questions or need help:
- Create an issue on GitHub
- Check the documentation
- Review the demo application

---

**Made with ❤️ for event lovers everywhere**
