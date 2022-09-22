const {Model,DataTypes}=require( "sequelize")
const sequelize =require('../config/database.js');

class MerchantSession extends Model{}

MerchantSession.init({
    session_id:{
        type:DataTypes.STRING,

    },payload:{
        type:DataTypes.JSON
    }
},{
    sequelize,
    modelName:'shopify_sessions'
})

const syncModel=async()=>{
    try{
        await MerchantSession.sync()
    }
    catch(err){
        console.log(err)
    }
}

syncModel()
module.exports=MerchantSession