const routeNotFound = (req, res, next) => {
  const error = new Error(`Route not found: ${req.originalUrl}`);
  res.status(404); // this is fine here
  next(error); // pass the error to the errorHandler
};

const errorHandler = (err, req, res, next) => {
  console.log(err)
  // If statusCode not set, default to 500
  let statusCode = res.statusCode && res.statusCode !== 200 ? err.statusCode : 500;
  let { message } = err;

  // Handle Mongoose ObjectId errors
  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    statusCode = 404;
    message = 'Resource not found';
  }

  res.status(statusCode).json({
    success: false,
    message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};

export { routeNotFound, errorHandler };
