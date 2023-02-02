const router = require('express').Router()
const { CreateOrUpdateCategoryValidator } = require('@validator/blog/category')
const { PositiveIntegerValidator, PaginateValidator } = require('@validator/common')
const { success, getSafeParamId } = require('@utils/util')
const { Auth } = require('@middleware/auth')

const { CategoryDao } = require('@dao/blog/category')

const CategoryDto = new CategoryDao()

// path => /blog/category/list 获取所有分类
router.get('/list', new Auth().m, async (req) => {
  const v = await new PaginateValidator().validate(req)
  const categories = await CategoryDto.getList(v, req.currentUser)
  success('获取分类列表成功', categories)
})

// path => /blog/category/all/get 获取所有分类
router.get('/all/get', new Auth().m, async (req) => {
  const categories = await CategoryDto.getAllList(req.currentUser)
  success('获取所有分类成功', categories)
})

// path => /blog/category/create 创建分类
router.post('/create', new Auth().m, async (req) => {
  const currentUser = req.currentUser
  const v = await new CreateOrUpdateCategoryValidator().validate(req)
  await CategoryDto.create(v, currentUser)
  success('新建分类成功')
})

// path => /blog/category/create 更新分类
router.put('/update', new Auth().m, async (req) => {
  const currentUser = req.currentUser
  const v = await new CreateOrUpdateCategoryValidator().validate(req)
  const id = getSafeParamId(v)
  await CategoryDto.update(v, id, currentUser?.name)
  success('更新分类成功')
})

// // path => /blog/category/delete  删除分类 需要最高权限才能删除分诶
router.delete('/delete', new Auth(32).m, async (req) => {
  const v = await new PositiveIntegerValidator().validate(req)
  const id = v.get('query.id')
  await CategoryDto.delete(id)
  success('删除分类成功')
})

module.exports = router