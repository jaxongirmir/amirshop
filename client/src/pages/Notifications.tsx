import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { apiRequest } from "@/lib/queryClient";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";

interface Notification {
  id: number;
  userId: number;
  message: string;
  read: boolean;
}

export default function Notifications() {
  const { toast } = useToast();
  
  // Fetch notifications
  const { data: notifications = [], isLoading } = useQuery<Notification[]>({
    queryKey: ['/api/notifications'],
  });
  
  // Mark as read mutation
  const markAsReadMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest('PATCH', `/api/notifications/${id}`, { read: true });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/notifications'] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to mark notification as read",
        variant: "destructive",
      });
    },
  });
  
  // Delete notification mutation
  const deleteNotificationMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest('DELETE', `/api/notifications/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/notifications'] });
      toast({
        title: "Notification deleted",
        description: "The notification has been removed",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete notification",
        variant: "destructive",
      });
    },
  });
  
  const handleMarkAsRead = (id: number) => {
    markAsReadMutation.mutate(id);
  };
  
  const handleDelete = (id: number) => {
    deleteNotificationMutation.mutate(id);
  };
  
  const markAllAsRead = () => {
    // Mark all unread notifications as read
    const unreadNotifications = notifications.filter(notification => !notification.read);
    
    unreadNotifications.forEach(notification => {
      markAsReadMutation.mutate(notification.id);
    });
    
    toast({
      title: "Success",
      description: "All notifications marked as read",
    });
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Notifications</h1>
        
        {notifications.some(notification => !notification.read) && (
          <button 
            className="text-accent hover:underline"
            onClick={markAllAsRead}
          >
            Mark all as read
          </button>
        )}
      </div>
      
      {isLoading ? (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="animate-pulse space-y-4">
            {[...Array(3)].map((_, idx) => (
              <div key={idx} className="border-b border-gray-200 pb-4 last:border-0 last:pb-0">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      ) : notifications.length > 0 ? (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="divide-y divide-gray-200">
            {notifications.map((notification) => (
              <div 
                key={notification.id} 
                className={`p-4 hover:bg-gray-50 transition-colors duration-150 ${
                  !notification.read ? 'bg-blue-50' : ''
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-grow">
                    <p className="font-medium text-gray-800 mb-1">{notification.message}</p>
                    <div className="flex items-center text-sm text-gray-500">
                      {!notification.read && (
                        <span className="inline-block w-2 h-2 bg-accent rounded-full mr-2"></span>
                      )}
                      <span>{notification.read ? 'Read' : 'New'}</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    {!notification.read && (
                      <button 
                        className="text-accent hover:text-accent/80"
                        onClick={() => handleMarkAsRead(notification.id)}
                      >
                        <i className="fas fa-check-circle"></i>
                      </button>
                    )}
                    <button 
                      className="text-gray-400 hover:text-secondary"
                      onClick={() => handleDelete(notification.id)}
                    >
                      <i className="fas fa-times-circle"></i>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-lg shadow-sm">
          <div className="mb-4 text-gray-400">
            <i className="far fa-bell text-6xl"></i>
          </div>
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">No notifications</h2>
          <p className="text-gray-500 mb-8">You don't have any notifications yet</p>
          <Link 
            href="/" 
            className="text-accent hover:underline"
          >
            Continue Shopping
          </Link>
        </div>
      )}
    </div>
  );
}
