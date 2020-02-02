module.exports = {
  successWrap(data) {
    return {
      error_info: null,
      is_success: true,
      result: data
    }
  },

  errorWrap(msg, code) {
    return {
      error_info: {
        code: code || 500,
        msg
      },
      is_success: false,
      result: null
    }
  }
}
