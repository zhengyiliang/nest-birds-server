const { NotFound, Forbidden } = require('@exception')
const { BlogTag, BlogArticleTag } = require('@models')
const { byAuth } = require('@utils/util')
const { Op } = require('sequelize')

class TagDao {
  // 创建标签
  async create(v, currentUser) {
    const tag = await BlogTag.findOne({
      where: {
        name: v.get('body.name'),
        ...byAuth(currentUser, 'created_by_id')
      }
    })
    if (tag) {
      throw new Forbidden('标签已存在')
    }
    return await BlogTag.create({
      name: v.get('body.name'),
      desc: v.get('body.desc'),
      created_by: currentUser.name,
      created_by_id: currentUser.id
      // update_by: createBy,
    })
  }

  // 获取标签列表
  async getList(v, currentUser) {
    const current = v.get('query.current')
    const pageSize = v.get('query.pageSize')
    const { rows, count } = await BlogTag.findAndCountAll({
      distinct: true,
      attributes: { exclude: ['deleted_at'] },
      offset: (current - 1 > 0 ? current - 1 : 0) * pageSize,
      limit: pageSize * 1,
      where: {
        ...byAuth(currentUser, 'created_by_id')
      }
    })

    return {
      list: rows,
      total: count
    }
  }

  // 根据id获取标签
  async getByIds(ids, options = {}) {
    const tags = await BlogTag.findAll({
      where: {
        id: {
          [Op.in]: ids
        }
      },
      ...options
    })
    return tags
  }

  // 更新标签
  async update(v, id, update_by) {
    const tag = await BlogTag.findByPk(id)
    if (!tag) {
      throw new NotFound('没有找到相关标签')
    }
    const name = v.get('body.name')
    const desc = v.get('body.desc')
    const sameName = await BlogTag.findOne({
      where: {
        name,
        id: {
          [Op.ne]: id * 1
        }
      }
    })
    if (sameName) {
      throw new Forbidden('标签名称重复')
    }
    tag.name = name
    tag.desc = desc
    tag.update_by = update_by
    tag.save()
  }

  // 删除标签
  async delete(id) {
    const tag = await BlogTag.findOne({
      where: {
        id
      }
    })
    if (!tag) {
      throw new NotFound('没有找到相关标签')
    }
    const result = await BlogArticleTag.findOne({
      where: {
        tag_id: id
      }
    })
    if (result) {
      throw new Forbidden('该标签下有文章，禁止删除')
    }
    tag.destroy()
  }

  // 获取所有标签
  async getAllList(user) {
    const tags = await BlogTag.findAll({
      attributes: ['id', 'name'],
      where: {
        ...byAuth(user, 'created_by_id')
      }
    })
    return tags
  }
}

module.exports = {
  TagDao
}