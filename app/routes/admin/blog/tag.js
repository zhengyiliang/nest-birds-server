const router = require('express').Router()
const { success } = require('@utils/util')
const { CreateOrUpdateTagValidator } = require('@validator/blog/tag')
const { getSafeParamId } = require('@utils/util')
const { PositiveIntegerValidator, PaginateValidator } = require('@validator/common')
const { Auth } = require('@middleware/auth')

const { TagDao } = require('@dao/blog/tag')
const { Validator } = require('@utils/validator')

const TagDto = new TagDao()

// path => /blog/tag/create 创建标签
router.post('/create', new Auth().m, async (req) => {
  const v = await new CreateOrUpdateTagValidator().validate(req)
  const currentUser = req.currentUser
  await TagDto.create(v, currentUser)
  success('新建标签成功')
})

// path => /blog/tag/list 获取标签列表
router.get('/list', new Auth().m, async (req) => {
  const v = await new PaginateValidator().validate(req)
  const tags = await TagDto.getList(v, req.currentUser)
  success('获取标签列表成功', tags)
})

// path => /blog/tag/all/get 获取所有标签
router.get('/all/get', new Auth().m, async (req) => {
  const tags = await TagDto.getAllList(req.currentUser)
  success('获取所有标签成功', tags)
})


// path => /blog/tag/update 更新标签
router.put('/update', new Auth().m, async (req) => {
  const currentUser = req.currentUser
  const v = await new CreateOrUpdateTagValidator().validate(req)
  const id = getSafeParamId(v)
  await TagDto.update(v, id, currentUser?.name)
  success('更新标签成功')
})

// path => /blog/tag/delete 删除标签，需要最高权限才能删除留言
router.delete('/delete', new Auth(32).m, async (req) => {
  const v = await new PositiveIntegerValidator().validate(req)
  const id = v.get('query.id')
  await TagDto.delete(id)
  success('删除标签成功')
})

module.exports = router