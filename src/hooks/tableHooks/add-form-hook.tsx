"use client";

import * as React from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { toast } from "sonner";
import {
  collection,
  addDoc,
  query,
  getDocs,
  where,
  onSnapshot,
} from "firebase/firestore";
import { db } from "@/firebase/firebase";

export function useForm<T extends Record<string, any>>(initialValues: T) {
  const [formData, setFormData] = React.useState<T>(initialValues);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [employees, setEmployees] = React.useState<
    Array<{
      id: string;
      firstName: string;
      employeeId: string;
      lastName: string;
    }>
  >([]);

  // fetch employees
  React.useEffect(() => {
    const auth = getAuth();

    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        const employeesCollection = collection(db, "employees");
        const userQuery = query(
          employeesCollection,
          where("userId", "==", user.uid)
        );
        // Set up a real-time listener.
        const unsubscribeEmployees = onSnapshot(
          userQuery,
          (snapshot) => {
            const employeesList = snapshot.docs.map((doc) => ({
              id: doc.id,
              firstName: doc.data().firstName || "",
              employeeId: doc.data().employeeId || "",
              lastName: doc.data().lastName || "",
            }));
            setEmployees(employeesList);
          },
          (error) => {
            console.error("Error fetching employees:", error);
            setEmployees([]);
          }
        );

        return () => unsubscribeEmployees();
      } else {
        console.error("No authenticated user found");
        setEmployees([]);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  // input change handler
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // select change handler
  const handleSelectChange = (field: string) => (value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // date change handler
  const handleDateChange = (field: string) => (date: Date | undefined) => {
    setFormData((prev) => ({
      ...prev,
      [field]: date ? date.toISOString() : new Date().toISOString(),
    }));
  };

  // employee change handler
  const handleEmployeeChange = (employeeId: string) => {
    const selectedEmployee = employees.find((emp) => emp.id === employeeId);
    if (selectedEmployee) {
      setFormData((prev) => ({
        ...prev,
        employeeId: employeeId,
        assignedEmployee: selectedEmployee.firstName,
        email: selectedEmployee.employeeId,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        employeeId: "",
        assignedEmployee: "",
        email: "",
      }));
    }
  };

  // custom type change handler for assets
  const handleTypeChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      type: value,
      customType: value === "Other" ? "" : (prev as any).customType,
    }));
  };

  // reset form to initial values
  const resetForm = () => {
    setFormData(initialValues);
  };

  return {
    formData,
    setFormData,
    isSubmitting,
    setIsSubmitting,
    open,
    setOpen,
    employees,
    handleInputChange,
    handleSelectChange,
    handleDateChange,
    handleTypeChange,
    handleEmployeeChange,
    resetForm,
  };
}

// submit handler for employee form
export async function submitAddEmployeeForm({
  e,
  formData,
  setIsSubmitting,
  onEmployeeAdded,
  onClose,
  resetForm,
}: {
  e: React.FormEvent;
  formData: any;
  setIsSubmitting: React.Dispatch<React.SetStateAction<boolean>>;
  onEmployeeAdded: () => void;
  onClose: () => void;
  resetForm: () => void;
}) {
  e.preventDefault();
  setIsSubmitting(true);

  const auth = getAuth();
  const user = auth.currentUser;
  const userEmail = user?.email;

  if (!user || !userEmail) {
    toast.error("you must be logged in to add an employee!");
    setIsSubmitting(false);
    return;
  }

  if (!formData.firstName || !formData.lastName || !formData.email) {
    toast.error("first name, last name, and email are required!");
    setIsSubmitting(false);
    return;
  }

  try {
    const employeesRef = collection(db, "employees");

    // check for duplicate employee ID
    if (formData.employeeId) {
      const idQuery = query(
        employeesRef,
        where("employeeId", "==", formData.employeeId),
        where("userId", "==", user.uid)
      );
      const idSnapshot = await getDocs(idQuery);

      if (!idSnapshot.empty) {
        toast.error("employee with this ID already exists!");
        setIsSubmitting(false);
        return;
      }
    }

    // prepare data for submission
    const dataToSubmit = {
      ...formData,
      userId: user.uid,
      dateAdded: new Date().toISOString(),
      createdBy: userEmail,
    };

    // add the document
    await addDoc(employeesRef, dataToSubmit);

    toast.success("employee added successfully!");
    onEmployeeAdded();
    onClose();
    resetForm();
  } catch (error) {
    console.error("error adding employee:", error);
    toast.error("failed to add employee");
  } finally {
    setIsSubmitting(false);
  }
}

// submit handler for asset form
export async function submitAddAssetForm({
  e,
  formData,
  setIsSubmitting,
  onAssetAdded,
  onClose,
  resetForm,
}: {
  e: React.FormEvent;
  formData: any;
  setIsSubmitting: React.Dispatch<React.SetStateAction<boolean>>;
  onAssetAdded: () => void;
  onClose: () => void;
  resetForm: () => void;
}) {
  e.preventDefault();
  setIsSubmitting(true);

  const auth = getAuth();
  const user = auth.currentUser;
  const userEmail = user?.email;

  if (!user || !userEmail) {
    toast.error("you must be logged in to add an asset!");
    setIsSubmitting(false);
    return;
  }

  if (!formData.serialNo || !formData.type) {
    toast.error("serial number and asset type are required!");
    setIsSubmitting(false);
    return;
  }

  if (formData.type === "Other" && !formData.customType) {
    toast.error("custom type is required when 'Other' is selected!");
    setIsSubmitting(false);
    return;
  }

  try {
    const assetsRef = collection(db, "it-assets");

    // check for duplicate serial number
    const serialQuery = query(
      assetsRef,
      where("serialNo", "==", formData.serialNo),
      where("userId", "==", user.uid)
    );
    const serialSnapshot = await getDocs(serialQuery);

    if (!serialSnapshot.empty) {
      toast.error("asset with this serial number already exists!");
      setIsSubmitting(false);
      return;
    }

    // prepare data for submission
    const dataToSubmit = {
      ...formData,
      userId: user.uid,
      dateAdded: new Date().toISOString(),
      createdBy: userEmail,
    };

    // handle custom type
    if (formData.type === "Other") {
      dataToSubmit.type = formData.customType;
    }

    // add the document
    await addDoc(assetsRef, dataToSubmit);

    toast.success("asset added successfully!");
    onAssetAdded();
    onClose();
    resetForm();
  } catch (error) {
    console.error("error adding asset:", error);
    toast.error("failed to add asset");
  } finally {
    setIsSubmitting(false);
  }
}
