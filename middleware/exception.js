const { HttpException } = require('@exception')

const env = process.env.NODE_ENV;

const catchError = async (error, req, res, next) => {
  // try {
  //   await next()
  // } catch (error) {
  //   console.log('哈哈')
  // console.log(error, 'xxx')
  const isHttpException = error instanceof HttpException
  const isDev = env === 'development'
  if (isDev && !isHttpException) {
    throw error
  }
  // console.log(error)
  if (isHttpException) {
    res.json({
      message: error.msg,
      errorCode: error.errorCode,
      request: `${req.method.toLowerCase()} ${req.path}`,
      code: error.code,
      data: error.data
    })
  }
  else {
    res.json({
      message: 'we made a mistake O(∩_∩)O~~',
      errorCode: 999,
      request: `${req.method.toLowerCase()} ${req.path}`,
      code: 500,
      data: null
    })
  }
  // }
}

module.exports = catchError