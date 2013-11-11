var makeMiss = function() {
    var num = Math.floor(Math.random()*10);

    if ( num % 2 == 0 ) {
        return true;
    } else {
        return false;
    }
};

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


$(document).ready(function(e) {

    // Selected Player variable
    var selected_player = 'away_10';// CHANGE: dynamicallly set
    var selected_team = 'away';

    // svg dimensions
    var svg_width = $('#basketball_court').attr('width');
    var svg_height = $('#basketball_court').attr('height');
    var hoop_x = 49;
    var hoop_y = 302;

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


    // Shot Details
	$('svg').click(function(e) {

        // Get position of parent coords
		var posX = $(this.parentNode).offset().left, posY = $(this.parentNode).offset().top;

        // user id
        var user_number = $('#' + selected_player).text().substring(1);

        // shot location
        var shot_x_coords = ((e.pageX - posX) / svg_width).toFixed(3);
        var shot_y_coords = ((e.pageY - posY) / svg_height).toFixed(3);
        var shot_x = e.pageX - posX;
        var shot_y = e.pageY - posY;

        // Randomly generate whether shot was made or missed
        var make_or_miss = makeMiss();


        // Log distance of shot in percentage
        //console.log('hoop_x: ' + away_hoop_x + ' , hoop_y: ' + away_hoop_y);
        //console.log('shot_x: ' + shot_x_coords + ' , shot_y: ' + shot_y_coords);
        var shot_distance = shotDistance(hoop_x, hoop_y, shot_x, shot_y);
        console.log(shot_distance);


        // display Make or Miss
        if (make_or_miss == true) {
            //console.log('Make');

            var shot = {'uid': user_number, 
                        'xShot': shot_x_coords, 
                        'yShot': shot_y_coords,
                        'shot_success': true,
                        'distance_pixels': shotDistance(hoop_x, hoop_y, shot_x, shot_y),
                        'points': shotPoints(shot_distance)};

            // Successful shot logo
            d3.select("#basketball_court").append('circle').attr('cx', shot_x_coords * svg_width).attr('cy', shot_y_coords * svg_height).attr('r', 15).attr('fill', 'green').attr("stroke","black").attr("stroke-width", 4);


        } else {
            //console.log('Miss');

            // instanciate shot object
            var shot = {'uid': user_number, 
                        'xShot': shot_x_coords, 
                        'yShot': shot_y_coords,
                        'shot_success': false,
                        'distance_pixels': shotDistance(hoop_x, hoop_y, shot_x, shot_y),
                        'points': 0};

            // UNsuccessful shot logo
            d3.select("#basketball_court").append('circle').attr('cx', shot_x_coords * svg_width).attr('cy', shot_y_coords * svg_height).attr('r', 15).attr('fill', 'red');

        }


        // Save shot into home/away team shot array
        shots[selected_team].push(shot);


        // log to console
		//console.log((e.pageX - posX) + ' , ' + (e.pageY - posY));
        console.log(shots);
	});


});
