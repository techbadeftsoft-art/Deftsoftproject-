import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Staff, Task, Notification, AuditLog, SystemSettings } from '../types';
import { MOCK_STAFF, MOCK_TASKS, MOCK_NOTIFICATIONS } from '../mockData';

interface AppContextType {
  staff: Staff[];
  tasks: Task[];
  notifications: Notification[];
  auditLogs: AuditLog[];
  settings: SystemSettings;
  currentUser: Staff | null;
  setCurrentUser: (s: Staff | null) => void;
  addStaff: (s: Staff) => void;
  addTask: (t: Task) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  sendNotification: (n: Notification) => void;
  addAuditLog: (log: Omit<AuditLog, 'id' | 'timestamp'>) => void;
  updateSettings: (s: Partial<SystemSettings>) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const DEFAULT_SETTINGS: SystemSettings = {
  companyName: 'Demo Staff Manager',
  timezone: 'UTC+0',
  notificationsEnabled: true,
  autoArchiveDays: 30,
  requirePhotoProof: true,
  requireLocation: true,
};

export function AppProvider({ children }: { children: ReactNode }) {
  const [staff, setStaff] = useState<Staff[]>(() => {
    const saved = localStorage.getItem('staff');
    return saved ? JSON.parse(saved) : MOCK_STAFF;
  });
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('tasks');
    return saved ? JSON.parse(saved) : MOCK_TASKS;
  });
  const [notifications, setNotifications] = useState<Notification[]>(() => {
    const saved = localStorage.getItem('notifications');
    return saved ? JSON.parse(saved) : MOCK_NOTIFICATIONS;
  });
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    const saved = localStorage.getItem('auditLogs');
    return saved ? JSON.parse(saved) : [];
  });
  const [settings, setSettings] = useState<SystemSettings>(() => {
    const saved = localStorage.getItem('settings');
    return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
  });
  const [currentUser, setCurrentUser] = useState<Staff | null>(null);

  // Persistence
  useEffect(() => {
    localStorage.setItem('staff', JSON.stringify(staff));
    localStorage.setItem('tasks', JSON.stringify(tasks));
    localStorage.setItem('notifications', JSON.stringify(notifications));
    localStorage.setItem('auditLogs', JSON.stringify(auditLogs));
    localStorage.setItem('settings', JSON.stringify(settings));
  }, [staff, tasks, notifications, auditLogs, settings]);

  const addStaff = (s: Staff) => {
    setStaff(prev => [...prev, s]);
    addAuditLog({
      userId: 'admin',
      userName: 'Robin',
      action: 'Added Staff',
      details: `Added new staff member: ${s.name}`,
      type: 'Staff'
    });
  };

  const addTask = (t: Task) => {
    setTasks(prev => [t, ...prev]);
    addAuditLog({
      userId: 'admin',
      userName: 'Robin',
      action: 'Created Task',
      details: `Created task: ${t.title}`,
      type: 'Task'
    });
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
    const task = tasks.find(t => t.id === id);
    if (updates.status === 'Completed') {
      addAuditLog({
        userId: task?.assignedTo || 'unknown',
        userName: staff.find(s => s.id === task?.assignedTo)?.name || 'Unknown',
        action: 'Completed Task',
        details: `Completed task: ${task?.title}`,
        type: 'Task'
      });
    }
  };

  const sendNotification = (n: Notification) => setNotifications(prev => [n, ...prev]);

  const addAuditLog = (log: Omit<AuditLog, 'id' | 'timestamp'>) => {
    const newLog: AuditLog = {
      ...log,
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  const updateSettings = (s: Partial<SystemSettings>) => {
    setSettings(prev => ({ ...prev, ...s }));
    addAuditLog({
      userId: 'admin',
      userName: 'Robin',
      action: 'Updated Settings',
      details: 'System settings were modified',
      type: 'System'
    });
  };

  return (
    <AppContext.Provider value={{ 
      staff, 
      tasks, 
      notifications, 
      auditLogs,
      settings,
      currentUser, 
      setCurrentUser, 
      addStaff, 
      addTask, 
      updateTask, 
      sendNotification,
      addAuditLog,
      updateSettings
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
}
