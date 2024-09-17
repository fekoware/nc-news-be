const request = require("supertest");
const app = require("../app");
const express = require("express");
const db = require("../db/connection");
const endpoints = require("../endpoints.json");

const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data");

beforeEach(() => seed(data));

afterAll(() => {
  return db.end();
});

describe("GET", () => {
  describe("/api/topics", () => {
    it("200: should respond with an array of topic objects", () => {
      return request(app).get("/api/topics").expect(200);
    });
    it("200: should respond with an array of topic objects, of whcih should have slug and description as properties", () => {
      return request(app)
        .get("/api/topics")
        .expect(200)
        .then(({ body }) => {
          expect(body).toEqual({
            topics: [
              {
                slug: "mitch",
                description: "The man, the Mitch, the legend",
              },
              { slug: "cats", description: "Not dogs" },
              { slug: "paper", description: "what books are made of" },
            ],
          });
        });
    });
  });

  describe("/api", () => {
    it("200: should respond with an object", () => {
      return request(app)
        .get("/api")
        .expect(200)
        .then(({ body }) => {
          expect(body.endpoints).toEqual(endpoints);
        });
    });
  });

  describe("/api/articles/:article_id", () => {
    it("200: should respond with an article object with correct article_id and correct number of keys", () => {
      return request(app)
        .get("/api/articles/1")
        .expect(200)
        .then((res) => {
          expect(res.body.article.article_id).toBe(1);
          expect(Object.values(res.body.article).length).toBe(9);
        });
    });

    it("200: should respond with an article object with correct article_id and comment count for article included", () => {
      return request(app)
        .get("/api/articles/1")
        .expect(200)
        .then((res) => {
          expect(res.body.article.article_id).toBe(1);
          expect(Object.values(res.body.article).length).toBe(9);
        });
    });

    it("404: should respond with error with given valid id not registered", () => {
      return request(app)
        .get("/api/articles/999999999")
        .expect(404)
        .then((response) => {
          expect(response.body.message).toBe("Not Found");
        });
    });

    it("400: should respond with error when given invalid id (eg invalid data type)", () => {
      return request(app)
        .get("/api/articles/bananas")
        .expect(400)
        .then((response) => {
          expect(response.body.message).toBe("Bad Request");
        });
    });
  });

  describe("/api/articles", () => {
    it("200: should respond with array of article objects each with a property of number of comments per article", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then((result) => {
          expect(result.body.articles.length).toBeGreaterThan(0);
          result.body.articles.forEach((article) => {
            expect(article).toEqual({
              article_id: expect.any(Number),
              title: expect.any(String),
              author: expect.any(String),
              topic: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
              article_img_url: expect.any(String),
              comment_count: expect.any(String),
            });
          });
        });
    });

    it("200: should respond with array of articles in descending order", () => {
      return request(app)
        .get("/api/articles?order=desc")
        .expect(200)
        .then((result) => {
          expect(result.body.articles).toBeSortedBy("created_at", {
            descending: true,
          });
        });
    });

    it("200: should respond with array of articles with body property removed", () => {
      return request(app)
        .get("/api/articles?order=desc")
        .expect(200)
        .then((result) => {
          expect(result.body.articles).toBeSortedBy("created_at", {
            descending: true,
          });
        });
    });

    it("200: should respond with an array of articles that can be sorted by any of its properties passed as a query and in descending order as default ", () => {
      return request(app)
        .get("/api/articles?sort_by=created_at&order=desc")
        .expect(200)
        .then((result) => {
          expect(result.body.articles).toBeSortedBy("created_at", {
            descending: true,
          });
        });
    });

    it("200: should respond with array of articles with topic of mitch", () => {
      return request(app)
        .get("/api/articles?topic=mitch")
        .expect(200)
        .then((result) => {
          result.body.articles.forEach((article) => {
            expect(article.topic).toBe("mitch");
          });
        });
    });

    it("400: should respond with error when given invalid sort by query, valid order", () => {
      return request(app)
        .get("/api/articles?sort_by=baloney&order=desc")
        .expect(400)
        .then((result) => {
          expect(result.body.message).toBe("Bad Request");
        });
    });

    it("400: should respond with error when given invalid order by query", () => {
      return request(app)
        .get("/api/articles?sort_by=author&order=xyz")
        .expect(400)
        .then((result) => {
          expect(result.body.message).toBe("Bad Request");
        });
    });

    it("400: should respond with error when given invalid topic query", () => {
      return request(app)
        .get("/api/articles?topic=mercedes")
        .expect(400)
        .then((result) => {
          expect(result.body.message).toBe("Bad Request");
        });
    });
  });

  describe("api/articles/:article_id/comments", () => {
    it("200: should respond with array of comments for given article_id, with each article comment to have 6 matching properties", () => {
      return request(app)
        .get("/api/articles/3/comments")
        .expect(200)
        .then((result) => {
          result.body.comments.forEach((comment) => {
            expect(comment.article_id).toBe(3);
            expect(Object.keys(comment).length).toBe(6);
          });
        });
    });

    it("200: should respond with an array of comments for given article in descending order", () => {
      return request(app)
        .get("/api/articles/3/comments?order=desc")
        .expect(200)
        .then((result) => {
          expect(result.body.comments).toBeSortedBy("created_at", {
            descending: true,
          });
        });
    });

    it("404: should respond with error when given out of range id ", () => {
      return request(app)
        .get("/api/articles/999999/comments")
        .expect(404)
        .then((result) => {
          expect(result.body.message).toBe("Not Found");
        });
    });

    it("400: should respond with error when given invalid id (eg wrong data type)", () => {
      return request(app)
        .get("/api/articles/lemons/comments")
        .expect(400)
        .then((result) => {
          expect(result.body.message).toBe("Bad Request");
        });
    });

    it("400: should respond with an error when invalid order parameter given", () => {
      return request(app)
        .get("/api/articles/lemons/comments?order=xyz")
        .expect(400)
        .then((results) => {
          expect(results.body.message).toBe("Bad Request");
        });
    });
  });

  describe("/api/users", () => {
    it("200: responds with an array of objects with 3 properties", () => {
      return request(app)
        .get("/api/users")
        .expect(200)
        .then((result) => {
          expect(result.body.users.length).toBeGreaterThan(0);
          result.body.users.forEach((user) => {
            expect(user).toEqual({
              username: expect.any(String),
              name: expect.any(String),
              avatar_url: expect.any(String),
            });
          });
        });
    });
  });
});

