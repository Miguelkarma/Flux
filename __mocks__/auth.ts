
export const getAuth = jest.fn(() => ({
  currentUser: { uid: "test-user-id" },
}));

export const onAuthStateChanged = jest.fn((_auth, callback) => {
  callback({ uid: "test-user-id" });
  return jest.fn(); // unsubscribe function
});
