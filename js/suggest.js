$('#suggest-link').bind('click', function(e){
  e.preventDefault();
  chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
    var title = 'Suggestion: ' + tabs[0].title;
    var body = 'URL: ' + tabs[0].url + "\r\n\r\nAny details?\r\n";
    window.open('https://github.com/jlyon/newtab/issues/new?title='+ encodeURIComponent(title) +'&body='+ encodeURIComponent(body), '_newtab');
  });
});
