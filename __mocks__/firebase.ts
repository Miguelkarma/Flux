export const getFirestore = jest.fn(() => ({
  collection: jest.fn(),
}));

export const getAuth = jest.fn(() => ({
  onAuthStateChanged: jest.fn(),
}));

export const initializeApp = jest.fn();

export const db = {};
