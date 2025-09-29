import { X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const PaymentNotificationPage = () => {
  const navigate = useNavigate();

  const handleUnderstand = () => {
    navigate("/transfer-page");
  };

  return (
    <div className="min-h-screen bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-6 max-w-sm w-full relative">
        {/* Close Button */}
        <button 
          onClick={() => navigate("/withdrawal-receipt")}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Content */}
        <div className="space-y-4">
          {/* Title */}
          <div className="flex items-center space-x-2 mb-6">
            <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
              <span className="text-black font-bold">!</span>
            </div>
            <h2 className="text-xl font-bold text-foreground">Important Payment Notice</h2>
          </div>

          {/* Instructions */}
          <div className="space-y-4 text-sm">
            <div className="flex items-start space-x-3">
              <span className="text-lg">•</span>
              <span className="text-foreground">
                Transfer the <span className="font-bold">exact amount</span> shown on this page.
              </span>
            </div>

            <div className="flex items-start space-x-3">
              <span className="text-lg">•</span>
              <span className="text-foreground">
                Upload a clear <span className="font-bold">payment screenshot</span> immediately after transfer.
              </span>
            </div>

            <div className="flex items-start space-x-3">
              <span className="text-lg">•</span>
              <div className="text-foreground">
                <div className="flex items-center space-x-1">
                  <span className="w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center text-black text-xs font-bold">!</span>
                  <span className="font-bold text-red-600">Avoid using Opay bank.</span>
                </div>
                <span className="text-muted-foreground">
                  Due to temporary network issues from Opay servers, payments made with Opay may not be confirmed. Please use <span className="font-bold">any other Nigerian bank</span> for instant confirmation.
                </span>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <span className="text-lg">✅</span>
              <span className="text-foreground">
                Payments made with other banks are confirmed within minutes.
              </span>
            </div>

            <div className="flex items-start space-x-3">
              <span className="text-lg">❌</span>
              <span className="text-foreground">
                Do not dispute your payment under any circumstances — disputes delay confirmation.
              </span>
            </div>
          </div>

          {/* Button */}
          <Button 
            onClick={handleUnderstand}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-full mt-6"
          >
            I Understand
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PaymentNotificationPage;