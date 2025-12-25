import { useState } from 'react';
import { Bell, BellRing, Clock, MapPin, DollarSign, Building2, Filter, Search, X, CheckCircle, Trash2 } from 'lucide-react';

export default function JobAlerts() {
  const [showOnlyUnread, setShowOnlyUnread] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data for job alerts
  const mockAlerts = [
    {
      id: 1,
      title: "New Frontend Developer position at TechCorp",
      company: "TechCorp Vietnam",
      location: "Ho Chi Minh City",
      salary: "25,000,000 - 35,000,000 VND",
      type: "Full-time",
      isRead: false,
      createdAt: "2024-12-25T10:30:00Z",
      jobId: 1,
      description: "Perfect match for your React.js skills preference"
    },
    {
      id: 2,
      title: "Senior React Developer at StartupXYZ",
      company: "StartupXYZ",
      location: "Ha Noi",
      salary: "30,000,000 - 40,000,000 VND",
      type: "Full-time",
      isRead: false,
      createdAt: "2024-12-25T09:15:00Z",
      jobId: 2,
      description: "Matches your experience level and tech stack"
    },
    {
      id: 3,
      title: "UI/UX Developer at DesignStudio",
      company: "DesignStudio Co.",
      location: "Da Nang",
      salary: "20,000,000 - 28,000,000 VND",
      type: "Full-time",
      isRead: true,
      createdAt: "2024-12-24T16:45:00Z",
      jobId: 3,
      description: "New job matching your frontend skills"
    },
    {
      id: 4,
      title: "JavaScript Developer at WebTech",
      company: "WebTech Solutions",
      location: "Ho Chi Minh City",
      salary: "22,000,000 - 32,000,000 VND",
      type: "Contract",
      isRead: true,
      createdAt: "2024-12-24T14:20:00Z",
      jobId: 4,
      description: "Remote opportunity matching your preferences"
    },
    {
      id: 5,
      title: "Full-Stack Developer at InnovateLab",
      company: "InnovateLab",
      location: "Remote",
      salary: "28,000,000 - 38,000,000 VND",
      type: "Full-time",
      isRead: false,
      createdAt: "2024-12-24T11:30:00Z",
      jobId: 5,
      description: "Great opportunity for Node.js and React experience"
    }
  ];

  const filteredAlerts = mockAlerts.filter(alert => {
    const matchesSearch = alert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         alert.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesReadFilter = showOnlyUnread ? !alert.isRead : true;
    return matchesSearch && matchesReadFilter;
  });

  const unreadCount = mockAlerts.filter(alert => !alert.isRead).length;

  const formatTimeAgo = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    return `${Math.floor(diffInHours / 24)} days ago`;
  };

  const AlertCard = ({ alert }) => (
    <div className={`border rounded-lg p-6 transition-all hover:shadow-md cursor-pointer ${
      alert.isRead ? 'bg-white border-gray-200' : 'bg-blue-50 border-blue-200'
    }`}>
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4 flex-1">
          <div className={`mt-1 ${alert.isRead ? 'text-gray-400' : 'text-blue-500'}`}>
            {alert.isRead ? <Bell size={20} /> : <BellRing size={20} />}
          </div>
          
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className={`text-lg font-semibold ${alert.isRead ? 'text-gray-700' : 'text-gray-900'}`}>
                {alert.title}
              </h3>
              {!alert.isRead && (
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
              )}
            </div>
            
            <p className="text-gray-600 text-sm mb-3">{alert.description}</p>
            
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <Building2 size={14} />
                <span>{alert.company}</span>
              </div>
              
              <div className="flex items-center gap-1">
                <MapPin size={14} />
                <span>{alert.location}</span>
              </div>
              
              <div className="flex items-center gap-1">
                <DollarSign size={14} />
                <span>{alert.salary}</span>
              </div>
              
              <div className="flex items-center gap-1">
                <Clock size={14} />
                <span>{formatTimeAgo(alert.createdAt)}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2 ml-4">
          {!alert.isRead && (
            <button className="text-green-500 hover:text-green-600 p-1" title="Mark as read">
              <CheckCircle size={18} />
            </button>
          )}
          <button className="text-red-500 hover:text-red-600 p-1" title="Delete alert">
            <Trash2 size={18} />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Job Alerts</h1>
              <p className="text-gray-600">Stay updated with new job opportunities that match your preferences</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                {unreadCount} unread
              </div>
            </div>
          </div>
          
          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search alerts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X size={16} />
                </button>
              )}
            </div>
            
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showOnlyUnread}
                  onChange={(e) => setShowOnlyUnread(e.target.checked)}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Show only unread</span>
              </label>
              
              <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <Filter size={16} />
                Manage Alerts
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white border rounded-lg p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Bell className="text-blue-600" size={24} />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{mockAlerts.length}</p>
                <p className="text-gray-600 text-sm">Total Alerts</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white border rounded-lg p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <BellRing className="text-green-600" size={24} />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{unreadCount}</p>
                <p className="text-gray-600 text-sm">Unread</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white border rounded-lg p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Clock className="text-purple-600" size={24} />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">3</p>
                <p className="text-gray-600 text-sm">Today</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white border rounded-lg p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Building2 className="text-orange-600" size={24} />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">5</p>
                <p className="text-gray-600 text-sm">Companies</p>
              </div>
            </div>
          </div>
        </div>

        {/* Alerts List */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Recent Alerts</h2>
              {unreadCount > 0 && (
                <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                  Mark all as read
                </button>
              )}
            </div>
          </div>
          
          <div className="p-6">
            {filteredAlerts.length === 0 ? (
              <div className="text-center py-12">
                <Bell className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No alerts found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {searchTerm ? 'Try adjusting your search terms.' : 'Set up job alerts to get notified about new opportunities.'}
                </p>
                {!searchTerm && (
                  <div className="mt-6">
                    <button className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
                      Create Job Alert
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredAlerts.map((alert) => (
                  <AlertCard key={alert.id} alert={alert} />
                ))}
              </div>
            )}
          </div>
        </div>
        
        {/* Pagination */}
        {filteredAlerts.length > 0 && (
          <div className="mt-6 flex justify-center">
            <nav className="flex items-center gap-2">
              <button className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                Previous
              </button>
              <button className="px-3 py-2 text-sm font-medium text-white bg-blue-600 border border-blue-600 rounded-md">
                1
              </button>
              <button className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
                2
              </button>
              <button className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
                3
              </button>
              <button className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
                Next
              </button>
            </nav>
          </div>
        )}
      </div>
    </div>
  );
}

  const handleMarkAsRead = async (alertId) => {
    try {
      await jobAlertService.markAsRead(alertId);
      fetchAlerts();
      fetchUnreadCount();
    } catch (err) {
      console.error("Error marking alert as read:", err);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const unreadAlertIds = alerts
        .filter(alert => !alert.readAt)
        .map(alert => alert.id);

      if (unreadAlertIds.length === 0) {
        return;
      }

      await jobAlertService.markMultipleAsRead(unreadAlertIds);
      fetchAlerts();
      fetchUnreadCount();
    } catch (err) {
      console.error("Error marking all alerts as read:", err);
    }
  };

  const handleAlertClick = (alert) => {
    if (!alert.readAt) {
      handleMarkAsRead(alert.id);
    }

    if (alert.jobId) {
      navigate(`/job/${alert.jobId}`);
    }
  };

  const handleDeleteAlert = async (alertId, e) => {
    e.stopPropagation();

    if (window.confirm('Are you sure you want to delete this alert?')) {
      try {
        await jobAlertService.deleteAlert(alertId);
        fetchAlerts();
        fetchUnreadCount();
      } catch (err) {
        console.error("Error deleting alert:", err);
      }
    }
  };

  const handleDeleteAllRead = async () => {
    const hasReadAlerts = alerts.some(alert => alert.readAt);

    if (!hasReadAlerts) {
      alert('No read alerts to delete');
      return;
    }

    if (window.confirm('Are you sure you want to delete all read alerts?')) {
      try {
        await jobAlertService.deleteAllReadAlerts();
        fetchAlerts();
        fetchUnreadCount();
      } catch (err) {
        console.error("Error deleting read alerts:", err);
      }
    }
  };

  const getAlertIcon = (type) => {
    switch (type) {
      case 'APPLICATION_APPROVED':
        return (
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        );
      case 'APPLICATION_DECLINED':
        return (
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
        );
      case 'APPLICATION_INTERVIEWING':
        return (
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        );
      case 'JOB_UPDATED':
        return (
          <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
        );
      default:
        return (
          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </div>
        );
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;

    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 60) {
      return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
    } else if (hours < 24) {
      return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
    } else if (days < 7) {
      return `${days} day${days !== 1 ? 's' : ''} ago`;
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">
            Job Alerts
            {unreadCount > 0 && (
              <span className="ml-3 px-3 py-1 bg-blue-600 text-white text-sm rounded-full">
                {unreadCount} new
              </span>
            )}
          </h1>

          <div className="flex gap-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showOnlyUnread}
                onChange={(e) => {
                  setShowOnlyUnread(e.target.checked);
                  setCurrentPage(1);
                }}
                className="w-4 h-4 text-blue-600 rounded"
              />
              <span className="text-sm text-gray-700">Show unread only</span>
            </label>

            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              >
                Mark all as read
              </button>
            )}

            {alerts.some(alert => alert.readAt) && (
              <button
                onClick={handleDeleteAllRead}
                className="px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                Delete all read
              </button>
            )}
          </div>
        </div>

        {loading && (
          <div className="text-center py-10">
            <p className="text-gray-500">Loading alerts...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg">
            {error}
          </div>
        )}

        {!loading && !error && alerts.length === 0 && (
          <div className="bg-white rounded-lg p-12 text-center">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <p className="text-gray-500 text-lg">No job alerts yet</p>
            <p className="text-gray-400 text-sm mt-2">
              You'll receive alerts when employers update your applications or saved jobs
            </p>
          </div>
        )}

        {!loading && !error && alerts.length > 0 && (
          <div className="space-y-3">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className={`bg-white rounded-lg p-4 border hover:shadow-lg transition-all ${
                  !alert.readAt ? 'border-l-4 border-l-blue-600 bg-blue-50' : ''
                }`}
              >
                <div className="flex items-start gap-4">
                  {getAlertIcon(alert.type)}

                  <div
                    className="flex-1 cursor-pointer"
                    onClick={() => handleAlertClick(alert)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-gray-900">{alert.title}</h3>
                        {alert.jobTitle && (
                          <p className="text-sm text-gray-600">
                            {alert.jobTitle}
                            {alert.companyName && ` at ${alert.companyName}`}
                          </p>
                        )}
                      </div>
                      {!alert.readAt && (
                        <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                      )}
                    </div>

                    <p className="text-gray-700 mb-2">{alert.message}</p>

                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>{formatDate(alert.createdAt)}</span>
                      {alert.readAt && (
                        <span className="text-gray-400">Read</span>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={(e) => handleDeleteAlert(alert.id, e)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete alert"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8 flex justify-center gap-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
              className="px-4 py-2 border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              ←
            </button>

            {[...Array(Math.min(totalPages, 5))].map((_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }

              return (
                <button
                  key={i}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`px-4 py-2 rounded ${
                    currentPage === pageNum
                      ? 'bg-blue-600 text-white'
                      : 'border hover:bg-gray-50'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}

            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
              className="px-4 py-2 border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
