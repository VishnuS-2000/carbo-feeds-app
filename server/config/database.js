require('dotenv').config()
const { Sequelize } =require( "sequelize");




const sequelize=new Sequelize(process.env.DATABASE_URL,{
    dialect:'postgres',
    "dialectOptions": {
        "ssl": {
            "require": true,
            "rejectUnauthorized": false
        },
    },
    logging:true
})


const checkConnection=async()=>{
    try{
        await sequelize.authenticate()
        console.log("Database connected")
    }
    catch(err){ 
        console.log(err)
    }   
}

checkConnection();

module.exports=sequelize;