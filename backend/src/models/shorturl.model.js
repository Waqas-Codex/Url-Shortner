import mongoose from "mongoose";


const shortUrlSchema = new mongoose.Schema(
  {
    full_url: {
      type: String,
      required: true,
    },
    short_url: {
      type: String,
      required: true,
      index: true,
      unique: true,
    },
    clicks: {
      type: Number,
      default: 0,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // reference to User model
    },
  }
);



const ShortUrl = mongoose.model("shortUrl", shortUrlSchema);

export default ShortUrl;
