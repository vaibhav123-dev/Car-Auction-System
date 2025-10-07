import HTTP_STATUS from '../constant.js';

class ApiResponse {
  constructor(statusCode, data, message = 'Success') {
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
    this.success = statusCode < HTTP_STATUS.BAD_REQUEST;
  }
}

export { ApiResponse };
