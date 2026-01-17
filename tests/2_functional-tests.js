const chaiHttp = require("chai-http");
const chai = require("chai");
const assert = chai.assert;
const server = require("../server");

chai.use(chaiHttp);

suite("Functional Tests", function () {
  let testId1;
  test("Create an issue with every field", function (done) {
    chai
      .request(server)
      .post("/api/issues/test")
      .send({
        issue_title: "Title",
        issue_text: "Text",
        created_by: "Alice",
        assigned_to: "Bob",
        status_text: "In Progress",
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.issue_title, "Title");
        assert.equal(res.body.assigned_to, "Bob");
        testId1 = res.body._id;
        done();
      });
  });

  test("Create an issue with only required fields", function (done) {
    chai
      .request(server)
      .post("/api/issues/test")
      .send({
        issue_title: "Required Title",
        issue_text: "Required Text",
        created_by: "Alice",
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.issue_title, "Required Title");
        assert.equal(res.body.assigned_to, "");
        done();
      });
  });

  test("Create an issue with missing required fields", function (done) {
    chai
      .request(server)
      .post("/api/issues/test")
      .send({ issue_title: "Title Only" })
      .end(function (err, res) {
        assert.equal(res.body.error, "required field(s) missing");
        done();
      });
  });

  test("View issues on a project", function (done) {
    chai
      .request(server)
      .get("/api/issues/test")
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.isArray(res.body);
        done();
      });
  });

  test("View issues on a project with one filter", function (done) {
    chai
      .request(server)
      .get("/api/issues/test?open=true")
      .end(function (err, res) {
        assert.isArray(res.body);
        assert.equal(res.body[0].open, true);
        done();
      });
  });

  test("View issues on a project with multiple filters", function (done) {
    chai
      .request(server)
      .get("/api/issues/test?open=true&created_by=Alice")
      .end(function (err, res) {
        assert.isArray(res.body);
        assert.equal(res.body[0].open, true);
        assert.equal(res.body[0].created_by, "Alice");
        done();
      });
  });

  test("Update one field on an issue", function (done) {
    chai
      .request(server)
      .put("/api/issues/test")
      .send({ _id: testId1, issue_title: "Updated Title" })
      .end(function (err, res) {
        assert.equal(res.body.result, "successfully updated");
        assert.equal(res.body._id, testId1);
        done();
      });
  });

  test("Update multiple fields on an issue", function (done) {
    chai
      .request(server)
      .put("/api/issues/test")
      .send({ _id: testId1, issue_text: "New Text", open: false })
      .end(function (err, res) {
        assert.equal(res.body.result, "successfully updated");
        done();
      });
  });

  test("Update an issue with missing _id", function (done) {
    chai
      .request(server)
      .put("/api/issues/test")
      .send({ issue_title: "New Title" })
      .end(function (err, res) {
        assert.equal(res.body.error, "missing _id");
        done();
      });
  });

  test("Update an issue with no fields to update", function (done) {
    chai
      .request(server)
      .put("/api/issues/test")
      .send({ _id: testId1 })
      .end(function (err, res) {
        assert.equal(res.body.error, "no update field(s) sent");
        done();
      });
  });

  test("Update an issue with an invalid _id", function (done) {
    chai
      .request(server)
      .put("/api/issues/test")
      .send({ _id: "5f665eb46e296f214cc11111", issue_title: "Invalid" })
      .end(function (err, res) {
        assert.equal(res.body.error, "could not update");
        done();
      });
  });

  test("Delete an issue", function (done) {
    chai
      .request(server)
      .delete("/api/issues/test")
      .send({ _id: testId1 })
      .end(function (err, res) {
        assert.equal(res.body.result, "successfully deleted");
        assert.equal(res.body._id, testId1);
        done();
      });
  });

  test("Delete an issue with an invalid _id", function (done) {
    chai
      .request(server)
      .delete("/api/issues/test")
      .send({ _id: "5f665eb46e296f214cc11111" })
      .end(function (err, res) {
        assert.equal(res.body.error, "could not delete");
        done();
      });
  });

  test("Delete an issue with missing _id", function (done) {
    chai
      .request(server)
      .delete("/api/issues/test")
      .send({})
      .end(function (err, res) {
        assert.equal(res.body.error, "missing _id");
        done();
      });
  });
});
