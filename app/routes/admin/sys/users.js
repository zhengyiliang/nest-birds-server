var express = require('express')
const router = express.Router()
const {
  CreateUserValidator,
  UpdateUserValidator,
  getUsersValidator,
  UpdateUserPasswordValidator,
  UpdateAuthValidator,
  UpdateStatusValidator
} = require('@validator/sys/user')
const { Forbidden } = require('@exception')
const { PositiveIntegerValidator } = require('@validator/common')
const UserDao = require('@dao/sys/user')
const { success, getSafeParamId } = require('@utils/util')
const { Auth } = require('@middleware/auth')
const UpLoader = require('@utils/upload')
const { Validator } = require('@utils/validator')

const UserDto = new UserDao()

// path => /sys/user/create 超级管理员创建用户
router.post('/create', async function (req) {
  const v = await new CreateUserValidator().validate(req)
  await UserDto.create(v)
  success('创建用户成功')
})

// path => /sys/user/update 超级管理员更新用户信息
router.put('/update', new Auth(32).m, async function (req) {
  const v = await new UpdateUserValidator().validate(req)
  const id = getSafeParamId(v)
  await UserDto.update(v, id)
  success('更新用户成功')
})

// path => /sys/user/list 用户列表
router.get('/list', new Auth().m, async function (req) {
  const v = await new getUsersValidator().validate(req)
  const { list, total } = await UserDto.getList(v)
  success('获取用户列表成功', { list, total })

})

router.get('/get', new Auth().m, async function (req) {
  // const v = await new Validator.validate(req)
  // console.log()
  const data = await UserDto.getByAuth(req.currentUser)
  success('获取用户列表成功', data)

})

// path => /sys/user/delete 删除用户
router.delete('/delete', new Auth(32).m, async function (req) {
  const v = await new PositiveIntegerValidator().validate(req)
  const id = getSafeParamId(v)

  const userId = req.currentUser.id
  if (id === userId) {
    throw new Forbidden('不能删除自己')
  }
  await UserDto.delete(id)
  success('删除用户成功')
})

// path => /sys/avatar/avatar 用户修改自己的头像
router.put('/avatar/update', new Auth().m, async function (req) {
  let currentUserName = req?.currentUser?.name ?? ''
  const id = req.currentUser?.id
  if (currentUserName) {
    currentUserName = currentUserName + '_'
  }
  const files = await req.multipart({
    singleLimit: 1024 * 100,
    fileType: 'image'
  })
  const upLoader = new UpLoader(`blog/avatar/${currentUserName}`)
  // const result = await upLoader.single(files[0].data)
  // console.log(result, 'xxx')
  const result = await upLoader.upload(files)
  console.log(result)
  const url = result[0].url
  await UserDto.updateAvatar(url, id)
  success('头像上传成功')
})

// path => /sys/user/password/reset 超级管理员重置用户密码
router.put('/password/reset', new Auth(32).m, async function (req) {
  const v = await new PositiveIntegerValidator().validate(req)
  const id = getSafeParamId(v)

  await UserDto.resetPassword(id)
  success('重置密码成功')
})

// path => /sys/user/password/update 当前登录用户修改自己的密码
router.put('/password/update', new Auth().m, async function (req) {
  const v = await new UpdateUserPasswordValidator().validate(req)
  const id = req?.currentUser.id
  await UserDto.updatePassword(v, id)
  success('密码修改成功')
})


// path => /sys/user/auth/update 管理员设置用户角色
// router.put('/auth/update', new Auth(32).m, async function (req) {
//   const v = await new UpdateAuthValidator().validate(req)
//   await UserDto.updateAuth(v)
//   success('角色设置成功')
// })

// path => /sys/user/status/update 管理员更新用户状态
router.put('/status/update', new Auth(32).m, async function (req) {
  const v = await new UpdateStatusValidator().validate(req)
  await UserDto.updateStatus(v)
  success('账号状态设置成功')
})



module.exports = router;
