$(document).ready(function(){
  $("#username").keyup(function(){
    var name = $("#username").val();

  // $.post("https://ricemil.herokuapp.com/validate",{ username: name},function(response,status){
  $.post("http://localhost/validate",{ username: name},function(response,status){
      if(!response && status == "success"){
        $('#error_name').html('<div class="alert alert-danger"><span class="glyphicons glyphicons-warning-sign"></span>' + name + ' : USERNAME not available</div>');
      } else {
        $('#error_name').html("");
      }
    });
  });


  console.log('Connected');
});
