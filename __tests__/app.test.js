const request = require("supertest");
require("jest-sorted");
const testData = require("../db/data/test-data/index.js");
const connection = require("../db/connection");
const seed = require("../db/seeds/seed");
const endpoints = require("../endpoints.json");

const app = require("../app");
const articles = require("../db/data/test-data/articles.js");

beforeEach(() => seed(testData));
afterAll(() => connection.end());

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
  describe("/api/articles/:article_id/comments", () => {
    test("200 OK: should return an array of comments refferencing the article_id that was given", () => {
      return request(app)
        .get("/api/articles/1/comments")
        .expect(200)
        .then(({ body }) => {
          console.log(body);
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
});
