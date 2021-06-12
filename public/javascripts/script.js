
 
   //----------------------------- 
   function addcart(proId) {
    $.ajax({
        url:"/add-to-cart/"+proId,
        method:"get",
        success:(response)=>{
           
          alert("Item added to the cart")
        var count= parseInt($("#count").html()) 
        count= count+1
        $("#count").html(count)
        }
      })
    }


//--------------------------

  
  
