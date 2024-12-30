import React, { useState } from 'react';
import {
  Users, Settings2, Shield, Activity, UserPlus, 
  UserMinus, CheckCircle, XCircle, Search, Filter,
  ChevronDown, Bell, User, LogOut, ChevronLeft
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Define types
type AccessRequestStatus = 'pending' | 'approved' | 'denied';
type UserStatus = 'active' | 'inactive';
type UserRole = 'Admin' | 'User' | 'Manager' | 'Engineer' | 'Inspector' | 'Technician';
type Section = 'Users' | 'Access' | 'Activity' | 'Settings';

interface AccessRequest {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  status: AccessRequestStatus;
  date: string;
}

interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  lastActive: string;
}

interface MenuItem {
  id: Section;
  icon: React.FC<any>;
  label: string;
  color: string;
}

const AdminDashboard: React.FC = () => {
  const [isNavCollapsed, setIsNavCollapsed] = useState<boolean>(false);
  const [activeSection, setActiveSection] = useState<Section>('Users');
  const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<'all' | UserStatus>('all');

  // Mock data for pending access requests
  const [accessRequests, setAccessRequests] = useState<AccessRequest[]>([
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Engineer', status: 'pending', date: '2024-12-25' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'Inspector', status: 'pending', date: '2024-12-26' },
    { id: 3, name: 'Mike Johnson', email: 'mike@example.com', role: 'Technician', status: 'approved', date: '2024-12-27' },
  ]);

  // Mock data for user management
  const [users, setUsers] = useState<User[]>([
    { id: 1, name: 'Alice Cooper', email: 'alice@example.com', role: 'Admin', status: 'active', lastActive: '2024-12-28' },
    { id: 2, name: 'Bob Wilson', email: 'bob@example.com', role: 'User', status: 'inactive', lastActive: '2024-12-27' },
    { id: 3, name: 'Carol Smith', email: 'carol@example.com', role: 'Manager', status: 'active', lastActive: '2024-12-28' },
  ]);

  const menuItems: MenuItem[] = [
    { id: 'Users', icon: Users, label: 'User Management', color: 'text-[#FFC857]' },
    { id: 'Access', icon: Shield, label: 'Access Control', color: 'text-[#FFC857]' },
    { id: 'Activity', icon: Activity, label: 'User Activity', color: 'text-[#FFC857]' },
    { id: 'Settings', icon: Settings2, label: 'Admin Settings', color: 'text-[#4A90E2]' },
  ];

  const handleAccessRequest = (id: number, status: AccessRequestStatus): void => {
    setAccessRequests(requests =>
      requests.map(request =>
        request.id === id ? { ...request, status } : request
      )
    );
  };

  const handleUserStatus = (id: number, status: UserStatus): void => {
    setUsers(currentUsers =>
      currentUsers.map(user =>
        user.id === id ? { ...user, status } : user
      )
    );
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'all' || user.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const renderMenuItem = (item: MenuItem) => {
    const isActive = activeSection === item.id;
    
    return (
      <motion.li key={item.id} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
        <button
          onClick={() => setActiveSection(item.id)}
          className={`flex w-full items-center gap-3 py-3 rounded-lg transition-all duration-200 group 
            ${isActive ? 'bg-gradient-to-r from-[#282828] to-[#1E1E1E] text-[#E0E0E0] shadow-lg' : 'text-[#9A9A9A] hover:bg-[#282828]/50'}
            ${!isNavCollapsed ? 'px-4' : 'justify-center px-2'}`}
        >
          <div className={`relative ${isActive ? 'text-[#FFC857]' : item.color}`}>
            <item.icon className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
            {isActive && !isNavCollapsed && (
              <motion.div
                layoutId="active-indicator"
                className="absolute -left-2 top-1/2 -translate-y-1/2 w-1 h-4 bg-[#FFC857] rounded-r-full"
              />
            )}
          </div>
          {!isNavCollapsed && (
            <span className={`flex-1 truncate ${isActive ? 'font-medium' : ''}`}>{item.label}</span>
          )}
        </button>
      </motion.li>
    );
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'Users':
        return (
          <Card className="bg-gradient-to-b from-[#1E1E1E] to-[#181818] border-[#282828]">
            <CardHeader>
              <CardTitle className="text-[#E0E0E0]">User Management</CardTitle>
              <CardDescription className="text-[#9A9A9A]">
                Manage user accounts and permissions
              </CardDescription>
              <div className="flex items-center gap-4 mt-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#9A9A9A] w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-[#282828] border border-[#383838] rounded-lg text-[#E0E0E0] placeholder-[#9A9A9A] focus:outline-none focus:border-[#FFC857]"
                  />
                </div>
                <div className="relative">
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value as 'all' | UserStatus)}
                    className="appearance-none pl-4 pr-10 py-2 bg-[#282828] border border-[#383838] rounded-lg text-[#E0E0E0] focus:outline-none focus:border-[#FFC857]"
                  >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                  <Filter className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#9A9A9A] w-4 h-4" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="border-[#282828]">
                    <TableHead className="text-[#9A9A9A]">Name</TableHead>
                    <TableHead className="text-[#9A9A9A]">Email</TableHead>
                    <TableHead className="text-[#9A9A9A]">Role</TableHead>
                    <TableHead className="text-[#9A9A9A]">Status</TableHead>
                    <TableHead className="text-[#9A9A9A]">Last Active</TableHead>
                    <TableHead className="text-[#9A9A9A]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id} className="border-[#282828]">
                      <TableCell className="text-[#E0E0E0]">{user.name}</TableCell>
                      <TableCell className="text-[#E0E0E0]">{user.email}</TableCell>
                      <TableCell className="text-[#E0E0E0]">{user.role}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          user.status === 'active' ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'
                        }`}>
                          {user.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-[#E0E0E0]">{user.lastActive}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {user.status === 'active' ? (
                            <button
                              onClick={() => handleUserStatus(user.id, 'inactive')}
                              className="p-1 text-red-500 hover:bg-red-500/20 rounded-lg transition-colors"
                            >
                              <UserMinus className="w-4 h-4" />
                            </button>
                          ) : (
                            <button
                              onClick={() => handleUserStatus(user.id, 'active')}
                              className="p-1 text-green-500 hover:bg-green-500/20 rounded-lg transition-colors"
                            >
                              <UserPlus className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        );

      case 'Access':
        return (
          <Card className="bg-gradient-to-b from-[#1E1E1E] to-[#181818] border-[#282828]">
            <CardHeader>
              <CardTitle className="text-[#E0E0E0]">Access Requests</CardTitle>
              <CardDescription className="text-[#9A9A9A]">
                Manage pending access requests
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="border-[#282828]">
                    <TableHead className="text-[#9A9A9A]">Name</TableHead>
                    <TableHead className="text-[#9A9A9A]">Email</TableHead>
                    <TableHead className="text-[#9A9A9A]">Role</TableHead>
                    <TableHead className="text-[#9A9A9A]">Date</TableHead>
                    <TableHead className="text-[#9A9A9A]">Status</TableHead>
                    <TableHead className="text-[#9A9A9A]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {accessRequests.map((request) => (
                    <TableRow key={request.id} className="border-[#282828]">
                      <TableCell className="text-[#E0E0E0]">{request.name}</TableCell>
                      <TableCell className="text-[#E0E0E0]">{request.email}</TableCell>
                      <TableCell className="text-[#E0E0E0]">{request.role}</TableCell>
                      <TableCell className="text-[#E0E0E0]">{request.date}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          request.status === 'approved' ? 'bg-green-500/20 text-green-500' :
                          request.status === 'denied' ? 'bg-red-500/20 text-red-500' :
                          'bg-yellow-500/20 text-yellow-500'
                        }`}>
                          {request.status}
                        </span>
                      </TableCell>
                      <TableCell>
                        {request.status === 'pending' && (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleAccessRequest(request.id, 'approved')}
                              className="p-1 text-green-500 hover:bg-green-500/20 rounded-lg transition-colors"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleAccessRequest(request.id, 'denied')}
                              className="p-1 text-red-500 hover:bg-red-500/20 rounded-lg transition-colors"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        );

      case 'Activity':
      case 'Settings':
        return (
          <Card className="bg-gradient-to-b from-[#1E1E1E] to-[#181818] border-[#282828]">
            <CardHeader>
              <CardTitle className="text-[#E0E0E0]">{activeSection}</CardTitle>
              <CardDescription className="text-[#9A9A9A]">
                This section is under development
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center text-center space-y-6 py-12">
                <div className="w-24 h-24 bg-gradient-to-br from-[#282828] to-[#1E1E1E] rounded-full flex items-center justify-center shadow-xl">
                  <Settings2 className="w-12 h-12 text-[#FFC857]" />
                </div>
                <div className="space-y-4">
                  <h3 className="text-2xl font-bold text-[#E0E0E0]">Coming Soon</h3>
                  <p className="text-[#9A9A9A]">This feature is currently under development.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        );
    }
  };

  return (
    <div className="flex min-h-screen bg-[#181818]">
      {/* Sidebar */}
      <motion.nav
        animate={{ width: isNavCollapsed ? '4rem' : '16rem' }}
        className="bg-gradient-to-r from-[#181818] to-[#1E1E1E] h-screen fixed left-0 top-0 border-r border-[#282828] z-20 shadow-xl"
      >
        <div className="flex items-center justify-between h-16 px-6 border-b border-[#282828] bg-gradient-to-r from-[#1E1E1E] to-[#282828]">
          {!isNavCollapsed && (
            <motion.span className="text-xl font-bold bg-gradient-to-r from-[#FFC857] to-[#4A90E2] bg-clip-text text-transparent">
              Admin Panel
            </motion.span>
          )}
          <button
            onClick={() => setIsNavCollapsed(!isNavCollapsed)}
            className="p-1.5 rounded-lg hover:bg-[#282828] transition-colors"
          >
            <ChevronLeft className={`w-5 h-5 text-[#E0E0E0] transform transition-transform ${isNavCollapsed ? 'rotate-180' : ''}`} />
          </button>
        </div>

        <div className="px-2 py-6 h-[calc(100vh-4rem)] overflow-y-auto">
          <ul className="space-y-2">
            {menuItems.map(item => renderMenuItem(item))}
          </ul>
        </div>
      </motion.nav>

      {/* Main Content */}
      <div className={`flex-1 ${isNavCollapsed ? 'ml-16' : 'ml-64'} transition-all duration-300`}>
        {/* Header */}
        <header 
          className="fixed right-0 bg-gradient-to-r from-[#181818] to-[#1E1E1E] h-16 flex items-center justify-end px-6 border-b border-[#282828] shadow-lg z-10 backdrop-blur-sm bg-opacity-95"
          style={{ width: `calc(100% - ${isNavCollapsed ? '4rem' : '16rem'})` }}
        >
          <div className="flex items-center gap-4">
            <motion.button 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="relative p-2 text-[#9A9A9A] hover:bg-[#282828] rounded-full transition-all duration-200 hover:text-[#E0E0E0]"
            >
              <Bell className="w-6 h-6" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-[#FFC857] rounded-full animate-pulse"></span>
            </motion.button>

            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2 p-2 text-[#9A9A9A] hover:bg-[#282828] rounded-lg transition-all duration-200 hover:text-[#E0E0E0]"
              >
                <div className="w-8 h-8 bg-gradient-to-tr from-[#FFC857] to-[#4A90E2] rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-[#E0E0E0]" />
                </div>
                <span className="font-medium">Admin</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
              </motion.button>

              <AnimatePresence>
                {isProfileOpen && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    className="absolute right-0 mt-2 w-48 bg-[#1E1E1E] rounded-lg shadow-xl border border-[#282828] overflow-hidden"
                  >
                    <div className="py-1">
                      <motion.button
                        whileHover={{ backgroundColor: '#282828' }}
                        className="flex items-center gap-2 px-4 py-2 text-red-400 w-full transition-all duration-200 hover:text-red-300"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Logout</span>
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="pt-20 p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-[#E0E0E0]">
              {activeSection === 'Users' && 'User Management Dashboard'}
              {activeSection === 'Access' && 'Access Control Center'}
              {activeSection === 'Activity' && 'User Activity Monitor'}
              {activeSection === 'Settings' && 'Admin Settings'}
            </h1>
            <p className="text-[#9A9A9A] mt-2">
              {activeSection === 'Users' && 'Manage and monitor user accounts'}
              {activeSection === 'Access' && 'Control user access and permissions'}
              {activeSection === 'Activity' && 'Track and analyze user activities'}
              {activeSection === 'Settings' && 'Configure admin panel settings'}
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 gap-6"
          >
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              <Card className="bg-gradient-to-b from-[#1E1E1E] to-[#181818] border-[#282828]">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-[#9A9A9A]">Total Users</p>
                      <h3 className="text-2xl font-bold text-[#E0E0E0] mt-1">{users.length}</h3>
                    </div>
                    <div className="w-12 h-12 bg-[#FFC857]/10 rounded-full flex items-center justify-center">
                      <Users className="w-6 h-6 text-[#FFC857]" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-b from-[#1E1E1E] to-[#181818] border-[#282828]">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-[#9A9A9A]">Active Users</p>
                      <h3 className="text-2xl font-bold text-[#E0E0E0] mt-1">
                        {users.filter(user => user.status === 'active').length}
                      </h3>
                    </div>
                    <div className="w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center">
                      <UserPlus className="w-6 h-6 text-green-500" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-b from-[#1E1E1E] to-[#181818] border-[#282828]">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-[#9A9A9A]">Pending Requests</p>
                      <h3 className="text-2xl font-bold text-[#E0E0E0] mt-1">
                        {accessRequests.filter(req => req.status === 'pending').length}
                      </h3>
                    </div>
                    <div className="w-12 h-12 bg-yellow-500/10 rounded-full flex items-center justify-center">
                      <Shield className="w-6 h-6 text-yellow-500" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-b from-[#1E1E1E] to-[#181818] border-[#282828]">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-[#9A9A9A]">System Status</p>
                      <h3 className="text-2xl font-bold text-[#E0E0E0] mt-1">Active</h3>
                    </div>
                    <div className="w-12 h-12 bg-[#4A90E2]/10 rounded-full flex items-center justify-center">
                      <Activity className="w-6 h-6 text-[#4A90E2]" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Dynamic Content */}
            {renderContent()}
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;