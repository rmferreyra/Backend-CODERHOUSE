const ErrorType = {
    DB: "Error en data base",
    General: "Error general en la app",
    Otro: "Otro codigo de error",
  }
  
  class CustomError extends Error {
    constructor(message, type) {
      super(message)
  
      this.type = type
    }
  }
  
  module.exports = {
    CustomError,
    ErrorType,
  }