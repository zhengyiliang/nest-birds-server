module.exports = (sequelize, DataTypes) => {
  const BlogFriend = sequelize.define('BlogFriend', {
    name: { // 友链名称
      type: DataTypes.STRING(64),
      allowNull: false
    },
    link: { // 链接
      type: DataTypes.STRING(255),
      allowNull: false
    },
    avatar: { // 头像
      type: DataTypes.STRING(255),
      defaultValue: ''
    },
  }, {});

  return BlogFriend;
};