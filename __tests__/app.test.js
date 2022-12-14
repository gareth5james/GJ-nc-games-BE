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
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad path, not found");
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
        expect(reviews).toBeSortedBy("created_at", { ascending: true });
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
  it("returns status 200 when given a valid in range id, with the chosen review", () => {
    return request(app)
      .get("/api/reviews/12")
      .expect(200)
      .then(({ body: { review } }) => {
        expect(review).toEqual(
          expect.objectContaining({
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
          })
        );
      });
  });

  it("returns status 404 when given a valid id, but one that does not exist in the database", () => {
    return request(app)
      .get("/api/reviews/500")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Review not found");
      });
  });

  it("returns status 400 when passed an ID that is not a number", () => {
    return request(app)
      .get("/api/reviews/banana")
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad data type");
      });
  });
});

describe("6. GET /api/reviews/:review_id/comments", () => {
  it("returns status 200 and an array of comment objects", () => {
    return request(app)
      .get("/api/reviews/2/comments")
      .expect(200)
      .then(({ body: { comments } }) => {
        expect(comments).toHaveLength(3);

        comments.forEach((comment) => {
          expect(comment).toEqual(
            expect.objectContaining({
              comment_id: expect.any(Number),
              votes: expect.any(Number),
              created_at: expect.any(String),
              author: expect.any(String),
              body: expect.any(String),
              review_id: expect.any(Number),
            })
          );
        });
      });
  });

  it("returns the comments in date order, most recent first", () => {
    return request(app)
      .get("/api/reviews/3/comments")
      .expect(200)
      .then(({ body: { comments } }) => {
        expect(comments).toBeSortedBy("created_at", { descending: true });
      });
  });

  it("returns status 200 and an empty array when passed a review_id with no comments", () => {
    return request(app)
      .get("/api/reviews/12/comments")
      .expect(200)
      .then(({ body: { comments } }) => {
        expect(comments).toHaveLength(0);
      });
  });

  it("returns status 404 when given a review_id that does not exist", () => {
    return request(app)
      .get("/api/reviews/500/comments")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Review not found");
      });
  });

  it("returns status 400 when given a review_id with the wrong data type", () => {
    return request(app)
      .get("/api/reviews/artichoke/comments")
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad data type");
      });
  });
});

describe("7. POST /api/reviews/:review_id/comments", () => {
  it("returns status 201 and the newly posted comment", () => {
    const newComment = {
      username: "bainesface",
      body: "distinctly average",
    };

    return request(app)
      .post("/api/reviews/12/comments")
      .send(newComment)
      .expect(201)
      .then(({ body: { comment } }) => {
        expect(comment).toEqual(
          expect.objectContaining({
            author: newComment.username,
            body: newComment.body,
            review_id: 12,
            comment_id: 7,
            votes: 0,
            created_at: expect.any(String),
          })
        );
      });
  });

  it("returns status 404 when passed a review_id not in the database", () => {
    const newComment = {
      username: "bainesface",
      body: "distinctly average",
    };

    return request(app)
      .post("/api/reviews/1000/comments")
      .send(newComment)
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Item not found");
      });
  });

  it("returns status 400 when passed a review_id with a bad data type", () => {
    const newComment = {
      username: "bainesface",
      body: "distinctly average",
    };

    return request(app)
      .post("/api/reviews/chicken/comments")
      .send(newComment)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad data type");
      });
  });

  it("returns status 400 when passed a faulty comment to add", () => {
    const newComment = {
      use7name: "bainesface",
      body: "distinctly average",
    };

    return request(app)
      .post("/api/reviews/8/comments")
      .send(newComment)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad input");
      });
  });

  it("returns status 400 when passed a comment with missing username", () => {
    const newComment = {
      body: "distinctly average",
    };

    return request(app)
      .post("/api/reviews/6/comments")
      .send(newComment)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad input");
      });
  });

  it("returns status 400 when passed a comment with missing body", () => {
    const newComment = {
      username: "bainesface",
    };

    return request(app)
      .post("/api/reviews/4/comments")
      .send(newComment)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad input");
      });
  });

  it("returns status 404 when passed a username not in the database", () => {
    const newComment = {
      username: "gareth",
      body: "distinctly average",
    };

    return request(app)
      .post("/api/reviews/6/comments")
      .send(newComment)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Item not found");
      });
  });
});

