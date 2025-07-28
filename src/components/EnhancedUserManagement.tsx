// src/components/EnhancedUserManagement.tsx
import React, { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { 
  Users, 
  Plus, 
  Edit, 
  Trash2, 
  Shield, 
  ShieldCheck, 
  Mail, 
  Search,
  UserPlus,
  Ban,
  Check,
  X,
  Eye,
  Calendar,
  CreditCard,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  Filter
} from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user' | 'moderator';
  status: 'active' | 'inactive' | 'banned';
  joinDate: string;
  lastLogin: string;
  totalBookings: number;
  totalSpent: number;
  avatar?: string;
}

interface UserFilters {
  searchTerm: string;
  selectedRole: string;
  selectedStatus: string;
  dateFrom: string;
  dateTo: string;
  sortBy: 'name' | 'email' | 'joinDate' | 'lastLogin' | 'totalBookings' | 'totalSpent';
  sortOrder: 'asc' | 'desc';
}

interface EnhancedUserManagementProps {
  className?: string;
}

const EnhancedUserManagement: React.FC<EnhancedUserManagementProps> = ({ className }) => {
  const { toast } = useToast();
  
  // Sample user data - in a real app, this would come from an API
  const [users, setUsers] = useState<User[]>([
    {
      id: 'user_1',
      name: 'John Doe',
      email: 'john@example.com',
      role: 'user',
      status: 'active',
      joinDate: '2024-01-15',
      lastLogin: '2024-07-18',
      totalBookings: 5,
      totalSpent: 750,
    },
    {
      id: 'user_2',
      name: 'Jane Smith',
      email: 'jane@example.com',
      role: 'moderator',
      status: 'active',
      joinDate: '2024-02-10',
      lastLogin: '2024-07-19',
      totalBookings: 12,
      totalSpent: 1200,
    },
    {
      id: 'user_3',
      name: 'Admin User',
      email: 'admin@example.com',
      role: 'admin',
      status: 'active',
      joinDate: '2024-01-01',
      lastLogin: '2024-07-19',
      totalBookings: 0,
      totalSpent: 0,
    },
    {
      id: 'user_4',
      name: 'Bob Wilson',
      email: 'bob@example.com',
      role: 'user',
      status: 'inactive',
      joinDate: '2024-03-20',
      lastLogin: '2024-06-15',
      totalBookings: 3,
      totalSpent: 450,
    },
    {
      id: 'user_5',
      name: 'Alice Johnson',
      email: 'alice@example.com',
      role: 'user',
      status: 'banned',
      joinDate: '2024-04-12',
      lastLogin: '2024-05-20',
      totalBookings: 2,
      totalSpent: 100,
    },
    {
      id: 'user_6',
      name: 'Mike Brown',
      email: 'mike@example.com',
      role: 'moderator',
      status: 'active',
      joinDate: '2024-03-05',
      lastLogin: '2024-07-17',
      totalBookings: 8,
      totalSpent: 980,
    },
    {
      id: 'user_7',
      name: 'Sarah Davis',
      email: 'sarah@example.com',
      role: 'user',
      status: 'active',
      joinDate: '2024-05-18',
      lastLogin: '2024-07-19',
      totalBookings: 15,
      totalSpent: 2100,
    },
    {
      id: 'user_8',
      name: 'Tom Miller',
      email: 'tom@example.com',
      role: 'user',
      status: 'inactive',
      joinDate: '2024-02-28',
      lastLogin: '2024-06-30',
      totalBookings: 1,
      totalSpent: 50,
    }
  ]);

  // Mobile view toggle
  const [isMobileView, setIsMobileView] = useState(false);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Check for mobile view
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobileView(window.innerWidth < 768);
    };
    
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  // Filters state
  const [filters, setFilters] = useState<UserFilters>({
    searchTerm: '',
    selectedRole: 'all',
    selectedStatus: 'all',
    dateFrom: '',
    dateTo: '',
    sortBy: 'name',
    sortOrder: 'asc'
  });

  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: 'user' as User['role'],
    status: 'active' as User['status'],
  });

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10);

  // Filter and sort users
  const filteredAndSortedUsers = useMemo(() => {
    let filtered = users.filter(user => {
      // Search filter
      const matchesSearch = filters.searchTerm === '' || 
        user.name.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(filters.searchTerm.toLowerCase());
      
      // Role filter
      const matchesRole = filters.selectedRole === 'all' || user.role === filters.selectedRole;
      
      // Status filter
      const matchesStatus = filters.selectedStatus === 'all' || user.status === filters.selectedStatus;
      
      // Date range filter
      const matchesDateFrom = filters.dateFrom === '' || 
        new Date(user.joinDate) >= new Date(filters.dateFrom);
      const matchesDateTo = filters.dateTo === '' || 
        new Date(user.joinDate) <= new Date(filters.dateTo);
      
      return matchesSearch && matchesRole && matchesStatus && matchesDateFrom && matchesDateTo;
    });

    // Sort users
    filtered.sort((a, b) => {
      let comparison = 0;
      switch (filters.sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'email':
          comparison = a.email.localeCompare(b.email);
          break;
        case 'joinDate':
          comparison = new Date(a.joinDate).getTime() - new Date(b.joinDate).getTime();
          break;
        case 'lastLogin':
          comparison = new Date(a.lastLogin).getTime() - new Date(b.lastLogin).getTime();
          break;
        case 'totalBookings':
          comparison = a.totalBookings - b.totalBookings;
          break;
        case 'totalSpent':
          comparison = a.totalSpent - b.totalSpent;
          break;
        default:
          comparison = 0;
      }
      return filters.sortOrder === 'desc' ? -comparison : comparison;
    });

    return filtered;
  }, [users, filters]);

  // Pagination logic
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredAndSortedUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredAndSortedUsers.length / usersPerPage);

  // Clear all filters
  const clearAllFilters = () => {
    setFilters({
      searchTerm: '',
      selectedRole: 'all',
      selectedStatus: 'all',
      dateFrom: '',
      dateTo: '',
      sortBy: 'name',
      sortOrder: 'asc'
    });
    setCurrentPage(1);
  };

  // User management functions
  const handleCreateUser = () => {
    if (!newUser.name || !newUser.email) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    // Check if email already exists
    if (users.some(user => user.email === newUser.email)) {
      toast({
        title: "Email Already Exists",
        description: "A user with this email address already exists.",
        variant: "destructive",
      });
      return;
    }

    const user: User = {
      id: `user_${Date.now()}`,
      ...newUser,
      joinDate: new Date().toISOString().split('T')[0],
      lastLogin: 'Never',
      totalBookings: 0,
      totalSpent: 0,
    };

    setUsers([...users, user]);
    setNewUser({
      name: '',
      email: '',
      role: 'user',
      status: 'active',
    });
    setIsCreateModalOpen(false);
    
    toast({
      title: "User Created",
      description: `User ${user.name} has been created successfully.`,
    });
  };

  const handleEditUser = () => {
    if (!selectedUser) return;

    // Validate required fields
    if (!selectedUser.name || !selectedUser.email) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    // Check if email already exists (excluding current user)
    if (users.some(user => user.email === selectedUser.email && user.id !== selectedUser.id)) {
      toast({
        title: "Email Already Exists",
        description: "A user with this email address already exists.",
        variant: "destructive",
      });
      return;
    }

    setUsers(users.map(user => 
      user.id === selectedUser.id ? selectedUser : user
    ));
    setIsEditModalOpen(false);
    setSelectedUser(null);
    
    toast({
      title: "User Updated",
      description: `User ${selectedUser.name} has been updated successfully.`,
    });
  };

  const handleDeleteUser = (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (!user) return;

    setUsers(users.filter(u => u.id !== userId));
    
    toast({
      title: "User Deleted",
      description: `User ${user.name} has been deleted successfully.`,
    });
  };

  const handleChangeUserStatus = (userId: string, newStatus: User['status']) => {
    const user = users.find(u => u.id === userId);
    if (!user) return;

    setUsers(users.map(u => 
      u.id === userId ? { ...u, status: newStatus } : u
    ));
    
    toast({
      title: "Status Updated",
      description: `${user.name}'s status has been changed to ${newStatus}.`,
    });
  };

  const handleViewUser = (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (user) {
      toast({
        title: "User Details",
        description: `Viewing details for ${user.name}`,
      });
    }
  };

  // Helper functions
  const getRoleIcon = (role: User['role']) => {
    switch (role) {
      case 'admin':
        return <ShieldCheck className="h-4 w-4" />;
      case 'moderator':
        return <Shield className="h-4 w-4" />;
      default:
        return <Users className="h-4 w-4" />;
    }
  };

  const getRoleBadgeVariant = (role: User['role']) => {
    switch (role) {
      case 'admin':
        return 'default';
      case 'moderator':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const getStatusBadgeVariant = (status: User['status']) => {
    switch (status) {
      case 'active':
        return 'default';
      case 'inactive':
        return 'secondary';
      case 'banned':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const formatDate = (dateString: string) => {
    if (dateString === 'Never') return 'Never';
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return dateString;
    }
  };

  // Mobile Card Component for Users
  const UserMobileCard = ({ user }: { user: User }) => (
    <Card className="dark:bg-gray-800 dark:border-gray-700 mb-4">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-3 flex-1 min-w-0">
            <Avatar className="w-10 h-10 flex-shrink-0">
              <AvatarImage src={user.avatar} />
              <AvatarFallback className="text-xs dark:bg-gray-600 dark:text-white">
                {getInitials(user.name)}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <h3 className="font-medium truncate dark:text-white">{user.name}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 truncate">{user.email}</p>
            </div>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm" className="flex-shrink-0 h-8 w-8 p-0">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="dark:bg-gray-800 dark:border-gray-700 mx-4 max-w-lg">
              <DialogHeader>
                <DialogTitle className="dark:text-white">User Actions</DialogTitle>
              </DialogHeader>
              <div className="space-y-2 mt-4">
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => handleViewUser(user.id)}
                >
                  <Eye className="mr-2 h-4 w-4" />
                  View Details
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => {
                    setSelectedUser({...user});
                    setIsEditModalOpen(true);
                  }}
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Edit User
                </Button>
                {user.status === 'active' && (
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-red-600"
                    onClick={() => handleChangeUserStatus(user.id, 'banned')}
                  >
                    <Ban className="mr-2 h-4 w-4" />
                    Ban User
                  </Button>
                )}
                {(user.status === 'banned' || user.status === 'inactive') && (
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-green-600"
                    onClick={() => handleChangeUserStatus(user.id, 'active')}
                  >
                    <Check className="mr-2 h-4 w-4" />
                    Activate User
                  </Button>
                )}
                <Button
                  variant="ghost"
                  className="w-full justify-start text-red-600"
                  onClick={() => handleDeleteUser(user.id)}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete User
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-3">
          <div>
            <Badge variant={getRoleBadgeVariant(user.role)} className="flex items-center gap-1 w-fit">
              {getRoleIcon(user.role)}
              <span className="text-xs">{user.role}</span>
            </Badge>
          </div>
          <div>
            <Badge variant={getStatusBadgeVariant(user.status)}>
              <span className="text-xs">{user.status}</span>
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 text-xs text-gray-600 dark:text-gray-300">
          <div>
            <div className="flex items-center gap-1 mb-1">
              <Calendar className="h-3 w-3" />
              <span>Joined</span>
            </div>
            <div>{formatDate(user.joinDate)}</div>
          </div>
          <div>
            <div className="flex items-center gap-1 mb-1">
              <Users className="h-3 w-3" />
              <span>Bookings</span>
            </div>
            <div>{user.totalBookings}</div>
          </div>
          <div>
            <div className="flex items-center gap-1 mb-1">
              <CreditCard className="h-3 w-3" />
              <span>Spent</span>
            </div>
            <div>${user.totalSpent}</div>
          </div>
          <div>
            <div className="flex items-center gap-1 mb-1">
              <span>Last Login</span>
            </div>
            <div>{formatDate(user.lastLogin)}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className={`space-y-4 px-2 sm:px-4 lg:px-6 ${className}`}>
      <Card className="dark:bg-gray-800 dark:border-gray-700">
        <CardHeader className="pb-3">
          <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
            <CardTitle className="flex items-center text-lg sm:text-xl dark:text-white">
              <Users className="mr-2 h-5 w-5" />
              User Management
            </CardTitle>
            <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
              <DialogTrigger asChild>
                <Button className="w-full sm:w-auto">
                  <Plus className="mr-2 h-4 w-4" />
                  <span className="sm:inline">Add User</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="dark:bg-gray-800 dark:border-gray-700 mx-4 max-w-lg">
                <DialogHeader>
                  <DialogTitle className="dark:text-white">Create New User</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 mt-4">
                  <div>
                    <Label htmlFor="newUserName" className="dark:text-gray-200">Full Name *</Label>
                    <Input
                      id="newUserName"
                      value={newUser.name}
                      onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                      placeholder="Enter full name"
                      className="dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                    />
                  </div>
                  <div>
                    <Label htmlFor="newUserEmail" className="dark:text-gray-200">Email *</Label>
                    <Input
                      id="newUserEmail"
                      type="email"
                      value={newUser.email}
                      onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                      placeholder="Enter email address"
                      className="dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                    />
                  </div>
                  <div>
                    <Label htmlFor="newUserRole" className="dark:text-gray-200">Role</Label>
                    <Select value={newUser.role} onValueChange={(value: User['role']) => setNewUser({...newUser, role: value})}>
                      <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="dark:bg-gray-700 dark:border-gray-600">
                        <SelectItem value="user">User</SelectItem>
                        <SelectItem value="moderator">Moderator</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="newUserStatus" className="dark:text-gray-200">Status</Label>
                    <Select value={newUser.status} onValueChange={(value: User['status']) => setNewUser({...newUser, status: value})}>
                      <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="dark:bg-gray-700 dark:border-gray-600">
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                        <SelectItem value="banned">Banned</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex flex-col space-y-2 sm:flex-row sm:justify-end sm:space-y-0 sm:space-x-2 pt-4">
                    <Button variant="outline" onClick={() => setIsCreateModalOpen(false)} className="w-full sm:w-auto dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700">
                      Cancel
                    </Button>
                    <Button onClick={handleCreateUser} className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-white font-medium">
                      <UserPlus className="mr-2 h-4 w-4 text-white" />
                      <span className="text-white font-medium">Create User</span>
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent className="p-4">
          {/* Enhanced Filters */}
          <div className="space-y-4 mb-6">
            {/* Primary Filters */}
            <div className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400 dark:text-gray-500" />
                <Input
                  placeholder="Search users..."
                  value={filters.searchTerm}
                  onChange={(e) => setFilters({...filters, searchTerm: e.target.value})}
                  className="pl-10 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                />
              </div>
              <Button
                variant="outline"
                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                className="sm:w-auto dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                <Filter className="mr-2 h-4 w-4" />
                Filters
              </Button>
            </div>

            {/* Advanced Filters - Collapsible on Mobile */}
            {showAdvancedFilters && (
              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  <Select value={filters.selectedRole} onValueChange={(value) => setFilters({...filters, selectedRole: value})}>
                    <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                      <SelectValue placeholder="All Roles" />
                    </SelectTrigger>
                    <SelectContent className="dark:bg-gray-700 dark:border-gray-600">
                      <SelectItem value="all">All Roles</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="moderator">Moderator</SelectItem>
                      <SelectItem value="user">User</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={filters.selectedStatus} onValueChange={(value) => setFilters({...filters, selectedStatus: value})}>
                    <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                      <SelectValue placeholder="All Status" />
                    </SelectTrigger>
                    <SelectContent className="dark:bg-gray-700 dark:border-gray-600">
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="banned">Banned</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select 
                    value={`${filters.sortBy}-${filters.sortOrder}`} 
                    onValueChange={(value) => {
                      const [sortBy, sortOrder] = value.split('-');
                      setFilters({...filters, sortBy: sortBy as UserFilters['sortBy'], sortOrder: sortOrder as 'asc' | 'desc'});
                    }}
                  >
                    <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent className="dark:bg-gray-700 dark:border-gray-600">
                      <SelectItem value="name-asc">Name (A-Z)</SelectItem>
                      <SelectItem value="name-desc">Name (Z-A)</SelectItem>
                      <SelectItem value="joinDate-desc">Newest First</SelectItem>
                      <SelectItem value="totalBookings-desc">Most Bookings</SelectItem>
                      <SelectItem value="totalSpent-desc">Highest Spending</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    variant="outline"
                    onClick={clearAllFilters}
                    className="dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                  >
                    Clear All
                  </Button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <Label className="text-sm font-medium dark:text-gray-200">Join Date From</Label>
                    <Input
                      type="date"
                      value={filters.dateFrom}
                      onChange={(e) => setFilters({...filters, dateFrom: e.target.value})}
                      className="mt-1 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-medium dark:text-gray-200">Join Date To</Label>
                    <Input
                      type="date"
                      value={filters.dateTo}
                      onChange={(e) => setFilters({...filters, dateTo: e.target.value})}
                      className="mt-1 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Results Summary */}
            <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-300">
              <span>
                Showing {indexOfFirstUser + 1}-{Math.min(indexOfLastUser, filteredAndSortedUsers.length)} of {filteredAndSortedUsers.length} users
              </span>
            </div>
          </div>

          {/* Users Display - Mobile Cards or Desktop Table */}
          {isMobileView ? (
            <div className="space-y-3">
              {currentUsers.map((user) => (
                <UserMobileCard key={user.id} user={user} />
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="dark:border-gray-700">
                    <TableHead className="dark:text-gray-300">User</TableHead>
                    <TableHead className="dark:text-gray-300">Role</TableHead>
                    <TableHead className="dark:text-gray-300">Status</TableHead>
                    <TableHead className="hidden lg:table-cell dark:text-gray-300">Join Date</TableHead>
                    <TableHead className="hidden lg:table-cell dark:text-gray-300">Last Login</TableHead>
                    <TableHead className="hidden xl:table-cell dark:text-gray-300">Bookings</TableHead>
                    <TableHead className="hidden xl:table-cell dark:text-gray-300">Total Spent</TableHead>
                    <TableHead className="dark:text-gray-300">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentUsers.map((user) => (
                    <TableRow key={user.id} className="dark:border-gray-700">
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <Avatar className="w-8 h-8">
                            <AvatarImage src={user.avatar} />
                            <AvatarFallback className="text-xs dark:bg-gray-600 dark:text-white">
                              {getInitials(user.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0">
                            <p className="font-medium truncate dark:text-white">{user.name}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-300 truncate">{user.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getRoleBadgeVariant(user.role)} className="flex items-center gap-1 w-fit dark:text-white">
                          {getRoleIcon(user.role)}
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadgeVariant(user.status)} className="dark:text-white">
                          {user.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell dark:text-gray-300">
                        {formatDate(user.joinDate)}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell dark:text-gray-300">
                        {formatDate(user.lastLogin)}
                      </TableCell>
                      <TableCell className="hidden xl:table-cell">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <span className="dark:text-gray-300">{user.totalBookings}</span>
                        </div>
                      </TableCell>
                      <TableCell className="hidden xl:table-cell">
                        <div className="flex items-center gap-1">
                          <CreditCard className="h-4 w-4 text-gray-400" />
                          <span className="dark:text-gray-300">${user.totalSpent}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewUser(user.id)}
                            className="h-8 w-8 p-0 dark:text-gray-300 dark:hover:bg-gray-700"
                            title="View Details"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>

                          <Dialog open={isEditModalOpen && selectedUser?.id === user.id} onOpenChange={(open) => {
                            setIsEditModalOpen(open);
                            if (!open) setSelectedUser(null);
                          }}>
                            <DialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setSelectedUser({...user})}
                                className="h-8 w-8 p-0 dark:text-gray-300 dark:hover:bg-gray-700"
                                title="Edit User"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="dark:bg-gray-800 dark:border-gray-700 mx-4 max-w-lg">
                              <DialogHeader>
                                <DialogTitle className="dark:text-white">Edit User</DialogTitle>
                              </DialogHeader>
                              {selectedUser && (
                                <div className="space-y-4 mt-4">
                                  <div>
                                    <Label htmlFor="editUserName" className="dark:text-gray-200">Full Name *</Label>
                                    <Input
                                      id="editUserName"
                                      value={selectedUser.name}
                                      onChange={(e) => setSelectedUser({...selectedUser, name: e.target.value})}
                                      className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                    />
                                  </div>
                                  <div>
                                    <Label htmlFor="editUserEmail" className="dark:text-gray-200">Email *</Label>
                                    <Input
                                      id="editUserEmail"
                                      type="email"
                                      value={selectedUser.email}
                                      onChange={(e) => setSelectedUser({...selectedUser, email: e.target.value})}
                                      className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                    />
                                  </div>
                                  <div>
                                    <Label htmlFor="editUserRole" className="dark:text-gray-200">Role</Label>
                                    <Select 
                                      value={selectedUser.role} 
                                      onValueChange={(value: User['role']) => setSelectedUser({...selectedUser, role: value})}
                                    >
                                      <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent className="dark:bg-gray-700 dark:border-gray-600">
                                        <SelectItem value="user">User</SelectItem>
                                        <SelectItem value="moderator">Moderator</SelectItem>
                                        <SelectItem value="admin">Admin</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                  <div>
                                    <Label htmlFor="editUserStatus" className="dark:text-gray-200">Status</Label>
                                    <Select 
                                      value={selectedUser.status} 
                                      onValueChange={(value: User['status']) => setSelectedUser({...selectedUser, status: value})}
                                    >
                                      <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent className="dark:bg-gray-700 dark:border-gray-600">
                                        <SelectItem value="active">Active</SelectItem>
                                        <SelectItem value="inactive">Inactive</SelectItem>
                                        <SelectItem value="banned">Banned</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                  <div className="flex flex-col space-y-2 sm:flex-row sm:justify-end sm:space-y-0 sm:space-x-2 pt-4">
                                    <Button variant="outline" onClick={() => setIsEditModalOpen(false)} className="w-full sm:w-auto dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700">
                                      Cancel
                                    </Button>
                                    <Button onClick={handleEditUser} className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-white font-medium">
                                      <span className="text-white font-medium">Save Changes</span>
                                    </Button>
                                  </div>
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>

                          {user.status === 'active' && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleChangeUserStatus(user.id, 'banned')}
                              className="h-8 w-8 p-0 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                              title="Ban User"
                            >
                              <Ban className="h-4 w-4" />
                            </Button>
                          )}
                          
                          {user.status === 'banned' && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleChangeUserStatus(user.id, 'active')}
                              className="h-8 w-8 p-0 text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300"
                              title="Activate User"
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                          )}

                          {user.status === 'inactive' && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleChangeUserStatus(user.id, 'active')}
                              className="h-8 w-8 p-0 text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300"
                              title="Activate User"
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                          )}

                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                                title="Delete User"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="dark:bg-gray-800 dark:border-gray-700 mx-4 max-w-lg">
                              <AlertDialogHeader>
                                <AlertDialogTitle className="dark:text-white">Delete User</AlertDialogTitle>
                                <AlertDialogDescription className="dark:text-gray-300">
                                  Are you sure you want to delete {user.name}? This action cannot be undone.
                                  All their bookings and data will be permanently removed.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter className="flex-col space-y-2 sm:flex-row sm:space-y-0">
                                <AlertDialogCancel className="w-full sm:w-auto dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700">Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDeleteUser(user.id)}
                                  className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white"
                                >
                                  Delete User
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {/* Empty State */}
          {filteredAndSortedUsers.length === 0 && (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No users found</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                {filters.searchTerm || filters.selectedRole !== 'all' || filters.selectedStatus !== 'all' || filters.dateFrom || filters.dateTo
                  ? 'Try adjusting your search or filters'
                  : 'No users have been created yet'
                }
              </p>
              {(filters.searchTerm || filters.selectedRole !== 'all' || filters.selectedStatus !== 'all' || filters.dateFrom || filters.dateTo) && (
                <Button variant="outline" onClick={clearAllFilters} className="dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700">
                  Clear All Filters
                </Button>
              )}
            </div>
          )}

          {/* Pagination */}
          {filteredAndSortedUsers.length > 0 && totalPages > 1 && (
            <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0 mt-6">
              <div className="text-sm text-gray-600 dark:text-gray-300 text-center sm:text-left">
                Page {currentPage} of {totalPages} ({filteredAndSortedUsers.length} total users)
              </div>
              <div className="flex items-center justify-center space-x-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 disabled:opacity-50"
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span className="hidden sm:inline ml-1">Previous</span>
                </Button>
                
                {/* Page Numbers - Show fewer on mobile */}
                <div className="flex space-x-1">
                  {Array.from({ length: Math.min(isMobileView ? 3 : 5, totalPages) }, (_, index) => {
                    let pageNum;
                    const maxPages = isMobileView ? 3 : 5;
                    if (totalPages <= maxPages) {
                      pageNum = index + 1;
                    } else if (currentPage <= Math.ceil(maxPages / 2)) {
                      pageNum = index + 1;
                    } else if (currentPage >= totalPages - Math.floor(maxPages / 2)) {
                      pageNum = totalPages - maxPages + index + 1;
                    } else {
                      pageNum = currentPage - Math.floor(maxPages / 2) + index;
                    }
                    
                    return (
                      <Button
                        key={pageNum}
                        variant={currentPage === pageNum ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(pageNum)}
                        className="w-8 h-8 p-0 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 disabled:opacity-50"
                >
                  <span className="hidden sm:inline mr-1">Next</span>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* User Statistics - Mobile-Responsive Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-300">Total Users</p>
                <p className="text-lg sm:text-2xl font-bold dark:text-white">{users.length}</p>
              </div>
              <Users className="h-6 w-6 sm:h-8 sm:w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-300">Active Users</p>
                <p className="text-lg sm:text-2xl font-bold dark:text-white">{users.filter(u => u.status === 'active').length}</p>
              </div>
              <Check className="h-6 w-6 sm:h-8 sm:w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-300">Admins</p>
                <p className="text-lg sm:text-2xl font-bold dark:text-white">{users.filter(u => u.role === 'admin').length}</p>
              </div>
              <ShieldCheck className="h-6 w-6 sm:h-8 sm:w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-300">Banned Users</p>
                <p className="text-lg sm:text-2xl font-bold dark:text-white">{users.filter(u => u.status === 'banned').length}</p>
              </div>
              <Ban className="h-6 w-6 sm:h-8 sm:w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EnhancedUserManagement;