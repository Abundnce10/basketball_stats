var shotDistance = function(x1, y1, x2, y2) {
    return Number(Math.sqrt(Math.pow((x1 - x2),2) + Math.pow((y1 - y2),2)).toFixed(1));
}

var shotPoints = function(shotDistance) {
    if (shotDistance > 266.0) {
        return 3;
    } else {
        return 2;
    }
}

var pixelsToFeet = function(shotDistance) {
    multiplier = 6/72;
    return Number((multiplier * shotDistance).toFixed(1));
}

var fadeShotOpacity = function(team) {
    $('#'+team+'_shot_last').attr('opacity', '0.5'); 
    $('#'+team+'_shot_last').attr('id', '');   
}

var newPlayer = function(team) {
    // Remove the add player button
    $('#form_'+team+'_players_container').children().last().children().last().remove();

    // Add a new div with form for new player
    $('#form_'+team+'_players_container').append('<div class="form_player_add"><label>Number&nbsp;</label><input type="text" placeholder="XX" size="2"></input><label>&nbsp;Name&nbsp;</label><input type="text" placeholder="John Doe" size="15"></input><button type="button" onclick="newPlayer(\''+team+'\')">+Player</button></div>');   
}

var createRosterHtml = function(teamName, playersArray, homeAway) {
    var htmlString = '';

    // add team name
    htmlString += '<h2 class="team_roster_header">'+teamName+'</h2>';

    // add 'starters' header
    htmlString += '<h4 class="starters_header">Starters</h4>';

    // add all players
    htmlString += '<ul class="roster">';
    for (var i = 0; i < playersArray.length; i++) {
        var spacer = '&nbsp;-&nbsp;';
        if (playersArray[i].length == 1) {
            "&nbsp:".concat(spacer);
        }
        htmlString += '<li id="' + homeAway + '_' + playersArray[i]['number'] + '">#';
        htmlString += playersArray[i]['number'] + spacer + playersArray[i]['name'];
        htmlString += '</li>';
    }

    // finish html and return
    htmlString += '</div>';
    return htmlString;
}



