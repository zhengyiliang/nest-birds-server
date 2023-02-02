module.exports = (sequelize, DataTypes) => {
  const BlogMessage = sequelize.define('BlogMessage', {
    // id: {
    //   type: DataTypes.UUID,
    //   allowNull: true,
    //   primaryKey: true,
    //   defaultValue: DataTypes.UUIDV4 // 或 DataTypes.UUIDV1
    // },
    nickname: { // 留言昵称
      type: DataTypes.STRING(32)
    },
    content: { // 留言内容
      type: DataTypes.STRING(1023),
      allowNull: false
    }
  }, {});

  return BlogMessage;
};