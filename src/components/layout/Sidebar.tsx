import { NavLink } from "react-router-dom";
import { LayoutDashboard, Boxes, ScanLine, ShoppingCart, FileText, ClipboardList, BarChart3, Settings } from "lucide-react";

const navItemBase = "flex items-center gap-2 px-3 py-2 rounded-md transition-colors";

const Sidebar = () => {
  return (
    <aside className="hidden md:flex flex-col w-64 border-r bg-card text-card-foreground min-h-screen">
      <div className="px-4 py-4 border-b">
        <span className="font-semibold">PharmacyMS</span>
      </div>
      <nav className="p-3 space-y-1">
        <NavLink to="/dashboard" className={({ isActive }) => `${navItemBase} ${isActive ? 'bg-secondary text-secondary-foreground' : 'hover:bg-accent hover:text-accent-foreground'}`}>
          <LayoutDashboard className="size-4" /> Dashboard
        </NavLink>
        <NavLink to="/inventory" className={({ isActive }) => `${navItemBase} ${isActive ? 'bg-secondary text-secondary-foreground' : 'hover:bg-accent hover:text-accent-foreground'}`}>
          <Boxes className="size-4" /> Inventory
        </NavLink>
        <NavLink to="/inventory/new" className={({ isActive }) => `${navItemBase} ${isActive ? 'bg-secondary text-secondary-foreground' : 'hover:bg-accent hover:text-accent-foreground'}`}>
          <ScanLine className="size-4" /> Add Product
        </NavLink>
        <NavLink to="/purchases" className={({ isActive }) => `${navItemBase} ${isActive ? 'bg-secondary text-secondary-foreground' : 'hover:bg-accent hover:text-accent-foreground'}`}>
          <ShoppingCart className="size-4" /> Purchases
        </NavLink>
        <NavLink to="/prescriptions" className={({ isActive }) => `${navItemBase} ${isActive ? 'bg-secondary text-secondary-foreground' : 'hover:bg-accent hover:text-accent-foreground'}`}>
          <ClipboardList className="size-4" /> Prescriptions
        </NavLink>
        <NavLink to="/reports" className={({ isActive }) => `${navItemBase} ${isActive ? 'bg-secondary text-secondary-foreground' : 'hover:bg-accent hover:text-accent-foreground'}`}>
          <BarChart3 className="size-4" /> Reports
        </NavLink>
        <NavLink to="/settings" className={({ isActive }) => `${navItemBase} ${isActive ? 'bg-secondary text-secondary-foreground' : 'hover:bg-accent hover:text-accent-foreground'}`}>
          <Settings className="size-4" /> Settings
        </NavLink>
      </nav>
      <div className="mt-auto p-3 text-xs text-muted-foreground">
        © {new Date().getFullYear()} PharmacyMS
      </div>
    </aside>
  );
};

export default Sidebar;
