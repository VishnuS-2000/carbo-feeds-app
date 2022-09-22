const {Model,DataTypes} =require( "sequelize")
const sequelize =require("../config/database.js");

class Feed extends Model {}

Feed.init({
    id:{
        type:DataTypes.UUID,
        defaultValue:DataTypes.UUIDV4,
        primaryKey:true
    },
    shop:{
        type:DataTypes.STRING,
        allowNull:false
    },
    title:{
        type:DataTypes.STRING,
        allowNull:false,
    },
    theme:{
        type:DataTypes.JSON,
        allowNull:false
    },
    image:{
        type:DataTypes.TEXT,
        allowNull:false
    },
    redirects:{
        type:DataTypes.JSON,
    }
    
},{
    sequelize,
    modelName:'feeds'
})

Feed.sync()

module.exports=Feed;