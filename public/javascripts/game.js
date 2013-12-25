var shotDistanceInPixels = function(x1, y1, x2, y2) {
    // returns a string in feet w/ 1 decimal place
    return Number(Math.sqrt(Math.pow((x1 - x2),2) + Math.pow((y1 - y2),2)).toFixed(1));
}

var pixelsToFeet = function(shotDistance) {
    multiplier = 6/72;
    return Number((multiplier * shotDistance).toFixed(1));
}

var shotPoints = function(shotDistance) {
    if (shotDistance > 266.0) {
        return 3;
    } else {
        return 2;
    }
}


var createRosterHtml = function(teamName, playersArray, homeAway) {
    var htmlString = '';
    var spacer = '&nbsp;-&nbsp;';

    // add team name
    htmlString += '<h2 class="team_roster_header">'+teamName+'</h2>';

    // add 'starters' header
    htmlString += '<h4 class="starters_header">Starters</h4>';

    // add all players
    htmlString += '<ul class="roster">';
    for (var i = 0; i < playersArray.length; i++) {
        
        if (playersArray[i].length == 1) {
            "&nbsp:".concat(spacer);
        }
        htmlString += '<li id="' + playersArray[i]['number'] + '">#';
        htmlString += '<span class="player_number">' + playersArray[i]['number'] + '</span>' + spacer;
        htmlString += '<span class="player_name">' + playersArray[i]['name'] + '</span>';
        htmlString += '</li>';
    }

    // finish html and return
    htmlString += '</div>';
    return htmlString;
}


var localStorageTeamsToHtml = function(teamNames) {
    var openDiv = "<div class='local_storage_team_container'><a href='#' class='local_storage_team'>";
    var closeDiv = "</a><a href='#' class='local_storage_delete'>delete</a></div>";
    var html = '';
    for (var i=0; i<teamNames.length; i++) {
        html += openDiv + teamNames[i] + closeDiv;
    }
    return html;
}


var populateInGamePlayers = function() {
    // grab players from away roster
    var awayPlayers = [];
    $("#away_roster ul li").slice(0, 5).each(function() {
        var player = {};
        player.name = $(this).find('.player_name').text();
        player.number = $(this).attr('id');
        awayPlayers.push(player);
    });

    // grab players from home roster
    var homePlayers = [];
    $("#home_roster ul li").slice(0, 5).each(function() {
        var player = {};
        player.name = $(this).find('.player_name').text();
        player.number = $(this).attr('id');
        homePlayers.push(player);
    });

    // populate away players in #game
    $("#"+ currentDirection.away +"_players_wrapper .player_border_container").each(function() {
        $(this).find('.player_number_wrapper').text('#' + awayPlayers.shift().number)
    })

    // populate home players in #game
    $("#"+ currentDirection.home +"_players_wrapper .player_border_container").each(function() {
        $(this).find('.player_number_wrapper').text('#' + homePlayers.shift().number)
    })

}


var highlightShotPoints = function(direction, points) {
    $("#" + direction + "_score_wrapper .recent_score").find('p').fadeIn(50).text('+' + points).fadeOut(2000);
}



