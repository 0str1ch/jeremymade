$(window).scroll(function() {
    if ($(window).scrollTop() >= 50) {
  $(".scrolldown").css("visibility", "hidden");
    } else {
    $(".scrolldown").css("visibility", "initial");
    }
  });