import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  Home,
  VideoIcon,
  LineChart,
  Mail,
  LogOut
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const location = useLocation();

  const handleLogout = () => {
    // Add your logout logic here
    console.log('Logging out...');
  };

  return (
    <div className={cn("hidden md:flex md:w-64 md:flex-col", className)}>
      <div className="flex flex-col flex-grow pt-5 bg-white overflow-y-auto border-r border-gray-200">
        {/* Logo Section with Bigger Plain Logo + Text */}
        <div className="flex items-center flex-shrink-0 px-4 mb-8">
          <Link to="/" className="flex items-center">
            {/* Plain Logo Icon - Made Bigger */}
            <img 
              src="/images/El Logo.png" 
              alt="FleetGuard Logo" 
              className="h-12 w-12 mr-3"
              onError={(e) => {
                // Fallback if logo doesn't load
                e.currentTarget.style.display = 'none';
                const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                if (fallback) fallback.style.display = 'flex';
              }}
            />
            
            {/* Fallback icon (hidden by default) - Also bigger */}
            <div className="hidden items-center justify-center w-12 h-12 bg-blue-600 rounded-lg mr-3">
              <span className="text-white font-bold text-xl">FG</span>
            </div>
            
            {/* FleetGuard Text */}
            <div>
              <h1 className="text-xl font-bold text-gray-900">FleetGuard</h1>
              <p className="text-xs text-gray-500">Safety System</p>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <div className="px-3 py-2">
          <div className="text-xs font-medium text-gray-400 px-4 mb-2">MAIN MENU</div>
          <nav className="space-y-1">
            <Link 
              to="/" 
              className={cn(
                "sidebar-link flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors",
                location.pathname === "/" 
                  ? "bg-blue-100 text-blue-700" 
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              )}
            >
              <Home size={18} className="mr-3" />
              <span>Dashboard</span>
            </Link>
            
            <Link 
              to="/clips" 
              className={cn(
                "sidebar-link flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors",
                location.pathname === "/clips" 
                  ? "bg-blue-100 text-blue-700" 
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              )}
            >
              <VideoIcon size={18} className="mr-3" />
              <span>Clips</span>
            </Link>
            
            <Link 
              to="/analytics" 
              className={cn(
                "sidebar-link flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors",
                location.pathname === "/analytics" 
                  ? "bg-blue-100 text-blue-700" 
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              )}
            >
              <LineChart size={18} className="mr-3" />
              <span>Analytics</span>
            </Link>
          </nav>
        </div>

        <div className="px-3 py-2 mt-6">
          <div className="text-xs font-medium text-gray-400 px-4 mb-2">SUPPORT</div>
          <nav className="space-y-1">
            <Link 
              to="/contact-support" 
              className={cn(
                "sidebar-link flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors",
                location.pathname === "/contact-support" 
                  ? "bg-blue-100 text-blue-700" 
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              )}
            >
              <Mail size={18} className="mr-3" />
              <span>Contact Support</span>
            </Link>
          </nav>
        </div>

        {/* User Profile Section at Bottom */}
        <div className="mt-auto p-4 border-t border-gray-100">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" alt="User Avatar" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">John Doe</p>
              <p className="text-xs text-gray-500 truncate">Fleet Manager</p>
            </div>
            <button 
              onClick={handleLogout}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              title="Logout"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}