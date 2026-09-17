# 🌾 YieldRent: Smart Farmer Machinery Rental & Live Weather Monitoring System

YieldRent is a full-stack agricultural web platform designed to bridge the gap between machinery owners with idle farm equipment and smallholder farmers who need affordable machinery. The platform integrates real-time localized weather monitoring and agro-advisories to help farmers plan field operations effectively.

---

## 🚀 Key Features

- **Dual-User Architecture**:
  - **🌾 Farmers**: Search and filter equipment, check live weather, inspect guidelines, and submit reservation requests.
  - **🚜 Machinery Owners**: Manage fleet, toggle availability in real-time, approve or decline incoming bookings, and track rental earnings.
- **Agricultural Marketplace**:
  - Browse Tractors, Harvesters, Rotavators, Seed Drills, Boom Sprayers, and Threshers.
  - Multi-parameter filtering by Category, District/Location, Price, and Availability.
  - Detailed equipment specifications (HP, fuel type, PTO requirements) and field operating guidelines.
- **Collision-Free Booking Engine**:
  - Automated date conflict detection to prevent double-booking.
  - Dynamic daily and hourly duration and cost calculations.
- **Live Agro-Weather & 4-Pillar Advisory Center**:
  - Real-time district weather telemetry (Temperature, Humidity, Wind speed, Precipitation probability).
  - 5-Day agricultural forecast outlook.
  - AI-supported decision advisories for:
    - 🌾 **Combine Harvesting**
    - 🌿 **Chemical & Fertilizer Spraying**
    - 🚜 **Plowing & Tillage**
    - 🌱 **Sowing & Seeding**
- **Direct Messaging**: Inquiries channel between farmers and equipment owners for logistical coordination.
- **1-Click Demo Accounts**: Instant evaluation with pre-seeded `🌾 Demo Farmer` and `🚜 Demo Owner` accounts.

---

## 🛠️ Technology Stack

- **Frontend**: React.js 19, Vite, Tailwind CSS v4, Lucide Icons, Axios
- **Backend**: Node.js, Express.js, JWT Authentication, bcryptjs
- **Database**: Dual-engine support — connects automatically to **MySQL (XAMPP)** if available, with a zero-configuration embedded **SQLite** fallback.
- **Weather API**: OpenWeather API with built-in agricultural simulation fallback for Indian farming hubs.

---

## 📦 Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/YOUR_USERNAME/yieldrent.git
cd yieldrent
```

### 2. Backend Setup
```bash
cd server
npm install
npm run seed     # Migrates schema and inserts initial machinery
npm start        # Starts server on http://localhost:5000
```

### 3. Frontend Setup (in a new terminal)
```bash
cd client
npm install
npm run dev      # Starts Vite React on http://localhost:3000
```

### 4. 1-Click Launch (Windows)
Double-click `start.bat` in the root folder to start both servers and launch your browser automatically!

---

## 🧪 Demo Credentials

For quick evaluation without manual signup:
- **Demo Farmer**: `farmer@yieldrent.com` (or click `🌾 Demo Farmer` in the navbar)
- **Demo Owner**: `owner@yieldrent.com` (or click `🚜 Demo Owner` in the navbar)

---

## 📜 Academic Attribution
Developed as an academic Mini Project adhering to Software Development Life Cycle (SDLC) standards.
