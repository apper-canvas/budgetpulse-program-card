import { Outlet } from "react-router-dom";
import BottomNavigation from "@/components/organisms/BottomNavigation";

const Layout = () => {
  return (
    <div className="min-h-screen bg-background pb-16">
      <main className="container mx-auto px-4 py-6 max-w-md">
        <Outlet />
      </main>
      <BottomNavigation />
    </div>
  );
};

export default Layout;