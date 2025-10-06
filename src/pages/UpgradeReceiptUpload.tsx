import { useState, useRef } from "react";
import { ArrowLeft, Upload, FileText, X } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

export default function UpgradeReceiptUpload() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [receipt, setReceipt] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const plan = searchParams.get("plan") || "";
  const amount = searchParams.get("amount") || "";
  const name = searchParams.get("name") || "";

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select an image smaller than 5MB",
        variant: "destructive",
      });
      return;
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file",
        variant: "destructive",
      });
      return;
    }

    setReceipt(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = () => {
    if (!receipt) {
      toast({
        title: "No receipt uploaded",
        description: "Please upload your payment receipt",
        variant: "destructive",
      });
      return;
    }

    navigate(`/upgrade-confirming?plan=${plan}&amount=${amount}&name=${name}`);
  };

  const removeReceipt = () => {
    setReceipt(null);
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-900 to-black pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-6 sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <Button
            onClick={() => navigate(-1)}
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/20"
          >
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Upload Payment Receipt</h1>
            <p className="text-sm opacity-90">Verify your payment</p>
          </div>
        </div>
      </div>

      <div className="px-6 py-8 space-y-6">
        {/* Plan Summary */}
        <Card className="bg-gradient-to-br from-white to-purple-50 p-6 border-2 border-purple-200">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-600">Plan</p>
              <p className="text-xl font-bold text-purple-600">{name}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Amount Paid</p>
              <p className="text-2xl font-bold text-gray-800">₦{parseInt(amount).toLocaleString()}</p>
            </div>
          </div>
        </Card>

        {/* Upload Area */}
        {!receipt ? (
          <Card
            onClick={() => fileInputRef.current?.click()}
            className="bg-white p-12 border-4 border-dashed border-purple-300 cursor-pointer hover:border-purple-500 transition-all"
          >
            <div className="text-center">
              <Upload className="w-16 h-16 text-purple-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-800 mb-2">Upload Receipt</h3>
              <p className="text-sm text-gray-600 mb-4">
                Click to select your payment receipt
              </p>
              <p className="text-xs text-gray-500">
                Supported formats: JPG, PNG (Max 5MB)
              </p>
            </div>
          </Card>
        ) : (
          <Card className="bg-white p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <FileText className="w-8 h-8 text-purple-600" />
                <div>
                  <p className="font-semibold text-gray-800">{receipt.name}</p>
                  <p className="text-xs text-gray-500">
                    {(receipt.size / 1024).toFixed(2)} KB
                  </p>
                </div>
              </div>
              <Button
                onClick={removeReceipt}
                variant="ghost"
                size="icon"
                className="text-red-500 hover:bg-red-50"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
            {preview && (
              <div className="rounded-lg overflow-hidden border-2 border-gray-200">
                <img src={preview} alt="Receipt preview" className="w-full" />
              </div>
            )}
          </Card>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />

        {/* Submit Button */}
        <Button
          onClick={handleSubmit}
          disabled={!receipt}
          className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-6 text-lg font-semibold disabled:opacity-50"
        >
          Confirm and Submit
        </Button>
      </div>
    </div>
  );
}
