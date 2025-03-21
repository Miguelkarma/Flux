"use client";

import * as React from "react";
import { getAuth } from "firebase/auth";
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
 * Custom hook for managing add form state and submission
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

  // Custom type change handler for assets
  const handleTypeChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      type: value,
      customType: value === "Other" ? "" : (prev as any).customType,
    }));
  };

  // Reset form to initial values
  const resetForm = () => {
    setFormData(initialValues);
  };

  // Submit handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      toast.error("You must be logged in to add this item!");
      setIsSubmitting(false);
      return;
    }

    if (!userEmail) {
      toast.error("You must be logged in to add this item!");
      setIsSubmitting(false);
      return;
    }

    // Validate required fields
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

    // Special validation for asset type
    if (
      collectionName === "it-assets" &&
      formData.type === "Other" &&
      !formData.customType
    ) {
      toast.error("Custom type is required when 'Other' is selected!");
      setIsSubmitting(false);
      return;
    }

    try {
      const collectionRef = collection(db, collectionName);

      // Check for unique fields if specified
      if (validationRules.unique && validationRules.unique.length > 0) {
        for (const uniqueField of validationRules.unique) {
          if (!formData[uniqueField.field]) continue; // Skip empty fields

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

      // Prepare data for submission
      const dataToSubmit = {
        ...formData,
        userId: user.uid,
        dateAdded: new Date().toISOString(),
        createdBy: userEmail,
      };

      // Special handling for assets with custom type
      if (collectionName === "it-assets" && formData.type === "Other") {
        (dataToSubmit as typeof dataToSubmit & { type: string }).type =
          formData.customType;
      }

      // Add the document
      await addDoc(collection(db, collectionName), dataToSubmit);

      toast.success(`Item added successfully!`);
      onSuccess();
      setOpen(false);
      resetForm();
    } catch (error) {
      console.error("Error adding item:", error);
      toast.error("Failed to add item");
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
    handleInputChange,
    handleSelectChange,
    handleDateChange,
    handleTypeChange,
    handleSubmit,
    resetForm,
  };
}
