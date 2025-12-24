import { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { supabase } from '@/integrations/supabase/client';
import { useAdmin } from '@/hooks/useAdmin';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Search, Ban, CheckCircle, Loader2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface UserProfile {
  user_id: string;
  full_name: string | null;
  email: string | null;
  balance: number | null;
  is_blocked: boolean | null;
  created_at: string;
}

const AdminUsers = () => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [showBlockDialog, setShowBlockDialog] = useState(false);
  const [blockReason, setBlockReason] = useState('');
  const { userId } = useAdmin();
  const { toast } = useToast();

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('user_id, full_name, email, balance, is_blocked, created_at')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: "Error",
        description: "Failed to load users",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleBlockToggle = async (user: UserProfile) => {
    if (user.is_blocked) {
      // Unblock directly
      await toggleBlock(user, false);
    } else {
      // Show dialog for block reason
      setSelectedUser(user);
      setShowBlockDialog(true);
    }
  };

  const toggleBlock = async (user: UserProfile, block: boolean, reason?: string) => {
    setActionLoading(user.user_id);
    try {
      const { data, error } = await supabase.rpc('toggle_user_block', {
        _target_user_id: user.user_id,
        _admin_id: userId,
        _block: block,
        _reason: reason || null
      });

      if (error) throw error;

      const result = data as { success: boolean; message: string };
      if (result.success) {
        toast({
          title: block ? "User Blocked" : "User Unblocked",
          description: result.message
        });
        fetchUsers();
      } else {
        throw new Error(result.message);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update user status",
        variant: "destructive"
      });
    } finally {
      setActionLoading(null);
      setShowBlockDialog(false);
      setBlockReason('');
      setSelectedUser(null);
    }
  };

  const filteredUsers = users.filter(user =>
    user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white">User Management</h1>
          <p className="text-purple-300 mt-2">Manage and monitor all registered users</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-purple-400" />
            <Input
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-black/60 border-purple-500/30 text-white placeholder:text-purple-400"
            />
          </div>
        </div>

        <div className="bg-black/60 border border-purple-500/30 rounded-lg overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center p-12">
              <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-purple-500/30 hover:bg-purple-900/20">
                  <TableHead className="text-purple-300">Name</TableHead>
                  <TableHead className="text-purple-300">Email</TableHead>
                  <TableHead className="text-purple-300">Balance</TableHead>
                  <TableHead className="text-purple-300">Status</TableHead>
                  <TableHead className="text-purple-300">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow 
                    key={user.user_id} 
                    className="border-purple-500/30 hover:bg-purple-900/20"
                  >
                    <TableCell className="text-white font-medium">
                      {user.full_name || 'N/A'}
                    </TableCell>
                    <TableCell className="text-purple-200">
                      {user.email || 'N/A'}
                    </TableCell>
                    <TableCell className="text-green-400">
                      {formatCurrency(user.balance || 0)}
                    </TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                        user.is_blocked 
                          ? 'bg-red-900/50 text-red-300' 
                          : 'bg-green-900/50 text-green-300'
                      }`}>
                        {user.is_blocked ? (
                          <>
                            <Ban className="h-3 w-3" />
                            Blocked
                          </>
                        ) : (
                          <>
                            <CheckCircle className="h-3 w-3" />
                            Active
                          </>
                        )}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        variant={user.is_blocked ? "outline" : "destructive"}
                        onClick={() => handleBlockToggle(user)}
                        disabled={actionLoading === user.user_id}
                        className={user.is_blocked 
                          ? "border-green-500 text-green-400 hover:bg-green-900/30" 
                          : ""
                        }
                      >
                        {actionLoading === user.user_id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : user.is_blocked ? (
                          'Unblock'
                        ) : (
                          'Block'
                        )}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>

        <AlertDialog open={showBlockDialog} onOpenChange={setShowBlockDialog}>
          <AlertDialogContent className="bg-black border-purple-500/30">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-white">
                Block User: {selectedUser?.full_name}
              </AlertDialogTitle>
              <AlertDialogDescription className="text-purple-300">
                This user will not be able to login or perform any transactions.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="py-4">
              <Input
                placeholder="Reason for blocking (optional)"
                value={blockReason}
                onChange={(e) => setBlockReason(e.target.value)}
                className="bg-purple-900/30 border-purple-500/30 text-white"
              />
            </div>
            <AlertDialogFooter>
              <AlertDialogCancel className="bg-transparent border-purple-500/30 text-purple-300">
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={() => selectedUser && toggleBlock(selectedUser, true, blockReason)}
                className="bg-red-600 hover:bg-red-700"
              >
                Block User
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </AdminLayout>
  );
};

export default AdminUsers;
