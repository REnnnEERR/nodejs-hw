import { Schema, model } from "mongoose";
import { TAGS } from "../constants/tags.js";

const noteSchema = new Schema({
  title: {
    type: String,
    trim: true,
    required: true,

  },
  content: {
    type: String,
    trim: true,
    default: "",
  },
  tag: {
    type: String,
    required: false,
    enum: [...TAGS],
    default: "Todo",
  }

}, {
  timestamps: true,
});
export const Note = model("Note", noteSchema);
