import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
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
} from '@/components/ui/alert-dialog';
import { Search, CheckCircle, XCircle, Clock, Loader2, Eye } from 'lucide-react';
import { format } from 'date-fns';

interface Payment {
  id: string;
  user_id: string;
  amount: number;
  status: 'pending' | 'approved' | 'rejected';
  payment_type: string;
  payment_proof_url: string | null;
  rejection_reason: string | null;
  created_at: string;
  user_name?: string;
  user_email?: string;
}

const AdminPayments = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [showProofDialog, setShowProofDialog] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [searchParams] = useSearchParams();
  const { userId } = useAdmin();
  const { toast } = useToast();

  useEffect(() => {
    const status = searchParams.get('status');
    if (status) {
      setStatusFilter(status);
    }
  }, [searchParams]);

  const fetchPayments = async () => {
    try {
      let query = supabase
        .from('payments')
        .select('*')
        .order('created_at', { ascending: false });

      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter as 'pending' | 'approved' | 'rejected');
      }

      const { data: paymentsData, error } = await query;

      if (error) throw error;

      // Fetch user profiles for each payment
      const userIds = [...new Set(paymentsData?.map(p => p.user_id) || [])];
      const { data: profiles } = await supabase
        .from('profiles')
        .select('user_id, full_name, email')
        .in('user_id', userIds);

      const profileMap = new Map(profiles?.map(p => [p.user_id, p]) || []);

      const paymentsWithUsers = paymentsData?.map(payment => ({
        ...payment,
        user_name: profileMap.get(payment.user_id)?.full_name || 'N/A',
        user_email: profileMap.get(payment.user_id)?.email || 'N/A'
      })) || [];

      setPayments(paymentsWithUsers);
    } catch (error) {
      console.error('Error fetching payments:', error);
      toast({
        title: "Error",
        description: "Failed to load payments",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, [statusFilter]);

  const handleApprove = async (payment: Payment) => {
    setActionLoading(payment.id);
    try {
      const { data, error } = await supabase.rpc('approve_payment', {
        _payment_id: payment.id,
        _admin_id: userId
      });

      if (error) throw error;

      const result = data as { success: boolean; message: string };
      if (result.success) {
        toast({
          title: "Payment Approved",
          description: "User wallet has been credited"
        });
        fetchPayments();
      } else {
        throw new Error(result.message);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to approve payment",
        variant: "destructive"
      });
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async () => {
    if (!selectedPayment) return;

    setActionLoading(selectedPayment.id);
    try {
      const { data, error } = await supabase.rpc('reject_payment', {
        _payment_id: selectedPayment.id,
        _admin_id: userId,
        _reason: rejectionReason || 'Payment rejected by admin'
      });

      if (error) throw error;

      const result = data as { success: boolean; message: string };
      if (result.success) {
        toast({
          title: "Payment Rejected",
          description: "User has been notified"
        });
        fetchPayments();
      } else {
        throw new Error(result.message);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to reject payment",
        variant: "destructive"
      });
    } finally {
      setActionLoading(null);
      setShowRejectDialog(false);
      setRejectionReason('');
      setSelectedPayment(null);
    }
  };

  const filteredPayments = payments.filter(payment =>
    payment.user_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    payment.user_email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      pending: 'bg-yellow-900/50 text-yellow-300',
      approved: 'bg-green-900/50 text-green-300',
      rejected: 'bg-red-900/50 text-red-300'
    };

    const icons = {
      pending: <Clock className="h-3 w-3" />,
      approved: <CheckCircle className="h-3 w-3" />,
      rejected: <XCircle className="h-3 w-3" />
    };

    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${styles[status as keyof typeof styles]}`}>
        {icons[status as keyof typeof icons]}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white">Payment Management</h1>
          <p className="text-purple-300 mt-2">Review and process user payments</p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-purple-400" />
            <Input
              placeholder="Search by user name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-black/60 border-purple-500/30 text-white placeholder:text-purple-400"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40 bg-black/60 border-purple-500/30 text-white">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent className="bg-black border-purple-500/30">
              <SelectItem value="all" className="text-white">All Status</SelectItem>
              <SelectItem value="pending" className="text-yellow-300">Pending</SelectItem>
              <SelectItem value="approved" className="text-green-300">Approved</SelectItem>
              <SelectItem value="rejected" className="text-red-300">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="bg-black/60 border border-purple-500/30 rounded-lg overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center p-12">
              <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
            </div>
          ) : filteredPayments.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-12 text-center">
              <Clock className="h-12 w-12 text-purple-400 mb-4" />
              <h3 className="text-white font-medium">No payments found</h3>
              <p className="text-purple-300 text-sm">No payments match your current filters</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-purple-500/30 hover:bg-purple-900/20">
                  <TableHead className="text-purple-300">User</TableHead>
                  <TableHead className="text-purple-300">Amount</TableHead>
                  <TableHead className="text-purple-300">Type</TableHead>
                  <TableHead className="text-purple-300">Date</TableHead>
                  <TableHead className="text-purple-300">Status</TableHead>
                  <TableHead className="text-purple-300">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPayments.map((payment) => (
                  <TableRow 
                    key={payment.id} 
                    className="border-purple-500/30 hover:bg-purple-900/20"
                  >
                    <TableCell>
                      <div>
                        <p className="text-white font-medium">
                          {payment.user_name || 'N/A'}
                        </p>
                        <p className="text-purple-400 text-sm">
                          {payment.user_email || 'N/A'}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="text-green-400 font-medium">
                      {formatCurrency(payment.amount)}
                    </TableCell>
                    <TableCell className="text-purple-200 capitalize">
                      {payment.payment_type}
                    </TableCell>
                    <TableCell className="text-purple-300">
                      {format(new Date(payment.created_at), 'MMM dd, yyyy HH:mm')}
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(payment.status)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {payment.payment_proof_url && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedPayment(payment);
                              setShowProofDialog(true);
                            }}
                            className="border-purple-500/30 text-purple-300"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        )}
                        {payment.status === 'pending' && (
                          <>
                            <Button
                              size="sm"
                              onClick={() => handleApprove(payment)}
                              disabled={actionLoading === payment.id}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              {actionLoading === payment.id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <CheckCircle className="h-4 w-4" />
                              )}
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => {
                                setSelectedPayment(payment);
                                setShowRejectDialog(true);
                              }}
                              disabled={actionLoading === payment.id}
                            >
                              <XCircle className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                        {payment.status === 'rejected' && payment.rejection_reason && (
                          <span className="text-xs text-red-400">
                            {payment.rejection_reason}
                          </span>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>

        {/* Reject Dialog */}
        <AlertDialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
          <AlertDialogContent className="bg-black border-purple-500/30">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-white">
                Reject Payment
              </AlertDialogTitle>
              <AlertDialogDescription className="text-purple-300">
                This payment will be marked as rejected and the user will be notified.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="py-4">
              <Input
                placeholder="Reason for rejection"
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="bg-purple-900/30 border-purple-500/30 text-white"
              />
            </div>
            <AlertDialogFooter>
              <AlertDialogCancel className="bg-transparent border-purple-500/30 text-purple-300">
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleReject}
                className="bg-red-600 hover:bg-red-700"
              >
                Reject Payment
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Proof Dialog */}
        <AlertDialog open={showProofDialog} onOpenChange={setShowProofDialog}>
          <AlertDialogContent className="bg-black border-purple-500/30 max-w-2xl">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-white">
                Payment Proof
              </AlertDialogTitle>
            </AlertDialogHeader>
            <div className="py-4">
              {selectedPayment?.payment_proof_url && (
                <img
                  src={selectedPayment.payment_proof_url}
                  alt="Payment proof"
                  className="w-full rounded-lg"
                />
              )}
            </div>
            <AlertDialogFooter>
              <AlertDialogCancel className="bg-transparent border-purple-500/30 text-purple-300">
                Close
              </AlertDialogCancel>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </AdminLayout>
  );
};

export default AdminPayments;
