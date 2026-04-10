import { Staff, Task, Notification } from './types';

export const MOCK_STAFF: Staff[] = [
  {
    id: '1',
    name: 'Joseph',
    role: 'Office Maintenance',
    email: 'joseph@demo.com',
    status: 'Active',
    performance: { onTime: 95, late: 3, missed: 2 }
  },
  {
    id: '2',
    name: 'Mike',
    role: 'Housekeeping',
    email: 'mike@demo.com',
    status: 'Active',
    performance: { onTime: 90, late: 8, missed: 2 }
  },
  {
    id: '3',
    name: 'Blake',
    role: 'Safety Officer',
    email: 'blake@demo.com',
    status: 'Active',
    performance: { onTime: 40, late: 50, missed: 10 }
  },
  {
    id: '4',
    name: 'Julian',
    role: 'Technical Support',
    email: 'julian@demo.com',
    status: 'Active',
    performance: { onTime: 85, late: 10, missed: 5 }
  },
  {
    id: '5',
    name: 'Lucy',
    role: 'Housekeeping',
    email: 'lucy@demo.com',
    status: 'Active',
    performance: { onTime: 88, late: 7, missed: 5 }
  },
  {
    id: '6',
    name: 'William',
    role: 'Office Assistant',
    email: 'william@demo.com',
    status: 'Active',
    performance: { onTime: 75, late: 20, missed: 5 }
  }
];

export const MOCK_TASKS: Task[] = [
  {
    id: 't1',
    title: 'Clean Pantry Area',
    description: 'Deep clean the pantry including surfaces and floor.',
    acceptanceCriteria: ['Surfaces wiped', 'Floor mopped', 'Trash emptied'],
    icon: 'Coffee',
    dueTime: '10:00 AM',
    severity: 'Medium',
    assignedTo: '2',
    frequency: 'Daily',
    status: 'Completed',
    startTime: '09:35 AM',
    endTime: '09:50 AM',
    proofImage: 'https://picsum.photos/seed/pantry/400/300',
    proofMetadata: {
      timestamp: '2026-04-09 09:50 AM',
      location: 'Demo Office, Pantry Area',
      ip: '192.168.1.45'
    }
  },
  {
    id: 't2',
    title: 'Check Fire Extinguishers',
    description: 'Inspect all fire extinguishers for pressure and expiry.',
    acceptanceCriteria: ['Pressure gauge checked', 'Seal intact', 'Expiry date verified'],
    icon: 'ShieldAlert',
    dueTime: '09:00 AM',
    severity: 'Critical',
    assignedTo: '3',
    frequency: 'Weekly',
    status: 'Overdue'
  },
  {
    id: 't3',
    title: 'Generator Diesel Check',
    description: 'Check diesel level in the main generator.',
    acceptanceCriteria: ['Diesel level recorded', 'No leaks detected'],
    icon: 'Zap',
    dueTime: '09:00 AM',
    severity: 'Critical',
    assignedTo: '4',
    frequency: 'Monthly',
    status: 'Completed',
    startTime: '08:55 AM',
    endTime: '09:05 AM'
  },
  {
    id: 't4',
    title: 'Wash Office Washrooms',
    description: 'Complete sanitation of all office washrooms.',
    acceptanceCriteria: ['Floor cleaned', 'Mirrors wiped', 'Soap refilled', 'No odor'],
    icon: 'Droplets',
    dueTime: '11:00 AM',
    severity: 'High',
    assignedTo: '5',
    frequency: 'Daily',
    status: 'In Progress',
    startTime: '10:45 AM'
  },
  {
    id: 't5',
    title: 'Clean Workstations',
    description: 'Dust and sanitize common area workstations.',
    acceptanceCriteria: ['Desks wiped', 'Monitors dusted'],
    icon: 'Monitor',
    dueTime: '11:00 AM',
    severity: 'Medium',
    assignedTo: '6',
    frequency: 'Daily',
    status: 'Pending'
  },
  {
    id: 't6',
    title: 'Lobby Vacuuming',
    description: 'Vacuum the main entrance lobby and reception area.',
    acceptanceCriteria: ['Carpet vacuumed', 'Entrance mats cleaned'],
    icon: 'Wind',
    dueTime: '08:30 AM',
    severity: 'Low',
    assignedTo: '2',
    frequency: 'Daily',
    status: 'Completed',
    startTime: '08:15 AM',
    endTime: '08:40 AM'
  },
  {
    id: 't7',
    title: 'Conference Room Setup',
    description: 'Prepare the main conference room for the morning meeting.',
    acceptanceCriteria: ['Table cleaned', 'Chairs arranged', 'Water bottles placed'],
    icon: 'Users',
    dueTime: '09:30 AM',
    severity: 'High',
    assignedTo: '1',
    frequency: 'Daily',
    status: 'Completed',
    startTime: '09:10 AM',
    endTime: '09:25 AM'
  },
  {
    id: 't8',
    title: 'IT Server Room Dusting',
    description: 'Carefully dust the server room racks and floor.',
    acceptanceCriteria: ['Racks dusted', 'Floor cleaned', 'No cables disturbed'],
    icon: 'Server',
    dueTime: '02:00 PM',
    severity: 'High',
    assignedTo: '4',
    frequency: 'Weekly',
    status: 'Completed',
    startTime: '01:45 PM',
    endTime: '02:15 PM'
  }
];

export const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: 'n1',
    title: 'Upcoming Task: Generator Check',
    message: 'Your generator check task starts in 10 minutes.',
    timestamp: '08:50 AM',
    type: 'Task',
    read: true
  },
  {
    id: 'n2',
    title: 'Urgent Announcement',
    message: 'Office inspection today at 3 PM. Ensure full cleanliness.',
    timestamp: '09:15 AM',
    type: 'Announcement',
    read: false
  },
  {
    id: 'n3',
    title: 'Task Overdue',
    message: 'Fire Safety Check is now overdue.',
    timestamp: '10:30 AM',
    type: 'Alert',
    read: false
  }
];
