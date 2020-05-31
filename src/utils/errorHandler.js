


module.exports = function (err, req, res, next) {
	err.status = err.status || "error"  // either "fail" or "error"
	err.statusCode = err.statusCode || "500" // either 4xx or 500
	if (err) {
		if(process.env.NODE_ENV === "development"){
			return res
			.status(err.statusCode)
			.json({
				status: err.status,
				error: err,
				message: err.message,
				stack: err.stack
			}) 
		} else if (process.env.NODE_ENV === "production"){
			return res
			.status(err.statusCode)
			.json({
				status: err.status,
				message: err.message
			})
		}
	};
}
