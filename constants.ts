import { GradeLevel, PaymentStatus, Student, PaymentRecord } from './types';

export const INITIAL_STUDENTS: Student[] = [
  {
    id: 'ST-001',
    firstName: 'Emma',
    lastName: 'Thompson',
    grade: GradeLevel.HIGH_SCHOOL,
    parentName: 'Sarah Thompson',
    parentEmail: 'sarah.t@example.com',
    contactNumber: '555-0101',
    totalFees: 5000,
    paidFees: 5000,
    status: PaymentStatus.PAID
  },
  {
    id: 'ST-002',
    firstName: 'Liam',
    lastName: 'Chen',
    grade: GradeLevel.MIDDLE_SCHOOL,
    parentName: 'David Chen',
    parentEmail: 'david.c@example.com',
    contactNumber: '555-0102',
    totalFees: 4500,
    paidFees: 2000,
    status: PaymentStatus.PARTIAL
  },
  {
    id: 'ST-003',
    firstName: 'Sophia',
    lastName: 'Rodriguez',
    grade: GradeLevel.ELEMENTARY,
    parentName: 'Maria Rodriguez',
    parentEmail: 'maria.r@example.com',
    contactNumber: '555-0103',
    totalFees: 3800,
    paidFees: 0,
    status: PaymentStatus.OVERDUE
  },
  {
    id: 'ST-004',
    firstName: 'Noah',
    lastName: 'Kim',
    grade: GradeLevel.KINDERGARTEN,
    parentName: 'Jun Kim',
    parentEmail: 'jun.k@example.com',
    contactNumber: '555-0104',
    totalFees: 3200,
    paidFees: 3200,
    status: PaymentStatus.PAID
  },
  {
    id: 'ST-005',
    firstName: 'Olivia',
    lastName: 'Wilson',
    grade: GradeLevel.HIGH_SCHOOL,
    parentName: 'James Wilson',
    parentEmail: 'james.w@example.com',
    contactNumber: '555-0105',
    totalFees: 5000,
    paidFees: 1000,
    status: PaymentStatus.PENDING
  }
];

export const INITIAL_PAYMENTS: PaymentRecord[] = [
  {
    id: 'PAY-001',
    studentId: 'ST-001',
    amount: 5000,
    date: '2023-09-01',
    method: 'Transfer',
    note: 'Full term payment'
  },
  {
    id: 'PAY-002',
    studentId: 'ST-002',
    amount: 2000,
    date: '2023-09-05',
    method: 'Card',
    note: 'First installment'
  },
  {
    id: 'PAY-004',
    studentId: 'ST-004',
    amount: 3200,
    date: '2023-09-02',
    method: 'Cash',
    note: 'Full year'
  }
];

export const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: 'LayoutDashboard' },
  { id: 'students', label: 'Students', icon: 'Users' },
  { id: 'payments', label: 'Fees & Payments', icon: 'CreditCard' },
  { id: 'assistant', label: 'AI Assistant', icon: 'Sparkles' },
];