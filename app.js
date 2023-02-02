require('module-alias/register')
require('express-async-errors')
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const catchError = require('./middleware/exception')
const multipart = require('@utils/multipart')
var indexRouter = require('@routes/admin');
var sysRouter = require('@routes/admin/sys');
var blogRouter = require('@routes/admin/blog');
const webRouter = require('@routes/web')

var app = express();


// view engine setup
// console.log(app.get('env'))
multipart(app)
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// ----  管理端路由 start ---------
app.use('/', indexRouter);
app.use('/sys', sysRouter);
app.use('/blog', blogRouter);
// ----  管理端路由 end ---------
app.use('/api', webRouter)



// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});


// 全局捕获异常返回响应体（包括成功响应）
app.use(catchError)


// error handler
// app.use(function (err, req, res, next) {
//   console.log('哈哈测试')
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });

module.exports = app;
