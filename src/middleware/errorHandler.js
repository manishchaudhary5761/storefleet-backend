const errorHandler = (err, req, res, next) => {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message;

  // 🚫 Mongo duplicate key
  if (err.code === 11000) {
    message = "Email already registered";
    statusCode = 400;
  }

  res.status(statusCode).json({
    success: false,
    error: message,
  });
};

export default errorHandler;
