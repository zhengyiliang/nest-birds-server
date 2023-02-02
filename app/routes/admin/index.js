var express = require('express')
const router = express.Router()
const { LoginValidator } = require('@validator')
const SysDao = require('@dao')
const { success } = require('@utils/util')
const { TokenType } = require('@utils/enums')
const config = require('@config')
const { generateToken, RefreshAuth } = require('@middleware/auth')

const SysDto = new SysDao()

// path => /login 登录
router.post('/login', async function (req) {
  const v = await new LoginValidator().validate(req)
  const name = v.get('body.name')
  const password = v.get('body.password')

  const user = await SysDto.verifyPassword(req, name, password)
  // console.log(user, 'xxx')
  const accessToken = generateToken(user, TokenType.ACCESS, { expiresIn: config.security.accessExp })
  const refreshToken = generateToken(user, TokenType.REFRESH, { expiresIn: config.security.refreshExp })
  // res.body = 
  success('登录成功', {
    accessToken,
    refreshToken,
  })
})

router.get('/refresh', new RefreshAuth().m, async (req) => {
  const user = req.currentUser
  const accessToken = generateToken(user, TokenType.ACCESS, { expiresIn: config.security.accessExp })
  const refreshToken = generateToken(user, TokenType.REFRESH, { expiresIn: config.security.refreshExp })

  // res.body = 
  success('token获取成功', {
    accessToken,
    refreshToken,
  })
})

module.exports = router;
