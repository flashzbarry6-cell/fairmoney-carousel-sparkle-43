import { ArrowLeft, Calendar, Gift, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

const Activity = () => {
  const [activeTab, setActiveTab] = useState<"task" | "checkin">("checkin");
  const [checkIns, setCheckIns] = useState<any[]>([]);

  useEffect(() => {
    // Load check-in history from localStorage
    const history = localStorage.getItem('checkinHistory');
    if (history) {
      setCheckIns(JSON.parse(history));
    }
  }, []);

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="min-h-screen bg-black p-4 max-w-md mx-auto pb-24">
      {/* Header */}
      <div className="flex items-center mb-6 pt-2">
        <Link to="/dashboard" className="mr-3">
          <ArrowLeft className="w-6 h-6 text-white" />
        </Link>
        <h1 className="text-xl font-semibold text-white">Activity History</h1>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 bg-gray-900 p-1 rounded-full">
        <button
          onClick={() => setActiveTab("task")}
          className={`flex-1 py-2 px-4 rounded-full text-sm font-medium transition-all ${
            activeTab === "task"
              ? "bg-gradient-to-r from-purple-600 to-purple-800 text-white"
              : "text-gray-400"
          }`}
        >
          <Gift className="w-4 h-4 inline mr-2" />
          Task
        </button>
        <button
          onClick={() => setActiveTab("checkin")}
          className={`flex-1 py-2 px-4 rounded-full text-sm font-medium transition-all ${
            activeTab === "checkin"
              ? "bg-gradient-to-r from-purple-600 to-purple-800 text-white"
              : "text-gray-400"
          }`}
        >
          <CheckCircle className="w-4 h-4 inline mr-2" />
          Check-in
        </button>
      </div>

      {/* Content */}
      {activeTab === "task" ? (
        <div className="bg-gray-900/50 rounded-2xl p-6 text-center border border-purple-500/20">
          <Gift className="w-12 h-12 mx-auto mb-3 text-purple-400" />
          <p className="text-gray-400">No tasks completed yet</p>
          <p className="text-gray-500 text-sm mt-2">Complete daily tasks to earn rewards</p>
        </div>
      ) : (
        <div className="space-y-3">
          {checkIns.length === 0 ? (
            <div className="bg-gray-900/50 rounded-2xl p-6 text-center border border-purple-500/20">
              <Calendar className="w-12 h-12 mx-auto mb-3 text-purple-400" />
              <p className="text-gray-400">No check-ins yet</p>
              <p className="text-gray-500 text-sm mt-2">Start checking in daily to earn ₦1,500</p>
            </div>
          ) : (
            <div className="bg-gray-900/50 rounded-2xl overflow-hidden border border-purple-500/20">
              <div className="bg-gradient-to-r from-purple-600 to-purple-800 p-4">
                <h3 className="text-white font-semibold">Check-in History</h3>
              </div>
              <div className="divide-y divide-gray-800">
                {checkIns.map((checkin, index) => (
                  <div key={index} className="p-4 flex items-center justify-between hover:bg-gray-800/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-700 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-white font-medium">Daily Check-in</p>
                        <p className="text-gray-400 text-sm">{formatDate(checkin.timestamp)}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-green-400 font-semibold">+₦1,500</p>
                      <p className="text-gray-500 text-xs">{formatTime(checkin.timestamp)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Activity;
