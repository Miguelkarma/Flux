export type FirestoreData = {
  id: string;
  serialNo: string;
  assetTag: string;
  type: string;
  customType?: string;
  location: string;
  assignedEmployee: string;
  status: string;
  dateAdded: string;
};

export type ProductDetails = {
  thumbnail?: string;
  title?: string;
  description?: string;
  category?: string;
};
