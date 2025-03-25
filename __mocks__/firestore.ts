export const getFirestore = jest.fn(() => ({
  collection,
  addDoc,
  query,
  where,
  getDocs,
}));

export const collection = jest.fn(() => "collection-mock");
export const addDoc = jest.fn(() => Promise.resolve({ id: "new-doc-id" }));
export const query = jest.fn(() => "query-mock");
export const where = jest.fn(() => "where-mock");
export const getDocs = jest.fn(() =>
  Promise.resolve({
    docs: [
      {
        data: () => ({
          id: "existing1",
          serialNo: "SN001",
          assetTag: "AT001",
          firstName: "John",
          lastName: "Doe",
          email: "john.doe@company.com",
          employeeId: "EMP001",
        }),
      },
      {
        data: () => ({
          id: "existing2",
          serialNo: "SN002",
          assetTag: "AT002",
          firstName: "Jane",
          lastName: "Smith",
          email: "jane.smith@company.com",
          employeeId: "EMP002",
        }),
      },
    ],
  })
);
