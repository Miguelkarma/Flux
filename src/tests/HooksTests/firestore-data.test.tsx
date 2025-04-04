import { renderHook, act } from "@testing-library/react";
import { useFirestoreData } from "@/hooks/tableHooks/firestore-data-hook";
import * as firestore from "firebase/firestore";

// mock firebase firestore
jest.mock("firebase/firestore", () => ({
  collection: jest.fn(),
  onSnapshot: jest.fn(),
  query: jest.fn(),
  where: jest.fn(),
  orderBy: jest.fn(),
}));

jest.mock("@/firebase/firebase", () => ({
  db: {},
}));

describe("useFirestoreData", () => {
  const mockData = [
    { id: "1", name: "John Doe", userId: "user123" },
    { id: "2", name: "Jane Smith", userId: "user123" },
  ];

  beforeEach(() => {
    jest.clearAllMocks();

    // mock onSnapshot to trigger callback with mock data
    (firestore.onSnapshot as jest.Mock).mockImplementation(
      (_query, callback) => {
        setTimeout(() => {
          callback({
            docs: mockData.map((item) => ({
              id: item.id,
              data: () => ({ ...item }),
            })),
          });
        }, 0);
        return jest.fn(); // unsubscribe mock
      }
    );

    // mock firestore functions
    (firestore.collection as jest.Mock).mockReturnValue({});
    (firestore.query as jest.Mock).mockReturnValue({});
    (firestore.where as jest.Mock).mockReturnValue({});
    (firestore.orderBy as jest.Mock).mockReturnValue({});
  });

  test("fetches data from firestore", async () => {
    const { result } = renderHook(() =>
      useFirestoreData({
        collectionName: "employees",
        userId: "user123",
      })
    );

    // loading should be true initially
    expect(result.current.loading).toBe(true);

    // wait for hook to update
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    // loading should be false, data populated
    expect(result.current.loading).toBe(false);
    expect(result.current.data).toEqual(mockData);

    // firestore functions should be called
    expect(firestore.collection).toHaveBeenCalledWith({}, "employees");
    expect(firestore.where).toHaveBeenCalledWith("userId", "==", "user123");
    expect(firestore.orderBy).toHaveBeenCalledWith("dateAdded", "desc");
    expect(firestore.query).toHaveBeenCalled();
    expect(firestore.onSnapshot).toHaveBeenCalled();
  });

  test("returns empty array when userId is null", () => {
    const { result } = renderHook(() =>
      useFirestoreData({
        collectionName: "employees",
        userId: null,
      })
    );

    expect(result.current.loading).toBe(false);
    expect(result.current.data).toEqual([]);
    expect(firestore.onSnapshot).not.toHaveBeenCalled();
  });

  test("refreshData triggers loading state", async () => {
    let snapshotCallback: (snapshot: {
      docs: {
        id: string;
        data: () => any;
      }[];
    }) => void;

    // capture callback for manual trigger
    (firestore.onSnapshot as jest.Mock).mockImplementation(
      (_query, callback) => {
        snapshotCallback = callback;
        setTimeout(() => {
          callback({
            docs: mockData.map((item) => ({
              id: item.id,
              data: () => ({ ...item }),
            })),
          });
        }, 0);
        return jest.fn();
      }
    );

    const { result } = renderHook(() =>
      useFirestoreData({
        collectionName: "employees",
        userId: "user123",
      })
    );

    // wait for initial load
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    // initial state check
    expect(result.current.loading).toBe(false);
    expect(result.current.data).toEqual(mockData);

    // call refreshData
    act(() => {
      result.current.refreshData();
    });

    // should set loading to true
    expect(result.current.loading).toBe(true);

    // manually trigger snapshot again
    await act(async () => {
      snapshotCallback({
        docs: mockData.map((item) => ({
          id: item.id,
          data: () => ({ ...item }),
        })),
      });
    });

    // should finish loading
    expect(result.current.loading).toBe(false);
    expect(result.current.data).toEqual(mockData);
  });
});
