export function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode || err.status || 500;
  const message = err.message || "Error interno del servidor";

  console.error("❌ Error capturado:", {
    status: statusCode,
    message,
    path: req.path,
    method: req.method,
    timestamp: new Date().toISOString(),
  });

  const response = { error: message, status: statusCode };

    res.status(statusCode).json(response);
}
