import { ZodError } from "zod";

export const validate = (schema) => (req, res, next) => {
  try {
    schema.parse({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    next();
  } catch (error) {
    if (error instanceof ZodError) {
      const errorList = error.issues || error.errors || [];
      const errors = errorList.map(err => ({
        field: err.path.join('.'),
        message: err.message,
      }));
      console.error("❌ Validation Failed for", req.path, ":", errors);
      return res.status(400).json({ message: "Validation failed", errors });
    }
    next(error);
  }
};
