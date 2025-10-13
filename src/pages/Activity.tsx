import { ArrowLeft, Calendar, Gift, CheckCircle, TrendingUp, DollarSign } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { BottomNav } from "@/components/BottomNav";

const TASKS = [
  {
    id: "whatsapp",
    title: "Join our WhatsApp Channel",
    description: "Join the WhatsApp channel to stay updated.",
    url: "https://whatsapp.com/channel/0029Vb6eAwH9mrGTeNSKVh1q",
  },
  {
    id: "telegram",
    title: "Join our Telegram Channel",
    description: "Join the Telegram channel for announcements.",
    url: "https://t.me/Plutozanki",
  },
  {
    id: "tiktok",
    title: "Follow us on TikTok",
    description: "Follow our TikTok account.",
    url: "https://www.tiktok.com/@plutozgbv15?_t=ZS-90V5QAYqdoS&_r=1",
  },
  {
    id: "visit_site",
    title: "Visit our Site",
    description: "Visit our site and sign up.",
    url: "https://lumexzz.netlify.app/login?ref=REF94D97212&tab=signup",
  },
];

const Activity = () => {
  const [activeTab, setActiveTab] = useState<"all" | "task" | "checkin">("all");
  const [activities, setActivities] = useState<any[]>([]);
  const [completedTasks, setCompletedTasks] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const allHistory = localStorage.getItem("activityHistory");
    if (allHistory) {
      setActivities(JSON.parse(allHistory));
    }

    const storedCompleted = localStorage.getItem("completedTasks");
    if (storedCompleted) {
      setCompletedTasks(JSON.parse(storedCompleted));
    }
  }, []);

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "check-in":
        return <CheckCircle className="w-5 h-5 text-white" />;
      case "bonus":
        return <Gift className="w-5 h-5 text-white" />;
      case "auto-bonus":
        return <TrendingUp className="w-5 h-5 text-white" />;
      case "referral":
        return <DollarSign className="w-5 h-5 text-white" />;
      default:
        return <Gift className="w-5 h-5 text-white" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case "check-in":
        return "from-green-500 to-green-700";
      case "bonus":
        return "from-yellow-500 to-yellow-700";
      case "auto-bonus":
        return "from-purple-500 to-purple-700";
      case "referral":
        return "from-blue-500 to-blue-700";
      default:
        return "from-gray-500 to-gray-700";
    }
  };

  const filteredActivities =
    activeTab === "all"
      ? activities
      : activities.filter((a) => {
          if (activeTab === "checkin") return a.type === "check-in";
          if (activeTab === "task") return a.type === "task";
          return false;
        });

  // Dashboard balance utilities
  const getDashboardBalance = () => {
    const raw = localStorage.getItem("dashboardBalance");
    const n = raw ? Number(raw) : 0;
    return isNaN(n) ? 0 : n;
  };

  const setDashboardBalance = (value: number) => {
    localStorage.setItem("dashboardBalance", String(value));
    // Trigger custom update event for any dashboard listener
    window.dispatchEvent(new CustomEvent("balanceUpdated", { detail: value }));
  };

  const persistActivityHistory = (newActivities: any[]) => {
    localStorage.setItem("activityHistory", JSON.stringify(newActivities));
  };

  const persistCompletedTasks = (obj: Record<string, boolean>) => {
    localStorage.setItem("completedTasks", JSON.stringify(obj));
  };

  const handleCompleteTask = (task: typeof TASKS[number]) => {
    if (completedTasks[task.id]) return;

    // Open link in new tab
    window.open(task.url, "_blank", "noopener,noreferrer");

    // Mark as completed
    const updatedCompleted = { ...completedTasks, [task.id]: true };
    setCompletedTasks(updatedCompleted);
    persistCompletedTasks(updatedCompleted);

    // Reward logic — add ₦450 to dashboard balance
    const reward = 450;
    const currentBalance = getDashboardBalance();
    const newBalance = currentBalance + reward;
    setDashboardBalance(newBalance);

    // Immediately sync reward visually
    localStorage.setItem("dashboardBalance", String(newBalance));
    window.dispatchEvent(new CustomEvent("balanceUpdated", { detail: newBalance }));

    // Add to activity history
    const entry = {
      type: "task",
      description: `Completed: ${task.title}`,
      amount: reward,
      timestamp: Date.now(),
    };
    const newActivities = [entry, ...activities];
    setActivities(newActivities);
    persistActivityHistory(newActivities);
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
          onClick={() => setActiveTab("all")}
          className={`flex-1 py-2 px-3 rounded-full text-xs font-medium transition-all ${
            activeTab === "all"
              ? "bg-gradient-to-r from-purple-600 to-purple-800 text-white"
              : "text-gray-400"
          }`}
        >
          All
        </button>
        <button
          onClick={() => setActiveTab("task")}
          className={`flex-1 py-2 px-3 rounded-full text-xs font-medium transition-all ${
            activeTab === "task"
              ? "bg-gradient-to-r from-purple-600 to-purple-800 text-white"
              : "text-gray-400"
          }`}
        >
          <Gift className="w-3 h-3 inline mr-1" />
          Task
        </button>
        <button
          onClick={() => setActiveTab("checkin")}
          className={`flex-1 py-2 px-3 rounded-full text-xs font-medium transition-all ${
            activeTab === "checkin"
              ? "bg-gradient-to-r from-purple-600 to-purple-800 text-white"
              : "text-gray-400"
          }`}
        >
          <CheckCircle className="w-3 h-3 inline mr-1" />
          Check-in
        </button>
      </div>

      {/* Content */}
      <div className="space-y-3">
        {/* Must Join Channels Section */}
        {activeTab === "task" && (
          <div className="space-y-3">
            {TASKS.map((task) => {
              const done = !!completedTasks[task.id];
              return (
                <div
                  key={task.id}
                  className={`p-4 rounded-2xl border border-purple-700/40 flex items-center justify-between transition-all duration-500 ${
                    done
                      ? "bg-black/70 shadow-none"
                      : "bg-black/80 animate-pulse-soft"
                  }`}
                >
                  <div>
                    <h4 className="text-white font-semibold">{task.title}</h4>
                    <p className="text-gray-400 text-sm mt-1">
                      {task.description}
                    </p>
                  </div>
                  <div className="flex flex-col items-end">
                    <p className="text-green-400 font-semibold mb-2">+₦450</p>
                    <button
                      onClick={() => handleCompleteTask(task)}
                      disabled={done}
                      className={`px-4 py-2 text-sm font-medium rounded-xl shadow-lg transition-all ${
                        done
                          ? "bg-gray-700 text-gray-300 cursor-default"
                          : "bg-gradient-to-r from-purple-600 to-purple-800 text-white hover:from-purple-700"
                      }`}
                    >
                      {done ? "Completed" : "Complete"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Activity History */}
        {filteredActivities.length === 0 ? (
          <div className="bg-gray-900/50 rounded-2xl p-6 text-center border border-purple-500/20">
            <Calendar className="w-12 h-12 mx-auto mb-3 text-purple-400" />
            <p className="text-gray-400">No activity yet</p>
            <p className="text-gray-500 text-sm mt-2">
              Start earning to see your activity here
            </p>
          </div>
        ) : (
          <div className="bg-gray-900/50 rounded-2xl overflow-hidden border border-purple-500/20">
            <div className="bg-gradient-to-r from-purple-600 to-purple-800 p-4">
              <h3 className="text-white font-semibold">Transaction History</h3>
            </div>
            <div className="divide-y divide-gray-800">
              {filteredActivities.map((activity, index) => (
                <div
                  key={index}
                  className="p-4 flex items-center justify-between hover:bg-gray-800/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 bg-gradient-to-br ${getActivityColor(
                        activity.type
                      )} rounded-full flex items-center justify-center`}
                    >
                      {getActivityIcon(activity.type)}
                    </div>
                    <div>
                      <p className="text-white font-medium">
                        {activity.description}
                      </p>
                      <p className="text-gray-400 text-sm">
                        {formatDate(activity.timestamp)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-green-400 font-semibold">
                      +₦{activity.amount.toLocaleString()}
                    </p>
                    <p className="text-gray-500 text-xs">
                      {formatTime(activity.timestamp)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
};

export default Activity;
