module.exports = (sequelize, DataTypes) => {
    const Product = sequelize.define("Product",{
        // id:{
        //     type: DataTypes.STRING,
        //     allowNull : false
        // },
        name:{
            type: DataTypes.STRING,
            allowNull: false
        },
        desc:{
            type: DataTypes.STRING,
            allowNull: false
        },
        price:{
            type: DataTypes.STRING,
            allowNull: false
        },
        image:{
            type: DataTypes.STRING,
            allowNull: false
        }
    });
    return Product;
}
