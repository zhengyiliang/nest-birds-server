// const { Op } = require('sequelize')
const { SysUser, BlogArticle } = require('@models')
const { Forbidden, NotFound, ParameterException } = require('@exception')
const { StatusType, AuthType } = require('@utils/enums')
const { Op } = require('sequelize')
const dayjs = require('dayjs')
const { paginate, defaultPassword } = require('@config')
const bcrypt = require('bcryptjs')

// const { AuthType } = require('@utils/enums')

class UserDao {

  // 创建用户
  async create(v) {
    const name = v.get('body.name')
    const user = await SysUser.findOne({
      where: {
        name
      }
    })
    if (user) {
      throw new Forbidden('已存在该用户名')
    }
    await SysUser.create({
      name: v.get('body.name'),
      // avatar: v.get('body.avatar'),
      email: v.get('body.email'),
      description: v.get('body.description'),
      password: defaultPassword,
      auth: v.get('body.auth'),
      status: v.get('body.status')

    })
  }

  // 更新用户
  async update(v, id) {
    const user = await SysUser.findByPk(id)
    if (!user) {
      throw new NotFound('没有找到相关用户')
    }
    // user.avatar = v.get('body.avatar')
    user.email = v.get('body.email')
    user.description = v.get('body.description')
    user.auth = v.get('body.auth')
    user.status = v.get('body.status')
    user.save()
  }


  // 获取用户列表
  async getList(v) {
    let current = v.get('query.current') || paginate.pageDefault
    const pageSize = v.get('query.pageSize') || paginate.pageSizeDefault
    const keywords = v.get('query.keywords')
    const status = v.get('query.status')
    const startTime = v.get('query.startTime')
    const endTime = v.get('query.endTime')

    let where = {}

    if (StatusType.isThisType(status)) {
      where.status = status
    }

    if (keywords) {
      where.name = {
        [Op.like]: `%${keywords}%`
      }
    }

    const st = dayjs(startTime)
    const ed = dayjs(endTime)
    if (startTime && endTime) {
      where.created_at = {
        [Op.between]: [st.startOf('day').$d, ed.endOf('day').$d],
      }
    }


    const { rows, count } = await SysUser.findAndCountAll({
      where,
      // distinct: true,
      attributes: { exclude: ['deleted_at', 'updated_at', 'password'] },
      offset: (current - 1 > 0 ? current - 1 : 0) * pageSize,
      limit: pageSize * 1
    })
    return {
      list: rows,
      total: count
    }
  }

  // 根据权限获取用户列表 
  async getByAuth(currentUser) {
    const user = await SysUser.scope('acs').findAll({
      // where: {
      //   auth: {
      //     [Op.lte]: currentUser.auth
      //   }
      // },
      attributes: ['id', 'name']
    })
    return user
  }


  // 删除用户
  async delete(id) {
    const user = await SysUser.findOne({
      where: {
        id
      }
    })
    if (!user) {
      throw new NotFound('没有找到相关用户')
    }
    const result = await BlogArticle.findOne({
      where: {
        user_id: id
      }
    })
    if (result) {
      throw new Forbidden('该用户下有文章，禁止删除')
    }
    user.destroy()
  }

  // 用户修改自己头像
  async updateAvatar(url, id) {
    const user = await SysUser.findByPk(id)
    if (!user) {
      throw new NotFound('没有找到相关用户')
    }
    user.avatar = url
    user.save()
  }

  // 管理员重置密码
  async resetPassword(id) {
    const user = await SysUser.findByPk(id)
    if (!user) {
      throw new NotFound('没有找到相关用户')
    }
    user.password = defaultPassword
    user.save()
  }

  // 用户修改密码
  async updatePassword(v, id) {
    const user = await SysUser.findByPk(id)
    if (!user) {
      throw new NotFound('没有找到相关用户')
    }
    const oldPassword = v.get('body.oldPassword')
    const newPassword = v.get('body.newPassword')
    const correct = bcrypt.compareSync(oldPassword, user.password)
    const same = bcrypt.compareSync(newPassword, user.password)
    if (!correct) {
      throw new ParameterException('密码不正确')
    }

    if (same) {
      throw new ParameterException('新密码不能与原有密码一致')
    }

    user.password = newPassword
    user.save()
  }

  // 管理员设置用户角色
  // async updateAuth(v) {
  //   const id = v.get('body.id')
  //   const auth = v.get('body.auth')
  //   const user = await SysUser.findByPk(id)
  //   if (!user) {
  //     throw new NotFound('没有找到相关用户')
  //   }
  //   user.auth = auth
  //   user.save()
  // }

  // 管理员设置用户账号状态
  async updateStatus(v) {
    const id = v.get('body.id')
    const status = v.get('body.status')
    const user = await SysUser.findByPk(id)
    if (!user) {
      throw new NotFound('没有找到相关用户')
    }
    user.status = status
    user.save()
  }
}

module.exports = UserDao