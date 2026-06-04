import { Schema, model } from "mongoose";

const userSchema = new Schema({
  username: {
    type: String,
    trim: true,
  },
  email: {
    type: String,
    trim: true,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
  },
  avatar: {
    type: String,
    default: "https://ac.goit.global/fullstack/react/default-avatar.jpg",
  },

}, { timestamps: true });

userSchema.pre("save", async function () {
  if (!this.username) {
    this.username = this.email;
  }
});

userSchema.methods.toJSON = function () {
  const Obj = this.toObject();
  delete Obj.password;
  return Obj;
};

export const User = model("User", userSchema);
