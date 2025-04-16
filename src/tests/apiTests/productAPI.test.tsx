import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import {
  fetchElectronicsProducts,
  generateUniqueSerialNumber,
} from "@/api/electronicProductsAPI";

describe("fetchElectronicsProducts", () => {
  let mock: MockAdapter;

  beforeEach(() => {
    mock = new MockAdapter(axios);
  });

  afterEach(() => {
    mock.restore();
  });

  it("should fetch and filter electronics products", async () => {
    const mockData = {
      products: [
        { id: 1, category: "smartphones", title: "iPhone 12" },
        { id: 2, category: "furniture", title: "Wooden Chair" },
        { id: 3, category: "laptops", title: "MacBook Air" },
      ],
    };

    mock.onGet("https://dummyjson.com/products?limit=0").reply(200, mockData);

    const result = await fetchElectronicsProducts();
    expect(result).toHaveLength(2); // Only smartphones and laptops
    expect(result[0].title).toBe("iPhone 12");
    expect(result[1].title).toBe("MacBook Air");
  });

  it("should return an empty array on fetch failure", async () => {
    mock.onGet("https://dummyjson.com/products?limit=0").networkError();

    const result = await fetchElectronicsProducts();
    expect(result).toEqual([]);
  });
});

describe("generateUniqueSerialNumber", () => {
  it("should generate a serial number with default prefix", () => {
    const serial = generateUniqueSerialNumber();
    expect(serial).toMatch(/^ASSET-\d+-\d+$/);
  });

  it("should generate a serial number with a custom prefix", () => {
    const serial = generateUniqueSerialNumber("EMP");
    expect(serial).toMatch(/^EMP-\d+-\d+$/);
  });

  it("should generate unique serial numbers", () => {
    const serial1 = generateUniqueSerialNumber();
    const serial2 = generateUniqueSerialNumber();
    expect(serial1).not.toEqual(serial2);
  });
});
