import urlSchema from "../models/shorturl.model.js";

// CREATE
export const saveShortUrl = async (shortUrl, longUrl, userId) => {
  const newUrl = new urlSchema({
    full_url: longUrl,
    short_url: shortUrl,
   
  });
  if (userId) {
    newUrl.user = userId;
  }

  return await newUrl.save();
};

export const getShortUrl = async (shortUrl) => {
  return await urlSchema.findOneAndUpdate(
  { short_url: shortUrl },
  { $inc: { clicks: 1 } },
  { returnDocument: "after" }
);

};


export const getCustomShortUrl = async (slug) => {
  return await urlSchema.findOne({ short_url: slug });
};

export const getUrlsByUser = async (userId) => {
  return await urlSchema.find({ user: userId }).sort({ _id: -1 });
};

export const deleteUrlById = async (id, userId) => {
  return await urlSchema.findOneAndDelete({
    _id: id,
    user: userId,
  });
};