const errorHandler = (err, req, res, next) => {
  // Always log the full error internally for debugging
  console.error("ERROR:", err);

  const statusCode = err.statusCode || 500;

  // Only expose the message for operational errors (ones we threw intentionally).
  // For unexpected programming errors (500s), return a generic message so we
  // don't leak stack traces, DB schema details, or internal paths to the client.
  const isOperational = err.statusCode && err.statusCode < 500;

  res.status(statusCode).json({
    success: false,
    message: isOperational
      ? err.message
      : "An unexpected error occurred. Please try again later.",
    // Include a request ID if available (useful for support)
    ...(req.id && { requestId: req.id }),
  });
};

module.exports = { errorHandler };