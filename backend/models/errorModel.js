// errorModel.js
class HttpError extends Error {
    constructor(message, errorCode = 500) {
      super(message);
      this.code = errorCode;
      Object.setPrototypeOf(this, HttpError.prototype);
    }
  }
  
export default HttpError;
