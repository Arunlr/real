import { AdminLayout } from '../components/admin/AdminLayout';
import {
  Users, Search, Filter, UserCheck, UserX, Edit, Ban,
  CheckCircle, XCircle, Eye, MoreVertical, Shield, Award
} from 'lucide-react';
import { motion } from 'motion/react';
import { useState } from 'react';

export function AdminUserManagement() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'active' | 'banned' | 'contributors'>('all');
  const [selectedUser, setSelectedUser] = useState<number | null>(null);

  const users = [
    {
      id: 1,
      name: 'Rahul Sharma',
      email: 'rahul.sharma@example.com',
      avatar: 'RS',
      role: 'Contributor',
      status: 'active',
      joinedDate: '2024-01-15',
      reviews: 342,
      xp: 12450,
      trustScore: 94,
      verified: true,
      badges: ['Top Contributor', 'Verified User']
    },
    {
      id: 2,
      name: 'Priya Patel',
      email: 'priya.patel@example.com',
      avatar: 'PP',
      role: 'Contributor',
      status: 'active',
      joinedDate: '2024-02-10',
      reviews: 298,
      xp: 10890,
      trustScore: 91,
      verified: true,
      badges: ['Super Reviewer']
    },
    {
      id: 3,
      name: 'Amit Kumar',
      email: 'amit.kumar@example.com',
      avatar: 'AK',
      role: 'User',
      status: 'active',
      joinedDate: '2024-03-05',
      reviews: 45,
      xp: 1240,
      trustScore: 78,
      verified: false,
      badges: []
    },
    {
      id: 4,
      name: 'Sneha Singh',
      email: 'sneha.singh@example.com',
      avatar: 'SS',
      role: 'Contributor',
      status: 'active',
      joinedDate: '2024-01-20',
      reviews: 245,
      xp: 8765,
      trustScore: 88,
      verified: true,
      badges: ['Trusted Reviewer']
    },
    {
      id: 5,
      name: 'Vikas Gupta',
      email: 'vikas.gupta@example.com',
      avatar: 'VG',
      role: 'User',
      status: 'banned',
      joinedDate: '2024-04-12',
      reviews: 12,
      xp: 340,
      trustScore: 23,
      verified: false,
      badges: []
    },
  ];

  const stats = [
    { label: 'Total Users', value: '124,567', color: 'text-blue-400', icon: Users },
    { label: 'Active Contributors', value: '8,943', color: 'text-green-400', icon: UserCheck },
    { label: 'Pending Approvals', value: '156', color: 'text-yellow-400', icon: CheckCircle },
    { label: 'Banned Users', value: '234', color: 'text-red-400', icon: UserX },
  ];

  const handleUserAction = (userId: number, action: 'ban' | 'approve' | 'edit') => {
    console.log(`User ${userId} ${action}`);
    // Handle user action
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = selectedFilter === 'all' ||
                         (selectedFilter === 'active' && user.status === 'active') ||
                         (selectedFilter === 'banned' && user.status === 'banned') ||
                         (selectedFilter === 'contributors' && user.role === 'Contributor');
    return matchesSearch && matchesFilter;
  });

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <Users className="w-8 h-8 text-cyan-400" />
              User Management
            </h1>
            <p className="text-gray-400 mt-1">Manage users, contributors, and permissions</p>
          </div>
          <button className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg font-medium hover:shadow-lg hover:shadow-cyan-500/50 transition-all">
            Export User Data
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <h3 className={`text-2xl font-bold ${stat.color} mb-1`}>{stat.value}</h3>
                <p className="text-gray-400 text-sm">{stat.label}</p>
              </motion.div>
            );
          })}
        </div>

        {/* Filters and Search */}
        <div className="flex items-center justify-between gap-4">
          {/* Search Bar */}
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="text"
              placeholder="Search users by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
            />
          </div>

          {/* Filter Buttons */}
          <div className="flex items-center gap-2">
            {[
              { id: 'all', label: 'All Users' },
              { id: 'active', label: 'Active' },
              { id: 'banned', label: 'Banned' },
              { id: 'contributors', label: 'Contributors' },
            ].map((filter) => (
              <button
                key={filter.id}
                onClick={() => setSelectedFilter(filter.id as any)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  selectedFilter === filter.id
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/50'
                    : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>

          {/* Filter Icon */}
          <button className="p-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all">
            <Filter className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Users Table */}
        <div className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/5 border-b border-white/10">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">User</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Role</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Reviews</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">XP</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Trust Score</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Joined</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredUsers.map((user) => (
                  <motion.tr
                    key={user.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-white/5 transition-all"
                  >
                    {/* User Info */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center">
                          <span className="text-white font-bold text-sm">{user.avatar}</span>
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="text-white font-medium">{user.name}</p>
                            {user.verified && (
                              <Shield className="w-4 h-4 text-cyan-400" />
                            )}
                          </div>
                          <p className="text-gray-400 text-sm">{user.email}</p>
                        </div>
                      </div>
                    </td>

                    {/* Role */}
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        user.role === 'Contributor'
                          ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                          : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                      }`}>
                        {user.role}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 w-fit ${
                        user.status === 'active'
                          ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                          : 'bg-red-500/20 text-red-400 border border-red-500/30'
                      }`}>
                        <div className={`w-2 h-2 rounded-full ${
                          user.status === 'active' ? 'bg-green-400' : 'bg-red-400'
                        }`} />
                        {user.status}
                      </span>
                    </td>

                    {/* Reviews */}
                    <td className="px-6 py-4">
                      <p className="text-white font-medium">{user.reviews}</p>
                    </td>

                    {/* XP */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        <Award className="w-4 h-4 text-yellow-400" />
                        <p className="text-white font-medium">{user.xp.toLocaleString()}</p>
                      </div>
                    </td>

                    {/* Trust Score */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="flex-1">
                          <div className="w-24 bg-white/10 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full transition-all ${
                                user.trustScore > 80 ? 'bg-gradient-to-r from-green-500 to-emerald-500' :
                                user.trustScore > 50 ? 'bg-gradient-to-r from-yellow-500 to-amber-500' :
                                'bg-gradient-to-r from-red-500 to-orange-500'
                              }`}
                              style={{ width: `${user.trustScore}%` }}
                            />
                          </div>
                        </div>
                        <span className={`text-sm font-medium ${
                          user.trustScore > 80 ? 'text-green-400' :
                          user.trustScore > 50 ? 'text-yellow-400' :
                          'text-red-400'
                        }`}>
                          {user.trustScore}%
                        </span>
                      </div>
                    </td>

                    {/* Joined Date */}
                    <td className="px-6 py-4">
                      <p className="text-gray-400 text-sm">{user.joinedDate}</p>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleUserAction(user.id, 'edit')}
                          className="p-2 bg-blue-500/20 border border-blue-500/30 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-all"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleUserAction(user.id, 'edit')}
                          className="p-2 bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 rounded-lg hover:bg-cyan-500/30 transition-all"
                          title="Edit User"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleUserAction(user.id, 'ban')}
                          className={`p-2 rounded-lg transition-all ${
                            user.status === 'banned'
                              ? 'bg-green-500/20 border border-green-500/30 text-green-400 hover:bg-green-500/30'
                              : 'bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500/30'
                          }`}
                          title={user.status === 'banned' ? 'Unban User' : 'Ban User'}
                        >
                          <Ban className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-6 py-4 border-t border-white/10 flex items-center justify-between">
            <p className="text-gray-400 text-sm">Showing {filteredUsers.length} of {users.length} users</p>
            <div className="flex items-center gap-2">
              <button className="px-4 py-2 bg-white/5 text-gray-400 rounded-lg hover:bg-white/10 transition-all">
                Previous
              </button>
              <button className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg">
                1
              </button>
              <button className="px-4 py-2 bg-white/5 text-gray-400 rounded-lg hover:bg-white/10 transition-all">
                2
              </button>
              <button className="px-4 py-2 bg-white/5 text-gray-400 rounded-lg hover:bg-white/10 transition-all">
                3
              </button>
              <button className="px-4 py-2 bg-white/5 text-gray-400 rounded-lg hover:bg-white/10 transition-all">
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
