
const { Type } = require('@utils/enums')


module.exports = (sequelize, DataTypes) => {
  const BlogArticle = sequelize.define('BlogArticle', {
    title: { // 文章标题
      type: DataTypes.STRING,
      allowNull: false
    },
    content: { // 文章内容
      type: DataTypes.TEXT,
      allowNull: false
    },
    cover: { // 封面
      type: DataTypes.STRING(255),
    },
    description: { // 描述
      type: DataTypes.STRING(255),
      allowNull: false
    },
    category_id: { // 文章分类
      type: DataTypes.INTEGER,
      allowNull: false
    },
    user_id: { // 创作者
      type: DataTypes.INTEGER,
      allowNull: false
    },
    public: { // 1 公开 0 私密
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: Type.YES
    },
    isTop: { // 是否置顶 1 置顶 0 不置顶
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: Type.NOT
    },
    isHot: { // 是否热门 1 热门 0 不热门
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: Type.NOT
    },
    status: { // 文章状态 1 发布 0 草稿
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: Type.YES
    },
    views: { // 查看量
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
  }, {});
  BlogArticle.associate = function (models) {
    const { SysUser, BlogArticle, BlogComment, BlogCategory, BlogArticleTag, BlogTag } = models

    // 关联文章和评论
    BlogArticle.hasMany(BlogComment, {
      as: 'comments',
      constraints: false,
    })

    // 关联文章和分类
    BlogArticle.belongsTo(BlogCategory, {
      foreignKey: 'category_id',
      as: 'category',
      constraints: false,
    })

    // 关联文章和用户
    BlogArticle.belongsTo(SysUser, {
      foreignKey: 'user_id',
      as: 'user',
      constraints: false,
    })

    // 关联文章和标签
    BlogArticle.belongsToMany(BlogTag, {
      through: {
        model: BlogArticleTag,
        unique: false
      },
      foreignKey: 'article_id',
      constraints: false,
      as: 'tags'
    })
  };
  // BlogArticle.sync({ force: true })
  return BlogArticle;
};