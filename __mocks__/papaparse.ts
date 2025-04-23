export default {
  parse: jest.fn((_text, options) => {
    if (options && options.complete) {
      options.complete({
        data: [
          // for assets
          {
            serialNo: "SN003",
            assetTag: "AT003",
          },
          // for employees
          {
            firstName: "Alex",
            lastName: "Johnson",
            email: "alex.johnson@company.com",
            employeeId: "EMP003",
          },
        ],
      });
    }
  }),
};
