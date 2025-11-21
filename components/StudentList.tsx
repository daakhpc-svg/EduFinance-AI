import React, { useState } from 'react';
import { Student, PaymentStatus, GradeLevel } from '../types';
import { Search, Filter, Plus, Mail } from 'lucide-react';

interface StudentListProps {
  students: Student[];
  onAddStudent: (student: Omit<Student, 'id' | 'paidFees' | 'status'>) => void;
  onRecordPayment: (studentId: string) => void;
}

const StudentList: React.FC<StudentListProps> = ({ students, onAddStudent, onRecordPayment }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('All');

  const filteredStudents = students.filter(student => {
    const matchesSearch = 
      student.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'All' || student.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: PaymentStatus) => {
    switch(status) {
      case PaymentStatus.PAID: return 'bg-emerald-100 text-emerald-800';
      case PaymentStatus.PARTIAL: return 'bg-amber-100 text-amber-800';
      case PaymentStatus.PENDING: return 'bg-blue-100 text-blue-800';
      case PaymentStatus.OVERDUE: return 'bg-rose-100 text-rose-800';
      default: return 'bg-slate-100 text-slate-800';
    }
  };

  // Simple Add Student Form State
  const [newStudent, setNewStudent] = useState({
    firstName: '',
    lastName: '',
    grade: GradeLevel.ELEMENTARY,
    parentName: '',
    parentEmail: '',
    contactNumber: '',
    totalFees: 0
  });

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddStudent(newStudent);
    setShowAddModal(false);
    setNewStudent({
       firstName: '', lastName: '', grade: GradeLevel.ELEMENTARY,
       parentName: '', parentEmail: '', contactNumber: '', totalFees: 0
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-slate-800">Student Directory</h2>
        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus size={18} />
          Add Student
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
          <input 
            type="text" 
            placeholder="Search by name or ID..." 
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter size={20} className="text-slate-400" />
          <select 
            className="border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="All">All Statuses</option>
            {Object.values(PaymentStatus).map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 text-slate-600 text-sm font-semibold">
              <tr>
                <th className="p-4">ID</th>
                <th className="p-4">Name</th>
                <th className="p-4">Grade</th>
                <th className="p-4">Parent Contact</th>
                <th className="p-4">Fee Status</th>
                <th className="p-4">Balance</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 text-sm">
              {filteredStudents.length > 0 ? (
                filteredStudents.map(student => (
                  <tr key={student.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 font-mono text-slate-500">{student.id}</td>
                    <td className="p-4 font-medium text-slate-900">{student.firstName} {student.lastName}</td>
                    <td className="p-4">{student.grade}</td>
                    <td className="p-4">
                      <div className="flex flex-col">
                        <span>{student.parentName}</span>
                        <span className="text-xs text-slate-500">{student.parentEmail}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(student.status)}`}>
                        {student.status}
                      </span>
                    </td>
                    <td className="p-4 font-medium">
                      ${(student.totalFees - student.paidFees).toLocaleString()}
                    </td>
                    <td className="p-4 text-right space-x-2">
                       <button 
                         onClick={() => onRecordPayment(student.id)}
                         className="text-indigo-600 hover:text-indigo-800 font-medium text-xs border border-indigo-200 hover:border-indigo-400 px-3 py-1 rounded"
                       >
                         Pay
                       </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-500">
                    No students found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6 animate-fade-in">
            <h3 className="text-xl font-bold mb-4">Register New Student</h3>
            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">First Name</label>
                  <input required type="text" className="w-full border rounded-lg p-2" value={newStudent.firstName} onChange={e => setNewStudent({...newStudent, firstName: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Last Name</label>
                  <input required type="text" className="w-full border rounded-lg p-2" value={newStudent.lastName} onChange={e => setNewStudent({...newStudent, lastName: e.target.value})} />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Grade</label>
                  <select className="w-full border rounded-lg p-2" value={newStudent.grade} onChange={e => setNewStudent({...newStudent, grade: e.target.value as GradeLevel})}>
                    {Object.values(GradeLevel).map(g => <option key={g} value={g}>{g}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Total Fees ($)</label>
                  <input required type="number" min="0" className="w-full border rounded-lg p-2" value={newStudent.totalFees} onChange={e => setNewStudent({...newStudent, totalFees: Number(e.target.value)})} />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Parent Name</label>
                <input required type="text" className="w-full border rounded-lg p-2" value={newStudent.parentName} onChange={e => setNewStudent({...newStudent, parentName: e.target.value})} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                  <input required type="email" className="w-full border rounded-lg p-2" value={newStudent.parentEmail} onChange={e => setNewStudent({...newStudent, parentEmail: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
                  <input required type="tel" className="w-full border rounded-lg p-2" value={newStudent.contactNumber} onChange={e => setNewStudent({...newStudent, contactNumber: e.target.value})} />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button type="button" onClick={() => setShowAddModal(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">Register</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentList;