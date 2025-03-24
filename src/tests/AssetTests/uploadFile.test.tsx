import { renderHook, act } from "@testing-library/react";
import { useUploadFile } from "@/hooks/tableHooks/use-upload-hook";
import { getAuth } from "firebase/auth";
import { addDoc } from "firebase/firestore";
import { toast } from "sonner";

// mock dependencies
jest.mock("firebase/auth");
jest.mock("firebase/firestore");
jest.mock("sonner", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));
jest.mock("papaparse", () => ({
  parse: jest.fn((_content, _options) => ({
    data: [{ id: "1", name: "test" }],
  })),
}));

// proper filereader mock
class MockFileReader {
  static readonly EMPTY = 0;
  static readonly LOADING = 1;
  static readonly DONE = 2;

  EMPTY = 0;
  LOADING = 1;
  DONE = 2;

  onload: any = null;
  result: string | null = null;
  readyState: number = MockFileReader.EMPTY;

  readAsText(_file: Blob) {
    this.readyState = MockFileReader.LOADING;

    setTimeout(() => {
      this.readyState = MockFileReader.DONE;
      this.result = JSON.stringify([{ id: "1", name: "test" }]);

      if (this.onload) {
        this.onload({ target: this });
      }
    }, 0);
  }
}

// replace global filereader
global.FileReader = MockFileReader as any;

describe("useUploadFile hook", () => {
  const mockConfig = {
    title: "Test Upload",
    collectionName: "employees",
    formatExamples: {
      csv: "id,name",
      json: '[{"id":"1","name":"test"}]',
    },
    requiredFields: ["id", "name"],
    uniqueField: "id",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("initializes with default values", () => {
    // arrange & act
    const { result } = renderHook(() => useUploadFile(mockConfig));

    // assert
    expect(result.current.file).toBeNull();
    expect(result.current.loading).toBe(false);
    expect(result.current.user).toBeTruthy();
  });

  test("handles file change", () => {
    // arrange
    const { result } = renderHook(() => useUploadFile(mockConfig));
    const file = new File(["test"], "test.json", { type: "application/json" });
    const event = {
      target: { files: [file] },
    } as unknown as React.ChangeEvent<HTMLInputElement>;

    // act
    act(() => {
      result.current.handleFileChange(event);
    });

    // assert
    expect(result.current.file).toBe(file);
  });

  test("validates data correctly", async () => {
    // arrange
    const { result } = renderHook(() => useUploadFile(mockConfig));
    const mockOnSuccess = jest.fn();
    const file = new File(["test"], "test.json", { type: "application/json" });

    // act - set file and trigger upload
    act(() => {
      result.current.handleFileChange({ target: { files: [file] } } as any);
    });

    await act(async () => {
      await result.current.handleUpload(mockOnSuccess);
    });

    // assert
    expect(addDoc).toHaveBeenCalled();
    expect(toast.success).toHaveBeenCalled();
    expect(mockOnSuccess).toHaveBeenCalled();
  });

  test("handles upload with no file", async () => {
    // arrange
    const { result } = renderHook(() => useUploadFile(mockConfig));
    const mockOnSuccess = jest.fn();

    // act
    await act(async () => {
      await result.current.handleUpload(mockOnSuccess);
    });

    // assert
    expect(addDoc).not.toHaveBeenCalled();
    expect(mockOnSuccess).not.toHaveBeenCalled();
  });

  test("handles upload with no user", async () => {
    // arrange
    (getAuth as jest.Mock).mockReturnValueOnce({ currentUser: null });
    const { result } = renderHook(() => useUploadFile(mockConfig));
    const mockOnSuccess = jest.fn();
    const file = new File(["test"], "test.json", { type: "application/json" });

    // act
    act(() => {
      result.current.handleFileChange({ target: { files: [file] } } as any);
    });

    await act(async () => {
      await result.current.handleUpload(mockOnSuccess);
    });

    // assert
    expect(toast.error).toHaveBeenCalled();
    expect(addDoc).not.toHaveBeenCalled();
    expect(mockOnSuccess).not.toHaveBeenCalled();
  });
});
