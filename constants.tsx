import { CompanyInfo, InternProfile, Skill } from './types';

export const INTERN_DATA: InternProfile = {
  name: "Fa'al Aditya Purnama",
  role: "Network Technician Intern",
  status: "Active",
  idNumber: "MAGANG-2024-001",
  startDate: "2024-01-15",
  monthlyIncome: "Rp 2.850.000",
};

export const SKILLS_DATA: Skill[] = [
  { subject: 'Fiber Optic', A: 90, fullMark: 100 },
  { subject: 'MikroTik', A: 75, fullMark: 100 },
  { subject: 'Troubleshooting', A: 85, fullMark: 100 },
  { subject: 'Splicing', A: 80, fullMark: 100 },
  { subject: 'Wireless Config', A: 70, fullMark: 100 },
  { subject: 'Customer Svc', A: 95, fullMark: 100 },
];

export const COMPANY_DATA: CompanyInfo = {
  name: "PT. Andromega",
  locations: ["Mojokerto", "Gedeg", "Gempol Kerep", "Ngudi Kidul"],
  description: "Penyedia layanan infrastruktur jaringan terdepan yang berfokus pada konektivitas stabil dan solusi internet terpercaya di wilayah Mojokerto dan sekitarnya.",
  services: [
    {
      id: '1',
      title: 'Layanan Internet',
      description: 'High-speed broadband & dedicated internet connection.',
      icon: 'wifi'
    },
    {
      id: '2',
      title: 'Pemasangan',
      description: 'Instalasi jaringan baru, FO drop wire & CPE setup.',
      icon: 'install'
    },
    {
      id: '3',
      title: 'Maintenance',
      description: 'Perbaikan gangguan sinyal & optimasi jaringan rutin.',
      icon: 'wrench'
    }
  ]
};