var data, data_recs;
var seeds = '', seeds2 = '';
var user = '';
var playlistID = '';
var track_uris = '';
var playlist_url ='';

$(document).ready(function() {

/** Recommendations Section Data **/
    $('#rec-intro-results').hide();
    $('#rec-results').hide();
    $('#rec-intro').show();

/** More-Recommendations Section Data **/
    $('#more-rec-intro').hide();
    $('#more-rec-intro-results').hide();

    /**
     * Obtains parameters from the hash of the URL
     * @return Object
     */
    var getHashParams  = function() {
        var hashParams = {};
        var e, r = /([^&;=]+)=?([^&;]*)/g,
            q = window.location.hash.substring(1);
        while ( e = r.exec(q)) {
           hashParams[e[1]] = decodeURIComponent(e[2]);
        }
        return hashParams;
    }
    var add_attributes = function (target) {
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
    }
    var fetchTracks    = function (albumId, callback) {
        $.ajax({
            url: 'https://api.spotify.com/v1/tracks/' + albumId,
            success: function (response) {
                callback(response);
            }
        });
    };


    var playingCssClass = 'playing',
        audioObject     = null;

    var templateSource     = document.getElementById('results-template').innerHTML,
        template           = Handlebars.compile(templateSource),
        resultsPlaceholder = document.getElementById('results');
    
    var templateSourceR                = document.getElementById('recommendations-template').innerHTML,
        templateR                      = Handlebars.compile(templateSourceR),
        recommendationsPlaceholder     = document.getElementById('recommendations'),
        moreRecommendationsPlaceholder = document.getElementById('more_recommendations');

    var templateSourcePlay  = document.getElementById('playlist-template').innerHTML,
        templatePlay        = Handlebars.compile(templateSourcePlay),
        playlistPlaceholder = document.getElementById('playlist');


    var params = getHashParams();

    var access_token  = params.access_token,
        refresh_token = params.refresh_token,
        error         = params.error;

    if (error) {
        alert('There was an error during the authentication');
    } else {
        if (access_token) {
            $('#login').hide();
            $('#contents').hide();
            $('#options').show();

            var shortBtn  = document.getElementById('short-term');
            var medBtn    = document.getElementById('med-term');
            var longBtn   = document.getElementById('long-term');
            var timeRange = '';

            /* Get User ID*/
            $.ajax({
                url: 'https://api.spotify.com/v1/me',
                headers: {
                    'Authorization': 'Bearer ' + access_token
                },
                success: function (response) {
                    user = response['id']
                }
            });

            /* Get Top Tracks */
            if (shortBtn || medBtn || longBtn) {
                if (shortBtn) {
                    shortBtn.addEventListener('click', function () {
                        timeRange = 'short_term';
                        $('#options').hide();
                        $('#contents').show();
                        $.ajax({
                            url: 'https://api.spotify.com/v1/me/top/tracks?time_range=' + timeRange + '&limit=12',
                            headers: {
                                'Authorization': 'Bearer ' + access_token
                            },
                            success: function (response) {
                                data = response['items'];
                                resultsPlaceholder.innerHTML = template(response);
                            }
                        }).done(function () {

                            // create two different seed strings for recommendations
                            var count = 1;
                            for (var key in data) {
                                if (data.hasOwnProperty(key)) {
                                    if (count < 5) {
                                        seeds = seeds + data[key].id + ',';
                                        track_uris = track_uris + data[key].uri + ',';
                                        count++;
                                    } else if (count == 5) {
                                        seeds = seeds + data[key].id;
                                        track_uris = track_uris + data[key].uri;
                                        count++;
                                    } else if (count < 10) {
                                        seeds2 = seeds2 + data[key].id + ',';
                                        count++;
                                    } else if (count == 10) {
                                        seeds2 = seeds2 + data[key].id;
                                        count++;
                                    }
                                }
                            }
                            console.log(track_uris);
                        });
                    });
                    results.addEventListener('click', function (e) {
                        var target = e.target;
                        add_attributes(target);
                    });
                }
                if (medBtn) {
                    medBtn.addEventListener('click', function () {
                        timeRange = 'medium_term';
                        $('#options').hide();
                        $('#contents').show();
                        $.ajax({
                            url: 'https://api.spotify.com/v1/me/top/tracks?time_range=' + timeRange + '&limit=12',
                            headers: {
                                'Authorization': 'Bearer ' + access_token
                            },
                            success: function (response) {
                                data = response['items'];
                                resultsPlaceholder.innerHTML = template(response);
                            }
                        }).done(function () {
                            // create two different seed strings for recommendations
                            var count = 1;
                            for (var key in data) {
                                if (data.hasOwnProperty(key)) {
                                    if (count < 5) {
                                        seeds = seeds + data[key].id + ',';
                                        count++;
                                    } else if (count == 5) {
                                        seeds = seeds + data[key].id;
                                        count++;
                                    } else if (count < 10) {
                                        seeds2 = seeds2 + data[key].id + ',';
                                        count++;
                                    } else if (count == 10) {
                                        seeds2 = seeds2 + data[key].id;
                                        count++;
                                    }
                                }
                            }
                        });
                    });
                }
                if (longBtn) {
                    longBtn.addEventListener('click', function () {
                        timeRange = 'long_term';
                        $('#options').hide();
                        $('#contents').show();
                        $.ajax({
                            url: 'https://api.spotify.com/v1/me/top/tracks?time_range=' + timeRange + '&limit=12',
                            headers: {
                                'Authorization': 'Bearer ' + access_token
                            },
                            success: function (response) {
                                data = response['items'];
                                resultsPlaceholder.innerHTML = template(response);
                            }
                        }).done(function () {

                            // create two different seed strings for recommendations
                            var count = 1;
                            for (var key in data) {
                                if (data.hasOwnProperty(key)) {
                                    if (count < 5) {
                                        seeds = seeds + data[key].id + ',';
                                        track_uris = track_uris + data[key].uri + ',';
                                        count++;
                                    } else if (count == 5) {
                                        seeds = seeds + data[key].id;
                                        track_uris = track_uris + data[key].uri;
                                        count++;
                                    } else if (count < 10) {
                                        seeds2 = seeds2 + data[key].id + ',';
                                        count++;
                                    } else if (count == 10) {
                                        seeds2 = seeds2 + data[key].id;
                                        count++;
                                    }
                                }
                            }
                            console.log(track_uris);
                        });
                    });
                }
            }

            /** Site Buttons + Functions **/
            var recBtn = document.getElementById('get-rec');
            var moreRecBtn = document.getElementById('get-more-rec');
            var makePlaylistBtn = document.getElementById('make-playlist');

            /* Get Recommendation Tracks */
            if (recBtn) {
                recBtn.addEventListener('click', function () {
                    /* Get Recommendations */
                    $.ajax({
                        url: 'https://api.spotify.com/v1/recommendations?seed_tracks=' + seeds + '&limit=6',
                        headers: {
                            'Authorization': 'Bearer ' + access_token
                        },
                        success: function (response) {
                            data_recs = response['items'];
                            console.log(data_recs);
                            recommendationsPlaceholder.innerHTML = templateR(response);
                            $('#rec-intro-msg').hide();
                            $('#get-rec').hide();
                            $('#rec-results').show();
                            $('#rec-intro-results').show();
                            $('#more-rec-intro').show();
                            $('#more-rec-intro-msg').show();
                        }
                    });
                });


                recommendations.addEventListener('click', function (e) {
                    var target = e.target;
                    add_attributes(target);
                });
            }

            /* Get More Recommendation Tracks */
            if (moreRecBtn) {
                moreRecBtn.addEventListener('click', function () {
                    /* Get More Recommendations */
                    $.ajax({
                        url: 'https://api.spotify.com/v1/recommendations?seed_tracks=' + seeds2 + '&limit=6',
                        headers: {
                            'Authorization': 'Bearer ' + access_token
                        },
                        success: function (response) {
                            //data_recs = response['albums'];
                            moreRecommendationsPlaceholder.innerHTML = templateR(response);

                            $('#more-rec-intro').hide();
                            $('#get-more-rec').hide();
                            $('#more-rec-intro-msg').hide();
                            $('#more-rec-intro-results').show();

                        }
                    });
                }, false);

                more_recommendations.addEventListener('click', function (e) {
                    var target = e.target;
                    add_attributes(target);
                });
            }

            if (makePlaylistBtn) {
                makePlaylistBtn.addEventListener('click', function (){
                    // Create a Playlist
                    $.ajax({
                        url: 'https://api.spotify.com/v1/users/' + user + '/playlists',
                        headers: {
                            'Authorization': 'Bearer ' + access_token,
                            'Content-Type': 'application/json'
                        },
                        data: {
                            "name": "Top-Tracks-App-Recommendations"
                        },
                        success: function (response) {
                            var temp = response['items'][0];
                            playlistID = temp['id'];
                            console.log('got new playlist id');
                        }
                    }).done(function(){

                            // add tracks to playlist
                            $.ajax({
                                url: 'https://api.spotify.com/v1/users/' + user
                                        + '/playlists/' + playlistID
                                        +'/tracks?uris='+ track_uris,
                                headers: {
                                    'Authorization': 'Bearer ' + access_token,
                                    'Content-Type': 'application/json'
                                },
                                success: function (response) {
                                    console.log('added tracks');
                                    //get link to playlist
                                    $.ajax({
                                        url: 'https://api.spotify.com/v1/users/' + user
                                        + '/playlists' + playlistID,
                                        headers: {
                                            'Authorization': 'Bearer ' + access_token
                                        },
                                        success: function (response) {
                                            playlist_url = response['external_urls']['spotify'];
                                            playlistPlaceholder.innerHTML = templatePlay(response);
                                        }
                                    });
                                }
                            });
                        })
                }, false);
            }

        } else {
            // render initial screen
            $('#contents').hide();

            /*
            $('#results-intro-msg').hide();
            $('#results-intro-1').hide();

            $('#rec-intro').hide();
            $('#rec-intro-results').hide();

            $('#more-rec-intro').hide();
            $('#more-rec-intro-results').hide();*/
        }
    }
});