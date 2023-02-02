const { BlogMessage } = require('@models')

class MessageDao {
  // 创建留言
  async createMessage(v) {
    return await BlogMessage.create({
      nickname: v.get('body.nickname'),
      content: v.get('body.content')
    })
  }

  // 获取留言
  async getMessages(v) {
    const start = v.get('query.page');
    const pageCount = v.get('query.count');

    const { rows, count } = await BlogMessage.findAndCountAll({
      order: [
        ['id', 'DESC']
      ],
      offset: start * pageCount,
      limit: pageCount,
    })
    return {
      rows,
      total: count
    }
  }

  // 删除留言
  async deleteMessage(id) {
    const message = await BlogMessage.findOne({
      where: {
        id
      }
    })
    if (!message) {
      throw new NotFound('没有找到相关留言')
    }
    message.destroy()
  }
}

module.exports = {
  MessageDao
}
