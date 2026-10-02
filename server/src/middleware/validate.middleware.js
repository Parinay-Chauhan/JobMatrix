import { ApiError } from "../utils/ApiError.js";

export const validate = (schema) => (req, res, next) => {
  try {
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) {
      const errorMessages = parsed.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join(", ");
      throw new ApiError(400, `Validation Error: ${errorMessages}`);
    }
    req.body = parsed.data;
    next();
  } catch (err) {
    next(err);
  }
};
