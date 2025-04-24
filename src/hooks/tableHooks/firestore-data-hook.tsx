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

interface UseFirestoreDataProps {
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
}: UseFirestoreDataProps) {
  const [data, setData] = React.useState<T[]>([]);
  const [loading, setLoading] = React.useState(!!userId); // Initialize loading based on userId
  const [refreshTrigger, setRefreshTrigger] = React.useState(0);

  // ref to avoid stale closures
  const dataRef = React.useRef<T[]>([]);

  React.useEffect(() => {
    if (!userId) {
      setData([]);
      dataRef.current = [];
      setLoading(false);
      return;
    }

    setLoading(true);

    // build query constraints
    const constraints: QueryConstraint[] = [
      where("userId", "==", userId),
      orderBy(orderByField, orderDirection),
      ...additionalConstraints,
    ];

    const q = query(collection(db, collectionName), ...constraints);

    // subscribe to the query
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as T[];

      setData(fetchedData);
      dataRef.current = fetchedData;
      setLoading(false);
    });

    // cleanup function
    return () => unsubscribe();
  }, [
    collectionName,
    userId,
    orderByField,
    orderDirection,
    // stable dependency for constraints
    JSON.stringify(additionalConstraints),
    refreshTrigger,
  ]);

  const refreshData = React.useCallback(() => {
    if (userId) {
      setLoading(true);
      setRefreshTrigger((prev) => prev + 1); 
    }
  }, [userId]);

  return {
    data,
    loading,
    refreshData,
  };
}