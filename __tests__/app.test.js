const request = require("supertest");
const testData = require("../db/data/test-data/index.js");
const connection = require("../db/connection");
const seed = require("../db/seeds/seed");

const app = require("../app");

beforeEach(() => seed(testData));
afterAll(() => connection.end());

describe("/api", () => {
  describe("GET", () => {
    test("200 OK: should return all of the endpoints in endpoints.json", () => {
      return request(app)
        .get("/api")
        .expect(200)
        .then((endpoints) => {
          Object.keys(endpoints).forEach((endpoint) => {
            expect(typeof endpoint).toBe("string");
          });
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
          body.topics.forEach((topic) => {
            expect(typeof topic.slug).toBe("string");
            expect(typeof topic.description).toBe("string");
          });
        });
    });
  });
});
