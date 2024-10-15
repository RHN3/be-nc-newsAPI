const request = require("supertest");
const testData = require("../db/data/test-data/index.js");
const connection = require("../db/connection");
const seed = require("../db/seeds/seed");
const endpoints = require("../endpoints.json");

const app = require("../app");

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
          expect(body.article_id).toBe(1);
          expect(body.title).toBe("Living in the shadow of a great man");
          expect(body.topic).toBe("mitch");
          expect(body.author).toBe("butter_bridge");
          expect(body.body).toBe("I find this existence challenging");
          expect(body.votes).toBe(100);
          expect(body.article_img_url).toBe(
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
});
