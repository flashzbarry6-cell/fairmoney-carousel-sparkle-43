import { ArrowLeft, Upload, X, CheckCircle } from "lucide-react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useState, useRef } from "react";

const UpgradeReceiptUpload = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [receipt, setReceipt] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const plan = searchParams.get("plan");
  const amount = searchParams.get("amount");

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select an image smaller than 5MB",
        variant: "destructive"
      });
      return;
    }

    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file",
        variant: "destructive"
      });
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setReceipt(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleRemove = () => {
    setReceipt(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = () => {
    if (!receipt) {
      toast({
        title: "No receipt uploaded",
        description: "Please upload your payment receipt",
        variant: "destructive"
      });
      return;
    }

    setUploading(true);
    setTimeout(() => {
      navigate(`/upgrade-confirming?plan=${plan}&amount=${amount}`);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-950 to-black p-4 max-w-md mx-auto">
      {/* Header */}
      <div className="flex items-center mb-6 pt-2">
        <Link to={`/upgrade-bank-transfer?plan=${plan}&amount=${amount}`} className="mr-3">
          <ArrowLeft className="w-6 h-6 text-white" />
        </Link>
        <h1 className="text-xl font-semibold text-white">Upload Receipt</h1>
      </div>

      {/* Plan Info */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-900 rounded-2xl p-4 mb-6 border border-purple-500/30">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-purple-200 text-sm">Upgrading to</p>
            <p className="text-white font-bold text-lg">{plan} Plan</p>
          </div>
          <p className="text-yellow-400 text-2xl font-bold">₦{amount?.toLocaleString()}</p>
        </div>
      </div>

      {/* Upload Area */}
      <div className="mb-6">
        {!receipt ? (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-purple-500/30 rounded-2xl p-8 text-center cursor-pointer hover:border-purple-400 transition-colors bg-purple-900/20 backdrop-blur-sm"
          >
            <div className="flex flex-col items-center gap-3">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-purple-800 rounded-full flex items-center justify-center">
                <Upload className="w-8 h-8 text-white" />
              </div>
              <div>
                <p className="text-white font-semibold mb-1">Upload Payment Receipt</p>
                <p className="text-purple-300 text-sm">Click to select an image</p>
                <p className="text-purple-400 text-xs mt-1">Max size: 5MB</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="relative bg-gradient-to-br from-purple-900/50 to-black rounded-2xl p-4 border border-purple-500/30">
            <div className="flex items-center gap-3 mb-3">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <p className="text-white font-semibold">Receipt Uploaded</p>
            </div>
            <img
              src={receipt}
              alt="Payment receipt"
              className="w-full rounded-lg mb-3"
            />
            <Button
              onClick={handleRemove}
              variant="ghost"
              className="w-full text-red-400 hover:text-red-300 hover:bg-red-900/20"
            >
              <X className="w-4 h-4 mr-2" />
              Remove Receipt
            </Button>
          </div>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Instructions */}
      <div className="bg-purple-900/20 backdrop-blur-sm rounded-xl p-4 mb-6 border border-purple-500/20">
        <p className="text-purple-200 text-sm mb-2 font-semibold">Upload Instructions:</p>
        <ul className="space-y-1 text-purple-300 text-xs list-disc list-inside">
          <li>Take a clear photo of your payment receipt</li>
          <li>Ensure all details are visible</li>
          <li>Upload only valid payment proof</li>
        </ul>
      </div>

      {/* Buttons */}
      <Button
        onClick={handleSubmit}
        disabled={uploading || !receipt}
        className="w-full bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-white font-semibold py-4 rounded-full border border-purple-500/30 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {uploading ? "Submitting..." : "Confirm & Submit"}
      </Button>
    </div>
  );
};

export default UpgradeReceiptUpload;
