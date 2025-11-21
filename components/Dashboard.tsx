import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
  PieChart, Pie, Cell 
} from 'recharts';
import { DashboardStats, PaymentStatus, Student } from '../types';
import { Users, DollarSign, AlertCircle, CheckCircle } from 'lucide-react';

interface DashboardProps {
  stats: DashboardStats;
  students: Student[];
}

const COLORS = ['#10b981', '#f59e0b', '#ef4444', '#3b82f6'];

const StatCard: React.FC<{ title: string; value: string; icon: React.ReactNode; color: string }> = ({ title, value, icon, color }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center space-x-4 hover:shadow-md transition-shadow">
    <div className={`p-4 rounded-full ${color} text-white`}>
      {icon}
    </div>
    <div>
      <p className="text-sm text-slate-500 font-medium">{title}</p>
      <h3 className="text-2xl font-bold text-slate-800">{value}</h3>
    </div>
  </div>
);

const Dashboard: React.FC<DashboardProps> = ({ stats, students }) => {
  // Prepare data for charts
  const statusCounts = students.reduce((acc, student) => {
    acc[student.status] = (acc[student.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const pieData = Object.keys(statusCounts).map(status => ({
    name: status,
    value: statusCounts[status]
  }));

  const gradeFinancials = students.reduce((acc, student) => {
    const existing = acc.find(item => item.name === student.grade);
    if (existing) {
      existing.collected += student.paidFees;
      existing.pending += (student.totalFees - student.paidFees);
    } else {
      acc.push({
        name: student.grade,
        collected: student.paidFees,
        pending: student.totalFees - student.paidFees
      });
    }
    return acc;
  }, [] as { name: string; collected: number; pending: number }[]);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Dashboard Overview</h2>
        <p className="text-slate-500">Welcome back, Administrator.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Students" 
          value={stats.totalStudents.toString()} 
          icon={<Users size={24} />} 
          color="bg-blue-500" 
        />
        <StatCard 
          title="Expected Revenue" 
          value={`$${stats.totalExpected.toLocaleString()}`} 
          icon={<DollarSign size={24} />} 
          color="bg-indigo-500" 
        />
        <StatCard 
          title="Collected Fees" 
          value={`$${stats.totalCollected.toLocaleString()}`} 
          icon={<CheckCircle size={24} />} 
          color="bg-emerald-500" 
        />
        <StatCard 
          title="Pending Fees" 
          value={`$${stats.totalPending.toLocaleString()}`} 
          icon={<AlertCircle size={24} />} 
          color="bg-rose-500" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Payment Status Distribution */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Payment Status Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Financials by Grade */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Financials by Grade Level</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={gradeFinancials}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tick={{fontSize: 12}} />
                <YAxis />
                <Tooltip cursor={{fill: 'transparent'}} />
                <Legend />
                <Bar dataKey="collected" name="Collected" stackId="a" fill="#10b981" radius={[0, 0, 4, 4]} />
                <Bar dataKey="pending" name="Pending" stackId="a" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;