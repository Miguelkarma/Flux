// src/services/employeeService.ts

import { db } from "@/firebase/firebase";
import { 
  collection, 
  addDoc, 
  serverTimestamp, 
  getDocs, 
  deleteDoc, 
  doc, 
  updateDoc, 
  query, 
  where,
  DocumentData
} from "firebase/firestore";
import { FirebaseEmployeeData } from "@/components/EmployeeComponents/employeeColumns";

// Type for creating a new employee
export type NewEmployeeData = Omit<FirebaseEmployeeData, 'id' | 'createdAt' | 'updatedAt'>;

// Add a new employee to Firestore
export const addEmployee = async (
  employee: NewEmployeeData,
  userId: string
): Promise<string> => {
  try {
    // Generate unique employee ID if not provided
    const employeeId = employee.employeeId || 
      `EMP${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;

    const docRef = await addDoc(collection(db, "employees"), {
      ...employee,
      employeeId,
      userId, // Associate with the current user
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    console.log("Employee added with ID:", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Error adding employee:", error);
    throw error;
  }
};

// Fetch all employees for the current user
export const getEmployees = async (userId: string): Promise<FirebaseEmployeeData[]> => {
  try {
    const employeesQuery = query(
      collection(db, "employees"), 
      where("userId", "==", userId)
    );
    
    const snapshot = await getDocs(employeesQuery);
    
    return snapshot.docs.map(doc => {
      const data = doc.data() as Omit<FirebaseEmployeeData, 'id'>;
      return {
        id: doc.id,
        ...data,
        // Convert Firestore timestamps to ISO strings if needed
        createdAt: data.createdAt instanceof Date ? 
          data.createdAt.toISOString() : 
          typeof data.createdAt === 'object' && data.createdAt?.toDate ? 
            data.createdAt.toDate().toISOString() : 
            data.createdAt as string,
        updatedAt: data.updatedAt instanceof Date ? 
          data.updatedAt.toISOString() : 
          typeof data.updatedAt === 'object' && data.updatedAt?.toDate ? 
            data.updatedAt.toDate().toISOString() : 
            data.updatedAt as string,
      } as FirebaseEmployeeData;
    });
  } catch (error) {
    console.error("Error fetching employees:", error);
    throw error;
  }
};

// Update an existing employee
export const updateEmployee = async (
  id: string, 
  data: Partial<FirebaseEmployeeData>
): Promise<void> => {
  try {
    const employeeRef = doc(db, "employees", id);
    await updateDoc(employeeRef, {
      ...data,
      updatedAt: serverTimestamp()
    });
    console.log("Employee updated successfully");
  } catch (error) {
    console.error("Error updating employee:", error);
    throw error;
  }
};

// Delete an employee
export const deleteEmployee = async (id: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, "employees", id));
    console.log("Employee deleted successfully");
  } catch (error) {
    console.error("Error deleting employee:", error);
    throw error;
  }
};

// Check if employee with email already exists for this user
export const checkEmployeeExists = async (
  email: string, 
  userId: string
): Promise<boolean> => {
  try {
    const employeesRef = collection(db, "employees");
    const emailQuery = query(
      employeesRef,
      where("email", "==", email),
      where("userId", "==", userId)
    );
    const querySnapshot = await getDocs(emailQuery);
    
    return !querySnapshot.empty;
  } catch (error) {
    console.error("Error checking employee existence:", error);
    throw error;
  }
};

// Delete multiple employees (for bulk delete)
export const deleteMultipleEmployees = async (ids: string[]): Promise<void> => {
  try {
    const deletePromises = ids.map(id => deleteDoc(doc(db, "employees", id)));
    await Promise.all(deletePromises);
    console.log(`${ids.length} employees deleted successfully`);
  } catch (error) {
    console.error("Error deleting multiple employees:", error);
    throw error;
  }
};