import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function Activity() {
  const [activeTab, setActiveTab] = useState<"task" | "checkin">("checkin");
  const checkinHistory = JSON.parse(localStorage.getItem("checkinHistory") || "[]");

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6 rounded-b-3xl shadow-lg mb-6">
        <h1 className="text-2xl font-bold">Activity History</h1>
        <p className="text-sm opacity-90">Track your rewards and earnings</p>
      </div>

      {/* Tabs */}
      <div className="px-6 mb-6">
        <div className="flex gap-2 bg-white p-2 rounded-full shadow-md">
          <Button
            onClick={() => setActiveTab("task")}
            variant={activeTab === "task" ? "default" : "ghost"}
            className={`flex-1 rounded-full ${
              activeTab === "task" 
                ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white" 
                : "text-gray-600"
            }`}
          >
            Task
          </Button>
          <Button
            onClick={() => setActiveTab("checkin")}
            variant={activeTab === "checkin" ? "default" : "ghost"}
            className={`flex-1 rounded-full ${
              activeTab === "checkin" 
                ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white" 
                : "text-gray-600"
            }`}
          >
            Check-in
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="px-6">
        {activeTab === "task" && (
          <Card className="p-6">
            <p className="text-center text-gray-500">No tasks available yet</p>
          </Card>
        )}

        {activeTab === "checkin" && (
          <Card className="p-6">
            <h2 className="text-lg font-bold mb-4">Earnings History</h2>
            {checkinHistory.length === 0 ? (
              <p className="text-center text-gray-500">No activity yet</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-purple-200">
                      <th className="text-left py-3 px-2 text-sm font-semibold text-purple-900">Type</th>
                      <th className="text-left py-3 px-2 text-sm font-semibold text-purple-900">Amount</th>
                      <th className="text-left py-3 px-2 text-sm font-semibold text-purple-900">Date & Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {checkinHistory.reverse().map((item: any, index: number) => (
                      <tr key={index} className="border-b border-gray-100 hover:bg-purple-50 transition-colors">
                        <td className="py-3 px-2 text-sm">{item.type}</td>
                        <td className="py-3 px-2 text-green-600 font-semibold text-sm">
                          +₦{item.amount.toLocaleString()}
                        </td>
                        <td className="py-3 px-2 text-xs text-gray-600">
                          {formatDate(item.timestamp)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        )}
      </div>
    </div>
  );
}
