jest.mock("firebase/firestore");
jest.mock("firebase/auth");
jest.mock("@/firebase/firebase");
jest.mock("sonner");

import { renderHook, act, waitFor } from "@testing-library/react";
import { useUploadFile } from "@/hooks/tableHooks/use-upload-hook";
import { addDoc } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { toast } from "sonner";
import Papa from "papaparse";

// helper to create a file
const createMockFile = (content: string, name: string) => {
  const file = new File([content], name, {
    type: name.endsWith(".csv") ? "text/csv" : "application/json",
  });
  return file;
};

jest.mock("@/firebase/firebase", () => ({
  getFirebaseConfig: jest.fn().mockReturnValue({
    apiKey: "test-api-key",
    authDomain: "test-auth-domain",
    projectId: "test-project-id",
    storageBucket: "test-storage-bucket",
    messagingSenderId: "test-messaging-id",
    appId: "test-app-id",
    measurementId: "test-measurement-id",
  }),
  app: {},
  auth: {},
  db: {},
}));

// mock file reader
global.FileReader = class {
  onload: any;
  readAsText() {
    setTimeout(() => {
      this.onload({
        target: { result: "serialNo,assetTag\nSN003,AT003" },
      });
    }, 0);
  }
} as any;

describe("useUploadFile hook", () => {
  const assetConfig = {
    title: "upload assets",
    collectionName: "assets",
    formatExamples: {
      csv: "serialNo,assetTag\nSN001,AT001",
      json: '[{"serialNo":"SN001","assetTag":"AT001"}]',
    },
    requiredFields: ["serialNo", "assetTag"],
    uniqueField: "serialNo",
  };

  const employeeConfig = {
    title: "upload employees",
    collectionName: "employees",
    formatExamples: {
      csv: "firstName,lastName,email,employeeId\nJohn,Doe,john.doe@company.com,EMP001",
      json: '[{"firstName":"John","lastName":"Doe","email":"john.doe@company.com","employeeId":"EMP001"}]',
    },
    requiredFields: ["firstName", "lastName", "email", "employeeId"],
    uniqueField: "employeeId",
  };

  beforeEach(() => {
    jest.clearAllMocks();

    // Default mock for asset data
    (Papa.parse as jest.Mock).mockImplementation((_text, _options) => {
      return {
        data: [{ serialNo: "SN003", assetTag: "AT003" }],
        errors: [],
      };
    });
  });

  test("initializes with default values", async () => {
    const { result } = renderHook(() => useUploadFile(assetConfig));

    // wait for the useEffect to complete
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.file).toBeNull();
    expect(result.current.user).toBeTruthy();
  });

  test("handles file change", async () => {
    const { result } = renderHook(() => useUploadFile(assetConfig));

    // wait for the useEffect to complete
    await waitFor(() => {
      expect(onAuthStateChanged).toHaveBeenCalled();
    });

    const file = createMockFile("test", "test.csv");
    const event = {
      target: { files: [file] },
    } as unknown as React.ChangeEvent<HTMLInputElement>;

    act(() => {
      result.current.handleFileChange(event);
    });

    expect(result.current.file).toBe(file);
  });

  test("handles upload of csv file for assets", async () => {
    const { result } = renderHook(() => useUploadFile(assetConfig));

    // wait for the useEffect to complete
    await waitFor(() => {
      expect(onAuthStateChanged).toHaveBeenCalled();
    });

    // set a mock file
    const file = createMockFile("serialNo,assetTag\nSN003,AT003", "test.csv");

    act(() => {
      result.current.handleFileChange({ target: { files: [file] } } as any);
    });

    const onSuccess = jest.fn();

    // mock the implementation for this test
    const mockAddDoc = addDoc as jest.Mock;
    mockAddDoc.mockResolvedValueOnce({ id: "new-doc-id" });

    await act(async () => {
      await result.current.handleUpload(onSuccess);
    });

    // verify addDoc was called
    await waitFor(() => {
      expect(mockAddDoc).toHaveBeenCalled();
      expect(onSuccess).toHaveBeenCalled();
      expect(toast.success).toHaveBeenCalledWith(
        expect.stringContaining("assets")
      );
    });
  });

  test("handles upload of csv file for employees", async () => {
    // Mock FileReader for employee data
    global.FileReader = class {
      onload: any;
      readAsText() {
        setTimeout(() => {
          this.onload({
            target: {
              result:
                "firstName,lastName,email,employeeId\nJohn,Doe,john.doe@company.com,EMP003",
            },
          });
        }, 0);
      }
    } as any;

    // Mock Papa.parse for employee data
    (Papa.parse as jest.Mock).mockImplementation((_text, _options) => {
      return {
        data: [
          {
            firstName: "John",
            lastName: "Doe",
            email: "john.doe@company.com",
            employeeId: "EMP003",
          },
        ],
        errors: [],
      };
    });

    const { result } = renderHook(() => useUploadFile(employeeConfig));

    // wait for the useEffect to complete
    await waitFor(() => {
      expect(onAuthStateChanged).toHaveBeenCalled();
    });

    // set a mock file
    const file = createMockFile(
      "firstName,lastName,email,employeeId\nJohn,Doe,john.doe@company.com,EMP003",
      "employees.csv"
    );

    act(() => {
      result.current.handleFileChange({ target: { files: [file] } } as any);
    });

    const onSuccess = jest.fn();

    // mock the implementation for this test
    const mockAddDoc = addDoc as jest.Mock;
    mockAddDoc.mockResolvedValueOnce({ id: "new-doc-id" });

    await act(async () => {
      await result.current.handleUpload(onSuccess);
    });

    // verify addDoc was called
    await waitFor(() => {
      expect(mockAddDoc).toHaveBeenCalled();
      expect(onSuccess).toHaveBeenCalled();
      expect(toast.success).toHaveBeenCalledWith(
        expect.stringContaining("employees")
      );
    });
  });

  test("handles no user logged in", async () => {
    // override the mock for this specific test to return null for currentUser
    (getAuth as jest.Mock).mockReturnValueOnce({ currentUser: null });

    // mock onAuthStateChanged to call the callback with null user
    (onAuthStateChanged as jest.Mock).mockImplementationOnce(
      (_auth, callback) => {
        callback(null);
        return jest.fn(); // unsubscribe function
      }
    );

    const { result } = renderHook(() => useUploadFile(assetConfig));

    // Wait for the useEffect to complete and verify user is null
    await waitFor(() => {
      expect(onAuthStateChanged).toHaveBeenCalled();
      expect(result.current.user).toBeNull();
    });

    // Set a mock file
    const file = createMockFile("test", "test.csv");

    act(() => {
      result.current.handleFileChange({ target: { files: [file] } } as any);
    });

    const onSuccess = jest.fn();

    await act(async () => {
      await result.current.handleUpload(onSuccess);
    });

    // Verify error message
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        "You must be logged in to upload files"
      );
      expect(onSuccess).not.toHaveBeenCalled();
    });
  });
});
