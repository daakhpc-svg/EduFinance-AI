import React, { useState, useEffect } from 'react';
import { Student } from '../types';
import { X } from 'lucide-react';

interface PaymentFormProps {
  student: Student | null;
  onClose: () => void;
  onSubmit: (amount: number, method: 'Cash' | 'Card' | 'Transfer', note: string) => void;
}

const PaymentForm: React.FC<PaymentFormProps> = ({ student, onClose, onSubmit }) => {
  const [amount, setAmount] = useState<string>('');
  const [method, setMethod] = useState<'Cash' | 'Card' | 'Transfer'>('Card');
  const [note, setNote] = useState('');

  useEffect(() => {
    if (student) {
      // Suggest the remaining balance
      setAmount((student.totalFees - student.paidFees).toString());
    }
  }, [student]);

  if (!student) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(Number(amount), method, note);
    onClose();
  };

  const outstanding = student.totalFees - student.paidFees;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-in-up">
        <div className="bg-indigo-600 p-6 flex justify-between items-center text-white">
          <h3 className="text-xl font-bold">Record Payment</h3>
          <button onClick={onClose} className="hover:bg-indigo-700 p-1 rounded-full transition-colors"><X size={20} /></button>
        </div>
        
        <div className="p-6">
          <div className="bg-slate-50 p-4 rounded-lg mb-6 border border-slate-100">
             <div className="flex justify-between mb-1">
               <span className="text-sm text-slate-500">Student</span>
               <span className="font-semibold text-slate-700">{student.firstName} {student.lastName}</span>
             </div>
             <div className="flex justify-between mb-1">
               <span className="text-sm text-slate-500">ID</span>
               <span className="text-sm text-slate-700">{student.id}</span>
             </div>
             <div className="flex justify-between mt-3 pt-3 border-t border-slate-200">
               <span className="text-sm font-medium text-slate-600">Outstanding Balance</span>
               <span className="font-bold text-rose-600">${outstanding.toLocaleString()}</span>
             </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Payment Amount ($)</label>
              <input 
                type="number" 
                max={outstanding}
                min={1}
                required 
                className="w-full border border-slate-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-lg font-semibold" 
                value={amount} 
                onChange={e => setAmount(e.target.value)} 
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Payment Method</label>
              <div className="grid grid-cols-3 gap-2">
                {['Cash', 'Card', 'Transfer'].map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setMethod(m as any)}
                    className={`py-2 px-3 rounded-lg text-sm font-medium transition-all border ${
                      method === m 
                        ? 'bg-indigo-50 border-indigo-500 text-indigo-700' 
                        : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Notes (Optional)</label>
              <textarea 
                className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 outline-none resize-none h-20"
                value={note}
                onChange={e => setNote(e.target.value)}
                placeholder="Check number, transaction ID, etc."
              />
            </div>

            <button 
              type="submit" 
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-lg shadow-lg shadow-indigo-200 transition-all mt-2 active:scale-95"
            >
              Confirm Payment
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PaymentForm;