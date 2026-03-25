/**
 * API Endpoints Configuration
 */
const API_ENDPOINTS = {
    ROOMS: '/rooms',
    ROOM_BY_ID: (id) => `/rooms/${id}`,
    ROOMS_BY_CATEGORY: (category) => `/rooms?category=${category}`,

    ACTIVITIES: '/activities',
    ACTIVITY_BY_ID: (id) => `/activities/${id}`,
    ACTIVITIES_BY_CATEGORY: (category) => `/activities?category=${category}`,

    USERS: '/users',
    USER_BY_ID: (id) => `/users/${id}`,
    USER_LOGIN: '/users?_login',

    BOOKINGS: '/bookings',
    BOOKING_BY_ID: (id) => `/bookings/${id}`,
    BOOKINGS_BY_USER: (userId) => `/bookings?userId=${userId}`,

    NEWS: '/news',
    NEWS_BY_ID: (id) => `/news/${id}`,

    OFFERS: '/offers',
    OFFER_BY_ID: (id) => `/offers/${id}`,

    REVIEWS: '/reviews',
    REVIEWS_BY_ROOM: (roomId) => `/reviews?roomId=${roomId}`,

    CONTACTS: '/contacts',
    CONTACT_MESSAGE: '/contact-messages'
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = API_ENDPOINTS;
}
