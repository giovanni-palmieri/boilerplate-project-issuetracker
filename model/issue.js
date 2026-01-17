import mongoose, { model } from "mongoose";
const { Schema } = mongoose;

const issueSchema = new Schema(
  {
    project: {
      type: String,
      required: true,
    },
    issue_title: {
      type: String,
      required: true,
    },
    issue_text: {
      type: String,
      required: true,
    },
    created_by: {
      type: String,
      required: true,
    },
    assigned_to: {
      type: String,
      default: "",
    },
    status_text: {
      type: String,
      default: "",
    },
    open: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: { createdAt: "created_on", updatedAt: "updated_on" },
  },
);

const Issue = model("Issue", issueSchema);

export default Issue;
