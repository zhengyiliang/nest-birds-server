const { Type } = require("@utils/enums");

module.exports = (sequelize, DataTypes) => {
  const BlogComment = sequelize.define('BlogComment', {
    // id: {
    //   type: DataTypes.UUID,
    //   allowNull: true,
    //   primaryKey: true,
    //   defaultValue: DataTypes.UUIDV4 // 或 DataTypes.UUIDV1
    // },
    parent_id: { // 父评论id
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false,
    },
    // nickname: { // 昵称
    //   type: DataTypes.STRING(32),
    //   allowNull: false
    // },
    web_user_id: { // qq用户表id
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    // address: { // qq用户所在地址
    //   type: DataTypes.STRING,
    //   allowNull: true,
    // },
    content: { // 评论内容
      type: DataTypes.STRING(1023),
      allowNull: false
    },
    // like: { // 该条评论被点赞数
    //   type: DataTypes.INTEGER,
    //   defaultValue: 0,
    //   allowNull: false
    // },
    article_id: { // 对应文章id
      type: DataTypes.INTEGER,
      allowNull: false
    },
    isRead: { // 是否已读暂时先保留
      type: DataTypes.TINYINT(1),
      allowNull: false,
      defaultValue: Type.NOT
    }
  }, {});
  // BlogComment.sync({ force: true })

  return BlogComment;
};