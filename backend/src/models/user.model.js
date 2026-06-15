import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  username: { type: String, required: false, unique: true, sparse: true },
  password: { type: String, required: true , select: false },
  avatar: { type: String, required: false,
    default: "https://res.cloudinary.com/dmkcml2mw/image/upload/v1781523342/DtE-u4iU8AANEdN_yphxo7.jpg",
  },
});


userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.set("toJSON", {
  transform: function (doc, ret) {
    delete ret.password;
    delete ret.__v;
    return ret;
  },
});

userSchema.pre("save", async function () {
  if (!this.isModified("password")) {
    return;
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});


const User = mongoose.model("user", userSchema);

export default User;

