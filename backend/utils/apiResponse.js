class ApiResponse {
    constructor(statusCode = 500, data, message = "Something went wrong") {
        this.statusCode = statusCode;
        this.data = data;
        this.message = message;
    }
}

export {ApiResponse}