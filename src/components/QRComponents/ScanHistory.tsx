import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  History,
  Search,
  Trash2,
  RefreshCw,
  Loader2,
  ListRestart,
} from "lucide-react";
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
import DeleteDialog from "@/components/sharedComponent/DeleteDialog"; // Import the DeleteDialog
import type { FirestoreData } from "@/components/AssetsComponents/columns";
import { toast } from "sonner";

interface ScanHistoryProps {
  userId: string | undefined;
  onSelectSerial?: (serialNumber: string) => void;
}

export type ScanRecord = {
  id: string;
  serialNum: string;
  timestamp: any;
  found: boolean;
};

export function ScanHistory({ userId }: ScanHistoryProps) {
  const [history, setHistory] = useState<ScanRecord[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedAsset, setSelectedAsset] = useState<FirestoreData | null>(
    null
  );
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
  const [selectedRecord, setSelectedRecord] = useState<ScanRecord | null>(null);

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
          serialNum: data.serialNum,
          timestamp: data.timestamp,
          found: data.found,
        });
      });

      setHistory(records);
    } catch (error) {
      console.error("Error fetching scan history:", error);
    } finally {
      setIsLoading(false);
      toast.success("Fetched history successfully");
    }
  };

  const clearAllHistory = async () => {
    try {
      const historyRef = collection(db, "scan-history");
      const q = query(historyRef, where("userId", "==", userId));
      const querySnapshot = await getDocs(q);

      querySnapshot.forEach(async (document) => {
        await deleteDoc(doc(db, "scan-history", document.id));
      });

      setHistory([]);
      toast.success("History cleared successfully");
    } catch (error) {
      console.error("Error clearing history:", error);
    }
  };

  const fetchAssetBySerialNum = async (serialNum: string) => {
    if (!userId) return null;

    try {
      const assetsRef = collection(db, "it-assets");
      const q = query(
        assetsRef,
        where("serialNo", "==", serialNum),
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

  const viewAssetDetails = async (serialNum: string) => {
    const asset = await fetchAssetBySerialNum(serialNum);
    if (asset) {
      setSelectedAsset(asset);
      setIsDialogOpen(true);
    }
  };

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

  const handleDeleteDialogOpen = (record: ScanRecord) => {
    setSelectedRecord(record);
    setDeleteDialogOpen(true);
  };

  useEffect(() => {
    fetchHistory();
  }, [userId]);

  return (
    <Card className="w-full max-w-4xl mx-auto shadow shadow-popover-foreground bg-[hsl(var(--secondary))] ">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl font-bold flex items-center gap-2 mt-2">
          <History className="w-5 h-5" />
          Recent Scans
        </CardTitle>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="lg"
            onClick={fetchHistory}
            disabled={isLoading}
          >
            <RefreshCw className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={clearAllHistory}
            disabled={isLoading || history.length === 0}
          >
            <ListRestart className="w-4 h-4" /> Clear History
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center p-4">
            <Loader2 className="w-6 h-6 animate-spin" />
          </div>
        ) : history.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No scan history found
          </div>
        ) : (
          <div className="space-y-2 ">
            {history.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-3 rounded-md border bg-background hover:bg-muted/50 transition-colors shadow shadow-popover-foreground"
              >
                <div className="flex-1">
                  <div className="font-medium">{item.serialNum}</div>
                  <div className="text-sm text-muted-foreground">
                    {formatDate(item.timestamp)}
                  </div>
                </div>
                <div className="flex gap-2">
                  {item.found && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => viewAssetDetails(item.serialNum)}
                    >
                      <Search className="w-4 h-4" />
                    </Button>
                  )}

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteDialogOpen(item)}
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

      {selectedRecord && (
        <DeleteDialog
          item={{
            type: "scan-history",
            data: selectedRecord,
          }}
          isOpen={deleteDialogOpen}
          setIsOpen={setDeleteDialogOpen}
          onHistoryUpdated={fetchHistory}
        />
      )}
    </Card>
  );
}
