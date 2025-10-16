"use client";

import { BreadcrumbPage } from "@/components/ui/breadcrumb";
import { usePathname } from "next/navigation";

const BreadcrumbPageClient = ({}) => {
  const path = usePathname();

  const getPageTitle = (path: string) => {
    switch (path) {
      case "/dashboard":
        return "Dashboard";
      case "/dashboard/create":
        return "Create";
      case "/dashboard/settings":
        return "Settings";
      case "/dashboard/project":
        return "Project";
      default:
        return "Dashboard";
    }
  };
  return (
    <BreadcrumbPage className="text-foreground text-sm font-medium">
      {getPageTitle(path)}
    </BreadcrumbPage>
  );
};

export default BreadcrumbPageClient;
