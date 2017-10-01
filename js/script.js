$('#iframe').css('height', window.innerHeight + 'px');

$.getJSON('http://www.newtab.party/data/list.json', function( data ) {
//$.getJSON('../data/list.json', function( data ) {
  display(data);
});



function display(list) {
  var item = window.location.hash ? list[window.location.hash.replace('#', '')] : list[pickRandomProperty(list)];

  switch (item.type) {
    case 'gist':
      showGist(item);
      break;
    case 'github':
      showGithub(item);
      break;
    case 'flickr':
      showFlickr(item);
      break;
    default:
      showOther(item);
      break;
  }
}




function showGist(item) {
  $('#iframe').show();

  if (item.code != undefined) {
    $('#iframe').attr('src', item.code.replace('gist.githubusercontent.com', 'cdn.rawgit.com'));
  }

  $.getJSON( 'https://api.github.com/gists/' + item.src, function( data ) {
    if (item.code == undefined) {
      $('#iframe').attr('src', 'https://cdn.rawgit.com/mbostock/'+ item.src +'/raw/'+ data.history[0].version +'/index.html');
    }
    setInfo({
      'icon': 'img/github.png',
      'name': data.description,
      'author': data.owner.login,
      'link': 'https://bl.ocks.org/'+ data.owner.login +'/'+ item.src,
      'details': data.files['README.md'] ? data.files['README.md'].content : ''
    });

  });
}

function showGithub(item) {
  $('#iframe').show();

  if (item.code != undefined) {
    $('#iframe').attr('src', item.code.replace('raw.githubusercontent.com', 'cdn.rawgit.com'));
  }

  $.getJSON( 'https://api.github.com/repos/' + item.src, function( data ) {
    if (item.code == undefined) {
      $('#iframe').attr('src', 'https://cdn.rawgit.com/mbostock/'+ item.src +'/raw/'+ data.history[0].version +'/index.html');
    }
    setInfo({
      'icon': 'img/github.png',
      'name': data.name,
      'author': data.owner.login,
      'link': 'https://github.com/'+ item.src,
      'details': data.description
    });

  });
}

function showFlickr(item) {
  $('#iframe').hide();
  $('body').css({
    'background-image': 'url('+ item.image +')',
    //'background-position-y': item['background-position-y'] ? item['background-position-y'] : 'center'
  });
  console.log(item.src);

  $.getJSON( 'https://api.flickr.com/services/rest/?method=flickr.photos.getInfo&api_key=b4bfee90f8d4ee9d0b9642803e17ea13&photo_id='+ item.src +'&format=json&nojsoncallback=1', function( data ) {
    console.log(data);
    var description = data.photo.description._content;
    if (data.photo.location) {
      var loc = data.photo.location.locality._content +', '+ data.photo.location.country._content;
      description = '<div class="location"><a href="https://www.google.com/maps/?q='+ loc +'" title="View on Google Maps">'+ loc +'</a></div>' + description;
    }
    setInfo({
      'icon': 'img/flickr.png',
      'name': data.photo.title._content,
      'author': data.photo.owner.realname ? data.photo.owner.realname : data.photo.owner.username,
      'link': data.photo.urls.url[0]._content,
      'details': description
    });

  });

}



function showOther(item) {

  if (item.code != undefined) {
    $('#iframe').show();
    $('#iframe').attr('src', item.code);
  }

  if (item.image != undefined) {
    $('#iframe').hide();
    $('body').css({
      'background-image': 'url('+ item.image +')',
      //'background-position-y': item['background-position-y'] ? item['background-position-y'] : 'center'
    });
  }
  $('#loading').hide();
}







function setInfo(data) {
  // Parse markdown links
  // From https://stackoverflow.com/a/31192012

  var converter = new showdown.Converter();
  data.details = converter.makeHtml(data.details);


  console.log(data);
  $('#icon').attr('src', data.icon);
  $('#name').text(data.name);
  $('#author').text(data.author);
  $('#link').attr('href', data.link);
  $('#details').html(data.details);
  $('#loading').hide();
  $('#info').fadeIn();
}


function pickRandomProperty(obj) {
  var result;
  var count = 0;
  for (var prop in obj)
    if (Math.random() < 1/++count)
      result = prop;
  return result;
}