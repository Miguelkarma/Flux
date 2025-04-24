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
import DeleteDialog from "@/components/sharedComponent/DeleteDialog";
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
    <Card className="w-full max-w-4xl mx-auto shadow shadow-popover-foreground bg-[hsl(var(--secondary))] px-2 sm:px-4">
      <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-2 sm:px-4">
        <CardTitle className="text-lg sm:text-xl font-bold flex items-center gap-2">
          <History className="w-4 h-4 sm:w-5 sm:h-5" />
          Recent Scans
        </CardTitle>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchHistory}
            disabled={isLoading}
            className="p-1 sm:p-2"
          >
            <RefreshCw className="w-4 h-4" />
            <span className="sr-only">Refresh</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={clearAllHistory}
            disabled={isLoading || history.length === 0}
            className="text-xs sm:text-sm p-1 sm:p-2 flex-1 sm:flex-none"
          >
            <ListRestart className="w-4 h-4 mr-1" />
            <span className="block">Clear History</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:px-4 pb-4">
        {isLoading ? (
          <div className="flex justify-center p-4">
            <Loader2 className="w-6 h-6 animate-spin" />
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
                className="flex items-center justify-between p-2 sm:p-3 rounded-md border bg-background hover:bg-muted/50 transition-colors shadow shadow-popover-foreground"
              >
                <div className="flex-1 min-w-0 pr-2">
                  <div className="font-medium text-sm sm:text-base truncate">
                    {item.serialNum}
                  </div>
                  <div className="text-xs sm:text-sm text-muted-foreground">
                    {formatDate(item.timestamp)}
                  </div>
                </div>
                <div className="flex gap-1 sm:gap-2 flex-shrink-0">
                  {item.found && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => viewAssetDetails(item.serialNum)}
                      className="h-8 w-8 p-0"
                    >
                      <Search className="w-4 h-4" />
                      <span className="sr-only">View Details</span>
                    </Button>
                  )}

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteDialogOpen(item)}
                    className="h-8 w-8 p-0"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span className="sr-only">Delete</span>
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
