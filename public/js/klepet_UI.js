function divElementEnostavniTekst(sporocilo) {
  var jeSmesko = sporocilo.indexOf('http://sandbox.lavbic.net/teaching/OIS/gradivo/') > -1;
<<<<<<< HEAD
  var jeSlika = sporocilo.indexOf('<img style=\"width:200px; margin-left:20px;\" src=\"') > -1;
=======
   var jeVideo = sporocilo.indexOf('<iframe src=\"https://www.youtube.com/embed/')>-1;
>>>>>>> youtube
  
  if (jeSmesko) {
    sporocilo = sporocilo.replace(/\</g, '&lt;').replace(/\>/g, '&gt;').replace('&lt;img', '<img').replace('png\' /&gt;', 'png\' />');
    return $('<div style="font-weight: bold"></div>').html(sporocilo);
    
    
<<<<<<< HEAD
    
  } else if (jeSlika){
    
    sporocilo = sporocilo.replace(/\</g, '&lt;').replace(/\>/g, '&gt;').replace('&lt;img', '<img').replace('png\"&gt;', 'png\">').replace('gif\"&gt;', 'gif\">').replace('jpg\"&gt;', 'jpg\">');
    return $('<div style="font-weight: bold"></div>').html(sporocilo);
    
  }else{
=======
  } else if (jeVideo){
    
    sporocilo = sporocilo.replace(/\</g, '&lt;').replace(/\>/g, '&gt;').replace('&lt;iframe','<iframe').replace('allowfullscreen&gt;&lt;/iframe&gt;', 'allowfullscreen></iframe>');

    return $('<div style="font-weight: bold"></div>').html(sporocilo);
  }else{
    
>>>>>>> youtube
    return $('<div style="font-weight: bold;"></div>').text(sporocilo);
  }
  
}

function divElementHtmlTekst(sporocilo) {
  return $('<div></div>').html('<i>' + sporocilo + '</i>');
}

function procesirajVnosUporabnika(klepetApp, socket) {
  var sporocilo = $('#poslji-sporocilo').val();
  sporocilo = dodajSmeske(sporocilo);
<<<<<<< HEAD
  sporocilo = dodajSlike(sporocilo);
=======
  sporocilo = dodajVideo(sporocilo);
>>>>>>> youtube
  var sistemskoSporocilo;

  if (sporocilo.charAt(0) == '/') {
    sistemskoSporocilo = klepetApp.procesirajUkaz(sporocilo);
    if (sistemskoSporocilo) {
      $('#sporocila').append(divElementHtmlTekst(sistemskoSporocilo));
    }
  } else {
    sporocilo = filtirirajVulgarneBesede(sporocilo);
    klepetApp.posljiSporocilo(trenutniKanal, sporocilo);
    $('#sporocila').append(divElementEnostavniTekst(sporocilo));
    $('#sporocila').scrollTop($('#sporocila').prop('scrollHeight'));
  }

  $('#poslji-sporocilo').val('');
}

var socket = io.connect();
var trenutniVzdevek = "", trenutniKanal = "";

var vulgarneBesede = [];
$.get('/swearWords.txt', function(podatki) {
  vulgarneBesede = podatki.split('\r\n');
});

function filtirirajVulgarneBesede(vhod) {
  for (var i in vulgarneBesede) {
    vhod = vhod.replace(new RegExp('\\b' + vulgarneBesede[i] + '\\b', 'gi'), function() {
      var zamenjava = "";
      for (var j=0; j < vulgarneBesede[i].length; j++)
        zamenjava = zamenjava + "*";
      return zamenjava;
    });
  }
  return vhod;
}

