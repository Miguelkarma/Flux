import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import EmployeeActionsCell from "@/components/EmployeeComponents/EmployeeActionsCell";

jest.mock("@/components/EmployeeComponents/EditEmployeeDrawer", () => ({
  __esModule: true,
  EditEmployeeDrawer: jest.fn(() => <div>Edit Employee</div>),
}));

jest.mock("@/components/sharedComponent/DeleteDialog", () => ({
  __esModule: true,
  default: ({ onDelete }: { onDelete: () => Promise<void> }) => (
    <div data-testid="delete-dialog">
      <button onClick={() => onDelete()}>Mock Delete Button</button>
    </div>
  ),
}));

jest.mock("lucide-react", () => ({
  MoreHorizontal: () => <svg data-testid="more-horizontal" />,
  Edit: () => <svg data-testid="edit-icon" />,
  Trash: () => <svg data-testid="trash-icon" />,
  Copy: () => <svg data-testid="copy-icon" />,
}));

const mockEmployee = {
  id: "1",
  employeeId: "EMP123",
  firstName: "John",
  lastName: "Doe",
  email: "john.doe@example.com",
  department: "IT",
  position: "Software Engineer",
  status: "Active",
  dateAdded: "2022-01-01",
  location: "Remote",
};

beforeAll(() => {
  Object.assign(navigator, {
    clipboard: {
      writeText: jest.fn().mockResolvedValue(undefined),
    },
  });
});

beforeEach(() => {
  jest.clearAllMocks();
});

test("opens delete dialog when delete menu item is clicked", async () => {
  render(
    <EmployeeActionsCell
      employee={mockEmployee}
      onEmployeeUpdated={jest.fn()}
    />
  );

  // Open the dropdown menu
  await userEvent.click(screen.getByLabelText("Open actions menu"));

  // Click the Delete option
  await userEvent.click(screen.getByText("Delete"));

  // Verify delete dialog is shown
  expect(screen.getByTestId("delete-dialog")).toBeInTheDocument();
});

test("copies employee ID to clipboard", async () => {
  render(
    <EmployeeActionsCell
      employee={mockEmployee}
      onEmployeeUpdated={jest.fn()}
    />
  );

  await userEvent.click(screen.getByLabelText("Open actions menu"));

  const copyButton = await screen.findByText("Copy Employee ID");
  await userEvent.click(copyButton);

  await waitFor(() =>
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith("EMP123")
  );
});

test("opens edit drawer when edit is clicked", async () => {
  render(
    <EmployeeActionsCell
      employee={mockEmployee}
      onEmployeeUpdated={jest.fn()}
    />
  );

  await userEvent.click(screen.getByLabelText("Open actions menu"));

  const editButton = await screen.findByText("Edit");
  await userEvent.click(editButton);

  expect(screen.getByText("Edit Employee")).toBeInTheDocument();
});
