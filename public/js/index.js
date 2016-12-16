var data, data_recs, data_recs2;
var seeds = '', seeds2 = '';
var user = '', playlistID = '', track_uris = '', playlist_url ='', timeRange = '';
var temp;

$(document).ready(function() {

    $('#login').show();
    $('#options').hide();
    $('#contents').hide();


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

    /* Templates */
    var templateSource     = document.getElementById('results-template').innerHTML,
        template           = Handlebars.compile(templateSource),
        resultsPlaceholder = document.getElementById('results');
    
    var templateSourceR                = document.getElementById('recommendations-template').innerHTML,
        templateR                      = Handlebars.compile(templateSourceR),
        recommendationsPlaceholder     = document.getElementById('recommendations'),
        moreRecommendationsPlaceholder = document.getElementById('more_recommendations');

    var params = getHashParams();

    var access_token  = params.access_token,
        refresh_token = params.refresh_token,
        error         = params.error;

    if (error) {
        alert('There was an error during the authentication');
    } else {
        if (access_token) {
            $('#login').hide();
            $('#options').show();

            /** Site Buttons + Functions **/
            var shortBtn        = document.getElementById('short-term');
            var medBtn          = document.getElementById('med-term');
            var longBtn         = document.getElementById('long-term');
            var recBtn          = document.getElementById('get-rec');
            var moreRecBtn      = document.getElementById('get-more-rec');
            var makePlaylistBtn = document.getElementById('make-playlist');

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
                        $('#rec-results').hide();
                        $('#more-rec-intro').hide();
                        $('#make-playlist').hide();
                        $('#playlist-msg').hide();

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
                        });
                    });
                }
                if (medBtn) {
                    medBtn.addEventListener('click', function () {
                        timeRange = 'medium_term';
                        $('#options').hide();
                        $('#contents').show();
                        $('#rec-results').hide();
                        $('#more-rec-intro').hide();
                        $('#make-playlist').hide();
                        $('#playlist-msg').hide();
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
                        $('#rec-results').hide();
                        $('#more-rec-intro').hide();
                        $('#make-playlist').hide();
                        $('#playlist-msg').hide();
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
                                        //track_uris = track_uris + data[key].uri + ',';
                                        count++;
                                    } else if (count == 5) {
                                        seeds = seeds + data[key].id;
                                        //track_uris = track_uris + data[key].uri;
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

                results.addEventListener('click', function (e) {
                    var target = e.target;
                    add_attributes(target);
                });
            }

            /* Get Recommendation Tracks */
            if (recBtn || moreRecBtn || makePlaylistBtn) {
                if (recBtn) {
                    recBtn.addEventListener('click', function () {
                        /* Get Recommendations */
                        $.ajax({
                            url: 'https://api.spotify.com/v1/recommendations?seed_tracks=' + seeds + '&limit=6',
                            headers: {
                                'Authorization': 'Bearer ' + access_token
                            },
                            success: function (response) {
                                data_recs = response['tracks'];
                                recommendationsPlaceholder.innerHTML = templateR(response);
                                $('#rec-intro-msg').hide();
                                $('#get-rec').hide();
                                $('#rec-results').show();
                                $('#rec-intro-results').show();
                                $('#more-rec-intro').show();
                                $('#more-rec-intro-msg').show();

                            }
                        }).done(function () {
                            var count = 0;
                            for (var key in data_recs) {
                                if (data_recs.hasOwnProperty(key)) {
                                    if (count < 6) {
                                        track_uris = track_uris + data_recs[key].uri + ',';
                                        count++;
                                    }
                                }
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
                                data_recs2 = response['tracks'];
                                moreRecommendationsPlaceholder.innerHTML = templateR(response);

                                $('#more-rec-intro').hide();
                                $('#get-more-rec').hide();
                                $('#more-rec-intro-msg').hide();
                                $('#more-rec-intro-results').show();
                                $('#make-playlist').show();
                                $('#playlist-msg').hide();

                            }
                        }).done(function () {
                            var count = 1;
                            for (var key in data_recs2) {
                                if (data_recs2.hasOwnProperty(key)) {
                                    if (count < 6) {
                                        track_uris = track_uris + data_recs2[key].uri + ',';
                                        count++;
                                    } else if (count == 6) {
                                        track_uris = track_uris + data_recs2[key].uri;
                                        count++;
                                    }
                                }
                            }
                        });
                    });

                    more_recommendations.addEventListener('click', function (e) {
                        var target = e.target;
                        add_attributes(target);
                    });
                }
                /* Create a playlist from recommendations */
                if (makePlaylistBtn){

                    makePlaylistBtn.addEventListener('click', function () {
                        // Create a Playlist
                        $.ajax({
                            type: 'POST',
                            url: 'https://api.spotify.com/v1/users/' + user + '/playlists',
                            headers: {
                                'Authorization': 'Bearer ' + access_token,
                            },
                            dataType: 'json',
                            contentType: "application/json",
                            data: JSON.stringify({ "name": "TopTracks Recommendations" ,
                                "public": false
                            }),
                            success: function (response) {
                                temp = response['id'];

                                $('#playlist').attr('href', response['external_urls']['spotify']);
                                $('#playlist').text("Your Playlist");
                                $('#playlist-iframe').attr('src', "https://embed.spotify.com/?uri="+response['uri']);
                                $('#playlist-intro').hide();

                                $('#playlist-msg').show();
                                $('#playlist-iframe').hide();


                            }
                        }).done(function () {
                            playlistID = temp;
                            console.log('got new playlist id');
                            console.log(playlist_url);
                            $.ajax({
                                type: 'POST',
                                url: 'https://api.spotify.com/v1/users/' + user + '/playlists/' + playlistID
                                            + '/tracks?uris=' + track_uris,
                                headers: {
                                    'Authorization': 'Bearer ' + access_token,
                                    'Content-Type': 'application/json'
                                },
                                success: function (response) {
                                    $('#playlist-iframe').show();
                                }
                            });
                        });
                    });
                }
            }
        } else {
            // render initial screen
            $('#contents').hide();

        }
    }
});