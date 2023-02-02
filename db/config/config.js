const base = {
  logging: true,//日志输出
  timezone: '+08:00',//时区同步
  define: {
    timestamps: true, //时间戳
    paranoid: true, //软删除 必须启用时间戳
    createdAt: 'created_at', //创建时间表字段名称重定义
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at',
    underscored: true, //驼峰转下划线
    scopes: {
      bh: {
        attributes: {
          exclude: ['updated_at', 'deleted_at', 'created_at']
        },
      },
      frontShow: {
        where: {
          public: 1,
          status: 1
        }
      },
      acs: { // 账号停用的不获取
        where: {
          status: 0
        }
      }
    }
  }
}

const development = {
  ...base,
  "username": "root",
  "password": "root",
  "host": "127.0.0.1",
  "dialect": "mysql",
  "database": "nest_birds",
}

const production = {
  ...base,
  "username": "root",
  "password": "root",
  "database": "nest_birds",
  "host": "127.0.0.1",
  "dialect": "mysql"
}

module.exports = {
  development,
  production
}