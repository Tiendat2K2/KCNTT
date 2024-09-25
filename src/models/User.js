const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize('dulieu', 'username', 'password', {
    host: 'DESKTOP-6ICFLK0\\SQLEXPRESS',
    dialect: 'mssql',
});

const User = sequelize.define('User', {
    Email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true, // Đảm bảo địa chỉ email là duy nhất
        validate: {
            isEmail: true, // Kiểm tra định dạng email
        },
    },
    Password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    // Các trường khác có thể bao gồm:
    // fullName: { type: DataTypes.STRING },
    // createdAt: { type: DataTypes.DATE, defaultValue: Sequelize.NOW },
    // updatedAt: { type: DataTypes.DATE, defaultValue: Sequelize.NOW },
}, {
    timestamps: true, // Tự động thêm createdAt và updatedAt
});

module.exports = User;
