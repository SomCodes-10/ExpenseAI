const errorHandler = (err,req,res,next) =>{
  console.log("❌ Global Error Caught:", err.message || err)

  const statusCode = err.statusCode || 500
  const message = err.message || "Internal server error";

  res.status(statusCode).json({
    success: false,
    status: statusCode,
    message: message,
    stack: process.env.NODE_ENV ==="development" ? err.stack : undefined
  })
}

export default errorHandler