"use client";

import * as React from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { toast } from "sonner";
import {
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "@/firebase/firebase";

// form state management
export function useFormState<T>(initialData: T) {
  const [formData, setFormData] = React.useState<T>(initialData);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
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

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const fetchEmployees = async () => {
          try {
            const employeesCollection = collection(db, "employees");

            const userQuery = query(
              employeesCollection,
              where("userId", "==", user.uid)
            );
            const employeesSnapshot = await getDocs(userQuery);

            const employeesList = employeesSnapshot.docs.map((doc) => ({
              id: doc.id,
              firstName: doc.data().firstName || "",
              employeeId: doc.data().employeeId || "",
              lastName: doc.data().lastName || "",
            }));

            setEmployees(employeesList);
          } catch (error) {
            console.error("Error fetching employees:", error);
          }
        };

        fetchEmployees();
      } else {
        console.error("No authenticated user found");
        setEmployees([]);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleEmployeeChange = (employeeId: string) => {
    if (employeeId === "none") {
      setFormData((prev) => ({
        ...prev,
        employeeId: "",
        assignedEmployee: "",
        email: "",
      }));
      return;
    }

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

  // update form data when initial data changes
  const prevInitialDataRef = React.useRef<T>(initialData);

  React.useEffect(() => {
    if (
      JSON.stringify(prevInitialDataRef.current) !== JSON.stringify(initialData)
    ) {
      setFormData(initialData);
      prevInitialDataRef.current = initialData;
    }
  }, [initialData]);

  // input change handler
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // select change handler
  const handleSelectChange = (field: string) => (value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // date change handler
  const handleDateChange = (field: string) => (date: Date | undefined) => {
    setFormData((prev) => ({
      ...prev,
      [field]: date ? date.toISOString() : new Date().toISOString(),
    }));
  };

  return {
    formData,
    employees,
    setEmployees,
    setFormData,
    isSubmitting,
    setIsSubmitting,
    handleInputChange,
    handleSelectChange,
    handleDateChange,
    handleEmployeeChange,
  };
}

// submit handler for employee form
export async function submitEmployeeForm({
  e,
  formData,
  employee,
  setIsSubmitting,
  onEmployeeUpdated,
  onClose,
}: {
  e: React.FormEvent;
  formData: any;
  employee: any;
  setIsSubmitting: React.Dispatch<React.SetStateAction<boolean>>;
  onEmployeeUpdated: () => void;
  onClose: () => void;
}) {
  e.preventDefault();
  setIsSubmitting(true);

  const auth = getAuth();
  const user = auth.currentUser;
  const userEmail = user?.email;

  if (!userEmail) {
    toast.error("you must be logged in to update an employee!");
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
    if (formData.employeeId && formData.employeeId !== employee.employeeId) {
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

    // check for duplicate email
    if (formData.email !== employee.email) {
      const emailQuery = query(
        employeesRef,
        where("email", "==", formData.email),
        where("userId", "==", user.uid)
      );
      const emailSnapshot = await getDocs(emailQuery);

      if (!emailSnapshot.empty) {
        toast.error("employee with this email already exists!");
        setIsSubmitting(false);
        return;
      }
    }

    const employeeRef = doc(db, "employees", employee.id);
    await updateDoc(employeeRef, {
      ...formData,
      updatedAt: new Date().toISOString(),
      updatedBy: userEmail,
    });

    toast.success("employee updated successfully!");
    onEmployeeUpdated();
    onClose();
  } catch (error) {
    console.error("error updating employee:", error);
    toast.error("failed to update employee");
  } finally {
    setIsSubmitting(false);
  }
}

// submit handler for asset form
export async function submitAssetForm({
  e,
  formData,
  asset,
  setIsSubmitting,
  onAssetUpdated,
  onClose,
}: {
  e: React.FormEvent;
  formData: any;
  asset: any;
  setIsSubmitting: React.Dispatch<React.SetStateAction<boolean>>;
  onAssetUpdated: () => void;
  onClose: () => void;
}) {
  e.preventDefault();
  setIsSubmitting(true);

  const auth = getAuth();
  const user = auth.currentUser;
  const userEmail = user?.email;

  if (!userEmail) {
    toast.error("you must be logged in to update an asset!");
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
    if (formData.serialNo !== asset.serialNo) {
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
    }

    // check for duplicate asset tag
    if (formData.assetTag && formData.assetTag !== asset.assetTag) {
      const tagQuery = query(
        assetsRef,
        where("assetTag", "==", formData.assetTag),
        where("userId", "==", user.uid)
      );
      const tagSnapshot = await getDocs(tagQuery);

      if (!tagSnapshot.empty) {
        toast.error("asset with this asset tag already exists!");
        setIsSubmitting(false);
        return;
      }
    }

    const assetRef = doc(db, "it-assets", asset.id);
    await updateDoc(assetRef, {
      ...formData,
      dateUpdated: new Date().toISOString(),
      updatedBy: userEmail,
    });

    toast.success("asset updated successfully!");
    onAssetUpdated();
    onClose();
  } catch (error) {
    console.error("error updating asset:", error);
    toast.error("failed to update asset");
  } finally {
    setIsSubmitting(false);
  }
}
