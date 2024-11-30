// src/services/preferencesService.js
const apiUrl = 'http://localhost:3001/api/preferences';

export const getPreferences = async () => {
  const response = await fetch(`${apiUrl}/userId`);
  return response.json();
};

export const updatePreferences = async (preferences) => {
  const response = await fetch(`${apiUrl}/userId`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(preferences),
  });
  return response.json();
};

export const deletePreferences = async () => {
  const response = await fetch(`${apiUrl}/userId`, {
    method: 'DELETE',
  });
  return response.json();
};
