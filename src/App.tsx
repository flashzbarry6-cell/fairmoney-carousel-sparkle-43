import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";

import Dashboard from "./pages/Dashboard";
import Support from "./pages/Support";
import LoanApplication from "./pages/LoanApplication";
import TVRecharge from "./pages/TVRecharge";
import BuyData from "./pages/BuyData";
import Betting from "./pages/Betting";
import Withdraw from "./pages/Withdraw";
import WithdrawalAmount from "./pages/WithdrawalAmount";
import ReferralRequirement from "./pages/ReferralRequirement";
import WithdrawBankSelection from "./pages/WithdrawBankSelection";
import WithdrawalConfirmation from "./pages/WithdrawalConfirmation";
import WithdrawalReceipt from "./pages/WithdrawalReceipt";
import WithdrawalSuccess from "./pages/WithdrawalSuccess";
import PaymentNotConfirmed from "./pages/PaymentNotConfirmed";
import PaymentPending from "./pages/PaymentPending";
import PaymentApproved from "./pages/PaymentApproved";
import PaymentRejected from "./pages/PaymentRejected";
import TransferPage from "./pages/TransferPage";
import FaircodePaymentSuccess from "./pages/FaircodePaymentSuccess";
import BuyAirtime from "./pages/BuyAirtime";
import InviteEarn from "./pages/InviteEarn";
import MoreOptions from "./pages/MoreOptions";
import Profile from "./pages/Profile";
import About from "./pages/About";
import UpgradeAccount from "./pages/UpgradeAccount";
import JoinCommunity from "./pages/JoinCommunity";
import BuyFaircode from "./pages/BuyFaircode";
import Investment from "./pages/Investment";
import InvestmentPayment from "./pages/InvestmentPayment";
import Activity from "./pages/Activity";
import PlayGames from "./pages/PlayGames";
import SpinAndWin from "./pages/SpinAndWin";
import UpgradeProcessing from "./pages/UpgradeProcessing";
import UpgradePaymentMethod from "./pages/UpgradePaymentMethod";
import UpgradeBankTransfer from "./pages/UpgradeBankTransfer";
import UpgradeReceiptUpload from "./pages/UpgradeReceiptUpload";
import UpgradeConfirming from "./pages/UpgradeConfirming";
import NotFound from "./pages/NotFound";
import BankRegistrationEntry from "./pages/BankRegistrationEntry";
import BankRegistrationPayment from "./pages/BankRegistrationPayment";
import BankRegistrationForm from "./pages/BankRegistrationForm";
import PaymentDue from "./pages/PaymentDue";

// Admin pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminPayments from "./pages/admin/AdminPayments";
import AdminNotifications from "./pages/admin/AdminNotifications";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/support" element={<Support />} />
          <Route path="/loan" element={<LoanApplication />} />
          <Route path="/investment" element={<Investment />} />
          <Route path="/investment-payment" element={<InvestmentPayment />} />
          <Route path="/activity" element={<Activity />} />
          <Route path="/play-games" element={<PlayGames />} />
          <Route path="/spin-win" element={<SpinAndWin />} />
          <Route path="/tv-recharge" element={<TVRecharge />} />
          <Route path="/buy-data" element={<BuyData />} />
          <Route path="/betting" element={<Betting />} />
          <Route path="/withdraw" element={<Withdraw />} />
          <Route path="/withdrawal-amount" element={<WithdrawalAmount />} />
          <Route path="/referral-requirement" element={<ReferralRequirement />} />
          <Route path="/withdraw-bank-selection" element={<WithdrawBankSelection />} />
          <Route path="/withdrawal-confirmation" element={<WithdrawalConfirmation />} />
          <Route path="/withdrawal-receipt" element={<WithdrawalReceipt />} />
          <Route path="/withdrawal-success" element={<WithdrawalSuccess />} />
          <Route path="/payment-not-confirmed" element={<PaymentNotConfirmed />} />
          <Route path="/payment-pending" element={<PaymentPending />} />
          <Route path="/payment-approved" element={<PaymentApproved />} />
          <Route path="/payment-rejected" element={<PaymentRejected />} />
          <Route path="/transfer-page" element={<TransferPage />} />
          <Route path="/faircode-payment-success" element={<FaircodePaymentSuccess />} />
          <Route path="/buy-airtime" element={<BuyAirtime />} />
          <Route path="/invite-earn" element={<InviteEarn />} />
          
          <Route path="/more-options" element={<MoreOptions />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/about" element={<About />} />
          <Route path="/upgrade" element={<UpgradeAccount />} />
          <Route path="/upgrade-processing" element={<UpgradeProcessing />} />
          <Route path="/upgrade-payment-method" element={<UpgradePaymentMethod />} />
          <Route path="/upgrade-bank-transfer" element={<UpgradeBankTransfer />} />
          <Route path="/upgrade-receipt-upload" element={<UpgradeReceiptUpload />} />
          <Route path="/upgrade-confirming" element={<UpgradeConfirming />} />
          <Route path="/join-community" element={<JoinCommunity />} />
          <Route path="/buy-faircode" element={<BuyFaircode />} />
          
          {/* Bank Registration Routes */}
          <Route path="/bank-registration" element={<BankRegistrationEntry />} />
          <Route path="/bank-registration-payment" element={<BankRegistrationPayment />} />
          <Route path="/bank-registration-form" element={<BankRegistrationForm />} />
          <Route path="/payment-due" element={<PaymentDue />} />
          
          {/* Admin Routes */}
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/payments" element={<AdminPayments />} />
          <Route path="/admin/notifications" element={<AdminNotifications />} />
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
