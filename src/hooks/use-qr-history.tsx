import { db } from "@/firebase/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";


export function useScanHistory(userId: string | undefined) {
  const saveScanHistory = async (serialNum: string, found: boolean) => {
    if (!userId) {
      console.error("User ID is required to save scan history");
      return;
    }

    try {
      const historyRef = collection(db, "scan-history");
      await addDoc(historyRef, {
        userId,
        serialNum,
        timestamp: serverTimestamp(),
        found,
      });
      console.log("Scan history saved successfully");
    } catch (error) {
      console.error("Error saving scan history:", error);
      throw error; // Re-throw the error so calling code can handle it
    }
  };

  return { saveScanHistory };
}
