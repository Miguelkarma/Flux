import * as React from "react";
import {
  collection,
  onSnapshot,
  query,
  where,
  orderBy,
  QueryConstraint,
} from "firebase/firestore";
import { db } from "@/firebase/firebase";

interface UseFirestoreDataProps<T> {
  collectionName: string;
  userId: string | null;
  orderByField?: string;
  orderDirection?: "asc" | "desc";
  additionalConstraints?: QueryConstraint[];
}

export function useFirestoreData<T>({
  collectionName,
  userId,
  orderByField = "dateAdded",
  orderDirection = "desc",
  additionalConstraints = [],
}: UseFirestoreDataProps<T>) {
  const [data, setData] = React.useState<T[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (!userId) {
      setData([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    // Build query constraints
    const constraints: QueryConstraint[] = [
      where("userId", "==", userId),
      orderBy(orderByField, orderDirection),
      ...additionalConstraints,
    ];

    const q = query(collection(db, collectionName), ...constraints);

    // Subscribe to the query
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as T[];

      setData(fetchedData);
      setLoading(false);
    });

    // Cleanup function
    return () => unsubscribe();
  }, [
    collectionName,
    userId,
    orderByField,
    orderDirection,
    additionalConstraints,
  ]);

  // Function to manually refresh data
  const refreshData = React.useCallback(() => {
    if (userId) {
      setLoading(true);
      // Data will be refreshed by the snapshot listener
    }
  }, [userId]);

  return {
    data,
    loading,
    refreshData,
  };
}
