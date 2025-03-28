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
  model:string;
  description?:string;
};

export type ProductDetails = {
  thumbnail?: string;
  title?: string;
  description?: string;
  category?: string;
};
