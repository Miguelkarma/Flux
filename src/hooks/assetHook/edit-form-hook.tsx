"use client";

import * as React from "react";
import { getAuth } from "firebase/auth";
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

/**
 * Custom hook for form state management
 */
export function useFormState<T>(initialData: T) {
  const [formData, setFormData] = React.useState<T>(initialData);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // Update form data when initial data changes
  const prevInitialDataRef = React.useRef<T>(initialData);

  React.useEffect(() => {
    // Only update if initialData has actually changed
    if (
      JSON.stringify(prevInitialDataRef.current) !== JSON.stringify(initialData)
    ) {
      setFormData(initialData);
      prevInitialDataRef.current = initialData;
    }
  }, [initialData]);

  // Input change handler
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Select change handler
  const handleSelectChange = (field: string) => (value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Date change handler
  const handleDateChange = (field: string) => (date: Date | undefined) => {
    setFormData((prev) => ({
      ...prev,
      [field]: date ? date.toISOString() : new Date().toISOString(),
    }));
  };

  return {
    formData,
    setFormData,
    isSubmitting,
    setIsSubmitting,
    handleInputChange,
    handleSelectChange,
    handleDateChange,
  };
}

/**
 * Submit handler for employee form
 */
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
    toast.error("You must be logged in to update an employee!");
    setIsSubmitting(false);
    return;
  }

  if (!formData.firstName || !formData.lastName || !formData.email) {
    toast.error("First name, last name, and email are required!");
    setIsSubmitting(false);
    return;
  }

  try {
    const employeesRef = collection(db, "employees");

    // Check for duplicate employee ID (if changed)
    if (formData.employeeId && formData.employeeId !== employee.employeeId) {
      const idQuery = query(
        employeesRef,
        where("employeeId", "==", formData.employeeId),
        where("userId", "==", user.uid)
      );
      const idSnapshot = await getDocs(idQuery);

      if (!idSnapshot.empty) {
        toast.error("Employee with this ID already exists!");
        setIsSubmitting(false);
        return;
      }
    }

    // Check for duplicate email (if changed)
    if (formData.email !== employee.email) {
      const emailQuery = query(
        employeesRef,
        where("email", "==", formData.email),
        where("userId", "==", user.uid)
      );
      const emailSnapshot = await getDocs(emailQuery);

      if (!emailSnapshot.empty) {
        toast.error("Employee with this email already exists!");
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

    toast.success("Employee updated successfully!");
    onEmployeeUpdated();
    onClose();
  } catch (error) {
    console.error("Error updating employee:", error);
    toast.error("Failed to update employee");
  } finally {
    setIsSubmitting(false);
  }
}

/**
 * Submit handler for asset form
 */
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
    toast.error("You must be logged in to update an asset!");
    setIsSubmitting(false);
    return;
  }

  if (!formData.serialNo || !formData.type) {
    toast.error("Serial number and asset type are required!");
    setIsSubmitting(false);
    return;
  }

  if (formData.type === "Other" && !formData.customType) {
    toast.error("Custom type is required when 'Other' is selected!");
    setIsSubmitting(false);
    return;
  }

  try {
    const assetsRef = collection(db, "it-assets");

    // Check for duplicate serial number (if changed)
    if (formData.serialNo !== asset.serialNo) {
      const serialQuery = query(
        assetsRef,
        where("serialNo", "==", formData.serialNo),
        where("userId", "==", user.uid)
      );
      const serialSnapshot = await getDocs(serialQuery);

      if (!serialSnapshot.empty) {
        toast.error("Asset with this Serial Number already exists!");
        setIsSubmitting(false);
        return;
      }
    }

    // Check for duplicate asset tag (if asset tag is provided and changed)
    if (formData.assetTag && formData.assetTag !== asset.assetTag) {
      const tagQuery = query(
        assetsRef,
        where("assetTag", "==", formData.assetTag),
        where("userId", "==", user.uid)
      );
      const tagSnapshot = await getDocs(tagQuery);

      if (!tagSnapshot.empty) {
        toast.error("Asset with this Asset Tag already exists!");
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

    toast.success("Asset updated successfully!");
    onAssetUpdated();
    onClose();
  } catch (error) {
    console.error("Error updating asset:", error);
    toast.error("Failed to update asset");
  } finally {
    setIsSubmitting(false);
  }
}
