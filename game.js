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


$(document).ready(function(e) {

    // Force the input of Roster
    $('#game').hide();

    // variables to test for double click
    var DELAY = 225,
        clicks = 0,
        timer = null;

    // Selected Player variable
    var selected_player = 'away_10';// CHANGE: dynamicallly set
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



    // Clicking On A Player
    $('.player').click(function(e) {

        // Remove 'selected' class from previous player
        $('#' + selected_player).removeClass('selected');

        // Save new player to global selected_player var
        selected_player = $(this).attr('id');
        selected_team = $(this).parent().attr('id');

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

    });


});
