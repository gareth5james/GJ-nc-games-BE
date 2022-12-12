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

describe("GET /api/reviews", () => {
  it("returns status 200 and an array of review objects", () => {
    return request(app)
      .get("/api/reviews")
      .expect(200)
      .then(({ body: { reviews } }) => {
        expect(reviews).toHaveLength(13);

        reviews.forEach((review) => {
          expect(review).toEqual(
            expect.objectContaining({
              owner: expect.any(String),
              title: expect.any(String),
              review_id: expect.any(Number),
              category: expect.any(String),
              review_img_url: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
              designer: expect.any(String),
            })
          );
        });
      });
  });

  it("the reviews are sorted in descending date order", () => {
    return request(app)
      .get("/api/reviews")
      .expect(200)
      .then(({ body: { reviews } }) => {
        expect(reviews).toBeSortedBy("created_at", { descending: true });
      });
  });

  it("the reviews have a property 'comment-count' which accurately counts the number of comments on the review", () => {
    return request(app)
      .get("/api/reviews")
      .expect(200)
      .then(({ body: { reviews } }) => {
        reviews.forEach((review) => {
          expect(typeof parseInt(review.comment_count)).toBe("number");
        });

        expect(parseInt(reviews[12].comment_count)).toBe(0);
        expect(parseInt(reviews[4].comment_count)).toBe(3);
      });
  });
});
