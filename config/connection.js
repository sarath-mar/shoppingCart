const mongoClient=require("mongodb").MongoClient

module.exports.connection=()=>{
    const url="mongodb://localhost:27017"
mongoClient.connect(url, { useUnifiedTopology: true },(err,client)=>{
    
    
    if (err) throw err
    console.log(`data base connected`);
     db=client.db("shoppingCart")
    console.log("created db");
   
       
   

})}

module.exports.dbs=()=>db


