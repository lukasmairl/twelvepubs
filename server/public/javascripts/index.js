$.ajax({
  url: "https://api.foursquare.com/v2/users/self?v=20131119",
}).done(function(result) {
  console.log(result);
});