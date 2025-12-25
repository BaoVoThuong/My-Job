import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import jobAlertService from '../../services/jobAlertService';

export default function JobAlerts() {
  const navigate = useNavigate();
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [unreadCount, setUnreadCount] = useState(0);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showOnlyUnread, setShowOnlyUnread] = useState(false);

  const fetchAlerts = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await jobAlertService.getJobAlerts(
        currentPage,
        10,
        showOnlyUnread
      );

      setAlerts(response.data.items || []);
      setTotalPages(response.data.totalPages || 1);
    } catch (err) {
      console.error("Error fetching job alerts:", err);
      setError("Failed to load job alerts");
    } finally {
      setLoading(false);
    }
  }, [currentPage, showOnlyUnread]);

  const fetchUnreadCount = useCallback(async () => {
    try {
      const response = await jobAlertService.getUnreadCount();
      setUnreadCount(response.data.unreadCount || 0);
    } catch (err) {
      console.error("Error fetching unread count:", err);
    }
  }, []);

  useEffect(() => {
    fetchAlerts();
    fetchUnreadCount();
  }, [fetchAlerts, fetchUnreadCount]);

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
                onClick={() => handleAlertClick(alert)}
                className={`bg-white rounded-lg p-4 border hover:shadow-lg transition-all cursor-pointer ${
                  !alert.readAt ? 'border-l-4 border-l-blue-600 bg-blue-50' : ''
                }`}
              >
                <div className="flex items-start gap-4">
                  {getAlertIcon(alert.type)}

                  <div className="flex-1">
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
