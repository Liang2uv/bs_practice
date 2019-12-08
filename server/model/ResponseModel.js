class BaseModel {
  constructor(code, message = null, data = null) {
    this.code = code
    this.message = message
    this.data = data
  }
}

class SuccessModel extends BaseModel {
  constructor(code, data, message) {
    super(code, message, data)
  }
}

class ErrorModel extends BaseModel {
  constructor(code, message) {
    super(code, message)
  }
}

module.exports = {
  SuccessModel,
  ErrorModel
}