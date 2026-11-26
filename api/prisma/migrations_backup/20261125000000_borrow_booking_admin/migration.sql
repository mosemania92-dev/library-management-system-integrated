-- Align the integrated schema with the assignment's Booking model and fine tracking.
ALTER TYPE "BorrowStatus" ADD VALUE IF NOT EXISTS 'PENDING';
ALTER TYPE "BorrowStatus" ADD VALUE IF NOT EXISTS 'APPROVED';
ALTER TYPE "BorrowStatus" ADD VALUE IF NOT EXISTS 'REJECTED';

ALTER TYPE "SpaceBookingStatus" RENAME TO "BookingStatus";
ALTER TABLE "SpaceBooking" RENAME TO "Booking";
ALTER INDEX IF EXISTS "SpaceBooking_pkey" RENAME TO "Booking_pkey";
ALTER INDEX IF EXISTS "SpaceBooking_spaceId_date_status_idx" RENAME TO "Booking_spaceId_date_status_idx";
ALTER INDEX IF EXISTS "SpaceBooking_userId_idx" RENAME TO "Booking_userId_idx";
ALTER TABLE "BorrowRequest" ADD COLUMN IF NOT EXISTS "fineAmount" DOUBLE PRECISION NOT NULL DEFAULT 0;
