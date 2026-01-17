"use strict";
import Issue from "../model/issue.js";

export default function (app) {
  app
    .route("/api/issues/:project")

    .get(async function (req, res) {
      const { project } = req.params;

      try {
        const issues = await Issue.find({ project: project });
        res.json(issues);
      } catch (err) {
        res.json({ error: "Could not post issue", message: err.message });
      }
    })

    .post(async function (req, res) {
      const { project } = req.params;
      const { issue_title, issue_text, created_by, assigned_to, status_text } =
        req.body;

      if (!issue_title || !issue_text || !created_by) {
        return res.json({
          error: "required field(s) missing",
        });
      }

      try {
        const newIssue = new Issue({
          project,
          issue_title,
          issue_text,
          created_by,
          assigned_to: assigned_to || "",
          status_text: status_text || "",
        });

        const savedIssue = await newIssue.save();

        res.json(savedIssue);
      } catch (err) {
        res.json({ error: "Could not post issue", message: err.message });
      }
    })

    .put(function (req, res) {
      res.json({});
    })

    .delete(function (req, res) {
      res.json({});
    });
}
