// change logo color when the navbar is black
// window.addEventListener("scroll", (event) => {
//     let scrollY = this.scrollY;
    
//     if (scrollY >= 100){
//       $("#logo").css({
//         "display": "none",
//       });
//       if (screen.width <= 1100 ){
//         $("#logo-white").css({
//             "display": "inline",
//             "width" : "23%"
//           });
//       } else{
//         $("#logo-white").css({
//             "display": "inline",
//             "width" : "10%"
//           });
//       }
      
//     } else if (scrollY < 100 || scrollY == 0){
//         $("#logo-white").css({
//           "display": "none",
//         });
//         $("#logo").css({
//           "display": "inline",
//         });
//       }
//   });
  
  // transition of the hamburger button
  function myFunction(x) {
    x.classList.toggle("change");
  }
  
  let btn = document.querySelector('.hamburger');
  let box = document.querySelectorAll('.item'), i;
  
  btn.addEventListener('click', function () {
    for(i = 0; i < box.length; ++i){
      box[i].classList.toggle('show');
    }
  }, false);
  
  // navbar background is black if scroll is > 100
  $(window).scroll(function() {    
    var scroll = $(window).scrollTop();
  
    if (scroll >= 100) {
      $(".container").addClass("scrolling");
      $(".band").addClass("scrolling");
    } else {
        $(".container").removeClass("scrolling");
        $(".band").removeClass("scrolling");
      }
  });


  //cookie
  const cookieContanier = document.querySelector(".cookie-container");
  const cookieButton = document.querySelector(".cookie-btn");

  cookieButton.addEventListener("click", () => {
    cookieContanier.classList.remove("active");
    localStorage.setItem("cookieBannerDisplayed", "true")
  });

  setTimeout(() => {
      if(!localStorage.getItem("cookieBannerDisplayed")){
        cookieContanier.classList.add("active");
      } 
  }, 2000);