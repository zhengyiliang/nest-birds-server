module.exports = (sequelize, DataTypes) => {
  const BlogCategory = sequelize.define('BlogCategory', {
    name: { // 分类名称
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
    description: { // 分类描述
      type: DataTypes.STRING(255),
      allowNull: false,
    },
  }, {});

  // BlogCategory.sync({ force: true })

  return BlogCategory;
};