
$.get('/getnotifications', function(data) {
      $('notifications').html(data);
        alert('Load was performed.');
});


