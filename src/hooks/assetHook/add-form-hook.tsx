"use client";

import * as React from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { toast } from "sonner";
import { collection, addDoc, query, getDocs, where } from "firebase/firestore";
import { db } from "@/firebase/firebase";

interface ValidationRules {
  required: string[];
  unique?: {
    field: string;
    errorMessage: string;
  }[];
}

/**
 * custom hook for managing add form state and submission
 */
export function useForm<T extends Record<string, any>>({
  initialValues,
  collectionName,
  onSuccess,
  userEmail,
  validationRules,
}: {
  initialValues: T;
  collectionName: string;
  onSuccess: () => void;
  userEmail: string | null;
  validationRules: ValidationRules;
}) {
  const [formData, setFormData] = React.useState<T>(initialValues);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [employees, setEmployees] = React.useState<
    Array<{ id: string; firstName: string; employeeId: string; lastName: string}>
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

  // input change handler
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
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

  // submit handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const auth = getAuth();
    const user = auth.currentUser;

    if (!user || !userEmail) {
      toast.error("you must be logged in to add this item!");
      setIsSubmitting(false);
      return;
    }

    // validate required fields
    const missingRequiredFields = validationRules.required.filter(
      (field) => !formData[field]
    );

    if (missingRequiredFields.length > 0) {
      toast.error(
        `${missingRequiredFields.join(", ")} ${
          missingRequiredFields.length > 1 ? "are" : "is"
        } required!`
      );
      setIsSubmitting(false);
      return;
    }

    // special validation for asset type
    if (
      collectionName === "it-assets" &&
      formData.type === "Other" &&
      !formData.customType
    ) {
      toast.error("custom type is required when 'other' is selected!");
      setIsSubmitting(false);
      return;
    }

    try {
      const collectionRef = collection(db, collectionName);

      // check for unique fields if specified
      if (validationRules.unique && validationRules.unique.length > 0) {
        for (const uniqueField of validationRules.unique) {
          if (!formData[uniqueField.field]) continue;

          const fieldQuery = query(
            collectionRef,
            where(uniqueField.field, "==", formData[uniqueField.field]),
            where("userId", "==", user.uid)
          );

          const fieldSnapshot = await getDocs(fieldQuery);

          if (!fieldSnapshot.empty) {
            toast.error(uniqueField.errorMessage);
            setIsSubmitting(false);
            return;
          }
        }
      }

      // prepare data for submission
      const dataToSubmit = {
        ...formData,
        userId: user.uid,
        dateAdded: new Date().toISOString(),
        createdBy: userEmail,
      };

      // special handling for assets with custom type
      if (collectionName === "it-assets" && formData.type === "Other") {
        (dataToSubmit as typeof dataToSubmit & { type: string }).type =
          formData.customType;
      }

      // add the document
      await addDoc(collection(db, collectionName), dataToSubmit);

      toast.success(`item added successfully!`);
      onSuccess();
      setOpen(false);
      resetForm();
    } catch (error) {
      console.error("error adding item:", error);
      toast.error("failed to add item");
    } finally {
      setIsSubmitting(false);
    }
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
    handleSubmit,
    resetForm,
  };
}
