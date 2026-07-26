export const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);

  // In development, return the full stack trace. 
  // In production, mask internal server errors to prevent information leakage.
  if (process.env.NODE_ENV === 'production') {
    res.json({
      message: statusCode >= 500 ? 'Internal Server Error' : err.message,
    });
  } else {
    res.json({
      message: err.message,
      stack: err.stack,
    });
  }
};
