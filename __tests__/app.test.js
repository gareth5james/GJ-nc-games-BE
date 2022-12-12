const app = require("../app/app.js");
const db = require("../db/connection.js");
const request = require("supertest");
const testData = require("../db/data/test-data/index.js");
const seed = require("../db/seeds/seed.js");

afterAll(() => {
  db.end();
});

beforeEach(() => {
  return seed(testData);
});

describe("handles bad paths", () => {
  it("returns status 404 and an error message when a bad path is used", () => {
    return request(app)
      .get("/api/banana")
      .expect(404)
      .then(({ body: { message } }) => {
        expect(message).toBe("Bad path, not found");
      });
  });
});

describe("GET /api/categories", () => {
  it("returns status 200 and an array of category objects, each containing a 'slug' and 'description' property", () => {
    return request(app)
      .get("/api/categories")
      .expect(200)
      .then(({ body: { categories } }) => {
        expect(categories).toBeInstanceOf(Array);

        expect(categories).toHaveLength(4);

        categories.forEach((category) => {
          expect(category).toEqual(
            expect.objectContaining({
              slug: expect.any(String),
              description: expect.any(String),
            })
          );
        });
      });
  });
});
