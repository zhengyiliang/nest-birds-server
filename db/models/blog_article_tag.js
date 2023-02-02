module.exports = (sequelize, DataTypes) => {
  const BlogArticleTag = sequelize.define('BlogArticleTag', {
    // id: {
    //   type: DataTypes.INTEGER,
    //   primaryKey: true,
    //   defaultValue: DataTypes.UUIDV4
    // },
    article_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    tag_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {});
  // BlogArticleTag.sync({ force: true })
  return BlogArticleTag;
};