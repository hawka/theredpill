
$.get('/getNotifications', function(data) {
      $('notifications').html(data);
        alert('Load was performed.');
});
