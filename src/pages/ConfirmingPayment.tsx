import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ConfirmingPayment = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/payment-declined");
    }, 8000); // 8 seconds

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-muted/30 flex items-center justify-center p-4">
      <div className="bg-card rounded-2xl p-8 text-center max-w-sm w-full">
        {/* Loading Animation */}
        <div className="w-20 h-20 mx-auto mb-6 relative">
          <div className="w-full h-full border-4 border-primary/20 rounded-full"></div>
          <div className="absolute top-0 left-0 w-full h-full border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>

        <h2 className="text-xl font-bold text-foreground mb-2">Confirming Payment</h2>
        <p className="text-muted-foreground">Please wait while we verify your transfer...</p>
      </div>
    </div>
  );
};

export default ConfirmingPayment;