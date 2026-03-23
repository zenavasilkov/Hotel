/**
 * API Endpoints Configuration
 */
const API_ENDPOINTS = {
    // Rooms
    ROOMS: '/rooms',
    ROOM_BY_ID: (id) => `/rooms/${id}`,
    ROOMS_BY_CATEGORY: (category) => `/rooms?category=${category}`,

    // Activities
    ACTIVITIES: '/activities',
    ACTIVITY_BY_ID: (id) => `/activities/${id}`,
    ACTIVITIES_BY_CATEGORY: (category) => `/activities?category=${category}`,

    // Users
    USERS: '/users',
    USER_BY_ID: (id) => `/users/${id}`,
    USER_LOGIN: '/users?_login',

    // Bookings
    BOOKINGS: '/bookings',
    BOOKING_BY_ID: (id) => `/bookings/${id}`,
    BOOKINGS_BY_USER: (userId) => `/bookings?userId=${userId}`,

    // News
    NEWS: '/news',
    NEWS_BY_ID: (id) => `/news/${id}`,

    // Special Offers
    OFFERS: '/offers',
    OFFER_BY_ID: (id) => `/offers/${id}`,

    // Reviews
    REVIEWS: '/reviews',
    REVIEWS_BY_ROOM: (roomId) => `/reviews?roomId=${roomId}`,

    // Contacts
    CONTACTS: '/contacts',
    CONTACT_MESSAGE: '/contact-messages'
};

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = API_ENDPOINTS;
}
