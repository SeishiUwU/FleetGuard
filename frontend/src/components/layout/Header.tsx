import React, { useState } from 'react';
import { Moon, Sun, Bell, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Switch } from '@/components/ui/switch';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useNotificationContext } from '@/contexts/NotificationContext';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';

interface HeaderProps {
  className?: string;
}

export function Header({ className }: HeaderProps) {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { 
    notifications, 
    unreadCount, 
    markAsRead, 
    markAllAsRead, 
    removeNotification,
    clearAllNotifications 
  } = useNotificationContext();

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    // Add dark mode logic here
    if (isDarkMode) {
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'destination':
        return '🎯';
      case 'alert':
        return '⚠️';
      case 'info':
        return 'ℹ️';
      default:
        return '📌';
    }
  };

  const getNotificationBgColor = (type: string, isRead: boolean) => {
    if (isRead) {
      return 'hover:bg-gray-50';
    }
    
    switch (type) {
      case 'destination':
        return 'bg-green-50 border-l-4 border-l-green-500 hover:bg-green-100';
      case 'alert':
        return 'bg-red-50 border-l-4 border-l-red-500 hover:bg-red-100';
      case 'info':
        return 'bg-blue-50 border-l-4 border-l-blue-500 hover:bg-blue-100';
      default:
        return 'bg-gray-50 border-l-4 border-l-gray-500 hover:bg-gray-100';
    }
  };

  return (
    <header className={cn("bg-white border-b border-gray-200 px-6 py-4", className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <h2 className="text-xl font-semibold text-gray-800">Fleet Dashboard</h2>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Notification Bell */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center animate-pulse">
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0" align="end" sideOffset={8}>
              <div className="border-b border-gray-200 px-4 py-3 bg-gray-50">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900">Notifications</h3>
                  <div className="flex gap-1">
                    {unreadCount > 0 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={markAllAsRead}
                        className="text-xs h-7 px-2 text-blue-600 hover:text-blue-700"
                      >
                        Mark all read
                      </Button>
                    )}
                    {notifications.length > 0 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearAllNotifications}
                        className="text-xs h-7 px-2 text-red-600 hover:text-red-700"
                      >
                        Clear all
                      </Button>
                    )}
                  </div>
                </div>
                {unreadCount > 0 && (
                  <p className="text-xs text-gray-500 mt-1">
                    {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
                  </p>
                )}
              </div>
              
              <ScrollArea className="max-h-96">
                {notifications.length === 0 ? (
                  <div className="p-6 text-center text-gray-500">
                    <Bell className="w-8 h-8 text-gray-300 mx-auto mb-3" />
                    <p className="font-medium">No notifications</p>
                    <p className="text-sm text-gray-400 mt-1">
                      You'll see vehicle updates and alerts here
                    </p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-100">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={cn(
                          "p-4 cursor-pointer relative transition-colors",
                          getNotificationBgColor(notification.type, notification.isRead)
                        )}
                        onClick={() => markAsRead(notification.id)}
                      >
                        <Button
                          variant="ghost"
                          size="sm"
                          className="absolute top-2 right-2 h-6 w-6 p-0 opacity-60 hover:opacity-100"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeNotification(notification.id);
                          }}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                        
                        <div className="flex items-start gap-3 pr-8">
                          <span className="text-lg mt-0.5 flex-shrink-0">
                            {getNotificationIcon(notification.type)}
                          </span>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="text-sm font-semibold text-gray-900 truncate">
                                {notification.title}
                              </h4>
                              {!notification.isRead && (
                                <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                              )}
                            </div>
                            <p className="text-sm text-gray-700 leading-relaxed mb-2">
                              {notification.message}
                            </p>
                            
                            {notification.company && notification.vehicleId && (
                              <div className="flex gap-2 mb-2">
                                <span className="inline-block px-2 py-0.5 text-xs bg-blue-100 text-blue-800 rounded-md font-medium">
                                  {notification.company}
                                </span>
                                <span className="inline-block px-2 py-0.5 text-xs bg-green-100 text-green-800 rounded-md font-medium">
                                  Vehicle {notification.vehicleId}
                                </span>
                              </div>
                            )}
                            
                            <p className="text-xs text-gray-500">
                              {formatDistanceToNow(notification.timestamp, { addSuffix: true })}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
              
              {notifications.length > 0 && (
                <div className="border-t border-gray-200 p-3 bg-gray-50">
                  <p className="text-xs text-gray-500 text-center">
                    Showing {notifications.length} notification{notifications.length !== 1 ? 's' : ''}
                  </p>
                </div>
              )}
            </PopoverContent>
          </Popover>
          
          {/* User Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="gap-2" size="sm">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="https://github.com/shadcn.png" alt="User Avatar" />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <span className="font-medium text-gray-700">John Doe</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem className="flex items-center justify-between cursor-pointer" onClick={(e) => e.preventDefault()}>
                <div className="flex items-center gap-2">
                  {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
                  <span>Night Mode</span>
                </div>
                <Switch 
                  checked={isDarkMode} 
                  onCheckedChange={toggleDarkMode}
                />
              </DropdownMenuItem>
              <DropdownMenuItem>Profile Settings</DropdownMenuItem>
              <DropdownMenuItem>Help & Support</DropdownMenuItem>
              <DropdownMenuItem className="text-red-600">Sign Out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}