export type UserRole = 'user' | 'vendor' | 'admin';
export type TransportType = 'bus' | 'train' | 'launch' | 'plane';
export type SeatStatus = 'available' | 'held' | 'booked';
export type BookingStatus = 'pending' | 'paid' | 'expired' | 'cancelled';

export interface User {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  phone?: string;
  provider?: string;
  isFraud?: boolean;
  createdAt?: string;
}

export interface SeatLayout {
  rows: number;
  columns: number;
  aisleAfterColumn: number;
  totalSeats: number;
  labelStyle: 'numeric' | 'alpha-row';
}

export interface Vehicle {
  _id: string;
  type: TransportType;
  name: string;
  operator: string;
  registrationNo?: string;
  seatLayout: SeatLayout;
  assignedVendor?: User | string | null;
  images: string[];
  isActive: boolean;
}

export interface Trip {
  _id: string;
  title: string;
  vehicle: Vehicle | string;
  vendor: User | string;
  transportType: TransportType;
  from: string;
  to: string;
  departureAt: string;
  arrivalAt?: string;
  pricePerSeat: number;
  totalSeats: number;
  perks: string[];
  images: string[];
  isAdvertised: boolean;
  isActive: boolean;
  createdAt: string;
}

export interface Seat {
  _id: string;
  seatNumber: string;
  status: SeatStatus;
  holdExpiresAt?: string | null;
}

export interface Booking {
  _id: string;
  user: string;
  trip: Trip;
  seatNumbers: string[];
  totalPrice: number;
  status: BookingStatus;
  holdExpiresAt: string;
  createdAt: string;
}

export interface Transaction {
  _id: string;
  transactionId: string;
  amount: number;
  currency: string;
  ticketTitle: string;
  paymentDate: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}
