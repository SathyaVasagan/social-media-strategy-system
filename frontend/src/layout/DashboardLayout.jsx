import Navbar from "./Navbar";
import BreadcrumbNav from "../components/ui/BreadcrumbNav";

const DashboardLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-6">
        <BreadcrumbNav />

        <div className="mt-6">{children}</div>
      </div>
    </div>
  );
};

export default DashboardLayout;