describe("8. PATCH /api/reviews/:review_id", () => {
  it("returns status 200 and the updated review object", () => {
    const voter = {
      inc_votes: 20,
    };

    return request(app)
      .patch("/api/reviews/12")
      .send(voter)
      .expect(200)
      .then(({ body: { review } }) => {
        expect(review).toEqual(
          expect.objectContaining({
            review_id: 12,
            title: "Scythe; you're gonna need a bigger table!",
            designer: "Jamey Stegmaier",
            owner: "mallionaire",
            review_img_url:
              "https://images.pexels.com/photos/163064/play-stone-network-networked-interactive-163064.jpeg",
            review_body:
              "Spend 30 minutes just setting up all of the boards (!) meeple and decks, just to forget how to play. Scythe can be a lengthy game but really packs a punch if you put the time in. With beautiful artwork, countless scenarios and clever game mechanics, this board game is a must for any board game fanatic; just make sure you explain ALL the rules before you start playing with first timers or you may find they bring it up again and again.",
            category: "social deduction",
            created_at: "2021-01-22T10:37:04.839Z",
            votes: 120,
          })
        );
      });
  });

  it("returns status 404 when passed an id that is not in the database", () => {
    const voter = {
      inc_votes: 20,
    };

    return request(app)
      .patch("/api/reviews/50")
      .send(voter)
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Review not found");
      });
  });

  it("returns status 400 when passed an id that is the wrong datatype", () => {
    const voter = {
      inc_votes: 20,
    };

    return request(app)
      .patch("/api/reviews/cheese")
      .send(voter)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad data type");
      });
  });

  it("returns status 400 when passed an input object with bad data", () => {
    const voter = {
      inc_votes: "potato",
    };

    return request(app)
      .patch("/api/reviews/6")
      .send(voter)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad data type");
      });
  });

  it("returns status 400 when passed an input object with bad keys", () => {
    const voter = {
      ind_votes: 90,
    };

    return request(app)
      .patch("/api/reviews/4")
      .send(voter)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad input");
      });
  });

  it("returns status 400 when passed an input object with missing keys", () => {
    const voter = {};

    return request(app)
      .patch("/api/reviews/4")
      .send(voter)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad input");
      });
  });
});

describe("9. GET /api/users", () => {
  it("returns status 200 and an array of user objects", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body: { users } }) => {
        expect(users).toHaveLength(4);

        users.forEach((user) => {
          expect(user).toEqual(
            expect.objectContaining({
              username: expect.any(String),
              name: expect.any(String),
              avatar_url: expect.any(String),
            })
          );
        });
      });
  });
});

describe("10. GET /api/reviews (queries)", () => {
  it("allows users to select a category 'dexterity' and then receive an array of reviews only of that category with a status 200", () => {
    return request(app)
      .get("/api/reviews?category=dexterity")
      .expect(200)
      .then(({ body: { reviews } }) => {
        expect(reviews).toHaveLength(1);

        expect(reviews[0].category).toBe("dexterity");
      });
  });

  it("returns as above with another category, 'social deduction'", () => {
    return request(app)
      .get("/api/reviews?category=social+deduction")
      .expect(200)
      .then(({ body: { reviews } }) => {
        expect(reviews).toHaveLength(11);

        reviews.forEach((review) => {
          expect(review.category).toBe("social deduction");
        });
      });
  });

  it("returns status 404 when asked for a category not in the database", () => {
    return request(app)
      .get("/api/reviews?category=potatoes")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Item not found");
      });
  });

  it("returns status 200 and no rows when asked for a category in the database, but with no reviews", () => {
    return request(app)
      .get("/api/reviews?category=children's+games")
      .expect(200)
      .then(({ body: { reviews } }) => {
        expect(reviews).toHaveLength(0);
      });
  });

  describe("allows users to sort by different columns, defaulting to date(refer to origin test for default)", () => {
    it("sorts by votes, and status 200", () => {
      return request(app)
        .get("/api/reviews?sort_by=votes")
        .expect(200)
        .then(({ body: { reviews } }) => {
          expect(reviews).toBeSortedBy("votes", { descending: true });
        });
    });
  });
});
