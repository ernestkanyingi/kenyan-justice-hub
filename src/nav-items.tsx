
import { HomeIcon, FileText, Upload, Users, Settings, History } from "lucide-react";

export const navItems = [
  {
    title: "Dashboard",
    to: "/",
    icon: <HomeIcon className="h-4 w-4" />,
  },
  {
    title: "Cases",
    to: "/cases",
    icon: <FileText className="h-4 w-4" />,
  },
  {
    title: "Evidence",
    to: "/evidence",
    icon: <Upload className="h-4 w-4" />,
  },
  {
    title: "Reports",
    to: "/reports",
    icon: <Users className="h-4 w-4" />,
  },
  {
    title: "Admin",
    to: "/admin",
    icon: <Settings className="h-4 w-4" />,
  },
  {
    title: "Audit",
    to: "/audit",
    icon: <History className="h-4 w-4" />,
  },
];
