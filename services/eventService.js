import api from './api';

export const eventService = {
  /**
   * Fetch list of events from backend with search, genre, city, and sorting
   */
  async getEvents({ search = '', genre = 'all', city = 'all', sortBy = 'default' } = {}) {
    try {
      const response = await api.get('/events', {
        params: {
          search,
          genre,
          city,
          sort: sortBy,
        },
      });

      if (response.data?.success) {
        return response.data.data;
      }
      return [];
    } catch (error) {
      console.error('Failed to fetch events from API:', error.message);
      return [];
    }
  },

  /**
   * Get single event detail with venue, artist, and ticket categories from backend
   */
  async getEventById(id) {
    try {
      const response = await api.get(`/events/${id}`);
      if (response.data?.success) {
        return response.data.data;
      }
      return null;
    } catch (error) {
      console.error(`Failed to fetch event ${id} from API:`, error.message);
      return null;
    }
  },

  /**
   * Get real-time seat availability map for an event
   */
  async getSeats(eventId) {
    try {
      const response = await api.get(`/events/${eventId}/seats`);
      if (response.data?.success) {
        return response.data.data;
      }
      return { hasSeatedMap: false, sections: [], occupiedSeats: [] };
    } catch (error) {
      console.error(`Failed to fetch seats for ${eventId}:`, error.message);
      return { hasSeatedMap: false, sections: [], occupiedSeats: [] };
    }
  },

  /**
   * Get genres list from backend
   */
  async getGenres() {
    try {
      const response = await api.get('/genres');
      if (response.data?.success) {
        return response.data.data;
      }
      return [{ id: 'all', name: 'All Genres' }];
    } catch (error) {
      return [{ id: 'all', name: 'All Genres' }];
    }
  },

  /**
   * Get user testimonials from backend
   */
  async getTestimonials() {
    try {
      const response = await api.get('/testimonials');
      if (response.data?.success) {
        return response.data.data;
      }
      return [];
    } catch (error) {
      return [];
    }
  },

  /**
   * Get featured events for homepage carousel
   */
  async getFeaturedEvents() {
    try {
      const response = await api.get('/events', { params: { featured: 'true' } });
      if (response.data?.success) {
        return response.data.data;
      }
      return [];
    } catch (error) {
      return [];
    }
  },
};

export default eventService;
