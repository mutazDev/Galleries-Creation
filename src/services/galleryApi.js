/**
 * Gallery API Service
 *
 * Mock implementation — simulates network requests for gallery creation.
 * TODO: Replace with real API calls when the backend is ready.
 * TODO: Add authorization headers via an auth service/interceptor.
 */

// TODO: Replace with real API base URL from environment config
const API_BASE_URL = '/api/v1';

/**
 * Simulates creating a gallery profile.
 * @param {Object} payload - The gallery data to submit.
 * @returns {Promise<Object>} Simulated API response.
 */
export async function createGallery(payload) {
  // TODO: Replace this mock with a real fetch/axios call:
  // return fetch(`${API_BASE_URL}/galleries`, {
  //   method: 'POST',
  //   headers: {
  //     'Content-Type': 'application/json',
  //     'Authorization': `Bearer ${getAuthToken()}`,  // TODO: wire auth
  //   },
  //   body: JSON.stringify(payload),
  // }).then(res => res.json());

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Simulate a 5% random failure rate for testing error states
      if (Math.random() < 0.05) {
        reject({
          success: false,
          message: 'Server error — please try again later.',
        });
        return;
      }

      resolve({
        success: true,
        data: {
          id: crypto.randomUUID(),
          ...payload,
          createdAt: new Date().toISOString(),
        },
        message: 'Gallery created successfully!',
      });
    }, 1500);
  });
}