$(document).ready(function(e) {


    //$("#rosters_container").hide();

    // Hide input buttons
    $("#game_review").hide();
    $("#game_input").hide();
    $("#substitute").hide();
    $("#timeout").hide();
    $("#start_game").hide();
    $("#resume_game").hide();

    // Hide #game div
    $("#game").hide();

/*
    $("#rosters_container").hide();
    $("#game").hide();
*/  


    // game reset
    var defaultSettings = { periods: '4', minutesPerPeriod: '8', overtimeMinutes: '4' }; // HS settings
    var gameSettings = { periods: '4', minutesPerPeriod: '8', overtimeMinutes: '4' };
    var gameReset = { period:'1', minutes:'8', seconds:'00' };

    // Teams object, away/home
    var teams = {};

    // Shots object, away/home
    var shots = { away: [], home: [] };

    // Free Throws object, away/home
    var freeThrows = { away: [], home: [] };

    // Scores
    var scores = { away: 0, home: 0, 
        '1': {away: 0, home: 0},
        '2': {away: 0, home: 0},
        '3': {away: 0, home: 0},
        '4': {away: 0, home: 0},
    };

    // Secondary stats (rebounds, assists, etc.), away/home
    var secondaryStats = { 
            away: {
                rebound: [],
                steal: [],
                assist: [],
                block: [],
                turnover: [],
                shooting_foul: [],
                non_shooting_foul: [],
                technical: [],
                flagrant: []
            }, 
            home: {
                rebound: [],
                steal: [],
                assist: [],
                block: [],
                turnover: [],
                shooting_foul: [],
                non_shooting_foul: [],
                technical: [],
                flagrant: []
            } 
        };

    // Attacking which hoop?
    currentDirection = {
        home: 'right',
        away: 'left',
        right: 'home',
        left: 'away'
    }

    // Submitted Rosters
    var rostersSubmitted = 0;

    // Selected Player
    var selectedPlayer = { team: '', number: '', direction: '' };

    // Test for double click (Shot) variables
    var DELAY = 225,
        clicks = 0,
        timer = null;

    // svg court dimensions
    var svgWidth = $('#basketball_court').attr('width'),
        svgHeight = $('#basketball_court').attr('height'),
        leftHoopX = 49,
        leftHoopY = 302,
        rightHoopX = 1086,
        rightHoopY = 302;



    // User adds team/players to roster and clicks save
    $(".save_players_form").on("click", function(e) {

        e.preventDefault();

        // if 2 teams are saved, show start game button
        rostersSubmitted += 1;

        // localStorage Object
        var teamObj = { players: [] };

        // determine which team (home or away) was saved
        var team = ($(this).closest('form').attr('id')).split('_')[0];

        // capture team name and validate it's not blank
        var teamName = $('#'+team+'_form .team_name input').val();

        if (teamName == '' || teamName == null) {
            alert('Please provide a name for the '+team+' team.');
            return;
        }


        // capture team abbrev and validate it's less than 4 chars
        var teamAbbreviation = $('#'+team+'_form .team_abbreviation input').val().toUpperCase();

        if (teamAbbreviation == '') {
            alert('Please provide an abbreviation for the '+team+' team.');
            return false;
        } else if (teamAbbreviation.length > 3) {
            alert('Please provide an abbreviation of 3 or less characters for the '+team+' team.');
            return false;
        }


        // valid player variables
        var validPlayers = true;
        var validPlayersCount = 0;
        var players = [];
        var numbers = [];

        // capture player objects, validate number, push into players array
        $('#'+team+'_form .form_player_add').each(function(ix, elem) {
            var i = $(elem).find('input');

            // if both number and name are blank, don't add ignore
            if (i[0].value.length == 0 && i[1].value.length == 0) {
                return;
            }

            // validate number is less than 100 and only 2 digits
            if (isNaN(parseInt(i[0].value)) || i[0].value.length > 2) {
                alert('Please provide a number for each '+team+' team player.');
                validPlayers = false;
                return false;
            }

            // push player object into players array
            players.push( { number: i[0].value, name: i[1].value } );

            // store number to validate each are unique
            numbers.push(i[0].value);

            validPlayersCount += 1;
        });


        // Sort the numbers so you can validate uniqueness
        var sortedNumbers = numbers.sort();

        // Validate each player's number is unique
        for (var i = 0; i < sortedNumbers.length-1; i++) {
            if (sortedNumbers[i + 1] == sortedNumbers[i]) {
                validPlayers = false;
                alert('Each '+team+' team player mush have a unique number');
                return false;
            }
        }


        // Save roster only if all validations passed
        if (validPlayers && validPlayersCount >= 5) {

            // save team name into teamObj
            teamObj.teamName = teamName;
            // save team abbreviation
            teamObj.teamAbbreviation = teamAbbreviation;
            // save players
            teamObj.players = players;
            // Store team in global teams var
            teams[team] = teamObj;

            // Store in localStorage
            if (typeof(Storage) !== "undefined") {
                teamsLocalStorage = JSON.parse(localStorage.getItem("teams"));
                // If doesn't exist
                if (teamsLocalStorage == null) {
                    teamsLocalStorage = [];
                    teamsLocalStorage.push(teamObj);
                    localStorage.setItem('teams', JSON.stringify(teamsLocalStorage));
                } else {
                    teamsLocalStorage.push(teamObj);
                    localStorage.setItem('teams', JSON.stringify(teamsLocalStorage));
                }
            }
            

            // Remove Form and display team
            $('#'+team+'_roster').empty();
            $('#'+team+'_roster').append(createRosterHtml(teams[team]['teamName'], teams[team]['players'], team));


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

            // show start_game button if both rosters are ready
            if (rostersSubmitted === 2) {
                $("#start_game").show();
            }

        } else {
            alert('Please provide at least 5 players.')
        }


    });



    // Retrieve Saved Teams from localStorage
    $(".saved_teams").one("click", function() {
        var roster = $(this).parent().parent().attr("id");
        var teamNames = [];
        var localStorageTeams;

        $(this).hide();

        // if browser supports localStorage
        if (typeof(Storage) !== "undefined") {

            localStorageTeams = JSON.parse(localStorage.getItem("teams"));

            // if teams exist
            if (localStorageTeams !== null) {

                for (var i=0; i < localStorageTeams.length; i++) {
                    teamNames.push(localStorageTeams[i]['teamName']);
                }

                // Create links with each team name
                var html = localStorageTeamsToHtml(teamNames);

                // insert into .saved_teams div
                $('#'+ roster +' .local_storage_teams').append(html);

            // if teams don't exist (ile. first time visiting site)
            } else {

                // Seed with 1996 NBA Finals Teams
                var defaultTeams = ["Chicago Bulls", "Seattle SuperSonics"];
                var defaultLocalStorageTeams = [{'players':[{'number':'9','name':'Ron Harper'},{'number':'23','name':'Michael Jordan'},{'number':'33','name':'Scottie Pippen'},{'number':'7','name':'Toni Kukoc'},{'number':'91','name':'Dennis Rodman'},{'number':'0','name':'Randy Brown'},{'number':'30','name':'Jud Buechler'},{'number':'35','name':'Jason Caffey'},{'number':'53','name':'James Edwards'},{'number':'54','name':'Jack Haley'},{'number':'25','name':'Steve Kerr'},{'number':'13','name':'Luc Longley'},{'number':'22','name':'John Salley'},{'number':'8','name':'Dickey Simpkins'},{'number':'34','name':'BillWennington'}],'teamName':'Chicago Bulls','teamAbbreviation':'CHI'},{'players':[{'number':'20','name':'Gary Payton'},{'number':'33','name':'Hershey Hawkins'},{'number':'11','name':'Detlef Schrempf'},{'number':'40','name':'Shawn Kemp'},{'number':'50','name':'Ervin Johnson'},{'number':'2','name':'Vincent Askew'},{'number':'34','name':'Frank Brickowski'},{'number':'1','name':'Sherrell Ford'},{'number':'10','name':'Nate McMillan'},{'number':'14','name':'Sam Perkins'},{'number':'55','name':'Steve Scheffler'},{'number':'3','name':'Eric Snow'},{'number':'25','name':'David Wingate'}],'teamName':'Seattle SuperSonics','teamAbbreviation':'SEA'}];

                // Save them to localStorage
                localStorage.setItem('teams', JSON.stringify(defaultLocalStorageTeams));

                // Create links with each team name
                var html = localStorageTeamsToHtml(defaultTeams);

                // insert into .saved_teams div
                $('#'+ roster +' .local_storage_teams').append(html);


                //$('#'+ roster +' .local_storage_teams').append("<div>No Teams Available</div>");
            }

        } else {
            $('#'+ roster +' .local_storage_teams').append("<div>Upgrade your browser</div>");
        }

    });


    // Populate roster from localStorage
    $('.local_storage_teams').on("click", ".local_storage_team", function(e) {

        rostersSubmitted += 1;

        var teamName = $(this).html();
        //console.log(teamName);

        // determine which roster
        var roster = $(this).parent().parent().parent().attr('id');

        var homeAway = roster.split('_')[0]

        var teamObj = { players: [] };
        teamObj.teamName = teamName;

        // find team in localStorage
        var localStorageTeams = JSON.parse(localStorage.getItem("teams"));

        for (var i=0; i < localStorageTeams.length; i++) {
            if (teamName === localStorageTeams[i]['teamName']) {
                teamObj.players = localStorageTeams[i]['players'];
                teamObj.teamAbbreviation = localStorageTeams[i]['teamAbbreviation'];
            }
        }

        // store teamObj into global teams
        teams[homeAway] = teamObj;

        // Remove Form and display team roster
        $('#'+roster).empty();
        $('#'+roster).append(createRosterHtml(teamObj.teamName, teamObj.players, homeAway));


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


        // show start_game button if both rosters are ready
        if (rostersSubmitted === 2) {
            $("#start_game").show();
        }

    });


    // Add new player to Roster
    $('.players_input_container').on("click", ".new_player", function(e) {
        
        var newPlayerHtml = '<div class="form_player_add"><label>Number&nbsp;</label><input type="text" placeholder="50" size="2"></input><label>&nbsp;Name&nbsp;</label><input type="text" placeholder="John Doe" size="15"></input><button type="button" class="new_player">+Player</button></div>';

        // Form to add new input field
        var homeAwayForm = $(this).parent().parent();

        // remove button from last player
        homeAwayForm.children().last().children().last().remove();

        // add new player input field along w/ new_player button
        homeAwayForm.append(newPlayerHtml);

        // place cursor in new player field
        homeAwayForm.children().last().children().eq(1).focus();
        

    });


    // Delete team from localStorage
    $(".local_storage_teams").on("click", ".local_storage_delete", function(e) {

        e.preventDefault();
        var breakCheck = false;

        // grab teamName
        var teamName = $(this).siblings().html();

        // remove team from localStorage object
        var teams = JSON.parse(localStorage.getItem("teams"));

        for (var i=0; i < teams.length; i++) {
            if (teamName === teams[i]['teamName']) {
                teams.splice(i, 1)
                breakCheck = true;
            }
            if (breakCheck) { break; }
        }

        // save new teams object to localStorage
        if (teams.length >= 1) {
            localStorage.setItem('teams', JSON.stringify(teams));
        // or delete it if there are no teams
        } else {
            localStorage.removeItem('teams');
        }

        // hide that team
        $(this).parent().hide();

    });



    // Start Game
    $('#start_resume_button_container').on("click", "#start_game", function(e) {

        e.preventDefault();

        // instantiate gameReset object
        gameReset.period = $("#quarter_buttons .button_selected").attr('id');
        gameReset.minutes = $("#minutes").val();
        gameReset.seconds = $("#seconds").val();
        console.log(gameReset);


        // show court and hide roster view
        $("#rosters_container").hide();
        $("#game").show();

        // show buttons in 
        $("#game_review").show();
        $("#game_input").show();
        $("#substitute").show();
        $("#timeout").show();

        // populate team name abbreviations
        $("#left_score_wrapper .team_name_abbrev").children().text(teams[currentDirection.left].teamAbbreviation);
        $("#right_score_wrapper .team_name_abbrev").children().text(teams[currentDirection.right].teamAbbreviation);

        // populate in-game players from roster
        populateInGamePlayers();

        // hide start game button
        $("#start_game").hide();

        // hide settings button
        $("#settings").hide();

        // show resume game button
        $("#resume_game").show();

    });


    // Click on Player, add selected class
    $(".players_wrapper").on("click", ".player_border_container", function(e) {

        // Remove hidden & selected class (i.e. click 2 diff players consec)
        $(".player_border_container").each(function() {
            $(this).removeClass("hidden").removeClass("selected");
        });

        // Blur other players
        $(".player_border_container").each(function() {
            $(this).addClass("hidden");
        });

        // Only show player that was selected
        $(this).removeClass("hidden").addClass("selected");


        // Update selectedPlayer obj
        selectedPlayer.direction = $(this).parent().parent().attr('id').split('_')[0];
        selectedPlayer.team = currentDirection[selectedPlayer.direction];
        selectedPlayer.number = $(this).children().last().html().substring(1);

        //console.log(selectedPlayer);


    });


    // Click on SVG to input shot location
    $('#basketball_court').on('click', function(e) {

        // If a player is selected
        if (selectedPlayer.team.length > 0 && selectedPlayer.number.length > 0) {

            clicks++;

            var shotSuccess = false;

            // Remove hidden & selected class
            $(".player_border_container").each(function() {
                $(this).removeClass("hidden").removeClass("selected");
            });

            // Get top-left position of parent in relation to window
            var posX = $(this.parentNode).offset().left;
            var posY = $(this.parentNode).offset().top;

            // shot location relative to top-left of court
            var shotX = e.pageX - posX;
            var shotY = e.pageY - posY;

            // create initial missed shot marker
            $('#basketball_court').trigger("placeMarker", [shotSuccess, selectedPlayer.team, selectedPlayer.number, shotX, shotY]);
            console.log('inital marker');


            // If 1 click => Miss
            if (clicks === 1) {
                timer = setTimeout(function() {
                    
                    // reset clicks counter
                    clicks = 0;


                    console.log("Miss: " + selectedPlayer.team + ' #' + selectedPlayer.number);


                    // save missed shot
                    $('#basketball_court').trigger("saveShot", [shotSuccess, selectedPlayer.team, selectedPlayer.number, selectedPlayer.direction, shotX, shotY]);

                    // reset selectedPlayer
                    selectedPlayer.number = ''; selectedPlayer.team = ''; selectedPlayer.direction = '';
                
                }, DELAY);

            // else 2 clicks => Make
            } else {

                // reset timer
                clearTimeout(timer);

                // reset clicks counter
                clicks = 0;

                // mark shot as successful
                shotSuccess = true;
                

                console.log("Make: " + selectedPlayer.team + ' #' + selectedPlayer.number);


                // place successful marker over inital missed marker
                $('#basketball_court').trigger("placeMarker", [shotSuccess, selectedPlayer.team, selectedPlayer.number, shotX, shotY]);

                // save made shot, then update widget
                $('#basketball_court').trigger("saveShot", [shotSuccess, selectedPlayer.team, selectedPlayer.number, selectedPlayer.direction, shotX, shotY]);

                // reset selectedPlayer
                selectedPlayer.number = ''; selectedPlayer.team = ''; selectedPlayer.direction = '';
            }

        }

    })
    .on("dblclick", function(e) {
        // cancel system double click event
        e.preventDefault();
    });



    // place shot marker, shot already saved
    $("#basketball_court").on('placeMarker', function(e, shotSuccess, team, number, shotX, shotY) {
        e.preventDefault();

        // if the shot was successful
        if (shotSuccess) {

            // place successful shot marker
            d3.select("#basketball_court").append('circle').attr('cx', shotX).attr('cy', shotY).attr('r', 15).attr('fill', 'green').attr("stroke","black").attr("stroke-width", 4).attr('opacity', 1).attr('class', 'shot');

        // missed shot
        } else {

            // place missed shot marker
            d3.select("#basketball_court").append('circle').attr('cx', shotX).attr('cy', shotY).attr('r', 15).attr('fill', 'red').attr('opacity', 1).attr('class', 'shot');
        }


    });


    // save shot, then update score widget if it was successful
    $("#basketball_court").on("saveShot", function(e, shotSuccess, team, number, direction, shotX, shotY) {

        e.preventDefault();


        // determine shot distance
        if (direction == 'right') {
            // Determine length of shot
            var shotDistancePixels = shotDistanceInPixels(rightHoopX, rightHoopY, shotX, shotY);
            var shotDistanceFeet = pixelsToFeet(shotDistancePixels);
        } else {
            // Determine length of shot
            var shotDistancePixels = shotDistanceInPixels(leftHoopX, leftHoopY, shotX, shotY);
            var shotDistanceFeet = pixelsToFeet(shotDistancePixels);
        }

        // save shot to shots object
        shots[team].push( { 
            'playerNumber': parseInt(number),
            'shotSuccess': shotSuccess,
            'distanceFeet': shotDistanceFeet,
            'points': shotPoints(shotDistancePixels),
            'direction': direction,
            'shotX': shotX,
            'shotY': shotY,
            'quarter': parseInt(gameReset.period),
            'time': ''.concat(gameReset.minutes, ':', gameReset.seconds)
        } );

        // update 


        // if shot was successful
        if (shotSuccess) {

            // update score widget
            $('#basketball_court').trigger('updateScore', [direction, shotPoints(shotDistancePixels)])

        }


        console.log(shots);

    });

    
    // update score
    $("#basketball_court").on("updateScore", function(e, direction, points) {

        e.preventDefault();

        // update input score widget
        var previousScore = parseInt( $('#'+direction+'_team_score').text() );
        $("#"+direction+"_team_score").html( previousScore + points );

        // highlight how many points the shot was worth
        highlightShotPoints(direction, points);

        // update global score var
        scores[currentDirection[direction]] += points;
        scores[gameReset.period][currentDirection[direction]] += points

        // update the review_summary for current quarter
        $("#review_scores #"+ currentDirection[direction] +" #"+gameReset.period).text(scores[gameReset.period][currentDirection[direction]]);

        // update the review_summary final score
        $("#review_scores #"+ currentDirection[direction] +" #F").text(scores[currentDirection[direction]]);        


        console.log(scores[gameReset.period][currentDirection[direction]]);
        console.log(currentDirection[direction]);
        console.log(gameReset.period);

    });



    //
    $("#game_input_buttons").on("click", "button", function(e) {

        // If a player is selected
        if (selectedPlayer.team.length > 0 && selectedPlayer.number.length > 0) {

            // unfade player_border_container's
            $('.player_border_container').each(function() { 
                $(this).removeClass('selected').removeClass('hidden');
            })

            // highlight button briefly to indicate successful save
            $(this).effect("highlight", {color: "009933"}, 400);

            // Which stat did they select
            var secondaryStat = $(this).attr('id');

            // Save stat
            secondaryStats[selectedPlayer.team][secondaryStat].push( 
                { 
                    'playerNumber': parseInt(selectedPlayer.number), 
                    'quarter': parseInt(gameReset.period),
                    'time': ''.concat(gameReset.minutes, ':', gameReset.seconds) 
                }
            );

            // reset selectedPlayer
            selectedPlayer.number = ''; selectedPlayer.team = ''; selectedPlayer.direction = '';


            console.log(secondaryStats);


        // no player is selected
        } else {

            // highlight button briefly to indicate UNsuccessful save
            $(this).effect("highlight", {color: "FF0000"}, 400);
            
        }


    });



    // Clicking on Foul drop-down menu
    $("#foul").on("click", function(e) {
    
        // If a player is selected
        if (selectedPlayer.team.length > 0 && selectedPlayer.number.length > 0) {

            // unfade player_border_container's
            $('.player_border_container').each(function() { 
                $(this).removeClass('selected').removeClass('hidden');
            })

            // highlight button briefly to indicate successful save
            $(this).effect("highlight", {color: "009933"}, 400);

            // Which foul did they choose?
            var secondaryStat = $('#foul').val();

            // Save stat
            secondaryStats[selectedPlayer.team][secondaryStat].push( 
                { 
                    'playerNumber': parseInt(selectedPlayer.number), 
                    'quarter': parseInt(gameReset.period),
                    'time': ''.concat(gameReset.minutes, ':', gameReset.seconds) 
                }
            );

            // revert Foul drop-down to default value
            $('#foul').val('');

            // reset selectedPlayer
            selectedPlayer.number = ''; selectedPlayer.team = ''; selectedPlayer.direction = '';
                  

            console.log(secondaryStats);


        // no player is selected
        } else {

            // revert Foul drop-down to default value
            $('#foul').val('');

            // highlight button briefly to indicate UNsuccessful save
            $(this).effect("highlight", {color: "FF0000"}, 400);
        }

    });


    // Clicking on the Free Throw drop-down menu
    $("#free_throw").on("click", function(e) {

        // If a player is selected
        if (selectedPlayer.team.length > 0 && selectedPlayer.number.length > 0) {

            // unfade player_border_container's
            $('.player_border_container').each(function() { 
                $(this).removeClass('selected').removeClass('hidden');
            })

            // highlight button briefly to indicate successful save
            $(this).effect("highlight", {color: "009933"}, 400);

            // Which foul did they choose?
            var points = $('#free_throw').val();

            // Determine if shot was success
            var shotSuccess;
            if (points === '1') {

                shotSuccess = true;

                // update score widget
                $('#basketball_court').trigger('updateScore', [selectedPlayer.direction, 1])

            } else {
                shotSuccess = false;
            }


            // save free throw
            freeThrows[selectedPlayer.team].push(
                {   
                    'playerNumber': parseInt(selectedPlayer.number),
                    'shotSuccess': shotSuccess,
                    'points': parseInt(points),
                    'direction': selectedPlayer.direction,
                    'quarter': parseInt(gameReset.period),
                    'time': ''.concat(gameReset.minutes, ':', gameReset.seconds) 
                }
            );

            // revert Free Throw drop-down to default value
            $('#free_throw').val('');

            // reset selectedPlayer
            selectedPlayer.number = ''; selectedPlayer.team = ''; selectedPlayer.direction = '';
                  

            console.log(freeThrows);


        // no player is selected
        } else {

            // revert Free Throw drop-down to default value
            $('#free_throw').val('');

            // highlight button briefly to indicate UNsuccessful save
            $(this).effect("highlight", {color: "FF0000"}, 400);
        }

    });


    // Sub in new players
    $('header').on("click", "#substitute", function(e) {

        // show roster
        $("#rosters_container").show();

        // hide game
        $("#game").hide();

        // remove button_class from all header buttons
        $("header button").each(function() {
            $(this).removeClass('button_selected');
        });

        // highlight this button
        $(this).addClass('button_selected');



    });


    // Return to game input view
    $("header").on("click", "#game_input", function(e) {

        e.preventDefault();

        // update team abbreviations
        $("#left_score_wrapper .team_name_abbrev").children().text(teams[currentDirection.left].teamAbbreviation);
        $("#right_score_wrapper .team_name_abbrev").children().text(teams[currentDirection.right].teamAbbreviation);
        
        // update team scores
        $("#left_team_score").text(scores[currentDirection.left]);
        $("#right_team_score").text(scores[currentDirection.right]);

        // update players in the game
        populateInGamePlayers();

        // update time/quarter
        gameReset.period = $("#quarter_buttons .button_selected").attr('id');
        gameReset.minutes = $("#minutes").val();
        gameReset.seconds = $("#seconds").val();
        console.log(gameReset);


        // hide roster
        $("#rosters_container").hide();

        // show game input view
        $("#game").show();

        // remove button_class from all header buttons
        $("header button").each(function() {
            $(this).removeClass('button_selected');
        });

        // highlight input button
        $("#game_input").addClass('button_selected');

    });


    // Return to game input view
    $("#rosters_container").on("click", "#resume_game", function(e) {

        e.preventDefault();

        // update team abbreviations
        $("#left_score_wrapper .team_name_abbrev").children().text(teams[currentDirection.left].teamAbbreviation);
        $("#right_score_wrapper .team_name_abbrev").children().text(teams[currentDirection.right].teamAbbreviation);

        // update team scores
        $("#left_team_score").text(scores[currentDirection.left]);
        $("#right_team_score").text(scores[currentDirection.right]);


        // update players in the game
        populateInGamePlayers();

        // update time/quarter
        gameReset.period = $("#quarter_buttons .button_selected").attr('id');
        gameReset.minutes = $("#minutes").val();
        gameReset.seconds = $("#seconds").val();
        console.log(gameReset);

        // hide roster
        $("#rosters_container").hide();

        // show game input view
        $("#game").show();

        // remove button_class from all header buttons
        $("header button").each(function() {
            $(this).removeClass('button_selected');
        });

        // highlight input button
        $("#game_input").addClass('button_selected');

    });


    $("#quarter_minutes").on("click", "button", function(e) {

        // remove button_selected class
        $("#quarter_minutes button").each(function() {
            $(this).removeClass('button_selected');
        });

        // add button_selected class
        $(this).addClass('button_selected');


        // click next quarter, reset time to 8:00
        var newPeriod = $("#quarter_buttons .button_selected").attr('id');
        if ( parseInt(newPeriod) === parseInt(gameReset.period) + 1 ) {
            
            // reset minutes
            $("#minutes").val(gameSettings.minutesPerPeriod);
            
            // reset seconds
            $("#seconds").val('00');
            
        }

    });


    $("#home_direction").on("click", "button", function(e) {

        e.preventDefault();

        // remove button_selected class
        $("#home_direction button").each(function() {
            $(this).removeClass('button_selected');
        });

        // add button_selected class
        $(this).addClass('button_selected');

        // update currentDirections object
        var newDirection = $(this).attr('id');
        
        // if home team is going right
        if (newDirection === 'right') {

            // update the currentDirection object
            currentDirection.home = 'right';
            currentDirection.away = 'left';
            currentDirection.right = 'home';
            currentDirection.left = 'away';

            // float the away roster to the left
            $("#away_roster").removeClass('float_away_roster_right');

        } else {

            // update the currentDirection object
            currentDirection.home = 'left';
            currentDirection.away = 'right';
            currentDirection.right = 'away';
            currentDirection.left = 'home';

            // float the away roster to the right
            $("#away_roster").addClass('float_away_roster_right');
        }


        // Remove previous shots from SVG
        $("#basketball_court").find('circle').each(function() {
            if ($(this).attr('class') === 'shot') {
                $(this).remove();
            }
        });

    });


    // Settings accordian
    $( "#settings" ).accordion({
      collapsible: true,
      active: false
    });

    // Add button_selected class to button user clicks
    $("#periods_container").on("click", "button", function(e) {
        e.preventDefault();

        // remove button_selected class
        $("#periods_container button").each(function() {
            $(this).removeClass('button_selected');
        });

        // add button_selected class
        $(this).addClass('button_selected');


    });

    // Saving settings
    $("#save_settings").on("click", "button", function(e) {
        e.preventDefault();

        var periods;

        // capture periods
        $("#periods_container button").each(function() {
            if ( $(this).attr('class') == 'button_selected' ) {
                periods = $(this).attr('id');
            }
        });

        // capture minutes per period
        var minutesPerPeriod = $("#settings_minutes").val();

        // capture OT minutes
        var overtimeMinutes = $("#settings_overtime").val();

        // update quarter_minutes UI
        $("#quarter_minutes").trigger("updateSettings", [periods, minutesPerPeriod, overtimeMinutes]);

        // collapse accordion
        $("#settings").accordion('option', 'active', false);

    });

    $("#quarter_minutes").on("updateSettings", function(e, periods, minutesPerPeriod, overtimeMinutes) {
        e.preventDefault();

        // update gameSettings for this current game, leave defaultGameSettings alone
        gameSettings.periods = periods;
        gameSettings.minutesPerPeriod = minutesPerPeriod;
        gameSettings.overtimeMinutes = overtimeMinutes;

        // if they chose 2 periods, remove 3rd and 4th quarter buttons
        if (periods !== defaultSettings.periods) {
            $("#quarter_buttons #3").remove()
            $("#quarter_buttons #4").remove()
        }

        // if they changed the default minutes
        if (minutesPerPeriod !== defaultSettings.minutesPerPeriod) {

            // Add addition minute options above 8
            if (parseInt(minutesPerPeriod) > parseInt(defaultSettings.minutesPerPeriod)) {

                // prepend minute options
                for (var i = 9; i <= parseInt(minutesPerPeriod); i++) {
                    $("#minutes").prepend("<option>"+i.toString()+"</option>");
                }

                // set largest as default option
                $('#minutes').val(minutesPerPeriod);

            // Remove minutes above new minutesPerPeriod
            } else {

                // remove options if minutesPerPeriod below 8
                for (var i = 8; i > minutesPerPeriod; i--) {
                    $("#minutes option").each(function() {
                        if ($(this).val() == parseInt(i)) {
                            $(this).remove();
                        }
                    });
                }

                // set minutesPerPeriod as default in dropdown
                $("#minutes").val(minutesPerPeriod);

            }

        }

        // Nothing to change for OT minutes

    });



    // Clicking "Review" button



    // Clicking a review tab
    $("#review_tabs").on("click", "div", function(e) {
        e.preventDefault();

        // Remove tab_selected class, add tab class
        $("#review_tabs div").each(function() {
            $(this).removeClass('tab_selected').addClass('tab');
        });

        // Add tab_selected class, remove tab class
        $(this).addClass('tab_selected').removeClass('tab');


        // Hide review divs
        $("#review_views_container div").each(function() {
            $(this).hide()
        });

        // Show this div
        var tabId = $(this).find('span').text().replace(' ','_').toLowerCase();
        $("#review_"+tabId).show();



    });



 

/*
    // Alert user before reloading/leaving page
    $(window).bind('beforeunload', function(){

        return 'Are you sure you want to leave?';

    });
*/

});
