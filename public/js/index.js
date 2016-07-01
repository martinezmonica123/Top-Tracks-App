var data;
var data_recs;
var results_prev= [];
var rec_prev =[];
var seeds = '';
$(document).ready(function() {
  
  /**
   * Obtains parameters from the hash of the URL
   * @return Object
   */
    $('#rec-intro-results').hide();
    $('#rec-results').hide();
    $('#rec-intro').show();
    
    function getHashParams() {
        var hashParams = {};
        var e, r = /([^&;=]+)=?([^&;]*)/g,
            q = window.location.hash.substring(1);
        while ( e = r.exec(q)) {
           hashParams[e[1]] = decodeURIComponent(e[2]);
        }
        return hashParams;
    }

    var templateSource = document.getElementById('results-template').innerHTML,
      template = Handlebars.compile(templateSource),
      resultsPlaceholder = document.getElementById('results'),
      playingCssClass = 'playing',
      audioObject = null;
    
    var templateSourceR = document.getElementById('recommendations-template').innerHTML,
      templateR = Handlebars.compile(templateSourceR),
      recommendationsPlaceholder = document.getElementById('recommendations');

    var params = getHashParams();

    var access_token = params.access_token,
      refresh_token = params.refresh_token,
      error = params.error;

    var fetchTracks = function (albumId, callback) {
        $.ajax({
            url: 'https://api.spotify.com/v1/tracks/' + albumId,
            success: function (response) {
                callback(response);
            }
        });
    };
    
    if (error) {
        alert('There was an error during the authentication');
    } else {
        if (access_token) {
            $.ajax({
                url: 'https://api.spotify.com/v1/me/top/tracks?time_range=long_term&limit=12',
                headers: {
                'Authorization': 'Bearer ' + access_token
                },
                success: function (response) { 
                    data = response['items'];
                    resultsPlaceholder.innerHTML = template(response);
                }
            }).done(function(){
                var count = 0;
                for (var key in data){
                    if (data.hasOwnProperty(key)){
                        if (count<4){
                            seeds = seeds + data[key].id + ',';
                            count++;
                        } else if (count == 4){
                            seeds = seeds + data[key].id;
                            count++;
                        }                   
                    }
                }
            });
            var el = document.getElementById('get-rec');
            if (el){
                el.addEventListener('click', function() {
                $.ajax({
                      url: 'https://api.spotify.com/v1/recommendations?seed_tracks='+seeds+'&limit=6',
                      headers: {
                        'Authorization': 'Bearer ' + access_token
                      },
                      success: function (response) {
                          data_recs = response['albums'];
                          recommendationsPlaceholder.innerHTML = templateR(response);
                          $('#rec-intro-msg').hide();
                          $('#get-rec').hide();
                          $('#rec-results').show();
                          $('#rec-intro-results').show();
                      }
                  })}, false); 
            }
        
            results.addEventListener('click', function (e) {
                var target = e.target;
                if (target !== null && target.classList.contains('cover')) {
                    if (target.classList.contains(playingCssClass)) {
                        audioObject.pause();
                    } else {
                        if (audioObject) {
                            audioObject.pause();
                        }
                        fetchTracks(target.getAttribute('data-album-id'), function (data) {
                            audioObject = new Audio(data.preview_url);
                            audioObject.play();
                            target.classList.add(playingCssClass);
                            audioObject.addEventListener('ended', function () {
                                target.classList.remove(playingCssClass);
                            });
                            audioObject.addEventListener('pause', function () {
                                target.classList.remove(playingCssClass);
                            });
                        });
                    }
                }
            }); 
            
            recommendations.addEventListener('click', function (e) {
                var target = e.target;
                if (target !== null && target.classList.contains('cover')) {
                    if (target.classList.contains(playingCssClass)) {
                        audioObject.pause();
                    } else {
                        if (audioObject) {
                            audioObject.pause();
                        }
                        fetchTracks(target.getAttribute('data-album-id'), function (data) {
                            audioObject = new Audio(data.preview_url);
                            audioObject.play();
                            target.classList.add(playingCssClass);
                            audioObject.addEventListener('ended', function () {
                                target.classList.remove(playingCssClass);
                            });
                            audioObject.addEventListener('pause', function () {
                                target.classList.remove(playingCssClass);
                            });
                        });
                    }
                }
            }); 
            
        } else {
            // render initial screen
            $('#login').show();
            $('#results-intro').hide();
            $('#results-intro-1').hide();
            $('#rec-intro').hide();
            $('#rec-intro-results').hide();
        }
    }
});