import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Bell, 
  User, 
  LayoutDashboard, 
  ChevronRight,
  Camera,
  MapPin,
  Wifi,
  ArrowLeft,
  Settings as SettingsIcon,
  LogOut,
  Info
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Task, TaskStatus, Severity } from '../types';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate, Routes, Route, useLocation, useParams, Navigate } from 'react-router-dom';

export function MobileApp() {
  const navigate = useNavigate();
  const location = useLocation();
  const { tasks, notifications, staff, updateTask, currentUser } = useApp();
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [capturingTaskId, setCapturingTaskId] = useState<string | null>(null);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  React.useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
    }
  };

  const InstallButton = () => {
    if (!deferredPrompt) return null;
    return (
      <button 
        onClick={handleInstallClick}
        className="w-full flex items-center justify-between p-4 bg-indigo-50 border border-indigo-100 rounded-2xl text-sm font-bold text-indigo-700 hover:bg-indigo-100 transition-colors mb-4 group"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
             <LayoutDashboard className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-left">
            <p className="leading-tight">Install Staff App</p>
            <p className="text-[10px] text-indigo-400 font-medium">Add to your home screen</p>
          </div>
        </div>
        <ChevronRight className="w-4 h-4 text-indigo-400" />
      </button>
    );
  };

  if (!currentUser) return <Navigate to="/staff-login" replace />;

  const activeTab = location.pathname.split('/')[2] || 'tasks';

  const getSeverityColor = (severity: Severity) => {
    switch (severity) {
      case 'Critical': return 'text-red-600 bg-red-50 border-red-100';
      case 'High': return 'text-orange-600 bg-orange-50 border-orange-100';
      case 'Medium': return 'text-blue-600 bg-blue-50 border-blue-100';
      case 'Low': return 'text-slate-600 bg-slate-50 border-slate-100';
    }
  };

  const getStatusIcon = (status: TaskStatus) => {
    switch (status) {
      case 'Completed': return <CheckCircle2 className="w-5 h-5 text-emerald-500" />;
      case 'In Progress': return <Clock className="w-5 h-5 text-amber-500 animate-pulse" />;
      case 'Overdue': return <AlertCircle className="w-5 h-5 text-red-500" />;
      default: return <div className="w-5 h-5 rounded-full border-2 border-slate-200" />;
    }
  };

  const handleStartTask = (taskId: string) => {
    updateTask(taskId, { status: 'In Progress', startTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) });
  };

  const handleCompleteTask = (taskId: string) => {
    const endTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    updateTask(taskId, { 
      status: 'Completed', 
      endTime,
      proofImage: 'https://picsum.photos/seed/completed/400/300',
      proofMetadata: {
        timestamp: new Date().toLocaleString(),
        location: 'Demo Office, Pantry Area',
        ip: '192.168.1.45'
      }
    });
    setIsCameraOpen(false);
    setCapturingTaskId(null);
  };

  // Sub-components for routes
  const TaskList = () => (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="p-6 space-y-6"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-slate-900">Today's Tasks</h3>
        <span className="text-xs font-bold bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full">
          {tasks.filter(t => t.assignedTo === currentUser.id).length} Assigned
        </span>
      </div>

      <div className="space-y-4">
        {tasks.filter(t => t.assignedTo === currentUser.id).map((task) => (
          <button 
            key={task.id}
            onClick={() => navigate(`/staff/tasks/${task.id}`)}
            className="w-full bg-white border border-slate-100 rounded-2xl p-4 flex items-center gap-4 hover:border-indigo-100 hover:shadow-md transition-all text-left group"
          >
            <div className={cn("p-3 rounded-xl transition-colors", getSeverityColor(task.severity))}>
              {getStatusIcon(task.status)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <h4 className="font-bold text-slate-900 truncate group-hover:text-indigo-600 transition-colors">{task.title}</h4>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{task.dueTime}</span>
              </div>
              <p className="text-xs text-slate-500 truncate">{task.description}</p>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-400 transition-all group-hover:translate-x-1" />
          </button>
        ))}
      </div>
    </motion.div>
  );

  const TaskDetail = () => {
    const { taskId } = useParams();
    const task = tasks.find(t => t.id === taskId);

    if (!task) return <Navigate to="/staff/tasks" />;

    return (
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className="p-6 space-y-8"
      >
        <button 
          onClick={() => navigate('/staff/tasks')}
          className="flex items-center gap-2 text-slate-400 text-sm font-bold hover:text-slate-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Tasks
        </button>

        <div>
          <div className={cn("inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest mb-4 border", getSeverityColor(task.severity))}>
            {task.severity} Priority
          </div>
          <h1 className="text-3xl font-black text-slate-900 mb-3 leading-tight">{task.title}</h1>
          <p className="text-slate-500 leading-relaxed text-sm">{task.description}</p>
        </div>

        <div className="bg-slate-50 rounded-3xl p-6 border border-slate-100">
          <h4 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-indigo-600" />
            Acceptance Criteria
          </h4>
          <ul className="space-y-4">
            {task.acceptanceCriteria.map((criterion, idx) => (
              <li key={idx} className="flex items-start gap-3 text-sm text-slate-600">
                <div className={cn(
                  "w-5 h-5 rounded-lg border flex-shrink-0 mt-0.5 flex items-center justify-center transition-colors",
                  task.status === 'Completed' ? "bg-emerald-500 border-emerald-500" : "border-slate-300 bg-white"
                )}>
                  {task.status === 'Completed' && <CheckCircle2 className="w-3 h-3 text-white" />}
                </div>
                <span className={cn(task.status === 'Completed' && "line-through text-slate-400")}>
                  {criterion}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-4">
          {task.status === 'Pending' && (
            <button 
              onClick={() => handleStartTask(task.id)}
              className="w-full bg-indigo-600 text-white font-bold py-5 rounded-2xl shadow-xl shadow-indigo-100 active:scale-[0.98] transition-all text-lg"
            >
              Start Task
            </button>
          )}
          {task.status === 'In Progress' && (
            <button 
              onClick={() => {
                setCapturingTaskId(task.id);
                setIsCameraOpen(true);
              }}
              className="w-full bg-emerald-600 text-white font-bold py-5 rounded-2xl shadow-xl shadow-emerald-100 flex items-center justify-center gap-3 active:scale-[0.98] transition-all text-lg"
            >
              <Camera className="w-6 h-6" />
              Complete with Photo Proof
            </button>
          )}
          {task.status === 'Completed' && (
            <div className="bg-emerald-50 border border-emerald-100 rounded-3xl p-6 flex items-center gap-4">
              <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-emerald-100">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <p className="text-emerald-900 font-black text-lg">Task Completed</p>
                <p className="text-emerald-700 text-xs font-medium uppercase tracking-wider">Submitted at {task.endTime}</p>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    );
  };

  const StatsView = () => (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="p-6 space-y-8"
    >
      <h3 className="text-xl font-black text-slate-900">Performance Dashboard</h3>
      
      <div className="grid grid-cols-1 gap-6">
        <div className="bg-indigo-600 rounded-[2.5rem] p-10 text-white shadow-2xl shadow-indigo-100 relative overflow-hidden">
          <div className="relative z-10">
            <p className="text-indigo-100 text-xs font-bold uppercase tracking-widest mb-2">On-Time Completion</p>
            <h2 className="text-6xl font-black mb-6 tracking-tighter">{currentUser.performance.onTime}%</h2>
            <div className="w-full bg-white/20 h-3 rounded-full overflow-hidden backdrop-blur-sm">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${currentUser.performance.onTime}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="bg-white h-full shadow-[0_0_15px_rgba(255,255,255,0.5)]" 
              />
            </div>
          </div>
          <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute -left-10 -top-10 w-32 h-32 bg-indigo-400/20 rounded-full blur-2xl" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm">
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-2">Late Starts</p>
            <h4 className="text-3xl font-black text-amber-500">{currentUser.performance.late}%</h4>
            <div className="mt-2 text-[10px] text-amber-600 font-bold bg-amber-50 px-2 py-0.5 rounded-full inline-block">Needs Improvement</div>
          </div>
          <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm">
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-2">Missed Tasks</p>
            <h4 className="text-3xl font-black text-red-500">{currentUser.performance.missed}%</h4>
            <div className="mt-2 text-[10px] text-red-600 font-bold bg-red-50 px-2 py-0.5 rounded-full inline-block">Critical Alert</div>
          </div>
        </div>
      </div>

      <div className="bg-slate-50 rounded-3xl p-6 border border-slate-100">
        <h4 className="font-bold text-slate-900 mb-6 flex items-center justify-between">
          Weekly Activity
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Last 7 Days</span>
        </h4>
        <div className="flex items-end justify-between h-32 px-2">
          {[40, 70, 45, 90, 65, 80, 50].map((h, i) => (
            <div key={i} className="flex flex-col items-center gap-3">
              <motion.div 
                initial={{ height: 0 }}
                animate={{ height: `${h}%` }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className={cn(
                  "w-10 rounded-t-xl transition-all duration-300 shadow-sm", 
                  i === 3 ? "bg-indigo-600" : "bg-indigo-200"
                )} 
              />
              <span className="text-[10px] font-black text-slate-400">
                {['M', 'T', 'W', 'T', 'F', 'S', 'S'][i]}
              </span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );

  const NotificationsView = () => (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="p-6 space-y-6"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-black text-slate-900">Notifications</h3>
        <button className="text-xs font-bold text-indigo-600">Mark all as read</button>
      </div>
      <div className="space-y-4">
        {notifications.map((notif) => (
          <div 
            key={notif.id}
            className={cn(
              "p-5 rounded-3xl border transition-all relative overflow-hidden",
              notif.read ? "bg-white border-slate-100" : "bg-indigo-50/50 border-indigo-100 shadow-sm"
            )}
          >
            {!notif.read && <div className="absolute top-0 left-0 w-1 h-full bg-indigo-600" />}
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className={cn(
                  "p-2 rounded-xl",
                  notif.type === 'Alert' ? "bg-red-50 text-red-500" :
                  notif.type === 'Announcement' ? "bg-indigo-50 text-indigo-500" : "bg-amber-50 text-amber-500"
                )}>
                  {notif.type === 'Alert' && <AlertCircle className="w-4 h-4" />}
                  {notif.type === 'Announcement' && <Bell className="w-4 h-4" />}
                  {notif.type === 'Task' && <Clock className="w-4 h-4" />}
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{notif.type}</span>
              </div>
              <span className="text-[10px] font-bold text-slate-400">{notif.timestamp}</span>
            </div>
            <h4 className="font-bold text-slate-900 mb-1">{notif.title}</h4>
            <p className="text-xs text-slate-500 leading-relaxed">{notif.message}</p>
          </div>
        ))}
      </div>
    </motion.div>
  );

  const SettingsView = () => (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="p-6 space-y-8"
    >
      <h3 className="text-xl font-black text-slate-900">App Settings</h3>
      
      <div className="space-y-4">
        <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm">
          <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">Profile Information</h4>
          <div className="flex items-center gap-4 mb-6">
            <div className="w-20 h-20 bg-slate-100 rounded-3xl flex items-center justify-center text-3xl font-black text-slate-300 relative group cursor-pointer">
              {currentUser.name[0]}
              <div className="absolute inset-0 bg-black/20 rounded-3xl opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                <Camera className="text-white w-6 h-6" />
              </div>
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-lg">{currentUser.name}</h4>
              <p className="text-sm text-slate-500 mb-2">{currentUser.email}</p>
              <span className="text-[10px] font-bold bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full uppercase tracking-wider">Active Employee</span>
            </div>
          </div>
          <div className="space-y-3">
            <button 
              onClick={() => navigate('/staff/profile')}
              className="w-full flex items-center justify-between p-4 bg-slate-50 rounded-2xl text-sm font-bold text-slate-700 hover:bg-slate-100 transition-colors"
            >
              Edit Profile Details <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>
            <button className="w-full flex items-center justify-between p-4 bg-slate-50 rounded-2xl text-sm font-bold text-slate-700 hover:bg-slate-100 transition-colors">
              Change Password <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>
          </div>
        </div>

        <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm">
          <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">Device & App</h4>
          <div className="space-y-4">
            <InstallButton />
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-slate-900">Push Notifications</p>
                <p className="text-[10px] text-slate-500">Get task alerts and updates</p>
              </div>
              <div className="w-12 h-6 bg-indigo-600 rounded-full relative p-1 cursor-pointer">
                <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-slate-900">Location Services</p>
                <p className="text-[10px] text-slate-500">Required for task verification</p>
              </div>
              <div className="w-12 h-6 bg-indigo-600 rounded-full relative p-1 cursor-pointer">
                <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm">
          <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">Support</h4>
          <div className="space-y-3">
            <button 
              onClick={() => navigate('/staff/help')}
              className="w-full flex items-center gap-3 p-4 bg-slate-50 rounded-2xl text-sm font-bold text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <Info className="w-5 h-5 text-indigo-600" /> Help Center
            </button>
            <button className="w-full flex items-center gap-3 p-4 bg-slate-50 rounded-2xl text-sm font-bold text-slate-700 hover:bg-slate-100 transition-colors">
              <AlertCircle className="w-5 h-5 text-red-500" /> Report an Issue
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );

  const HelpView = () => (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="p-6 space-y-8"
    >
      <button 
        onClick={() => navigate('/staff/settings')}
        className="flex items-center gap-2 text-slate-400 text-sm font-bold hover:text-slate-600 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Setup
      </button>

      <h3 className="text-2xl font-black text-slate-900">Help Center</h3>

      <div className="space-y-4">
        {[
          { q: 'How do I submit proof?', a: 'Tap on a task, start it, and then use the "Complete with Photo Proof" button to capture and submit evidence.' },
          { q: 'What if I am offline?', a: 'The app works offline! Your submissions will be queued and synced automatically when you regain connection.' },
          { q: 'How are KPIs calculated?', a: 'Your score is based on on-time completions versus late or missed tasks over the last 30 days.' },
        ].map((faq, i) => (
          <div key={i} className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm">
            <h4 className="font-bold text-slate-900 mb-2">{faq.q}</h4>
            <p className="text-sm text-slate-500 leading-relaxed">{faq.a}</p>
          </div>
        ))}
      </div>

      <div className="bg-indigo-600 rounded-[2rem] p-8 text-white">
        <h4 className="text-lg font-bold mb-2">Still need help?</h4>
        <p className="text-indigo-100 text-sm mb-6">Our support team is available 24/7 to assist you with any issues.</p>
        <button className="w-full py-4 bg-white text-indigo-600 rounded-2xl font-bold shadow-lg">
          Contact Support
        </button>
      </div>
    </motion.div>
  );

  const ProfileView = () => (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="p-6 space-y-8"
    >
      <button 
        onClick={() => navigate('/staff/settings')}
        className="flex items-center gap-2 text-slate-400 text-sm font-bold hover:text-slate-600 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Setup
      </button>

      <h3 className="text-2xl font-black text-slate-900">Edit Profile</h3>
      
      <div className="space-y-6">
        <div className="flex justify-center">
          <div className="relative">
            <div className="w-32 h-32 bg-slate-100 rounded-[2.5rem] flex items-center justify-center text-4xl font-black text-slate-300">
              {currentUser.name[0]}
            </div>
            <button className="absolute bottom-0 right-0 w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg border-4 border-white">
              <Camera className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Full Name</label>
            <input 
              type="text" 
              defaultValue={currentUser.name}
              className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all bg-slate-50/50"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Email Address</label>
            <input 
              type="email" 
              defaultValue={currentUser.email}
              className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all bg-slate-50/50"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Phone Number</label>
            <input 
              type="tel" 
              placeholder="+1 (555) 000-0000"
              className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all bg-slate-50/50"
            />
          </div>
        </div>

        <button className="w-full bg-indigo-600 text-white font-bold py-5 rounded-2xl shadow-xl shadow-indigo-100 active:scale-[0.98] transition-all">
          Save Changes
        </button>
      </div>
    </motion.div>
  );

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen shadow-2xl relative flex flex-col overflow-hidden font-sans">
      {/* Header */}
      <header className="px-6 pt-12 pb-6 bg-white border-b border-slate-100 sticky top-0 z-20">
        <div className="flex items-center justify-between mb-4">
          <img 
            src="https://deftsoft.com/wp-content/uploads/2025/08/deft-logo2.svg" 
            alt="Deftsoft Logo" 
            className="h-6 w-auto"
          />
          <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black tracking-widest">
            <Wifi className="w-3 h-3" /> ONLINE
          </div>
        </div>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-100">
              {currentUser.name[0]}
            </div>
            <div>
              <h2 className="font-bold text-slate-900 leading-none">{currentUser.name}</h2>
              <span className="text-xs text-slate-500">{currentUser.role}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => navigate('/staff/notifications')}
              className="p-2 text-slate-400 hover:text-indigo-600 relative"
            >
              <Bell className="w-5 h-5" />
              {notifications.some(n => !n.read) && (
                <div className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
              )}
            </button>
            <button 
              onClick={() => {
                setCurrentUser(null);
                navigate('/');
              }} 
              className="p-2 text-slate-400 hover:text-red-500"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pb-24">
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="tasks" element={<TaskList />} />
            <Route path="tasks/:taskId" element={<TaskDetail />} />
            <Route path="stats" element={<StatsView />} />
            <Route path="notifications" element={<NotificationsView />} />
            <Route path="settings" element={<SettingsView />} />
            <Route path="profile" element={<ProfileView />} />
            <Route path="help" element={<HelpView />} />
            <Route path="*" element={<Navigate to="tasks" replace />} />
          </Routes>
        </AnimatePresence>
      </main>

      {/* Camera Overlay (Simulated) */}
      <AnimatePresence>
        {isCameraOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 bg-black flex flex-col"
          >
            <div className="flex-1 relative flex items-center justify-center">
              <div className="absolute top-12 left-6 right-6 flex justify-between items-center z-10">
                <button onClick={() => setIsCameraOpen(false)} className="text-white p-3 bg-black/40 rounded-full backdrop-blur-xl border border-white/10">
                  <ArrowLeft className="w-6 h-6" />
                </button>
                <div className="bg-black/40 backdrop-blur-xl border border-white/10 px-4 py-2 rounded-full text-white text-[10px] font-black flex items-center gap-3 tracking-widest">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.8)]" />
                  LIVE VERIFICATION
                </div>
              </div>

              {/* Simulated Camera Viewfinder */}
              <div className="w-full h-full bg-slate-900 flex items-center justify-center overflow-hidden">
                <img 
                  src="https://picsum.photos/seed/pantry/800/1200" 
                  alt="Camera View" 
                  className="w-full h-full object-cover opacity-80 scale-110"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 border-[40px] border-black/60 pointer-events-none" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 border-2 border-white/40 rounded-[3rem] pointer-events-none flex items-center justify-center">
                   <div className="w-4 h-4 border-t-2 border-l-2 border-white absolute top-0 left-0 rounded-tl-xl" />
                   <div className="w-4 h-4 border-t-2 border-r-2 border-white absolute top-0 right-0 rounded-tr-xl" />
                   <div className="w-4 h-4 border-b-2 border-l-2 border-white absolute bottom-0 left-0 rounded-bl-xl" />
                   <div className="w-4 h-4 border-b-2 border-r-2 border-white absolute bottom-0 right-0 rounded-br-xl" />
                </div>
              </div>

              {/* Metadata Overlay */}
              <div className="absolute bottom-36 left-8 right-8 space-y-3">
                <div className="flex items-center gap-3 text-white text-[10px] font-black tracking-widest bg-black/40 backdrop-blur-xl px-4 py-2 rounded-2xl border border-white/10 w-fit">
                  <Clock className="w-3.5 h-3.5 text-indigo-400" /> {new Date().toLocaleTimeString()}
                </div>
                <div className="flex items-center gap-3 text-white text-[10px] font-black tracking-widest bg-black/40 backdrop-blur-xl px-4 py-2 rounded-2xl border border-white/10 w-fit">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400" /> DEMO-HQ-PANTRY-01
                </div>
                <div className="flex items-center gap-3 text-white text-[10px] font-black tracking-widest bg-black/40 backdrop-blur-xl px-4 py-2 rounded-2xl border border-white/10 w-fit">
                  <Wifi className="w-3.5 h-3.5 text-blue-400" /> 192.168.1.45 (SECURE)
                </div>
              </div>
            </div>

            <div className="h-48 bg-black flex items-center justify-center gap-16 relative">
              <div className="w-14 h-14 rounded-2xl border-2 border-white/10 flex items-center justify-center">
                <div className="w-10 h-10 bg-white/5 rounded-xl" />
              </div>
              <button 
                onClick={() => {
                  if (capturingTaskId) handleCompleteTask(capturingTaskId);
                }}
                className="w-24 h-24 rounded-full border-4 border-white/30 p-1.5 hover:scale-105 transition-transform active:scale-95"
              >
                <div className="w-full h-full bg-white rounded-full shadow-[0_0_30px_rgba(255,255,255,0.3)]" />
              </button>
              <div className="w-14 h-14 rounded-2xl border-2 border-white/10 flex items-center justify-center">
                <div className="w-10 h-10 bg-white/5 rounded-xl" />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation */}
      <nav className="h-24 bg-white/80 backdrop-blur-xl border-t border-slate-100 flex items-center justify-around px-8 sticky bottom-0 z-20">
        {[
          { id: 'tasks', icon: LayoutDashboard, label: 'Tasks' },
          { id: 'stats', icon: User, label: 'Stats' },
          { id: 'notifications', icon: Bell, label: 'Alerts' },
          { id: 'settings', icon: SettingsIcon, label: 'Setup' },
        ].map((item) => (
          <button 
            key={item.id}
            onClick={() => navigate(`/staff/${item.id}`)}
            className={cn(
              "flex flex-col items-center gap-1.5 transition-all relative py-2 px-4 rounded-2xl",
              activeTab === item.id ? "text-indigo-600 bg-indigo-50" : "text-slate-400 hover:text-slate-600"
            )}
          >
            <item.icon className={cn("w-6 h-6 transition-transform", activeTab === item.id && "scale-110")} />
            <span className="text-[9px] font-black uppercase tracking-[0.15em]">{item.label}</span>
            {item.id === 'notifications' && notifications.some(n => !n.read) && (
              <div className="absolute top-2 right-4 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
            )}
          </button>
        ))}
      </nav>
    </div>
  );
}
