import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { History, Search, Trash2, RefreshCw } from "lucide-react";
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "@/firebase/firebase";
import { AssetDetailsDialog } from "@/components/SearchComponents/AssetsDetailsDialog";
import type { FirestoreData } from "@/components/AssetsComponents/columns";

interface ScanHistoryProps {
  userId: string | undefined;
  onSelectSerial?: (serialNumber: string) => void;
}

interface ScanRecord {
  id: string;
  serialNumber: string;
  timestamp: any; // Firestore timestamp
  found: boolean;
}

export function ScanHistory({ userId, onSelectSerial }: ScanHistoryProps) {
  const [history, setHistory] = useState<ScanRecord[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedAsset, setSelectedAsset] = useState<FirestoreData | null>(
    null
  );
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  const fetchHistory = async () => {
    if (!userId) return;

    setIsLoading(true);
    try {
      const historyRef = collection(db, "scan-history");
      const q = query(
        historyRef,
        where("userId", "==", userId),
        orderBy("timestamp", "desc"),
        limit(10)
      );

      const querySnapshot = await getDocs(q);
      const records: ScanRecord[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        records.push({
          id: doc.id,
          serialNumber: data.serialNumber,
          timestamp: data.timestamp,
          found: data.found,
        });
      });

      setHistory(records);
    } catch (error) {
      console.error("Error fetching scan history:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteHistoryItem = async (id: string) => {
    try {
      await deleteDoc(doc(db, "scan-history", id));
      setHistory(history.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Error deleting history item:", error);
    }
  };

  const clearAllHistory = async () => {
    try {
      // Get all history items for this user
      const historyRef = collection(db, "scan-history");
      const q = query(historyRef, where("userId", "==", userId));
      const querySnapshot = await getDocs(q);

      // Delete each item
      querySnapshot.forEach(async (document) => {
        await deleteDoc(doc(db, "scan-history", document.id));
      });

      setHistory([]);
    } catch (error) {
      console.error("Error clearing history:", error);
    }
  };

  const fetchAssetBySerialNumber = async (serialNumber: string) => {
    if (!userId) return null;

    try {
      const assetsRef = collection(db, "it-assets");
      const q = query(
        assetsRef,
        where("serialNo", "==", serialNumber),
        where("userId", "==", userId)
      );

      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        return null;
      }

      const doc = querySnapshot.docs[0];
      return { id: doc.id, ...doc.data() } as FirestoreData;
    } catch (error) {
      console.error("Error fetching asset:", error);
      return null;
    }
  };

  const viewAssetDetails = async (serialNumber: string) => {
    const asset = await fetchAssetBySerialNumber(serialNumber);
    if (asset) {
      setSelectedAsset(asset);
      setIsDialogOpen(true);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [userId]);

  const formatDate = (timestamp: any) => {
    if (!timestamp || !timestamp.toDate) {
      return "Unknown";
    }

    const date = timestamp.toDate();
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl font-bold flex items-center gap-2">
          <History className="w-5 h-5" />
          Recent Scans
        </CardTitle>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchHistory}
            disabled={isLoading}
          >
            <RefreshCw className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={clearAllHistory}
            disabled={isLoading || history.length === 0}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-8 text-muted-foreground">
            Loading history...
          </div>
        ) : history.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No scan history found
          </div>
        ) : (
          <div className="space-y-2">
            {history.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-3 rounded-md border bg-background hover:bg-muted/50 transition-colors"
              >
                <div className="flex-1">
                  <div className="font-medium">{item.serialNumber}</div>
                  <div className="text-sm text-muted-foreground">
                    {formatDate(item.timestamp)}
                  </div>
                </div>
                <div className="flex gap-2">
                  {item.found && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => viewAssetDetails(item.serialNumber)}
                    >
                      <Search className="w-4 h-4" />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      if (onSelectSerial) onSelectSerial(item.serialNumber);
                    }}
                  >
                    <Search className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteHistoryItem(item.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>

      {selectedAsset && (
        <AssetDetailsDialog
          asset={selectedAsset}
          isOpen={isDialogOpen}
          onOpenChange={setIsDialogOpen}
        />
      )}
    </Card>
  );
}
