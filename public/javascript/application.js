$(document).ready(function() {

  // See: http://docs.jquery.com/Tutorials:Introducing_$(document).ready()

  $(".wish_list_button").click(function() {

    $("#pokemon_to_wish").val($(this).data("id"));

    $('form[name="wish_list_form"]').submit();

  });
 //------pokedex search-----------
///-----change type drop down list style
  var update_chosen_item_class = function(){
    $('#type_bar_pokedex_chosen .active-result').each(function(i, list_item){
      text = list_item.innerHTML.toLowerCase();
      $(list_item).addClass("background-color-" + text);
      $(list_item).addClass("pokemon-type-tag-dropdown");
    });
  }
///-----
  //update pokedex by search box 
  var name_input = $('#search_bar_pokedex');
  var type_input = $('#type-bar-pokedex');
  //var name_input = document.getElementById('search-pokemon');
   // name_input = $(name_input);

   name_input.keyup(function(){filter_pokemon()});
  // name_input.chosen().change(function(){
  //   filter_pokemon();
  // });
  $(type_input).on('chosen:showing_dropdown', function(evt, params) {
    update_chosen_item_class();
  });
  $(type_input).chosen({max_selected_options: 2}).change(function(){
    filter_pokemon();
  });
  

  update_chosen_item_class();

var filter_pokemon = function(){
      var name_filter = name_input.val().toUpperCase();
      var type_filter = type_input.val();
      var lis = $('.col-pokedex');
      lis.each(function(i,l){
      var $l = $(l)
      var name = $l.find('.caption').html().trim();
      // var type = $l.find('[class^=background-color-]');
      var types = $l.find('[class^=background-color]');
 
      if (name.toUpperCase().indexOf(name_filter) == 0 && filter_type(types, type_filter)){
        $l.show();
      }
      else{
        $l.hide();
      }
    });
  }

  var filter_type = function(types, type_filter){
    var result = false
    if (type_filter == null){
      return true
    }
    types.each(function(x,t){
      if (t.innerHTML == type_filter){
        result = true
      }
    });
    return result
  }

///---------------

  //------WishList Ajax

  var user_id = $('body').attr('data-user-id');
  var get_user_wishlist = function(){
    if (user_id != undefined) {
      $.ajax({
        url: '/api/user/' + user_id + '/wishlist',
        method: 'GET', // optional
        success: function(data) {
          wrap_wishlist_button(data);
          // for(var i = 0; i < data.length; i++) {
          //   render_review(data[i]);
          // }
        }
      });
    }
  }
  get_user_wishlist();

  var wrap_wishlist_button = function(wish_list){
    var lis = $('.col-pokedex');
    lis.each(function(i,l){
      var $l = $(l)
      // var name = $l.find('.caption').html().trim();
      var species_id = $l.attr('data-species-id');
      wrap_species_wishlist_button(species_id, wish_list);
    });
  }

var wrap_species_wishlist_button = function(species_id,wish_list){
  l = $("#pokedex .col-pokedex[data-species-id=" + species_id +"]");
  if (wish_list.indexOf(species_id) != -1){
    l.find('.wish_list_button').addClass("wish_list_button_liked");
    l.find('.wish_list_button_wrapper span.button-tooltiptext').text("Remove from Wishlist");
  }
  else{
    l.find('.wish_list_button').removeClass("wish_list_button_liked");
    l.find('.wish_list_button_wrapper span.button-tooltiptext').text("Add to Wishlist");
  }
}

var remove_from_wish_list = function(species_id,wish_list){
  l = $("#wish-list .col-pokedex[data-species-id=" + species_id +"]");
  if (wish_list.indexOf(species_id) == -1){
    l.hide();
  }
}

var update_to_wishlist = function(species_id,ele) {
    $.ajax({
      url: '/api/user/' + user_id + '/wishlist',
      type: 'POST',
      data: { species_id: species_id },
      success: function(wish_list) {
        ele.attr('data-disabled',"false");
        ele.html('<span class=\'glyphicon glyphicon-heart\'></span>');
        wrap_species_wishlist_button(species_id, wish_list);
        remove_from_wish_list(species_id, wish_list);
      },
      error: function() {
      }
    });
  }



  $('a.wish_list_button').click(function() {
    event.preventDefault();

    if($(this).attr('data-disabled') == "true"){
      return false;
    }

    var ele = $(this);

    var species_id = $(this).attr('data-species-id');
    //http://preloaders.net/en/free
    $(this).html('<img id=\"#loader-icon\" src=\"/images/loader-icon36-36.gif\">')
    $(this).attr('data-disabled',"true");
    update_to_wishlist(species_id,ele);
  });

 $('a.tab-link').click(function(){
  $(this).parent().siblings().removeClass('active');
  $(this).parent().addClass('active');
 });
  
  // Will only work if string in href matches with location
  

  // // Will also work for relative and absolute hrefs
  // $('ul.nav a').filter(function() {
  //     return this.href == url;
  // }).parent().addClass('active');



});

jQuery(document).ready(function($) {
  var user_id = $('body').attr('data-user-id');


  $('.popup-ajax').magnificPopup({
  type:'inline',
  callbacks: {
    open: function() {
      el = $(this._lastFocusedEl);
      popup = this;
      species_id = el.attr('data-species-id');
      species_name = el.attr('data-species-name');
      species_url = el.attr('data-species-url');
      $('#popup-add-to-collection-image').html("<img class=\"thumbnail-image\" src=\""+ species_url +"\" alt=\"Bulbasaur\">");
      $('#popup-add-to-collection-name').html("<span>" + species_name + "</span>");
      console.log(this);

      $('#popup-add-to-collection-form').submit(function(){
        $('#popup-add-to-collection-message').html("");
        event.preventDefault();
        $form = $(this)
        $.ajax({
          url: $form.attr('action'),
          type: 'POST',
          data: {species_id: species_id, user_id: user_id, cp: $('#cp').val(), name: $('#name').val(), quick_move: $('#quick_move').val(), charge_move: $('charge_move').val()},
          success: function(data){
            console.log(data);
            $('#popup-add-to-collection-message').html("<span style=\"color: green;\">Successfully added to collection.</span>");
            setTimeout(function(){console.log(1);popup.close();}, 2000);
            
          },
          error: function(){
            $('#popup-add-to-collection-message').html("<span style=\"color: red;\">Failed to added to collection.</span>");
            setTimeout(function(){console.log(1);popup.close();}, 2000);
          }
        });
      });
    },
    close: function() {
      // Will fire when popup is closed
    }
    // e.t.c.
  }
  });
});
