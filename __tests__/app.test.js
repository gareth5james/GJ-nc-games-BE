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

  test("the reviews are sorted in descending date order", () => {
    return request(app)
      .get("/api/reviews")
      .expect(200)
      .then(({ body: { reviews } }) => {
        expect(reviews).toBeSortedBy("created_at", { descending: true });
      });
  });

  test("the reviews have a property 'comment-count' which accurately counts the number of comments on the review", () => {
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

describe("5. GET /api/reviews/:review_id", () => {
  it("returns 200 when given a valid in range id, with the chosen review", () => {
    return request(app)
      .get("/api/reviews/12")
      .expect(200)
      .then(({ body: { review } }) => {
        expect(review).toEqual({
          review_id: 12,
          title: "Scythe; you're gonna need a bigger table!",
          review_body:
            "Spend 30 minutes just setting up all of the boards (!) meeple and decks, just to forget how to play. Scythe can be a lengthy game but really packs a punch if you put the time in. With beautiful artwork, countless scenarios and clever game mechanics, this board game is a must for any board game fanatic; just make sure you explain ALL the rules before you start playing with first timers or you may find they bring it up again and again.",
          designer: "Jamey Stegmaier",
          review_img_url:
            "https://images.pexels.com/photos/163064/play-stone-network-networked-interactive-163064.jpeg",
          votes: 100,
          category: "social deduction",
          owner: "mallionaire",
          created_at: "2021-01-22T10:37:04.839Z",
        });
      });
  });

  it("returns a 404 when given a valid id, but one that does not exist in the database", () => {
    return request(app)
      .get("/api/reviews/12")
      .expect(404)
      .then(({ body: { message } }) => {
        expect(message).toBe("No review with ID 12 in the database");
      });
  });

  it("returns a 400 when passed an ID that is not a number", () => {
    return request(app)
      .get("/api/reviews/banana")
      .expect(400)
      .then(({ body: { message } }) => {
        expect(message).toBe("Bad data type");
      });
  });
});
