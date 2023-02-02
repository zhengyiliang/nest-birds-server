
module.exports = (sequelize, DataTypes) => {
  const SysVisitor = sequelize.define('SysVisitor', {
    // username: {
    //   type: DataTypes.STRING,
    //   notEmpty: true,
    //   notNull: true,
    //   comment: '用户名',
    // },
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
    type: {
      type: DataTypes.INTEGER,
      notEmpty: true,
      notNull: true,
      comment: '项目类型',
    },
    count: {
      type: DataTypes.INTEGER,
      notEmpty: true,
      notNull: true,
      comment: '访问次数',
      defaultValue: 1
    },
    ipaddr: {
      type: DataTypes.STRING,
      notEmpty: true,
      notNull: true,
      comment: 'IP',
    },
    loginLocation: {
      type: DataTypes.STRING,
      notEmpty: true,
      notNull: true,
      comment: '地址',
    }
  }, {});


  return SysVisitor;
};