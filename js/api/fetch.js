/**
 * Fetch API Utility
 */
const FetchAPI = {
    _dbCache: null,
    /**
     * Make GET request
     * @param {string} endpoint - API endpoint
     * @param {object} params - Query parameters
     * @returns {Promise}
     */
    async get(endpoint, params = {}) {
        try {
            const url = new URL(`${APP_CONFIG.API_BASE_URL}${endpoint}`);

            // Add query parameters
            Object.keys(params).forEach(key => {
                if (params[key] !== undefined && params[key] !== null) {
                    url.searchParams.append(key, params[key]);
                }
            });

            const response = await fetch(url.toString(), {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            // Fallback for static mode without local API server
            return await this.getFromLocalDb(endpoint, params);
        }
    },

    /**
     * Read endpoint data from local db.json when API is unavailable.
     * @param {string} endpoint
     * @param {object} params
     * @returns {Promise<any>}
     */
    async getFromLocalDb(endpoint, params = {}) {
        if (!this._dbCache) {
            const response = await fetch('data/db.json', {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            });

            if (!response.ok) {
                throw new Error(`Failed to load local db.json: ${response.status}`);
            }

            this._dbCache = await response.json();
        }

        const parsed = new URL(endpoint, 'https://local.invalid');
        const [_, collection, id] = parsed.pathname.split('/');
        const queryParams = new URLSearchParams(parsed.search);

        Object.keys(params).forEach(key => {
            if (params[key] !== undefined && params[key] !== null) {
                queryParams.set(key, String(params[key]));
            }
        });

        const data = this._dbCache[collection];
        if (data === undefined) {
            throw new Error(`Collection "${collection}" not found in local db.json`);
        }

        if (!Array.isArray(data)) {
            return data;
        }

        let result = data;

        if (id) {
            const numericId = Number(id);
            return result.find(item => item.id === numericId || String(item.id) === id) || null;
        }

        for (const [key, value] of queryParams.entries()) {
            result = result.filter(item => String(item[key]) === value);
        }

        return result;
    },

    /**
     * Make POST request
     * @param {string} endpoint - API endpoint
     * @param {object} data - Request body
     * @returns {Promise}
     */
    async post(endpoint, data = {}) {
        try {
            const response = await fetch(`${APP_CONFIG.API_BASE_URL}${endpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('POST request failed:', error);
            throw error;
        }
    },

    /**
     * Make PUT request
     * @param {string} endpoint - API endpoint
     * @param {object} data - Request body
     * @returns {Promise}
     */
    async put(endpoint, data = {}) {
        try {
            const response = await fetch(`${APP_CONFIG.API_BASE_URL}${endpoint}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('PUT request failed:', error);
            throw error;
        }
    },

    /**
     * Make PATCH request
     * @param {string} endpoint - API endpoint
     * @param {object} data - Request body
     * @returns {Promise}
     */
    async patch(endpoint, data = {}) {
        try {
            const response = await fetch(`${APP_CONFIG.API_BASE_URL}${endpoint}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('PATCH request failed:', error);
            throw error;
        }
    },

    /**
     * Make DELETE request
     * @param {string} endpoint - API endpoint
     * @returns {Promise}
     */
    async delete(endpoint) {
        try {
            const response = await fetch(`${APP_CONFIG.API_BASE_URL}${endpoint}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('DELETE request failed:', error);
            throw error;
        }
    }
};

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FetchAPI;
}
