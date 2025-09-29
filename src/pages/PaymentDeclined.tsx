import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const PaymentDeclined = () => {
  return (
    <div className="min-h-screen bg-muted/30 flex items-center justify-center p-4">
      <div className="bg-card rounded-2xl p-8 text-center max-w-sm w-full">
        {/* Error Icon */}
        <div className="w-20 h-20 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
          <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center">
            <span className="text-white text-2xl font-bold">✕</span>
          </div>
        </div>

        <h2 className="text-xl font-bold text-foreground mb-2">This transfer was declined by your bank</h2>

        <Link to="/dashboard" className="mt-8 block">
          <Button className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-3 rounded-full">
            Back to Dashboard
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default PaymentDeclined;