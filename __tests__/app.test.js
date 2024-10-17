const request = require("supertest");
require("jest-sorted");
const testData = require("../db/data/test-data/index.js");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const endpoints = require("../endpoints.json");

const app = require("../app");
const articles = require("../db/data/test-data/articles.js");

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe("/api", () => {
  describe("GET", () => {
    test("200 OK: should return all of the endpoints in endpoints.json", () => {
      return request(app)
        .get("/api")
        .expect(200)
        .then(({ body }) => {
          expect(body).toEqual(endpoints);
        });
    });
  });
});
describe("/api/topics", () => {
  describe("GET", () => {
    test("200 OK: should return an array of all the topics", () => {
      return request(app)
        .get("/api/topics")
        .expect(200)
        .then(({ body }) => {
          expect(body.topics.length).toBeGreaterThan(0);
          body.topics.forEach((topic) => {
            expect(typeof topic.slug).toBe("string");
            expect(typeof topic.description).toBe("string");
          });
        });
    });
  });
});
describe("/api/atricles", () => {
  describe("GET", () => {
    test("200 OK: should return an array of all the articles", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body }) => {
          expect(body.articles.length).toBeGreaterThan(0);
          body.articles.forEach((article) => {
            expect(typeof article.article_id).toBe("number");
            expect(typeof article.title).toBe("string");
            expect(typeof article.topic).toBe("string");
            expect(typeof article.author).toBe("string");
            expect(typeof article.votes).toBe("number");
            expect(typeof article.article_img_url).toBe("string");
            expect(typeof article.comment_count).toBe("string");
          });
        });
    });
    test("200 OK: should return an array of all the articles sorted by date", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body }) => {
          body.articles.forEach((article) => {
            article.created_at = new Date(article.created_at).getTime();
          });
          expect(body.articles).toBeSortedBy("created_at", {
            descending: true,
          });
        });
    });
  });
});
describe("/api/articles/:atricle_id", () => {
  describe("GET", () => {
    test("200 OK: should return an single article matching the id that is given", () => {
      return request(app)
        .get("/api/articles/1")
        .expect(200)
        .then(({ body }) => {
          expect(body.article.article_id).toBe(1);
          expect(body.article.title).toBe(
            "Living in the shadow of a great man"
          );
          expect(body.article.topic).toBe("mitch");
          expect(body.article.author).toBe("butter_bridge");
          expect(body.article.body).toBe("I find this existence challenging");
          expect(body.article.votes).toBe(100);
          expect(body.article.article_img_url).toBe(
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"
          );
        });
    });
    test("400 Bad request: should return 'Bad request' when given an invalid input for article_id", () => {
      return request(app)
        .get("/api/articles/hello")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad request");
        });
    });
    test("404 Not found: should return 'Not found' when given a valid input but out of the scope", () => {
      return request(app)
        .get("/api/articles/999")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Not found");
        });
    });
  });
  describe("PATCH", () => {
    test("200 OK: should return an article with the updated votes by article_id", () => {
      return request(app)
        .patch("/api/articles/1")
        .send({ inc_votes: -50 })
        .expect(200)
        .then(({ body }) => {
          expect(body.article.votes).toBe(50);
        });
    });
    test("400 Bad request: if valid input given for artcle id but non existant", () => {
      return request(app)
        .patch("/api/articles/999")
        .send({ inc_votes: -50 })
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad request");
        });
    });
    test("400 Bad request: if invalid input given for artcle id", () => {
      return request(app)
        .patch("/api/articles/hello")
        .send({ inc_votes: -50 })
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad request");
        });
    });
    test("422 Unprocessable content: if given a invalid body ", () => {
      return request(app)
        .patch("/api/articles/1")
        .send({})
        .expect(422)
        .then(({ body }) => {
          expect(body.msg).toBe("Unprocessable content");
        });
    });
  });
  describe("/api/articles/:article_id/comments", () => {
    describe("GET", () => {
      test("200 OK: should return an array of comments refferencing the article_id that was given", () => {
        return request(app)
          .get("/api/articles/1/comments")
          .expect(200)
          .then(({ body }) => {
            if (body.comments.length > 0) {
              body.comments.forEach((comment) => {
                expect(typeof comment.comment_id).toBe("number");
                expect(typeof comment.votes).toBe("number");
                expect(typeof comment.created_at).toBe("string");
                expect(typeof comment.author).toBe("string");
                expect(typeof comment.body).toBe("string");
                expect(typeof comment.article_id).toBe("number");
              });
            }
          });
      });
      test("400 Bad request: should return 'Bad request' when given an invalid input for article_id", () => {
        return request(app)
          .get("/api/articles/hello")
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe("Bad request");
          });
      });
      test("404 Not found: should return 'Not found' when given a valid input but out of the scope", () => {
        return request(app)
          .get("/api/articles/999")
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).toBe("Not found");
          });
      });
    });
    describe("POST", () => {
      test("201 CREATED: should return a comment refferencing the article_id that was given", () => {
        return request(app)
          .post("/api/articles/1/comments")
          .send({ username: "rogersop", body: "i dont agree with this!" })
          .expect(201)
          .then(({ body }) => {
            expect(body.comment.author).toBe("rogersop");
            expect(body.comment.body).toBe("i dont agree with this!");
            expect(body.comment).toEqual({
              comment_id: 19,
              body: "i dont agree with this!",
              votes: 0,
              author: "rogersop",
              article_id: 1,
              created_at: body.comment.created_at,
            });
          });
      });
      test("400 Bad request: if valid input given for artcle id but non existant", () => {
        return request(app)
          .post("/api/articles/999/comments")
          .send({
            username: "rogersop",
            body: "i dont agree with this!",
          })
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe("Bad request");
          });
      });
      test("400 Bad request: if invalid input given for artcle id", () => {
        return request(app)
          .post("/api/articles/hello/comments")
          .send({
            username: "rogersop",
            body: "i dont agree with this!",
          })
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe("Bad request");
          });
      });
      test("422 Unprocessable content: if given a invalid body ", () => {
        return request(app)
          .post("/api/articles/1/comments")
          .send({})
          .expect(422)
          .then(({ body }) => {
            expect(body.msg).toBe("Unprocessable content");
          });
      });
    });
  });
});
describe("/api/comments/:comment_id", () => {
  describe("DELETE", () => {
    test("204 : delete a comment refrencing the id that was given", () => {
      return request(app)
        .delete("/api/comments/1")
        .expect(204)
        .then(() => {
          return db
            .query(`SELECT * FROM comments WHERE comment_id=1;`)
            .then(({ rows }) => {
              expect(rows.length).toBe(0);
            });
        });
    });
    test("400 Bad request: if invalid input given for comment_id", () => {
      return request(app)
        .delete("/api/comments/hello")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad request");
        });
    });
    test("404 Not found: if valid input given for comment_id but not found", () => {
      return request(app)
        .delete("/api/comments/999")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Not found");
        });
    });
  });
});
