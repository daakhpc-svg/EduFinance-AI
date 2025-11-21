import React, { useState, useEffect, useMemo } from 'react';
import { 
  Student, PaymentRecord, ViewState, DashboardStats, PaymentStatus, GradeLevel 
} from './types';
import { INITIAL_STUDENTS, INITIAL_PAYMENTS, NAV_ITEMS } from './constants';
import Dashboard from './components/Dashboard';
import StudentList from './components/StudentList';
import PaymentForm from './components/PaymentForm';
import Assistant from './components/Assistant';
import { LayoutDashboard, Users, CreditCard, Sparkles, School, LogOut, Menu } from 'lucide-react';

// Icon mapping helper
const IconMap: Record<string, React.ReactNode> = {
  LayoutDashboard: <LayoutDashboard size={20} />,
  Users: <Users size={20} />,
  CreditCard: <CreditCard size={20} />,
  Sparkles: <Sparkles size={20} />
};

const App: React.FC = () => {
  // --- Global State ---
  // In a real app, this would come from a backend or Context API
  const [students, setStudents] = useState<Student[]>(() => {
    const saved = localStorage.getItem('students');
    return saved ? JSON.parse(saved) : INITIAL_STUDENTS;
  });

  const [payments, setPayments] = useState<PaymentRecord[]>(() => {
    const saved = localStorage.getItem('payments');
    return saved ? JSON.parse(saved) : INITIAL_PAYMENTS;
  });

  const [currentView, setCurrentView] = useState<ViewState>('dashboard');
  const [selectedStudentForPayment, setSelectedStudentForPayment] = useState<Student | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Persistence effect
  useEffect(() => {
    localStorage.setItem('students', JSON.stringify(students));
    localStorage.setItem('payments', JSON.stringify(payments));
  }, [students, payments]);

  // --- Computed Stats ---
  const stats: DashboardStats = useMemo(() => {
    const totalStudents = students.length;
    const totalExpected = students.reduce((sum, s) => sum + s.totalFees, 0);
    const totalCollected = students.reduce((sum, s) => sum + s.paidFees, 0);
    const totalPending = totalExpected - totalCollected;

    return { totalStudents, totalExpected, totalCollected, totalPending };
  }, [students]);

  // --- Handlers ---

  const handleAddStudent = (newStudentData: Omit<Student, 'id' | 'paidFees' | 'status'>) => {
    const newStudent: Student = {
      ...newStudentData,
      id: `ST-${(students.length + 1).toString().padStart(3, '0')}`,
      paidFees: 0,
      status: PaymentStatus.PENDING
    };
    setStudents([...students, newStudent]);
  };

  const handleRecordPayment = (amount: number, method: 'Cash' | 'Card' | 'Transfer', note: string) => {
    if (!selectedStudentForPayment) return;

    // Create payment record
    const newPayment: PaymentRecord = {
      id: `PAY-${Date.now()}`,
      studentId: selectedStudentForPayment.id,
      amount,
      date: new Date().toISOString().split('T')[0],
      method,
      note
    };

    // Update student
    const updatedStudents = students.map(s => {
      if (s.id === selectedStudentForPayment.id) {
        const newPaid = s.paidFees + amount;
        let newStatus = s.status;
        if (newPaid >= s.totalFees) newStatus = PaymentStatus.PAID;
        else if (newPaid > 0) newStatus = PaymentStatus.PARTIAL;
        
        return { ...s, paidFees: newPaid, status: newStatus };
      }
      return s;
    });

    setPayments([newPayment, ...payments]);
    setStudents(updatedStudents);
    setSelectedStudentForPayment(null);
  };

  const openPaymentModal = (studentId: string) => {
    const student = students.find(s => s.id === studentId);
    if (student) setSelectedStudentForPayment(student);
  };

  // --- Render ---

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans text-slate-900">
      
      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-slate-200 transform transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0
      `}>
        <div className="h-full flex flex-col">
          <div className="p-6 flex items-center gap-3 border-b border-slate-100">
            <div className="bg-indigo-600 p-2 rounded-lg text-white">
              <School size={24} />
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">
              EduFinance
            </h1>
          </div>

          <nav className="flex-1 p-4 space-y-1">
            {NAV_ITEMS.map(item => (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentView(item.id as ViewState);
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                  currentView === item.id 
                    ? 'bg-indigo-50 text-indigo-700 shadow-sm' 
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                {IconMap[item.icon]}
                {item.label}
              </button>
            ))}
          </nav>

          <div className="p-4 border-t border-slate-100">
            <button className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-rose-600 hover:bg-rose-50 rounded-lg transition-colors">
              <LogOut size={20} />
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 md:ml-64 flex flex-col min-h-screen">
        
        {/* Mobile Header */}
        <header className="md:hidden bg-white border-b border-slate-200 p-4 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-2">
             <div className="bg-indigo-600 p-1.5 rounded text-white"><School size={20} /></div>
             <span className="font-bold text-slate-800">EduFinance</span>
          </div>
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg">
            <Menu size={24} />
          </button>
        </header>

        {/* View Content */}
        <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full">
          {currentView === 'dashboard' && <Dashboard stats={stats} students={students} />}
          {currentView === 'students' && (
            <StudentList 
              students={students} 
              onAddStudent={handleAddStudent} 
              onRecordPayment={openPaymentModal} 
            />
          )}
          {currentView === 'payments' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-slate-800">Recent Transactions</h2>
              <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-slate-50 text-slate-600 text-sm">
                    <tr>
                      <th className="p-4">Payment ID</th>
                      <th className="p-4">Student ID</th>
                      <th className="p-4">Date</th>
                      <th className="p-4">Amount</th>
                      <th className="p-4">Method</th>
                      <th className="p-4">Note</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700 text-sm">
                    {payments.length === 0 ? (
                       <tr><td colSpan={6} className="p-8 text-center text-slate-500">No payments recorded yet.</td></tr>
                    ) : (
                      payments.map(p => (
                        <tr key={p.id}>
                          <td className="p-4 font-mono text-slate-500">{p.id}</td>
                          <td className="p-4">{p.studentId}</td>
                          <td className="p-4">{p.date}</td>
                          <td className="p-4 font-medium text-emerald-600">+${p.amount.toLocaleString()}</td>
                          <td className="p-4"><span className="bg-slate-100 px-2 py-1 rounded text-xs">{p.method}</span></td>
                          <td className="p-4 text-slate-500 truncate max-w-xs">{p.note || '-'}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          {currentView === 'assistant' && <Assistant students={students} payments={payments} />}
        </main>
      </div>

      {/* Payment Modal */}
      {selectedStudentForPayment && (
        <PaymentForm 
          student={selectedStudentForPayment}
          onClose={() => setSelectedStudentForPayment(null)}
          onSubmit={handleRecordPayment}
        />
      )}
    </div>
  );
};

export default App;