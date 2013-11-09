var makeMiss = function() {
    var num = Math.floor(Math.random()*10);

    if ( num % 2 == 0 ) {
        return true;
    } else {
        return false;
    }
};


$(document).ready(function(e) {

    // Selected Player variable
    var selected_player = 'away_10';// CHANGE: dynamicallly set

    // svg dimensions
    var svg_width = $('#basketball_court').attr('width');
    var svg_height = $('#basketball_court').attr('height');

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

        var shot = {'uid': user_number, 
                    'xShot': shot_x_coords, 
                    'yShot': shot_y_coords,
                    'shot_success': makeMiss()};

        // Save shot into home/away team shot array
        var team = $('#' + selected_player).parent().attr('id');
        shots[team].push(shot);


        // display Make or Miss
        if (shot.shot_success == true) {
            console.log('Make');

        // Successful shot logo
        d3.select("#basketball_court").append('circle').attr('cx', shot_x_coords * svg_width).attr('cy', shot_y_coords * svg_height).attr('r', 15).attr('fill', 'green').attr("stroke","black").attr("stroke-width", 4);


        } else {
            console.log('Miss');

        // UNsuccessful shot logo
        d3.select("#basketball_court").append('circle').attr('cx', shot_x_coords * svg_width).attr('cy', shot_y_coords * svg_height).attr('r', 15).attr('fill', 'red');

        }


        // log to console
		//console.log((e.pageX - posX) + ' , ' + (e.pageY - posY));
        console.log(shots);
	});


});
