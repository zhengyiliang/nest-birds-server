
const { SysUser } = require('@models')
const { Forbidden, NotFound, ParameterException } = require('@exception')
const bcrypt = require('bcryptjs')

class SysDao {
  // 校验用户名和密码
  async verifyPassword(_, name, password) {
    const user = await SysUser.findOne({
      where: {
        name
      }
    })
    if (!user) {
      throw new NotFound('用户不存在')
    }
    if ((user.status * 1 === 1)) {
      throw new Forbidden('用户已停用')
    }
    const correct = bcrypt.compareSync(password, user.password)
    if (!correct) {
      throw new ParameterException('密码不正确')
    }
    return user
  }
}

module.exports = SysDao