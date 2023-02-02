
module.exports = (sequelize, DataTypes) => {
  const SysLoginLog = sequelize.define('SysLoginLog', {
    user_id: { // 登录者
      type: DataTypes.INTEGER,
      allowNull: false
    },
    address: { // 登录所在地址
      type: DataTypes.STRING,
      allowNull: true,
    },
    browser: {
      type: DataTypes.STRING,
      notEmpty: true,
      notNull: true,
      comment: '浏览器',
    },
    os: {
      type: DataTypes.STRING,
      notEmpty: true,
      notNull: true,
      comment: '操作系统',
    },
    count: {
      type: DataTypes.INTEGER,
      notEmpty: true,
      notNull: true,
      comment: '登录次数',
      defaultValue: 1
    },
    ip: { // 登录 ip
      type: DataTypes.STRING,
      allowNull: true,
    },
    last_time: {
      type: DataTypes.DATE,
      allowNull: false,
    }
  }, {});
  // SysLoginLog.sync({ force: true })

  return SysLoginLog;
};