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
      'icon': 'github',
      'name': data.description,
      'author': data.owner.login,
      'link': 'https://bl.ocks.org/'+ data.owner.login +'/'+ item.src,
      'details': data.files['README.md'] ? data.files['README.md'].content : '',
      'license': data.files['.block'] ?data.files['.block'].content.replace("\n", '<br/>') : ''
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
      'icon': 'github',
      'name': data.name,
      'author': data.owner.login,
      'link': 'https://github.com/'+ item.src,
      'details': data.description,
      'license': item.license ? item.license : '',
      'text-color': item['text-color'] ? item['text-color'] : null
    });

  });
}

function showFlickr(item) {
  $('#iframe').hide();
  $('body').css({
    'background-image': 'url('+ item.image +')',
    'background-position-y': item['background-position-y'] ? item['background-position-y'] : 'center'
  });

  $.getJSON( 'https://api.flickr.com/services/rest/?method=flickr.photos.getInfo&api_key=ac684d54792f49a21a6b0b2e13bb76a5&photo_id='+ item.src +'&format=json&nojsoncallback=1', function( data ) {
    console.log(data);
    var description = data.photo.description._content;
    if (data.photo.location) {
      var loc = data.photo.location.locality ? data.photo.location.locality._content +', ' : '';
      loc += data.photo.location.country._content;
      description = '<div class="location"><a href="https://www.google.com/maps/?q='+ loc +'" title="View on Google Maps">'+ loc +'</a></div>' + description;
    }
    var license = flickrLicense(data.photo.license);
    setInfo({
      'icon': 'flickr',
      'name': data.photo.title._content,
      'author': data.photo.owner.realname ? data.photo.owner.realname : data.photo.owner.username,
      'link': data.photo.urls.url[0]._content,
      'details': description,
      'license': license ? '<a href="'+ license.url +'" target="_blank">'+ license.name +'</a>' : '',
      'text-color': item['text-color'] ? item['text-color'] : null
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
  setInfo({
    'icon': item.icon ? item.icon : null,
    'name': item.name ? item.name : '',
    'author': item.author ? item.author : '',
    'link': item.link ? item.link : '',
    'details': item.details ? item.details : '',
    'license': item.license ? item.license : '',
    'text-color': item['text-color'] ? item['text-color'] : null
  });
}







function setInfo(data) {
  // Parse markdown links
  // From https://stackoverflow.com/a/31192012 (is it really tho?)
  var converter = new showdown.Converter();
  data.details = converter.makeHtml(data.details);

  if (data.icon) {
    $('#icon').attr('class', 'service-logo fa fa-fw fa-' + data.icon).show();
  } else {
    $('#icon').hide();
  }

  if (!data.author && !data.name) {
    $('#info-line').hide();
  } else {
    $('#info-line').show();
  }

  if (!data.license || data.license == '') {
    $('#license-wrapper').hide();
  } else {
    $('#license-wrapper').show();
  }

  $('.info-container, a').css('color', data['text-color'] ? data['text-color'] : '#333');
  $('#name').text(data.name);
  $('#author').text(data.author);
  $('#link').attr('href', data.link);
  $('#details').html(data.details);
  $('#license').html(data.license);
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


function flickrLicense(num) {
  var licenses = {
    0: { "id": 0, "name": "All Rights Reserved", "url": "" },
    4: { "id": 4, "name": "Attribution License", "url": "https:\/\/creativecommons.org\/licenses\/by\/2.0\/" },
    6: { "id": 6, "name": "Attribution-NoDerivs License", "url": "https:\/\/creativecommons.org\/licenses\/by-nd\/2.0\/" },
    3: { "id": 3, "name": "Attribution-NonCommercial-NoDerivs License", "url": "https:\/\/creativecommons.org\/licenses\/by-nc-nd\/2.0\/" },
    2: { "id": 2, "name": "Attribution-NonCommercial License", "url": "https:\/\/creativecommons.org\/licenses\/by-nc\/2.0\/" },
    1: { "id": 1, "name": "Attribution-NonCommercial-ShareAlike License", "url": "https:\/\/creativecommons.org\/licenses\/by-nc-sa\/2.0\/" },
    5: { "id": 5, "name": "Attribution-ShareAlike License", "url": "https:\/\/creativecommons.org\/licenses\/by-sa\/2.0\/" },
    7: { "id": 7, "name": "No known copyright restrictions", "url": "https:\/\/www.flickr.com\/commons\/usage\/" },
    8: { "id": 8, "name": "United States Government Work", "url": "http:\/\/www.usa.gov\/copyright.shtml" },
    9: { "id": 9, "name": "Public Domain Dedication (CC0)", "url": "https:\/\/creativecommons.org\/publicdomain\/zero\/1.0\/" },
    10: { "id": 10, "name": "Public Domain Mark", "url": "https:\/\/creativecommons.org\/publicdomain\/mark\/1.0\/" }
  };
  return licenses[num] ? licenses[num] : null;
}