$(document).ready(function() {
  var klepetApp = new Klepet(socket);
  
  socket.on('vzdevekSpremembaOdgovor', function(rezultat) {
    var sporocilo;
    if (rezultat.uspesno) {
      trenutniVzdevek = rezultat.vzdevek;
      $('#kanal').text(trenutniVzdevek + " @ " + trenutniKanal);
      sporocilo = 'Prijavljen si kot ' + rezultat.vzdevek + '.';
    } else {
      sporocilo = rezultat.sporocilo;
    }
    $('#sporocila').append(divElementHtmlTekst(sporocilo));
  });

  socket.on('pridruzitevOdgovor', function(rezultat) {
    trenutniKanal = rezultat.kanal;
    $('#kanal').text(trenutniVzdevek + " @ " + trenutniKanal);
    $('#sporocila').append(divElementHtmlTekst('Sprememba kanala.'));
  });

  socket.on('sporocilo', function (sporocilo) {
    var novElement = divElementEnostavniTekst(sporocilo.besedilo);
    $('#sporocila').append(novElement);
  });
  
  socket.on('kanali', function(kanali) {
    $('#seznam-kanalov').empty();

    for(var kanal in kanali) {
      kanal = kanal.substring(1, kanal.length);
      if (kanal != '') {
        $('#seznam-kanalov').append(divElementEnostavniTekst(kanal));
      }
    }

    $('#seznam-kanalov div').click(function() {
      klepetApp.procesirajUkaz('/pridruzitev ' + $(this).text());
      $('#poslji-sporocilo').focus();
    });
  });

  socket.on('uporabniki', function(uporabniki) {
    $('#seznam-uporabnikov').empty();
    for (var i=0; i < uporabniki.length; i++) {
      $('#seznam-uporabnikov').append(divElementEnostavniTekst(uporabniki[i]));
    }
    
    //Zasebna sporočila
    $('#seznam-uporabnikov div').click(function(){
      
      $('#poslji-sporocilo').val("/zasebno \"" + $(this).text() + "\" ");
      $('#poslji-sporocilo').focus();
    })
    
  });

  setInterval(function() {
    socket.emit('kanali');
    socket.emit('uporabniki', {kanal: trenutniKanal});
  }, 1000);

  $('#poslji-sporocilo').focus();

  $('#poslji-obrazec').submit(function() {
    procesirajVnosUporabnika(klepetApp, socket);
    return false;
  });
  
  
});

function dodajVideo(bes){
  var st = bes.indexOf('https://www.youtube.com/watch?v=');
  if(st > -1){
    bes = bes.substr(0,st-1) + "<iframe src=\"https://www.youtube.com/embed/" + bes.substr(st+32,bes.length) + "\" allowfullscreen></iframe>";
  }
  return bes;
}


function dodajSmeske(vhodnoBesedilo) {
  var preslikovalnaTabela = {
    ";)": "wink.png",
    ":)": "smiley.png",
    "(y)": "like.png",
    ":*": "kiss.png",
    ":(": "sad.png"
  }
  for (var smesko in preslikovalnaTabela) {
    vhodnoBesedilo = vhodnoBesedilo.replace(smesko,
      "<img src='http://sandbox.lavbic.net/teaching/OIS/gradivo/" +
      preslikovalnaTabela[smesko] + "' />");
  }
  return vhodnoBesedilo;
}

function dodajSlike(bes){
  
  if(   (bes.indexOf("http://")>-1 || bes.indexOf("https://")>-1   )    &&    ( preverjanjeKonca(bes,'.jpg') || preverjanjeKonca(bes,'.png') || preverjanjeKonca(bes,'.gif') ) ){
    var st = Math.max(bes.indexOf("http://"),bes.indexOf("https://"));
    console.log(bes.substr(st , bes.length-1));
    bes=bes.substring(0,st) + "<img style=\"width:200px; margin-left:20px;\" src=\"" + bes.substr(st , bes.length) + "\">";
  }
  return bes;
}



//Preverjanje konca niz-a (sporočila)
function preverjanjeKonca(sporocilo, iskano) {
    return sporocilo.indexOf(iskano, sporocilo.length - iskano.length) !== -1;
}
