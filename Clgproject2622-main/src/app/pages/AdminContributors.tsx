import { AdminLayout } from '../components/admin/AdminLayout';
import { UserCheck, Search, Star, Award, TrendingUp, MapPin, Shield, CheckCircle, XCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { useState } from 'react';

const contributors = [
  { id: 1, name: 'Rahul Sharma', email: 'rahul.sharma@example.com', avatar: 'RS', city: 'Bangalore', reviews: 342, xp: 12450, trustScore: 94, level: 'Gold', verified: true, joinedDate: '2024-01-15', status: 'active' },
  { id: 2, name: 'Priya Patel', email: 'priya.patel@example.com', avatar: 'PP', city: 'Mumbai', reviews: 298, xp: 10890, trustScore: 91, level: 'Gold', verified: true, joinedDate: '2024-02-10', status: 'active' },
  { id: 3, name: 'Amit Kumar', email: 'amit.kumar@example.com', avatar: 'AK', city: 'Delhi', reviews: 201, xp: 7650, trustScore: 87, level: 'Silver', verified: true, joinedDate: '2024-03-05', status: 'active' },
  { id: 4, name: 'Sneha Reddy', email: 'sneha.reddy@example.com', avatar: 'SR', city: 'Hyderabad', reviews: 178, xp: 6200, trustScore: 83, level: 'Silver', verified: false, joinedDate: '2024-03-20', status: 'pending' },
  { id: 5, name: 'Vikram Singh', email: 'vikram.singh@example.com', avatar: 'VS', city: 'Pune', reviews: 145, xp: 4900, trustScore: 79, level: 'Bronze', verified: true, joinedDate: '2024-04-01', status: 'active' },
  { id: 6, name: 'Anjali Mehra', email: 'anjali.mehra@example.com', avatar: 'AM', city: 'Chennai', reviews: 112, xp: 3800, trustScore: 75, level: 'Bronze', verified: false, joinedDate: '2024-04-15', status: 'suspended' },
];

const levelColors: Record<string, string> = {
  Gold: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30',
  Silver: 'text-gray-300 bg-gray-300/10 border-gray-300/30',
  Bronze: 'text-orange-400 bg-orange-400/10 border-orange-400/30',
};

const statusColors: Record<string, string> = {
  active: 'text-green-400 bg-green-400/10',
  pending: 'text-yellow-400 bg-yellow-400/10',
  suspended: 'text-red-400 bg-red-400/10',
};

export function AdminContributors() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'pending' | 'suspended'>('all');

  const filtered = contributors.filter(c => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.city.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'all' || c.status === filter;
    return matchSearch && matchFilter;
  });

  const stats = [
    { label: 'Total Contributors', value: contributors.length, icon: UserCheck, color: 'from-cyan-500 to-blue-500' },
    { label: 'Active', value: contributors.filter(c => c.status === 'active').length, icon: CheckCircle, color: 'from-green-500 to-emerald-500' },
    { label: 'Pending Verification', value: contributors.filter(c => c.status === 'pending').length, icon: Shield, color: 'from-yellow-500 to-amber-500' },
    { label: 'Avg Trust Score', value: Math.round(contributors.reduce((a, c) => a + c.trustScore, 0) / contributors.length) + '%', icon: Star, color: 'from-purple-500 to-pink-500' },
  ];

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Contributors</h1>
            <p className="text-gray-400 mt-1">Manage verified local contributors</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((s, i) => {
            const Icon = s.icon;
            return (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="bg-white/5 border border-white/10 rounded-2xl p-4"
              >
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center mb-3`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <p className="text-2xl font-bold text-white">{s.value}</p>
                <p className="text-xs text-gray-400 mt-1">{s.label}</p>
              </motion.div>
            );
          })}
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by name, email or city..."
              className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 text-sm focus:outline-none focus:border-cyan-500/50"
            />
          </div>
          <div className="flex gap-2">
            {(['all', 'active', 'pending', 'suspended'] as const).map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all capitalize ${
                  filter === f
                    ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40'
                    : 'bg-white/5 text-gray-400 border border-white/10 hover:text-white'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  {['Contributor', 'City', 'Reviews', 'XP', 'Trust Score', 'Level', 'Status', 'Verified'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filtered.map((c, i) => (
                  <motion.tr
                    key={c.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className="hover:bg-white/5 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                          {c.avatar}
                        </div>
                        <div>
                          <p className="text-white text-sm font-medium">{c.name}</p>
                          <p className="text-gray-500 text-xs">{c.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 text-gray-300 text-sm">
                        <MapPin className="w-3 h-3 text-gray-500" />
                        {c.city}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-white text-sm font-medium">{c.reviews}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 text-cyan-400 text-sm font-medium">
                        <TrendingUp className="w-3 h-3" />
                        {c.xp.toLocaleString()}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 bg-white/10 rounded-full w-16">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-500"
                            style={{ width: `${c.trustScore}%` }}
                          />
                        </div>
                        <span className="text-white text-sm font-medium">{c.trustScore}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${levelColors[c.level]}`}>
                        <Award className="w-3 h-3 inline mr-1" />
                        {c.level}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${statusColors[c.status]}`}>
                        {c.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {c.verified
                        ? <CheckCircle className="w-5 h-5 text-green-400" />
                        : <XCircle className="w-5 h-5 text-gray-600" />}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div className="py-12 text-center text-gray-500">No contributors match your search.</div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
