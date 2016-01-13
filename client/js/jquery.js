//Toggle Dropdown Menu By setting a max-height on ".show" to 20em from max-height of 0px
  //Swap from nav-icon to close-icon or vice versa
  $('.dropdown').on('click', function() {
    $('nav ul').toggleClass('show');
    if($('.nav-icon').css('display') === 'none') {
      $('.close-icon').hide();
      $('.nav-icon').show();
    } else {
      $('.nav-icon').hide();
      $('.close-icon').show();
    }
  })

  //Toggle Modal form to add Question
  $('.yes').on('click', function() {
    $('.modal').toggle();
  })

  //Toggle Modal close
  $('.close-modal').on('click', function () {
    $('.modal').toggle();
  })

  //Toggle entire welcome component display to "none"
  $('.no').on('click', function() {
    $('.add-question').fadeToggle();
  })

  $('.question-button').on('click', function(){
    $('#question-form').hide();
    $('#answers-form').show();
  })

  $('.finalize').on('click', function() {
    $('#answers-form').hide();
    $('#question-form').show()
  })
