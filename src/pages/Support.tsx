import { ArrowLeft, Send, Mail, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Support = () => {
  return (
    <div className="min-h-screen relative overflow-hidden p-3 max-w-md mx-auto">
      {/* Animated Background */}
      <div className="absolute inset-0 animated-bg"></div>

      {/* Page Content */}
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center mb-6 pt-2">
          <Link to="/dashboard" className="mr-3">
            <ArrowLeft className="w-6 h-6 text-white" />
          </Link>
          <h1 className="text-xl font-semibold text-white">Support</h1>
        </div>

        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-white mb-2">
            How can we help you?
          </h2>
          <p className="text-gray-300">
            Choose your preferred way to get support from our team
          </p>
        </div>

        {/* Support Options */}
        <div className="space-y-4">
          {/* Telegram */}
          <div className="bg-black/40 backdrop-blur-lg rounded-2xl p-4 border border-purple-700/40">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-purple-700/20 rounded-full flex items-center justify-center">
                <Send className="w-6 h-6 text-purple-400" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-white mb-1">Telegram Support</h3>
                <p className="text-sm text-gray-300 mb-2">
                  Get instant support through our Telegram channel
                </p>
                <a
                  href="https://t.me/lumexzz"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-purple-400 hover:underline"
                >
                  @lumexzz
                </a>
              </div>
            </div>
          </div>

          {/* Email */}
          <div className="bg-black/40 backdrop-blur-lg rounded-2xl p-4 border border-purple-700/40">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-purple-700/20 rounded-full flex items-center justify-center">
                <Mail className="w-6 h-6 text-purple-400" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-white mb-1">Email Support</h3>
                <p className="text-sm text-gray-300 mb-2">
                  Send us an email and we'll get back to you within 24 hours
                </p>
                <a
                  href="mailto:commanderbenjamin177@gmail.com"
                  className="text-sm text-purple-400 hover:underline"
                >
                  commanderbenjamin177@gmail.com
                </a>
              </div>
            </div>
          </div>

          {/* WhatsApp */}
          <div className="bg-black/40 backdrop-blur-lg rounded-2xl p-4 border border-purple-700/40">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-purple-700/20 rounded-full flex items-center justify-center">
                <MessageCircle className="w-6 h-6 text-purple-400" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-white mb-1">WhatsApp Support</h3>
                <p className="text-sm text-gray-300 mb-2">
                  Chat directly with our support via WhatsApp
                </p>
                <a
                  href="https://wa.me/2349023475704"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-purple-400 hover:underline"
                >
                  +234 902 347 5704
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Inline Animated Background CSS */}
      <style>{`
        @keyframes gradientMove {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animated-bg {
          background: linear-gradient(-45deg, #0a0015, #1a0030, #3b0066, #000000);
          background-size: 400% 400%;
          animation: gradientMove 12s ease infinite;
        }
      `}</style>
    </div>
  );
};

export default Support;
