export interface Skill {
  subject: string;
  A: number; // Current Level
  fullMark: number;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  icon: 'wifi' | 'wrench' | 'install';
}

export interface CompanyInfo {
  name: string;
  locations: string[];
  description: string;
  services: Service[];
}

export interface InternProfile {
  name: string;
  role: string;
  status: 'Active' | 'Completed' | 'Pending';
  idNumber: string;
  startDate: string;
  monthlyIncome: string;
}