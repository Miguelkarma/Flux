import { useScanHistory } from "@/hooks/use-qr-history";
import { collection, addDoc } from "firebase/firestore";

jest.mock("@/firebase/firebase", () => ({
  db: {}, 
}));

// mock Firestore functions
jest.mock("firebase/firestore", () => ({
  collection: jest.fn(),
  addDoc: jest.fn(),
  serverTimestamp: jest.fn(() => "mock-timestamp"),
}));

describe("useScanHistory", () => {
  const userId = "test-user-id";

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should call addDoc with correct data when userId is provided", async () => {
    const mockCollectionRef = {};
    (collection as jest.Mock).mockReturnValue(mockCollectionRef);
    (addDoc as jest.Mock).mockResolvedValue({});

    const { saveScanHistory } = useScanHistory(userId);
    await saveScanHistory("SN-1234", true);

    expect(collection).toHaveBeenCalledWith(expect.anything(), "scan-history");
    expect(addDoc).toHaveBeenCalledWith(mockCollectionRef, {
      userId: "test-user-id",
      serialNum: "SN-1234",
      timestamp: "mock-timestamp",
      found: true,
    });
  });

  it("should not call addDoc if userId is undefined", async () => {
    const consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});
    const { saveScanHistory } = useScanHistory(undefined);

    await saveScanHistory("SN-5678", false);

    expect(addDoc).not.toHaveBeenCalled();
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "User ID is required to save scan history"
    );

    consoleErrorSpy.mockRestore();
  });

  it("should throw and log error if addDoc fails", async () => {
    const mockCollectionRef = {};
    (collection as jest.Mock).mockReturnValue(mockCollectionRef);
    const error = new Error("Firestore write error");
    (addDoc as jest.Mock).mockRejectedValue(error);

    const consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});
    const { saveScanHistory } = useScanHistory(userId);

    await expect(saveScanHistory("SN-0000", false)).rejects.toThrow(
      "Firestore write error"
    );

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Error saving scan history:",
      error
    );
    consoleErrorSpy.mockRestore();
  });
});
