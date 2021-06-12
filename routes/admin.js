var express = require('express');
const { handlebars } = require('hbs');
const productHelpers = require('../helpers/productHelpers');
var router = express.Router();




/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render("admin/frontpage",{admin:true});
});

router.get("/products",(req,res)=>{
  productHelpers.getAllProducts().then((resolve,reject)=>{
    console.log(resolve);
    res.render("admin/view-product",{resolve,admin:true})
  })
  
})
router.get("/addproducts",(req,res)=>{
  res.render("admin/add-products",{admin:true})
})
router.post("/addproduct",(req,res)=>{
  var image=req.files.image
  productHelpers.addProducts(req.body,(id)=>
  { image.mv("./public/product-images/"+id+".jpg",(err,data)=>{
    if(err){
      console.log(err);
    }else{
      res.render("admin/add-products",{admin:true})
    
    }
    })
  })
   
 
  
    
  })
  
  router.get("/delete/:id",(req,res)=>{
    deleteId=req.params.id
    console.log(deleteId);
    
    productHelpers.deleteProduct(deleteId).then((resolve,reject)=>{
      console.log(resolve);
      res.redirect("/admin/products")
    })
      })

  router.get("/edit/",(req,res)=>{
    deleteId=req.query.id
    productHelpers.editProduct(deleteId).then((resolve,reject)=>{
    console.log(resolve);
    
      res.render("admin/edit-product",{resolve})
    })
   

    
  })
  router.post("/update-product/:id",(req,res)=>{
    var updateId=req.params.id
    console.log(req.body);
    console.log(updateId);
    productHelpers.updateProducts(updateId,req.body).then((resolve,data)=>{
      console.log(resolve);
      if(req.files.image){
        image=req.files.image
        image.mv("./public/product-images/"+updateId+".jpg")

        
          }
      res.redirect("/admin/products")
      
    })
  })

module.exports = router;
