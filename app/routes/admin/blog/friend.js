const router = require('express').Router()
const { Auth } = require('@middleware/auth')
const { CreateOrUpdateFriendValidator } = require('@validator/blog/friend')
const { PositiveIntegerValidator } = require('@validator/common')

const { getSafeParamId, success } = require('@utils/util')

const { FriendDao } = require('@dao/blog/friend')


const friendDto = new FriendDao()

// path => /blog/friend/list 获取友链
router.get('/list', new Auth().m, async () => {
  const friends = await friendDto.getFriends()
  success('获取友链列表成功', friends)
})

// path => /blog/friend/create 添加友链
router.post('/create', new Auth().m, async (req) => {
  const v = await new CreateOrUpdateFriendValidator().validate(req)
  await friendDto.createFriend(v)
  success('新建友链成功')
})

// path => /blog/friend/update 修改友链
router.put('/update', new Auth().m, async (req) => {
  const v = await new CreateOrUpdateFriendValidator().validate(req)
  const id = getSafeParamId(v)
  await friendDto.updateFriend(v, id)
  success('修改友链成功')
})

// path => /blog/friend/delete 删除友链
router.delete('/delete', new Auth().m, async (req) => {
  const v = await new PositiveIntegerValidator().validate(req)
  const id = v.get('query.id')
  await friendDto.deleteFriend(id)
  success('删除标签成功')
})

module.exports = router