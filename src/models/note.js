import { Schema, model } from "mongoose";

const noteSchema = new Schema({
  title: {
    type: String,
    trim: true,
    required: true,

  },
  content: {
    type: String,
    required: true,
    trim: true,
    default: "",
  },
  tag: {
    type: String,
    required: false,
    enum: ["Work", "Personal", "Meeting", "Shopping", "Ideas", "Travel", "Finance", "Health", "Important", "Todo"],
    default: "Todo",
  }

}, {
  timestamps: true,
});
export const Note = model("Note", noteSchema);
