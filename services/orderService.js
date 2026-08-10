import api from './api';

export const orderService = {
  /**
   * Fetch all orders for current authenticated user from backend API
   */
  async getOrders() {
    try {
      const response = await api.get('/orders/my');
      if (response.data?.success) {
        return response.data.data;
      }
      return [];
    } catch (error) {
      console.error('Failed to fetch user orders from API:', error.message);
      return [];
    }
  },

  /**
   * Fetch single order detail by ID from backend API
   */
  async getOrderById(orderId) {
    try {
      const response = await api.get(`/orders/${orderId}`);
      if (response.data?.success) {
        return response.data.data;
      }
      return null;
    } catch (error) {
      console.error(`Failed to fetch order ${orderId}:`, error.message);
      return null;
    }
  },

  /**
   * Create a new order in backend MySQL database
   */
  async createOrder(bookingDetails, attendeeInfo, eventData) {
    try {
      const payload = {
        eventId: eventData.id || bookingDetails.eventId,
        categoryName: bookingDetails.categoryName,
        categoryId: bookingDetails.categoryId,
        quantity: bookingDetails.quantity || (bookingDetails.seats ? bookingDetails.seats.length : 1),
        totalPrice: bookingDetails.totalPrice,
        attendeeName: attendeeInfo.fullName,
        attendeeEmail: attendeeInfo.email,
        attendeeId: attendeeInfo.idNumber,
        isSeated: bookingDetails.isSeated || false,
        seats: bookingDetails.seats || [],
      };

      const response = await api.post('/orders', payload);
      if (response.data?.success && response.data?.data) {
        return response.data.data;
      } else {
        throw new Error(response.data?.error || 'Order creation failed');
      }
    } catch (error) {
      const message = error.response?.data?.error || error.message || 'Payment processing failed';
      throw new Error(message);
    }
  },

  /**
   * Admin: Get check-in statistics from backend
   */
  async getAdminStats() {
    try {
      const response = await api.get('/orders/admin/stats');
      if (response.data?.success) {
        return response.data.data;
      }
      return { totalOrders: 0, totalTicketsSold: 0, checkedInCount: 0, pendingCount: 0 };
    } catch (error) {
      console.error('Failed to fetch admin stats:', error.message);
      return { totalOrders: 0, totalTicketsSold: 0, checkedInCount: 0, pendingCount: 0 };
    }
  },

  /**
   * Admin: Search & inspect ticket by ticketCode or orderId
   */
  async verifyTicket(ticketCode) {
    try {
      const response = await api.post('/orders/verify', { ticketCode });
      return response.data;
    } catch (error) {
      if (error.response?.data) {
        return error.response.data;
      }
      throw new Error(error.message || 'Verification request failed');
    }
  },

  /**
   * Admin: Scan QR & Approve Gate Entry for ticketCode
   */
  async scanApproveTicket(ticketCode) {
    try {
      const response = await api.post('/orders/scan-approve', { ticketCode });
      return response.data;
    } catch (error) {
      if (error.response?.data) {
        return error.response.data;
      }
      throw new Error(error.message || 'Approve gate entry failed');
    }
  },
};

export default orderService;

