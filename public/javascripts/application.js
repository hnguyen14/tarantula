$(function() {
  $('#seed').on('submit', function(e) {
    e.preventDefault();
    var url = $(e.target).find('#seedUrl').val();

    $.post('/crawlers/queue', {url: url}, function(data, textStatus, jqXHR) {
      console.log(arguments);
      if (textStatus === 'success') {
        $('#seedUrlSuccess').toggle(100);
        setTimeout(function() {
          $('#seedUrlSuccess').toggle(100);
        }, 3000);
      }
    });
  })
});