describe("POST", () => {
  describe("/api/articles/:article_id/comments", () => {
    it("201: inserts new comment into db and returns comment to client", () => {
      const newComment = {
        username: "icellusedkars",
        body: "testing api posting",
      };
      return request(app)
        .post("/api/articles/3/comments")
        .send(newComment)
        .expect(201)
        .then((response) => {
          expect(response.body.comment.body).toEqual(newComment.body);
        });
    });

    it("404: should respond with an error when article_id is out of range", () => {
      const newComment = {
        username: "icellusedkars",
        body: "testing api posting",
      };
      return request(app)
        .post("/api/articles/999999/comments")
        .send(newComment)
        .expect(404)
        .then((response) => {
          expect(response.body.message).toBe("Bad Request");
        });
    });

    it("404: should respond with an error when invalid username is inserted", () => {
      const newComment = {
        username: "hellobellomello",
        body: "testing api posting",
      };
      return request(app)
        .post("/api/articles/3/comments")
        .send(newComment)
        .expect(404)
        .then((response) => {
          expect(response.body.message).toBe("Bad Request");
        });
    });
   
  });
});

describe("PATCH", () => {
  describe("/api/articles/:article_id", () => {
    it("200: should update valid article vote property", () => {
      const articleUpdates = {
        vote: 3,
      };
      return request(app)
        .patch("/api/articles/2")
        .send(articleUpdates)
        .expect(200)
        .then((response) => {
          expect(response.body.article.votes).toBe(3);
        });
    });

    it("400: should respond with error when given invalid article (eg data type)", () => {
      const articleUpdates = {
        vote: 3,
      };
      return request(app)
        .patch("/api/articles/bmwx5")
        .send(articleUpdates)
        .expect(400)
        .then((response) => {
          expect(response.body.message).toBe("Bad Request");
        });
    });

    it("400: shuould respond with error when given a valid article_id out of range", () => {
      const articleUpdates = {
        vote: 3,
      };
      return request(app)
        .patch("/api/articles/9999999")
        .send(articleUpdates)
        .expect(400)
        .then((response) => {
          expect(response.body.message).toBe("Bad Request");
        });
    });

    it("400: should respond with an error when invalid data type being inserted", () => {
      const articleUpdates = {
        vote: "vroom",
      };
      return request(app)
        .patch("/api/articles/2")
        .send(articleUpdates)
        .expect(400)
        .then((response) => {
          expect(response.body.message).toBe("Bad Request");
        });
    });
  });
});

describe("DELETE", () => {
  describe("/api/comments/:comment_id", () => {
    it("204: Not Content, deletes comment", () => {
      return request(app).delete("/api/comments/3").expect(204);
    });

    it("400: ahould respond with error when given invalid comment_id (eg data-type", () => {
      return request(app)
        .delete("/api/comments/lemons")
        .expect(400)
        .then((response) => {
          expect(response.body.message).toBe("Bad Request");
        });
    });

    it("404: should respond with error when given valid comment ID but out of range", () => {
      return request(app)
        .delete("/api/comments/lemons")
        .expect(400)
        .then((response) => {
          expect(response.body.message).toBe("Bad Request");
        });
    });
  });
});
