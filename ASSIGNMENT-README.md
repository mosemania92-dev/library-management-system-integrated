# Integrated Library Management System — Week 5

This package combines the two uploaded archives: the existing React/Vite catalog and the existing NestJS/Prisma backend, with the Week 5 reading-list, authentication, borrowing, and space-booking work integrated.

## What is based on the uploaded source

- Frontend: React 18, Vite, React Router 6; API base URL was already `http://localhost:3000`.
- Backend: NestJS, Prisma, PostgreSQL; existing auth routes are `POST /auth/register` and `POST /auth/login`.
- Login returns `{ "access_token": "..." }`.
- Registration returns a user record and does not issue a token; the frontend therefore sends the user to login after registration.
- Existing JWT guard attaches `req.user.id`, and roles are `PATRON` / `LIBRARIAN`.

## Week 5 work included

### Frontend
- `ReadingListContext.jsx`: reducer actions `ADD_BOOK`, `REMOVE_BOOK`, `CLEAR_LIST`, localStorage restore and persistence.
- `Navbar.jsx`: reading-list count and login/logout navigation.
- `LoginPage.jsx`, `RegisterPage.jsx`: controlled forms wired to the actual auth endpoints.
- `ProtectedRoute.jsx`: redirects to login when no token is present.
- `SpaceBookingPage.jsx`: loads actual active spaces from the API and submits a protected booking.
- `BorrowRequestPage.jsx`: submits a protected borrow request.
- `ReadingListPage.jsx`: view, remove and clear saved books.
- Book details include Add to reading list and Request to borrow actions.

### Backend
- Prisma models: `BorrowRequest`, `Space`, `SpaceBooking`, plus enums.
- `POST /borrow-requests`: authenticated patron borrow request; backend atomically decrements available copies and sets a 14-day due date.
- `GET /borrow-requests/mine`: current patron's borrow history.
- `POST /borrow-requests/:id/return`: returns a current patron's active loan and increments availability.
- `GET /spaces`: lists active spaces.
- `POST /space-bookings`: authenticated booking with date/time validation and overlap checks; conflicts return HTTP 409.
- `GET /space-bookings/mine`: current patron's bookings.
- `api/prisma/seed.ts`: creates three sample study spaces.

## Setup

### 1. Configure PostgreSQL and backend environment

In `api/`, copy `.env.example` to `.env` and set a real PostgreSQL connection string and a long random `JWT_SECRET`.

### 2. Install and initialize backend

```bash
cd api
npm install
npx prisma generate
npx prisma db push
npm run prisma:seed
npm run start:dev
```

The API listens on `http://localhost:3000`.

> `prisma db push` updates the development database schema to match `schema.prisma`. For a production deployment, create and review a Prisma migration instead.

### 3. Install and run frontend

In another terminal:

```bash
cd client
npm install
npm run dev
```

The client `.env` points to `http://localhost:3000`. If the API is hosted elsewhere, update `VITE_API_URL` and restart Vite.

## Important checks before submitting

1. Register a patron, then log in.
2. Open a book detail and add it to the reading list; refresh and confirm it persists.
3. Submit a borrow request; verify `copiesAvailable` decreases and the request has a server-generated due date.
4. Return the loan using `POST /borrow-requests/:id/return` (or add a return UI if your rubric requires it).
5. Open Book a space; the dropdown should be populated by `GET /spaces`.
6. Book a slot, then try the same space/date/overlapping time again. The second request should receive HTTP 409.
7. Confirm unauthenticated users are redirected from `/space-booking` and `/borrow/:id` to `/login`.

## Assumptions to verify with your course rubric

- Loan duration is set to 14 days on the backend because the supplied source did not specify a loan period.
- The sample space names/capacities are seed data; edit `api/prisma/seed.ts` to match your assignment's expected spaces.
- The backend ZIP did not contain a package manifest or Prisma service/module, so this package adds those standard NestJS project files to make the supplied source installable/buildable. Dependency versions are a compatible NestJS 10 / Prisma 5 baseline, not versions confirmed from the original archive.
- The original source uses PostgreSQL. Ensure the database is running and `DATABASE_URL` is valid before starting the API.
- Browser localStorage is used for the JWT as required by the assignment. For a production application, consider secure HttpOnly cookies and additional CSRF protections.
