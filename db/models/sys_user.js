const { AuthType, StatusType } = require('@utils/enums')
const bcrypt = require('bcryptjs')

module.exports = (sequelize, DataTypes) => {
  const SysUser = sequelize.define('SysUser', {
    // id: {
    //   type: DataTypes.UUID,
    //   allowNull: true,
    //   primaryKey: true,
    //   defaultValue: DataTypes.UUIDV4 // 或 DataTypes.UUIDV1
    // },
    name: { // 名称
      type: DataTypes.STRING(32),
      allowNull: false
    },
    avatar: { // 头像
      type: DataTypes.STRING(255),
      allowNull: true,
      // defaultValue: '',
    },
    email: { // 邮箱
      type: DataTypes.STRING(320),
      allowNull: false
    },
    description: { // 个人描述
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    auth: { // 用户类型-用户/管理员/超级管理员
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: AuthType.USER
    },
    status: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: StatusType.ACTIVE
    },
    roleId: { // 角色id
      type: DataTypes.STRING,
      notEmpty: true,
    },
    password: {
      type: DataTypes.STRING(127),
      allowNull: false,
      // defaultValue: defaultPassword,
      set(origin) {
        const salt = bcrypt.genSaltSync(10)
        const val = bcrypt.hashSync(origin, salt)
        this.setDataValue('password', val)
      },
      get() {
        return this.getDataValue('password');
      }
    }
  }, {});



  // SysUser.associate = function (models) {
  //   const { BlogArticle, SysUser, BlogArticleUser } = models
  //   // 关联用户和文章
  //   SysUser.belongsToMany(BlogArticle, {
  //     through: {
  //       model: BlogArticleUser,
  //       unique: false
  //     },
  //     foreignKey: 'user_id',
  //     constraints: false
  //   })
  // };

  return SysUser;
};