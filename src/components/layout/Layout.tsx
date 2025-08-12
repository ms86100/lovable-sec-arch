import { ReactNode } from "react";
import Navbar from "./Navbar";
import RouteTours from "@/components/tour/RouteTours";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <RouteTours />
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
};

export default Layout;