const db=require("../config/connection")
var collections=require("../config/collections")
var objectId=require("mongodb").ObjectID

module.exports={
    addProducts:(product,callback)=>{
        console.log(product);
    db.dbs().collection(collections.PRODUCT_COLLECTION).insertOne(product).then((resolve,reject)=>{
     
        console.log("data has inserted")
        console.log(resolve);
        callback(resolve.ops[0]._id)
      })
},
getAllProducts:()=>{
    return new Promise(async(resolve,reject)=>{
        let products=await db.dbs().collection(collections.PRODUCT_COLLECTION).find().toArray()
        resolve(products)
    })
},
deleteProduct:(deleteProduct)=>{
    return new Promise(async(resolve,reject)=>{
        var product=await db.dbs().collection(collections.PRODUCT_COLLECTION).removeOne({_id:objectId(deleteProduct) },(err,data)=>{
            if (err) throw err
            else console.log(data);
        })
        resolve(product)
    })
},
editProduct:(editproduct)=>{
    return new Promise((resolve,reject)=>{
        db.dbs().collection(collections.PRODUCT_COLLECTION).findOne({_id:objectId(editproduct)}).then((res,rej)=>{
         console.log(res);
           resolve(res)
           // console.log(product);
        })
        

    })
},
updateProducts:(product,update)=>{
    return new Promise((resolve,reject)=>{
        db.dbs().collection(collections.PRODUCT_COLLECTION).updateOne({_id:objectId(product)},
        {$set:{
            product:update.product
            ,category:update.category,
            discription:update.discription}}).then((data)=>{
                console.log(data);
            resolve(data)
        })
    })
}



}