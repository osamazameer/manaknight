module.exports = (sequelize, DataTypes) => {
    const Order = sequelize.define("Order",{
        product_id:{
            type: DataTypes.STRING,
            allowNull : false
        },
        total:{
            type: DataTypes.STRING,
            allowNull: false
        },
        stripe_id:{
            type: DataTypes.STRING,
            allowNull: false
        },
        status:{
            type: DataTypes.STRING,
            allowNull: false
        },

    });
    return Order;
}
