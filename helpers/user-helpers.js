const db=require("../config/connection")
var collections=require("../config/collections")
const bcrypt=require("bcrypt")
const { USER_COLLECTION } = require("../config/collections")
var objectId=require("mongodb").ObjectID
module.exports={

    doSignup:(userData,callback)=>{
        console.log(userData)
       
      
            userData.password= bcrypt.hash(userData.password,10,(err,hash)=>{
                if (err) throw err
                console.log(hash)
                 userData.password=hash
                callback()
                db.dbs().collection(collections.USER_COLLECTION).insertOne(userData).then((resolve,reject)=>{
                    console.log(`data has inserted to ${USER_COLLECTION}`);
                    console.log(resolve);
                })
                       
             })
    
      
        },
         
     doLogin:(userData)=>{
      
       responce={}
         return new  Promise(async(resolve,reject)=>{
              var user=await db.dbs().collection(collections.USER_COLLECTION).findOne({email:userData.email})
              
         
         if (user){
             console.log("valid username");
            
             bcrypt.compare(userData.password,user.password,((err,data)=>{
                 if(err) throw err
                 if (data){console.log("logged in");
                 responce.status=true
                 responce.user=user
                 console.log(responce);
                resolve(responce)}
                 else{console.log("invalid password");
                 responce.status=false
         resolve(responce)
                }
              } ))
         }

         else{console.log("invalid username")
         
         resolve({status:false})}
        })

      
     },
     addToCart:(userId,productId)=>{
         var proObj={
             item:objectId(productId),
             quantity:1
         }
         return new Promise (async(resolve,reject)=>{
         var cart=await db.dbs().collection(collections.CART_COLLECTION).findOne({user:objectId(userId) })
         if (cart){
             let proExist=cart.products.findIndex(product=>product.item==productId)
             console.log(proExist);
             if(proExist!=-1){
                 db.dbs().collection(collections.CART_COLLECTION).updateOne({"products.item":objectId(productId)},{$inc:{"products.$.quantity":1}}).then((res,rej)=>{
                     resolve()  })
               
             }else{
              db.dbs().collection(collections.CART_COLLECTION).updateOne({user:objectId(userId)},{$push:{products:proObj}}).then((responce,rej)=>{
               resolve() })
              }
             
         }else{
             var cartObj={
                 user:objectId(userId),
                 products:[proObj]
             }
         db.dbs().collection(collections.CART_COLLECTION).insertOne(cartObj).then((res,rej)=>{
             
            resolve()
         })
         }
         })

     },
     getCartProducts:(userId)=>{
         return new Promise((resolve,reject)=>{
             db.dbs().collection(collections.CART_COLLECTION).aggregate([
                 {
                     $match:{user:objectId(userId)}
                 },
                 {
                     $unwind:"$products"
                 },
                 {
                     $project:{
                         item:"$products.item",
                         quantity:"$products.quantity"
                     }
                 },{
                     $lookup:{
                         from:collections.PRODUCT_COLLECTION,
                         localField:"item",
                         foreignField:"_id",
                         as:"cartArray"
                     }
                 }
                 //in earlier case we used below look up functions for getting the products details
                //  {
                //     $lookup:{
                //         from:collections.PRODUCT_COLLECTION,
                //         let:{proList:"$products"},
                //         pipeline:[
                //             {
                //              $match:{
                //                  $expr:{
                //                      $in:["$_id","$$proList"]
                //                  }
                //              }   

                //         }
                            
                //         ],
                //         as:"cartArray"
                //     } 
                // }
             ]).toArray().then((res,err)=>{
                
                 resolve(res)
             })
             
         })
     },
     cartCount:(userId)=>{
  
         return new Promise((resolve,reject)=>{
         let  count=0
           db.dbs().collection(collections.CART_COLLECTION).findOne({user:objectId(userId)}).then((res)=>{
            console.log(res);
            if (res){
              
               count=res.products.length
              
            }
            resolve(count) 
           
             
           })
               //console.log(res.products.length);
           
         
         })
     }
    } 
  /* another method
   db.dbs().collection(collections.USER_COLLECTION).findOne({email:userData.email},(err,data)=>{
 if(err){console.log("incorrect mail id");}
 else{ console.log(data);
  console.log(data.email);
  console.log(userData.email);}
   if(data.email==userData.email){
       console.log(data);
       console.log("user existing");
       bcrypt.compare(userData.password,data.password,((err,data)=>{
           if (data){
               console.log("login pass");
           }
           else{
               console.log("incorrect password");
           }
       }))
   }else{
       console.log("incorrect ");
   }
   
 })

     }}*/
                
          
     

    