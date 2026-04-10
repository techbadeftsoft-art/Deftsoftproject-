export type Severity = 'Low' | 'Medium' | 'High' | 'Critical';
export type TaskStatus = 'Pending' | 'In Progress' | 'Completed' | 'Overdue' | 'Rejected';
export type Frequency = 'Daily' | 'Weekly' | 'Monthly' | 'Once';

export interface Staff {
  id: string;
  name: string;
  role: string;
  email: string;
  status: 'Active' | 'Inactive';
  performance: {
    onTime: number;
    late: number;
    missed: number;
  };
}

export interface Task {
  id: string;
  title: string;
  description: string;
  acceptanceCriteria: string[];
  icon: string;
  dueTime: string;
  severity: Severity;
  assignedTo: string; // Staff ID
  frequency: Frequency;
  status: TaskStatus;
  startTime?: string;
  endTime?: string;
  proofImage?: string;
  proofMetadata?: {
    timestamp: string;
    location: string;
    ip: string;
  };
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'Task' | 'Announcement' | 'Alert';
  read: boolean;
}

export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  details: string;
  timestamp: string;
  type: 'Security' | 'Task' | 'Staff' | 'System';
}

export interface SystemSettings {
  companyName: string;
  timezone: string;
  notificationsEnabled: boolean;
  autoArchiveDays: number;
  requirePhotoProof: boolean;
  requireLocation: boolean;
}