$(document).ready(function(e) {

    // Force the input of Roster
    $('#game').hide();

    // Hide in-game buttons
    $('#header_right').hide();

    // variables to test for double click
    var DELAY = 225,
        clicks = 0,
        timer = null;

    // Selected Player variable
    var selected_player = '';// CHANGE: dynamicallly set
    var selected_team = 'away';

    // svg dimensions
    var svg_width = $('#basketball_court').attr('width');
    var svg_height = $('#basketball_court').attr('height');
    var away_hoop_x = 49;
    var away_hoop_y = 302;
    var home_hoop_x = 1086;
    var home_hoop_y = 302;

    // shot container - [[x1,y1], [x2,y2]]
    var shots = {
        'away': [],
        'home': []
    };

    // teams container
    var teams = {};
    teams.away = {}; teams.home = {};
    teams.away.players = []; teams.home.players = [];

    // Submitted Rosters
    var rostersSubmitted = 0;



    // Capture User input within Teams/Players Form
    $('.save_players_form').on("click", function() {
        rostersSubmitted += 1;

        // determine which team (home or away) was saved        
        var team = ($(this).closest('form').attr('id')).split('_')[0];
        // save team name
        teams[team]['team_name'] = $('#'+team+'_form .team_name input').val();
        // save player objects into array
        $('#'+team+'_form .form_player_add').each(function(ix, elem) {
            var i = $(elem).find('input');
            teams[team]['players'].push( { number: i[0].value, name: i[1].value } );
        });

        // Remove Form and display team
        $('#'+team+'_roster').empty();
        $('#'+team+'_roster').append(createRosterHtml(teams[team]['team_name'], teams[team]['players'], team));        
        

        // Sort Roster Event Handler
        $(".roster").sortable({
            start: function (event, ui) {
                ui.item.css('border', '1px solid green').append('<span class="ui-icon ui-icon-check icons"></span>');
            },
            stop: function (event, ui) {
                //reset to no border or whatever your desired default border is
                ui.item.css('border', '');
                ui.item.children('.icons').remove();
            }

        });

        // Disable Selection of Player Roster
        $(".roster").disableSelection();

        if (rostersSubmitted === 2) {

            // Append a 'Start Game' Button
            $('#rosters_container').append('<button type="button" id="start_game">Start Game!</button>');

            // Create 'Start Game' Button Event Handler
            $('#start_game').on("click", function() {
                
                // Grab Away Starters & Append to #teams_container > #away
                $('#away_roster ul li:lt(5)').each(function(i, elem) {
                    var id = $(elem).attr('id');
                    var num = id.split('_')[1];
                    var html = '<div id="' + id + '" class="player">#' + num + '</div>';
                    $('#game #away').append(html);
                });

                // Grab Home Starters & Append to #teams_container > #home
                $('#home_roster ul li:lt(5)').each(function(i, elem) {
                    var id = $(elem).attr('id');
                    var num = id.split('_')[1];
                    var html = '<div id="' + id + '" class="player">#' + num + '</div>';
                    $('#game #home').append(html);
                });            

                // Highlight 1st away player
                $('#game #away div').slice(0,1).addClass('selected');
                selected_player = $('#game #away div').attr('id');


                // Hide the Roster View
                $('#rosters_container').slideUp();

                // Display Input View
                $('#game').slideDown();

                // Show in-game buttons
                $('#header_right').show();

                // Substitution Event Handler
                $('#substitute').on("click", function() {
                    $('#game').hide();
                    $('#rosters_container').show();
                    $('#rosters_container #start_game').remove();
                    $('#rosters_container').append('<button type="button" id="resume_game">Resume Game</button>');
                    // 'Resume Game' Event Handler
                    $('#rosters_container #resume_game').on("click", function() {
                        // Grab Away Starters & Append to #teams_container > #away
                        $('#game #away').empty();
                        $('#away_roster ul li:lt(5)').each(function(i, elem) {
                            var id = $(elem).attr('id');
                            var num = id.split('_')[1];
                            var html = '<div id="' + id + '" class="player">#' + num + '</div>';
                            $('#game #away').append(html);
                        });

                        // Grab Home Starters & Append to #teams_container > #home
                        $('#game #home').empty();
                        $('#home_roster ul li:lt(5)').each(function(i, elem) {
                            var id = $(elem).attr('id');
                            var num = id.split('_')[1];
                            var html = '<div id="' + id + '" class="player">#' + num + '</div>';
                            $('#game #home').append(html);
                        });

                        // Highlight 1st away player
                        $('#game #away div').slice(0,1).addClass('selected');
                        selected_player = $('#game #away div').attr('id');
                            
                        $('#game').show();
                        $('#rosters_container').hide();
                    });

                });



                ///// Shot Event Handlers  ///////

                // Clicking On A Player
                $('.player').click(function(e) {

                    // Remove 'selected' class from previous player
                    $('.player#' + selected_player).removeClass('selected');
                    console.log(selected_player);

                    // Save new player to global selected_player var
                    selected_player = $(this).attr('id');
                    selected_team = $(this).parent().attr('id');

                    console.log($(this).attr('id'));
                    console.log($(this).parent().attr('id'));

                    // Add 'selected' class to new player
                    $(this).addClass('selected');
                });


                // Clicking on the SVG
	            $('svg').on("click", function(e) {

                    clicks++;

                    var shotSuccess = true;

                    // Get position of parent coords
		            var posX = $(this.parentNode).offset().left;
                    var posY = $(this.parentNode).offset().top;

                    // shot location
                    var shotX = e.pageX - posX;
                    var shotY = e.pageY - posY;

                    if (clicks === 1) {
                        timer = setTimeout(function() {
                            clicks = 0;
                            $('#basketball_court').trigger("placeMarker", [shotX, shotY, shotSuccess]);
                        }, DELAY);
                    } else {
                        clearTimeout(timer); // prevent single click action
                        clicks = 0;
                        shotSuccess = false;
                        $('#basketball_court').trigger("placeMarker", [shotX, shotY, shotSuccess]);
                    }
                })
                .on("dblclick", function(e) {
                    e.preventDefault(); // cancel system double click event
                });



                // Place Shot Marker Event Handler
                $('#basketball_court').on("placeMarker", function(e, shotX, shotY, shotSuccess) {

                    // user id
                    var user_number = $('#' + selected_player).text().substring(1);

                    // determine shot distance 
                    if (selected_team == 'home') {
                        var shot_distance_pixels = shotDistance(home_hoop_x, home_hoop_y, shotX, shotY);
                    } else {
                        var shot_distance_pixels = shotDistance(away_hoop_x, away_hoop_y, shotX, shotY);
                    }


                    // Made Shot
                    if (shotSuccess == true) {

                        var shot = {'uid': user_number,
                                    'shot_success': shotSuccess,
                                    'distance_pixels': shot_distance_pixels,
                                    'distance_feet': pixelsToFeet(shot_distance_pixels),
                                    'points': shotPoints(shot_distance_pixels)};

                        // update score widget
                        var prev_score = parseInt($('#' + selected_team + '_score').text());
                        $('#' + selected_team + '_score').html(prev_score + shotPoints(shot_distance_pixels));

                        // pop off the 3rd to last shot
                        fadeShotOpacity(selected_team);

                        // Successful shot logo
                        d3.select("#basketball_court").append('circle').attr('id', selected_team+'_shot_last').attr('cx', shotX).attr('cy', shotY).attr('r', 15).attr('fill', 'green').attr("stroke","black").attr("stroke-width", 4).attr('opacity', 1);


                    // Missed Shot
                    } else {

                        var shot = {'uid': user_number,
                                    'shot_success': shotSuccess,
                                    'distance_pixels': shot_distance_pixels,
                                    'distance_feet': pixelsToFeet(shot_distance_pixels),
                                    'points': 0};

                        // pop off the 3rd to last shot
                        fadeShotOpacity(selected_team);

                        // Unsuccessful shot logo
                        d3.select("#basketball_court").append('circle').attr('id', selected_team+'_shot_last').attr('cx', shotX).attr('cy', shotY).attr('r', 15).attr('fill', 'red').attr('opacity', 1);

                    }

                    // Save shot into home/away team shot array
                    shots[selected_team].push(shot);
                    console.log(shots);

                });/////// End In Game Event Handlers ///////

            });// End 'Start Game' onclick

        }
        console.log(teams);

    });// End 'Save Players' Form onclick

});// End Document onload
