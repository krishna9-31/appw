# Bus Booking Web Application (MVP)

MERN stack bus booking app using JavaScript only.

## Tech Stack

- Frontend: React + basic CSS (no Tailwind)
- Backend: Node.js + Express
- Database: MongoDB + Mongoose

## Features

- Home page bus search (departure city, arrival city, travel date)
- Search buses by predefined cities and date
- Left sidebar filters (seat type, AC/NON-AC, departure slot)
- Paginated bus listing with "Book Now"
- Seat selection (40 seats) with booked/selected states
- 2-minute seat reservation timer lock
- Booking confirmation with passenger name, age, gender
- Duplicate seat booking prevention
- Public booking/reservation APIs (session-based seat locking)

## Predefined Cities

- Hyderabad
- Bangalore
- Chennai
- Mumbai
- Delhi

## Backend Setup

1. `cd backend`
2. `npm install`
3. Copy `.env.example` to `.env`
4. Run MongoDB locally
5. Seed buses: `npm run seed`
6. Start server: `npm run dev`

## Frontend Setup

1. `cd frontend`
2. `npm install`
3. Copy `.env.example` to `.env`
4. Start app: `npm run dev`

## API Routes

- `POST /api/auth/signup`
- `POST /api/auth/login`
- `GET /api/buses`
- `GET /api/buses/:busId`
- `POST /api/bookings`
- `POST /api/reservations`
- `PATCH /api/reservations/:id`
- `DELETE /api/reservations/:id`
