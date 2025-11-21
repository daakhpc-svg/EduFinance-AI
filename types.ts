export enum GradeLevel {
  KINDERGARTEN = 'Kindergarten',
  ELEMENTARY = 'Elementary',
  MIDDLE_SCHOOL = 'Middle School',
  HIGH_SCHOOL = 'High School'
}

export enum PaymentStatus {
  PAID = 'Paid',
  PARTIAL = 'Partial',
  PENDING = 'Pending',
  OVERDUE = 'Overdue'
}

export interface Student {
  id: string;
  firstName: string;
  lastName: string;
  grade: GradeLevel;
  parentName: string;
  parentEmail: string;
  contactNumber: string;
  totalFees: number;
  paidFees: number;
  status: PaymentStatus;
}

export interface PaymentRecord {
  id: string;
  studentId: string;
  amount: number;
  date: string;
  method: 'Cash' | 'Card' | 'Transfer';
  note?: string;
}

export interface DashboardStats {
  totalStudents: number;
  totalExpected: number;
  totalCollected: number;
  totalPending: number;
}

export type ViewState = 'dashboard' | 'students' | 'payments' | 'assistant';

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}