module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Role', {
      id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          allowNull: false,
          primaryKey: true
      },
      name: {
        type: DataTypes.STRING,
      }

  }, {
      sequelize,
      tableName: 'Roles',
      timestamps: true,
      indexes: [
        {
          name: "Roles_pkey",
          unique: true,
          fields: [
            { name: "id" },
          ]
        }
      ],
      freezeTableName:true
  });
};