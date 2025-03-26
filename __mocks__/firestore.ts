import { jest } from "@jest/globals";

export const getFirestore = jest.fn(() => ({
  collection,
  addDoc,
  query,
  where,
  orderBy,
  getDocs,
  onSnapshot,
  doc,
  updateDoc,
  deleteDoc,
}));

export const collection = jest.fn(() => "collection-mock");
export const addDoc = jest.fn(() => Promise.resolve({ id: "new-doc-id" }));
export const query = jest.fn(() => "query-mock");
export const where = jest.fn(() => "where-mock");
export const orderBy = jest.fn(() => "orderBy-mock");
export const doc = jest.fn(() => "doc-mock");
export const updateDoc = jest.fn(() => Promise.resolve());
export const deleteDoc = jest.fn(() => Promise.resolve());

export const getDocs = jest.fn(() =>
  Promise.resolve({
    docs: [
      {
        data: () => ({
          id: "existing1",
          serialNo: "SN001",
          assetTag: "AT001",
          firstName: "John",
          lastName: "Doe",
          email: "john.doe@company.com",
          employeeId: "EMP001",
        }),
        id: "existing1",
      },
      {
        data: () => ({
          id: "existing2",
          serialNo: "SN002",
          assetTag: "AT002",
          firstName: "Jane",
          lastName: "Smith",
          email: "jane.smith@company.com",
          employeeId: "EMP002",
        }),
        id: "existing2",
      },
    ],
    empty: false,
  })
);

export const onSnapshot = jest.fn(
  (
    query: any,
    callback: (snapshot: { docs: { id: string; data: () => any }[] }) => void
  ) => {
    callback({
      docs: [
        {
          id: "emp1",
          data: () => ({
            firstName: "John",
            employeeId: "JD001",
            lastName: "Doe",
          }),
        },
      ],
    });
    return jest.fn(); // Return unsubscribe function
  }
);

export const getAuth = jest.fn(() => ({
  onAuthStateChanged: jest.fn(),
}));

export const initializeApp = jest.fn();

export const db = {};
