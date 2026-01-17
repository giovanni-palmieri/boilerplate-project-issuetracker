"use strict";
import Issue from "../model/issue.js";

export default function (app) {
  app
    .route("/api/issues/:project")

    .get(async function (req, res) {
      const { project } = req.params;

      try {
        const issues = await Issue.find({ project, ...req.query });
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

    .put(async function (req, res) {
      const { _id, ...updateFields } = req.body;

      if (!_id) {
        return res.json({ error: "missing _id" });
      }

      if (Object.keys(updateFields).length === 0) {
        return res.json({ error: "no update field(s) sent", _id: _id });
      }

      try {
        const updatedIssue = await Issue.findByIdAndUpdate(
          _id,
          { $set: updateFields },
          { new: true },
        );

        if (!updatedIssue) {
          return res.json({ error: "could not update", _id: _id });
        }

        res.json({
          result: "successfully updated",
          _id: _id,
        });
      } catch (err) {
        res.json({ error: "could not update", _id: _id });
      }
    })

    .delete(async function (req, res) {
      const { _id } = req.body;

      if (!_id) {
        return res.json({ error: "missing _id" });
      }

      try {
        const deletedIssue = await Issue.findByIdAndDelete(_id);

        if (!deletedIssue) {
          return res.json({ error: "could not delete", _id: _id });
        }

        res.json({
          result: "successfully deleted",
          _id: _id,
        });
      } catch (err) {
        res.json({ error: "could not delete", _id: _id });
      }
    });
}
