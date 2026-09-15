import mongoose from "mongoose";
import { ApiError } from "../utils/ApiError.js";

const ErrorHandler = (err, req, res, next) => {
  let error = err;

  // 1. Handle Invalid MongoDB ObjectId (CastError)
  if (error instanceof mongoose.Error.CastError) {
    const statusCode = 400;
    const message = `Invalid format for field: ${error.path}`;
    error = new ApiError(statusCode, message);
  } 
  // 2. Handle Duplicate Key Error (MongoDB E11000)
  else if (error.code === 11000) {
    const statusCode = 409;
    const field = Object.keys(error.keyValue || {})[0] || "field";
    const message = `Duplicate value entered for '${field}'. Please use another value.`;
    error = new ApiError(statusCode, message);
  }

  // 3. Extract status code and build error response
  const statusCode = error.statusCode || 500;
  const message = error.message || "Something went wrong";

  return res.status(statusCode).json({
    statusCode,
    success: false,
    message,
    errors: error.errors || [],
    ...(process.env.NODE_ENV === "development" ? { stack: error.stack } : {}),
  });
};

export { ErrorHandler };


// const ErrorHandler = (err, req, res, next) => {
//     console.log("Middleware Error Handling");
//     const errStatus = err.statusCode || 500;
//     const errMsg = err.message || 'Something went wrong';
//     res.status(errStatus).json({
//         message: errMsg,
//         success: false,
//         statusCode: errStatus,
//         // stack: process.env.NODE_ENV === 'development' ? err.stack : {}
//         // stack: ""
//     })
// }

// export { ErrorHandler }
