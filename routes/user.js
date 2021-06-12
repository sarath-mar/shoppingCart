const { response } = require('express');
var express = require('express');
const { dbs } = require('../config/connection');

var router = express.Router();
app = express()
var productHelpers = require("../helpers/productHelpers");
const { b } = require('../helpers/user-helpers');
var userHelpers = require("../helpers/user-helpers")
navbar = true


function verifyUser(req, res, next) {
  if (req.session.logedIn) {
    next()
  } else {
    res.redirect("/login")
  }

}


/* GET home page. */
router.get("/login", (req, res) => {

  if (req.session.logedIn) {
    res.redirect("/")



  } else
    res.render("users/login", { navbar, error: req.session.error })
  req.session.error = false
})


router.get("/signup", (req, res) => {

  res.render("users/signup", { navbar })
})
router.post('/signup', (req, res) => {
  userHelpers.doSignup(req.body, () => {
    console.log(req.body);
    req.session.logedIn = true
    req.session.user = req.body
    res.redirect("login")
  })
})

router.get('/', function  (req, res, next) {
  var user = req.session.user
 
     var count = req.session.count
     res.render("users/front-page", { user,count})
})




router.get('/viewproducts', function (req, res, next) {
  var user = req.session.user
  //------
userHelpers.cartCount(req.session.user._id).then((count)=>{
 console.log("start");
  console.log(count);
 req.session.count=count


  //------
 // var count = req.session.count
  productHelpers.getAllProducts().then((resolve, reject) => {
    res.render("users/view-products", { resolve, user,count});
  })
})

});

router.post("/login", (req, res) => {



  userHelpers.doLogin(req.body).then((resolve, reject) => {
    if (resolve.status) {
      req.session.user = resolve.user


      req.session.logedIn = true
      console.log("reached here");
      res.redirect("/")

    }




    else {
      req.session.error = true //or req.session.error="invalid username or password" then go to login page and in if condition use this {{error}}
      console.log("reached else");
      res.redirect("/login")
    }

  }
  )
})
router.get("/logout", (req, res) => {
  req.session.destroy()
  res.redirect('/login')
})

router.get("/cart", verifyUser, (req, res) => {
  var user = req.session.user
  var count = req.session.count
  userId = req.session.user._id
  userHelpers.getCartProducts(userId).then((resolve, reject) => {
    if(resolve){
   
    console.log("usser page");
   
      var cartProduct = resolve
     
      res.render("users/cart", { cartProduct, user, count })
    }else if(reject){
      res.render("users/cart", {user, count })
    }
    
    
    
   
  })

})

router.get("/add-to-cart/:id", verifyUser, (req, res) => {
  console.log("get api");
  proid = req.params.id
  console.log(proid);
  console.log(req.session.user._id);
  userHelpers.addToCart(req.session.user._id, proid).then(() => {
    res.json({status:true})

    //res.redirect("/viewproducts")




  })
})

module.exports = router;
