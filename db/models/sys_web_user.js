
module.exports = (sequelize, DataTypes) => {
  const SysWebUser = sequelize.define('SysWebUser', {
    nickname: { // qq用户昵称
      type: DataTypes.STRING(32),
      allowNull: false
    },
    address: { // qq用户所在地址
      type: DataTypes.STRING,
      allowNull: true,
    },
    avatar: { // 头像
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    birth: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {});
  // SysWebUser.sync({ force: true })

  return SysWebUser;
};