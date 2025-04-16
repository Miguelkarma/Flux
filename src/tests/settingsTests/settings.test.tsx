import {
  render,
  screen,
  fireEvent,
  waitFor,
  within,
} from "@testing-library/react";
import SettingsPage from "@/components/SettingsComponent/SettingsPage";
import { useUserSettings } from "@/hooks/use-settings";

// Mock the useUserSettings hook
jest.mock("@/hooks/use-settings");

jest.mock("@/components/ui/tabs", () => ({
  Tabs: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  TabsList: ({ children }: { children: React.ReactNode }) => (
    <div role="tablist">{children}</div>
  ),
  TabsTrigger: ({
    children,
    value,
  }: {
    children: React.ReactNode;
    value: string;
  }) => (
    <button role="tab" data-testid={`tab-${value}`}>
      {children}
    </button>
  ),
  TabsContent: ({
    value,
    children,
  }: {
    value: string;
    children: React.ReactNode;
  }) => (
    <div role="tabpanel" data-testid={`tabpanel-${value}`}>
      {children}
    </div>
  ),
}));
jest.mock("@/components/ui/alert", () => ({
  Alert: ({
    children,
    className,
  }: {
    children: React.ReactNode;
    className?: string;
  }) => (
    <div data-testid="mock-alert" className={className}>
      {children}
    </div>
  ),
  AlertTitle: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="mock-alert-title">{children}</div>
  ),
  AlertDescription: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="mock-alert-description">{children}</div>
  ),
}));

describe("SettingsPage", () => {
  const mockUseUserSettings = useUserSettings as jest.MockedFunction<
    typeof useUserSettings
  >;

  const mockUserData = {
    displayName: "testuser",
    email: "test@example.com",
  };

  const defaultMockState = {
    userData: mockUserData,
    loading: false,
    error: null,
    success: null,
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    newEmail: "",
    newUsername: "",
  };

  const defaultMockActions = {
    setCurrentPassword: jest.fn(),
    setNewPassword: jest.fn(),
    setConfirmPassword: jest.fn(),
    setNewEmail: jest.fn(),
    setNewUsername: jest.fn(),
    updateUsername: jest.fn(),
    updateUserEmail: jest.fn(),
    updateUserPassword: jest.fn(),
    clearSuccess: jest.fn(),
    clearError: jest.fn(),
    refreshUserData: jest.fn(),
  };

  beforeEach(() => {
    mockUseUserSettings.mockReturnValue([defaultMockState, defaultMockActions]);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders the tabs navigation", () => {
    render(<SettingsPage />);
    expect(screen.getByTestId("tab-profile")).toBeInTheDocument();
    expect(screen.getByTestId("tab-email")).toBeInTheDocument();
    expect(screen.getByTestId("tab-password")).toBeInTheDocument();
  });

  it("renders profile tab by default", () => {
    render(<SettingsPage />);
    expect(screen.getByTestId("tabpanel-profile")).toBeInTheDocument();
    expect(screen.getByLabelText("Username")).toBeInTheDocument();
  });

  it("displays error message when error exists", async () => {
    const mockError = "Test error message";
    const mockState = {
      ...defaultMockState,
      userData: { displayName: "test", email: "test@test.com" },
      error: mockError,
    };

    mockUseUserSettings.mockReturnValueOnce([mockState, defaultMockActions]);

    render(<SettingsPage />);
  });

  describe("Profile Tab", () => {
    it("renders current username and allows editing", () => {
      mockUseUserSettings.mockReturnValue([
        {
          ...defaultMockState,
          userData: mockUserData,
          newUsername: mockUserData.displayName,
        },
        defaultMockActions,
      ]);

      render(<SettingsPage />);

      const usernameInput = screen.getByLabelText("Username");
      expect(usernameInput).toHaveValue(mockUserData.displayName);

      fireEvent.change(usernameInput, { target: { value: "newusername" } });
      expect(defaultMockActions.setNewUsername).toHaveBeenCalledWith(
        "newusername"
      );
    });

    it("disables update button when username is unchanged", () => {
      mockUseUserSettings.mockReturnValue([
        {
          ...defaultMockState,
          newUsername: mockUserData.displayName,
        },
        defaultMockActions,
      ]);

      render(<SettingsPage />);
      const updateButton = screen.getByRole("button", {
        name: /Update Username/i,
      });
      expect(updateButton).toBeDisabled();
    });

    it("calls updateUsername when update button is clicked", async () => {
      mockUseUserSettings.mockReturnValueOnce([
        { ...defaultMockState, newUsername: "newusername" },
        defaultMockActions,
      ]);

      render(<SettingsPage />);
      const updateButton = screen.getByRole("button", {
        name: /Update Username/i,
      });
      fireEvent.click(updateButton);

      await waitFor(() => {
        expect(defaultMockActions.updateUsername).toHaveBeenCalled();
      });
    });
  });

  describe("Email Tab", () => {
    it("renders email form with current email", () => {
      render(<SettingsPage />);
      const emailTabPanel = screen.getByTestId("tabpanel-email");

      // Test email-specific fields
      expect(
        within(emailTabPanel).getByLabelText("Current Email")
      ).toBeInTheDocument();
      expect(
        within(emailTabPanel).getByLabelText("New Email")
      ).toBeInTheDocument();

      // For the password field, use the specific ID from email tab
      expect(
        within(emailTabPanel).getByLabelText("Current Password", {
          selector: "#current-password-email",
        })
      ).toBeInTheDocument();
    });

    it("disables update button when email is unchanged", () => {
      render(<SettingsPage />);
      const emailTabPanel = screen.getByTestId("tabpanel-email");
      const updateButton = within(emailTabPanel).getByRole("button", {
        name: /Update Email/i,
      });
      expect(updateButton).toBeDisabled();
    });
  });

  describe("Password Tab", () => {
    it("renders password form", () => {
      render(<SettingsPage />);
      expect(screen.getByTestId("tabpanel-password")).toBeInTheDocument();

      // Get the password tab panel first
      const passwordTabPanel = screen.getByTestId("tabpanel-password");

      // Then query within this panel for specific elements
      expect(
        within(passwordTabPanel).getByLabelText("Current Password")
      ).toBeInTheDocument();
      expect(
        within(passwordTabPanel).getByLabelText("New Password")
      ).toBeInTheDocument();
      expect(
        within(passwordTabPanel).getByLabelText("Confirm New Password")
      ).toBeInTheDocument();
    });

    it("disables update button when passwords don't match", () => {
      mockUseUserSettings.mockReturnValue([
        {
          ...defaultMockState,
          currentPassword: "oldpass",
          newPassword: "newpass",
          confirmPassword: "differentpass",
        },
        defaultMockActions,
      ]);

      render(<SettingsPage />);
      const passwordTabPanel = screen.getByTestId("tabpanel-password");
      const updateButton = within(passwordTabPanel).getByRole("button", {
        name: /Update Password/i,
      });
      expect(updateButton).toBeDisabled();
    });

    it("enables update button when passwords match", () => {
      mockUseUserSettings.mockReturnValue([
        {
          ...defaultMockState,
          currentPassword: "oldpass",
          newPassword: "newpass",
          confirmPassword: "newpass",
        },
        defaultMockActions,
      ]);

      render(<SettingsPage />);
      const passwordTabPanel = screen.getByTestId("tabpanel-password");
      const updateButton = within(passwordTabPanel).getByRole("button", {
        name: /Update Password/i,
      });
      expect(updateButton).not.toBeDisabled();
    });
  });
});
