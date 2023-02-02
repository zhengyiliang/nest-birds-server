module.exports = (sequelize, DataTypes) => {
  const BlogTag = sequelize.define('BlogTag', {

    name: { // 标签名称
      type: DataTypes.STRING(64),
      allowNull: false
    },
    created_by: {
      type: DataTypes.STRING,
      allowNull: false
    },
    created_by_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    update_by: {
      type: DataTypes.STRING,
      allowNull: true
    },
    desc: { // 标签描述
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {});

  BlogTag.associate = function (models) {
    const { BlogArticle, BlogTag, BlogArticleTag } = models
    BlogTag.belongsToMany(BlogArticle, {
      through: {
        model: BlogArticleTag,
        unique: false
      },
      foreignKey: 'tag_id',
      constraints: false
    })
  };
  // BlogTag.sync({ force: true })
  return BlogTag;
};