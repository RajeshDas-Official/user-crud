export const response = (res, data, message, statusCode = 200, success = true) => {
  return res.status(statusCode).json({
    success: statusCode < 400 ? true : false,
    message,
    data: statusCode < 400 ? data : null,
    error: statusCode >= 400 ? data : null,
    timestamp: new Date().toISOString()
  });
};