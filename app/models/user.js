module.exports = function(sequelize, DataTypes) {
    return sequelize.define('User', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        firstName: {
            type: DataTypes.STRING
        },
        lastName: {
            type: DataTypes.STRING
        },
        address: {
            type: DataTypes.STRING
        },
        email: {
            type: DataTypes.STRING
        },
        phone: {
            type: DataTypes.STRING
        },
        roleId: {
            type: DataTypes.INTEGER
        },

    }, {
        sequelize,
        tableName: 'Users',
        timestamps: true,
        indexes: [
          {
            name: "Users_pkey",
            unique: true,
            fields: [
              { name: "id" },
            ]
          }
        ],
        freezeTableName:true
    });
};