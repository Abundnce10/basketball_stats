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
        player.number = $(this).attr('id');
        var name = $(this).find('.player_name').text();
        var names = name.split(' ');
        var lastName = names[names.length - 1];

        // short name, if necessary
        if (lastName.length > 9) {
            player.name = lastName.substring(0,9);
        } else {
            player.name = lastName;    
        }

        awayPlayers.push(player);
    });

    // grab players from home roster
    var homePlayers = [];
    $("#home_roster ul li").slice(0, 5).each(function() {
        var player = {};
        player.number = $(this).attr('id');
        var name = $(this).find('.player_name').text();
        var names = name.split(' ');
        var lastName = names[names.length - 1];

        // short name, if necessary
        if (lastName.length > 9) {
            player.name = lastName.substring(0,9);
        } else {
            player.name = lastName;    
        }

        homePlayers.push(player);
    });

    // populate away players in #game
    $("#"+ currentDirection.away +"_players_wrapper .player_border_container").each(function() {
        
        var player = awayPlayers.shift();

        // populate name
        $(this).find('.player_name').text(player.name);

        // populate number
        $(this).find('.player_number_wrapper').text('#' + player.number);

    })

    // populate home players in #game
    $("#"+ currentDirection.home +"_players_wrapper .player_border_container").each(function() {
        var player = homePlayers.shift();

        // populate name
        $(this).find('.player_name').text(player.name);

        // populate number
        $(this).find('.player_number_wrapper').text('#' + player.number);
    })

}


var highlightShotPoints = function(direction, points) {
    $("#" + direction + "_score_wrapper .recent_score").find('p').fadeIn(50).text('+' + points).fadeOut(2000);
}


var reviewSummaryTableToPercentage = function(made, missed) {
    if (missed != 0) {
        return (made/missed * 100.0).toFixed(1) + "%";
    } else {
        return "-%";
    }
}


var populateBoxScore = function() {

    var boxScore = {
        away: {
            total: {
                MIN: 0,
                FGM: 0,
                FGA: 0,
                '3PM': 0,
                '3PA': 0,
                FTM: 0,
                FTA: 0,
                REB: 0,
                AST: 0,
                STL: 0,
                BLK: 0,
                TO: 0,
                PF: 0,
                PTS: 0            
            }
        },
        home: {
            total: {
                MIN: 0,
                FGM: 0,
                FGA: 0,
                '3PM': 0,
                '3PA': 0,
                FTM: 0,
                FTA: 0,
                REB: 0,
                AST: 0,
                STL: 0,
                BLK: 0,
                TO: 0,
                PF: 0,
                PTS: 0            
            }
        }
    };

    // populate away start players
    $("#away_roster ul li").slice(0, 5).each(function() {
        
        var name = $(this).find('.player_name').text();
        var number = $(this).attr('id');
        
        var trClass = 'starter';
        var openHTML = '<tr class="'+ trClass +'" id="'+ number +'"><td class="player_name">';
        var closeHTML = '</td><td>0</td><td>0-0</td><td>0-0</td><td>0-0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td></tr>';

        var finalHTML = "".concat(openHTML, name, ', ', number, closeHTML);

        // insert into table
        $("#away_box_score .players_starters tbody").append(finalHTML);

        // Add player into global boxScore obj
        boxScore.away[number] = {
            name: name,
            MIN: 0,
            FGM: 0,
            FGA: 0,
            '3PM': 0,
            '3PA': 0,
            FTM: 0,
            FTA: 0,
            REB: 0,
            AST: 0,
            STL: 0,
            BLK: 0,
            TO: 0,
            PF: 0,
            PTS: 0            
        };

    });


    // populate away bench players
    $("#away_roster ul li").slice(5).each(function() {
        
        var name = $(this).find('.player_name').text();
        var number = $(this).attr('id');
        
        var trClass = 'bench';
        var openHTML = '<tr class="'+ trClass +'" id="'+ number +'"><td class="player_name">';
        var closeHTML = '</td><td>0</td><td>0-0</td><td>0-0</td><td>0-0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td></tr>';

        var finalHTML = "".concat(openHTML, name, ', ', number, closeHTML);

        // insert into table
        $("#away_box_score .players_bench tbody").append(finalHTML);

        // Add player into global boxScore obj
        boxScore.away[number] = {
            name: name,
            MIN: 0,
            FGM: 0,
            FGA: 0,
            '3PM': 0,
            '3PA': 0,
            FTM: 0,
            FTA: 0,
            REB: 0,
            AST: 0,
            STL: 0,
            BLK: 0,
            TO: 0,
            PF: 0,
            PTS: 0            
        };

    });


    // populate home start players
    $("#home_roster ul li").slice(0, 5).each(function() {
        
        var name = $(this).find('.player_name').text();
        var number = $(this).attr('id');

        var trClass = 'starter';
        var openHTML = '<tr class="'+ trClass +'" id="'+ number +'"><td class="player_name">';
        var closeHTML = '</td><td>0</td><td>0-0</td><td>0-0</td><td>0-0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td></tr>';

        var finalHTML = "".concat(openHTML, name, ', ', number, closeHTML);

        // insert into table
        $("#home_box_score .players_starters tbody").append(finalHTML);

        // Add player into global boxScore obj
        boxScore.home[number] = {
            name: name,
            MIN: 0,
            FGM: 0,
            FGA: 0,
            '3PM': 0,
            '3PA': 0,
            FTM: 0,
            FTA: 0,
            REB: 0,
            AST: 0,
            STL: 0,
            BLK: 0,
            TO: 0,
            PF: 0,
            PTS: 0            
        };

    });

    // populate home bench players
    $("#home_roster ul li").slice(5).each(function() {
        
        var name = $(this).find('.player_name').text();
        var number = $(this).attr('id');
        
        var trClass = 'bench';
        var openHTML = '<tr class="'+ trClass +'" id="'+ number +'"><td class="player_name">';
        var closeHTML = '</td><td>0</td><td>0-0</td><td>0-0</td><td>0-0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td></tr>';

        var finalHTML = "".concat(openHTML, name, ', ', number, closeHTML);

        // insert into table
        $("#home_box_score .players_bench tbody").append(finalHTML);

        // Add player into global boxScore obj
        boxScore.home[number] = {
            name: name,
            MIN: 0,
            FGM: 0,
            FGA: 0,
            '3PM': 0,
            '3PA': 0,
            FTM: 0,
            FTA: 0,
            REB: 0,
            AST: 0,
            STL: 0,
            BLK: 0,
            TO: 0,
            PF: 0,
            PTS: 0            
        };

    });

    
    return boxScore;

}


var madeAttemptedToHtml = function(made, attempted) {
    return "".concat(made.toString(), "-", attempted.toString());
}




$(document).ready(function(e) {


    // Hide input buttons
    $("#game_review").hide();
    $("#game_input").hide();
    $("#substitute").hide();
    $("#undo").hide();
    //$("#timeout").hide();
    $("#start_game").hide();
    $("#resume_game").hide();

    // Hide #game div
    $("#game").hide();

    // Hide #review div
    $("#review").hide();

    // Hide other review tabs
    $("#review_box_score").hide();
    $("#review_shot_chart").hide();
    $("#review_play-by-play").hide();


/*
    $("#rosters_container").hide();
    $("#game").hide();
    $("#review_summary").hide();
    $("#review_box_score").hide();
*/


    // game reset
    var defaultSettings = { periods: '4', minutesPerPeriod: '8', overtimeMinutes: '4' }; // HS settings
    var gameSettings = { periods: '4', minutesPerPeriod: '8', overtimeMinutes: '4' };
    var gameReset = { period:'1', minutes:'8', seconds:'00' };

    // Teams object, away/home
    var teams = {};

    // Shots object, away/home
    var shots = { away: [], home: [] };

    // FGs, 3PTs, FTs
    var shotCounter = {
        away: {
            FGM: 0,
            FGA: 0,
            '3PM': 0,
            '3PA': 0,
            FTM: 0,
            FTA: 0
        },
        home: {
            FGM: 0,
            FGA: 0,
            '3PM': 0,
            '3PA': 0,
            FTM: 0,
            FTA: 0
        }
    };

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

    //
    var statAbbreiationLookup = {    
            rebound: "REB",
            steal: "STL",
            assist: "AST",
            block: "BLK",
            turnover: "TO"
    };

    // 
    var statIndexLookup = {
            rebound: 5,
            assist: 6,
            steal: 7,
            block: 8,
            turnover: 9
    };

    // Box Score aggregator variable
    var boxScore;

    // Recent Stats array, allow for undu of recent actions
    var recentStats = [];

    // Global counter for each stat
    var statId = 1;

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
        $("#undo").show();
        //$("#timeout").show();

        // populate team name abbreviations
        $("#left_score_wrapper .team_name_abbrev").children().text(teams[currentDirection.left].teamAbbreviation);
        $("#right_score_wrapper .team_name_abbrev").children().text(teams[currentDirection.right].teamAbbreviation);

        // populate in-game players from roster
        populateInGamePlayers();

        // populate team names in review_summary tables
        $("#review_scores #away td").first().text(teams.away.teamAbbreviation);
        $("#review_scores #home td").first().text(teams.home.teamAbbreviation);
        $("#review_game_stats #away td").first().text(teams.away.teamAbbreviation);
        $("#review_game_stats #home td").first().text(teams.home.teamAbbreviation);

        // populate team name in review_box_score tables
        $("#review_box_score #away_team_name").text(teams.away.teamName);
        $("#review_box_score #home_team_name").text(teams.home.teamName);

        // populate review_box_score tables & boxScore obj
        boxScore = populateBoxScore();

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
            d3.select("#basketball_court").append('circle')
                .attr('cx', shotX)
                .attr('cy', shotY)
                .attr('r', 15)
                .attr('fill', 'green')
                .attr("stroke","black")
                .attr("stroke-width", 4)
                .attr('opacity', 1)
                .attr('class', 'shot')
                .attr('id', statId);

        // missed shot
        } else {

            // place missed shot marker
            d3.select("#basketball_court").append('circle')
                .attr('cx', shotX)
                .attr('cy', shotY)
                .attr('r', 15)
                .attr('fill', 'red')
                .attr('opacity', 1)
                .attr('class', 'shot')
                .attr('id', statId);
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
            'time': ''.concat(gameReset.minutes, ':', gameReset.seconds),
            'statId': statId
        } );

        console.log("shots");
        console.log(JSON.stringify(shots));

        // add shot/stat to recentStats array
        recentStats.push({
            statId: statId,
            objectType: 'shots',
            team: team,
            playerNumber: number,
            shotSuccess: shotSuccess
        });

        // increment statId
        statId += 1;


        // if shot was successful
        if (shotSuccess) {

            // update score widget
            $('#basketball_court').trigger('updateScore', [direction, shotPoints(shotDistancePixels), number])

            // update shotCounter obj (FGM/FGA), update review_summary table
            shotCounter[team]["FGM"] += 1;
            shotCounter[team]["FGA"] += 1;

            // update review_summary table
            $("#review_game_stats #"+ team +" #FG").text(reviewSummaryTableToPercentage(shotCounter[team]["FGM"], shotCounter[currentDirection[direction]]["FGA"]));

            // update boxScore obj (team/indiv.)
            boxScore[team]['total']['FGM'] += 1;
            boxScore[team]['total']['FGA'] += 1;
            boxScore[team][number]['FGM'] += 1;
            boxScore[team][number]['FGA'] += 1;

            // update box_score table
            $("#review_box_score #"+ team +"_box_score #summary").children().eq(2).text(madeAttemptedToHtml(boxScore[team]['total']['FGM'], boxScore[team]['total']['FGA']))
            $("#review_box_score #"+ team +"_box_score #"+number).children().eq(2).text(madeAttemptedToHtml(boxScore[team][number]['FGM'], boxScore[team][number]['FGA']));

    
            // if 3pt, update shotCounter (3PM/3PA), update table
            if (shotPoints(shotDistancePixels) == 3) {
                
                // update shotCounter obj
                shotCounter[team]["3PM"] += 1;
                shotCounter[team]["3PA"] += 1;

                // update review_summary table
                $("#review_game_stats #"+ team +" #3PT").text(reviewSummaryTableToPercentage(shotCounter[team]["3PM"], shotCounter[team]["3PA"]));

                // update boxScore obj (team/indiv.)
                boxScore[team]['total']['3PM'] += 1;
                boxScore[team]['total']['3PA'] += 1;
                boxScore[team][number]['3PM'] += 1;
                boxScore[team][number]['3PA'] += 1;

                // update box_score table (team/indiv.)
                $("#review_box_score #"+ team +"_box_score #summary").children().eq(3).text(madeAttemptedToHtml(boxScore[team]['total']['3PM'], boxScore[team]['total']['3PA']));
                $("#review_box_score #"+ team +"_box_score #"+number).children().eq(3).text(madeAttemptedToHtml(boxScore[team][number]['3PM'], boxScore[team][number]['3PA']));

            }


        // missed shot
        } else {

            // update shotCounter obj (FGA), update review_summary table
            shotCounter[team]["FGA"] += 1;

            // update review_summary table
            $("#review_game_stats #"+ team +" #FG").text(reviewSummaryTableToPercentage(shotCounter[team]["FGM"], shotCounter[team]["FGA"]));


            // update boxScore obj (team/indiv.)
            boxScore[team]['total']['FGA'] += 1;
            boxScore[team][number]['FGA'] += 1;

            // update box_score table (team/indiv.)
            $("#review_box_score #"+ team +"_box_score #summary").children().eq(2).text(madeAttemptedToHtml(boxScore[team]['total']['FGM'], boxScore[team]['total']['FGA']));
            $("#review_box_score #"+ team +"_box_score #"+number).children().eq(2).text(madeAttemptedToHtml(boxScore[team][number]['FGM'], boxScore[team][number]['FGA']));


            // if 3pt, update shotCounter (3PA), update table
            if (shotPoints(shotDistancePixels) == 3) {
                
                // update shotCounter obj
                shotCounter[team]["3PA"] += 1;

                // update review summary table
                $("#review_game_stats #"+ team +" #3PT").text(reviewSummaryTableToPercentage(shotCounter[team]["3PM"], shotCounter[team]["3PA"]));

                // update boxScore obj (team/indiv.)
                boxScore[team]['total']['3PA'] += 1;
                boxScore[team][number]['3PA'] += 1;

                // update box_score table (team/indiv.)
                $("#review_box_score #"+ team +"_box_score #summary").children().eq(3).text(madeAttemptedToHtml(boxScore[team]['total']['3PM'], boxScore[team]['total']['3PA']));
                $("#review_box_score #"+ team +"_box_score #"+number).children().eq(3).text(madeAttemptedToHtml(boxScore[team][number]['3PM'], boxScore[team][number]['3PA']));


            }
        }


        //console.log(shotCounter);
        //console.log(shots);

    });

    
    // update score
    $("#basketball_court").on("updateScore", function(e, direction, points, number) {

        e.preventDefault();

        // update input score widget
        var previousScore = parseInt( $('#'+direction+'_team_score').text() );
        $("#"+direction+"_team_score").html( previousScore + points );

        // highlight how many points the shot was worth
        highlightShotPoints(direction, points);

        // update global score var
        scores[currentDirection[direction]] += points;
        scores[gameReset.period][currentDirection[direction]] += points;

        // update the review_summary for current quarter
        $("#review_scores #"+ currentDirection[direction] +" #"+gameReset.period).text(scores[gameReset.period][currentDirection[direction]]);

        // update the review_summary final score
        $("#review_scores #"+ currentDirection[direction] +" #F").text(scores[currentDirection[direction]]);

        // update boxScore var (team/indiv.)
        boxScore[currentDirection[direction]]['total']['PTS'] += points;
        boxScore[currentDirection[direction]][number]['PTS'] += points;

        // update box_score table (team/indiv)
        $("#review_box_score #"+ currentDirection[direction] +"_box_score #summary").children().eq(12).text(boxScore[currentDirection[direction]]['total']['PTS']);
        $("#review_box_score #"+ currentDirection[direction] +"_box_score #"+number).children().eq(12).text(boxScore[currentDirection[direction]][number]['PTS']);



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
                    'time': ''.concat(gameReset.minutes, ':', gameReset.seconds),
                    'statId': statId
                }
            );

            // add shot/stat to recentStats array
            recentStats.push({
                statId: statId,
                objectType: 'secondaryStats',
                statType: secondaryStat,
                team: selectedPlayer.team,
                playerNumber: selectedPlayer.number,
                foul: false
            });

            // increment statId
            statId += 1;


            // update review_summary table
            $("#review_game_stats #"+ selectedPlayer.team +" #"+ secondaryStat).text(secondaryStats[selectedPlayer.team][secondaryStat].length);

            // update boxScore obj (team/indiv.)
            boxScore[selectedPlayer.team]['total'][statAbbreiationLookup[secondaryStat]] += 1;
            boxScore[selectedPlayer.team][selectedPlayer.number][statAbbreiationLookup[secondaryStat]] += 1;

            // update box_score table (team/indiv)
            $("#review_box_score #"+ selectedPlayer.team +"_box_score #summary").children().eq(statIndexLookup[secondaryStat]).text(boxScore[selectedPlayer.team]['total'][statAbbreiationLookup[secondaryStat]]);
            $("#review_box_score #"+ selectedPlayer.team +"_box_score #"+selectedPlayer.number).children().eq(statIndexLookup[secondaryStat]).text(boxScore[selectedPlayer.team][selectedPlayer.number][statAbbreiationLookup[secondaryStat]]);


            // reset selectedPlayer
            selectedPlayer.number = ''; selectedPlayer.team = ''; selectedPlayer.direction = '';


            //console.log(secondaryStats);


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
                    'time': ''.concat(gameReset.minutes, ':', gameReset.seconds),
                    'statId': statId
                }
            );

            // add shot/stat to recentStats array
            recentStats.push({
                statId: statId,
                objectType: 'secondaryStats',
                statType: secondaryStat,
                team: selectedPlayer.team,
                playerNumber: selectedPlayer.number,
                foul: true
            });

            // increment statId
            statId += 1;


            // update boxScore obj FTM/FTA (team/indiv)
            boxScore[selectedPlayer.team]['total']['PF'] += 1;
            boxScore[selectedPlayer.team][selectedPlayer.number]['PF'] += 1;

            // update box_score table FTM-A (team/indiv)
            $("#review_box_score #"+ selectedPlayer.team +"_box_score #summary").children().eq(10).text(boxScore[selectedPlayer.team]['total']['PF']);
            $("#review_box_score #"+ selectedPlayer.team +"_box_score #"+selectedPlayer.number).children().eq(10).text(boxScore[selectedPlayer.team][selectedPlayer.number]['PF']);


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

            // Did they make the free throw?
            var points = $('#free_throw').val();


            // Determine if shot was success
            var shotSuccess;
            if (points === '1') {

                shotSuccess = true;

                // update score widget, review_summary table, and box_score table
                $('#basketball_court').trigger('updateScore', [selectedPlayer.direction, 1, selectedPlayer.number])

                // update shotCounter obj (FTM/FTA), update review_summary table
                shotCounter[selectedPlayer.team]["FTM"] += 1;
                shotCounter[selectedPlayer.team]["FTA"] += 1;

                // update review_summary table
                $("#review_game_stats #"+ selectedPlayer.team +" #FT").text(reviewSummaryTableToPercentage(shotCounter[selectedPlayer.team]["FTM"], shotCounter[selectedPlayer.team]["FTA"]));


                // update boxScore obj FTM/FTA (team/indiv)
                boxScore[selectedPlayer.team]['total']['FTM'] += 1;
                boxScore[selectedPlayer.team]['total']['FTA'] += 1;
                boxScore[selectedPlayer.team][selectedPlayer.number]['FTM'] += 1;
                boxScore[selectedPlayer.team][selectedPlayer.number]['FTA'] += 1;

                // update box_score table FTM-A (team/indiv)
                $("#review_box_score #"+ selectedPlayer.team +"_box_score #summary").children().eq(4).text(madeAttemptedToHtml(boxScore[selectedPlayer.team]['total']['FTM'], boxScore[selectedPlayer.team]['total']['FTA']))
                $("#review_box_score #"+ selectedPlayer.team +"_box_score #"+selectedPlayer.number).children().eq(4).text(madeAttemptedToHtml(boxScore[selectedPlayer.team][selectedPlayer.number]['FTM'], boxScore[selectedPlayer.team][selectedPlayer.number]['FTA']));


            } else {
                shotSuccess = false;

                // update shotCounter obj (FTA), update review_summary table
                shotCounter[selectedPlayer.team]["FTA"] += 1;

                // update review_summary table
                $("#review_game_stats #"+ selectedPlayer.team +" #FT").text(reviewSummaryTableToPercentage(shotCounter[selectedPlayer.team]["FTM"], shotCounter[selectedPlayer.team]["FTA"]));

                // update boxScore obj FTM/FTA (team/indiv)
                boxScore[selectedPlayer.team]['total']['FTA'] += 1;
                boxScore[selectedPlayer.team][selectedPlayer.number]['FTA'] += 1;

                // update box_score table FTM-A (team/indiv)
                $("#review_box_score #"+ selectedPlayer.team +"_box_score #summary").children().eq(4).text(madeAttemptedToHtml(boxScore[selectedPlayer.team]['total']['FTM'], boxScore[selectedPlayer.team]['total']['FTA']))
                $("#review_box_score #"+ selectedPlayer.team +"_box_score #"+selectedPlayer.number).children().eq(4).text(madeAttemptedToHtml(boxScore[selectedPlayer.team][selectedPlayer.number]['FTM'], boxScore[selectedPlayer.team][selectedPlayer.number]['FTA']));


            }


            // save free throw
            freeThrows[selectedPlayer.team].push(
                {   
                    'playerNumber': parseInt(selectedPlayer.number),
                    'shotSuccess': shotSuccess,
                    'points': parseInt(points),
                    'direction': selectedPlayer.direction,
                    'quarter': parseInt(gameReset.period),
                    'time': ''.concat(gameReset.minutes, ':', gameReset.seconds),
                    'statId': statId
                }
            );

            // add shot/stat to recentStats array
            recentStats.push({
                statId: statId,
                objectType: 'freeThrows',
                team: selectedPlayer.team,
                playerNumber: selectedPlayer.number,
                shotSuccess: shotSuccess,
                points: 1
            });

            // increment statId
            statId += 1;


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

        // hide review tab
        $("#review").hide();

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
    $('header').on("click", "#game_review", function(e) {

        // show review div
        $("#review").show();

        // hide game
        $("#game").hide();
        $("#rosters_container").hide();

        // remove button_class from all header buttons
        $("header button").each(function() {
            $(this).removeClass('button_selected');
        });

        // highlight this button
        $(this).addClass('button_selected');



    });


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
        $("#review_views_container").children().each(function() {
            $(this).hide();
        });

        // Show this div
        var tabId = $(this).find('span').text().replace(' ','_').toLowerCase();
        $("#review_"+tabId).show();

        //console.log(tabId);

    });


    $("#undo").on("click", function(e) {
        e.preventDefault();

            if (recentStats.length > 0) {

            var recentStat = recentStats.pop();


            // undo last shot
            if (recentStat.objectType == 'shots') {

                // remove most recent shot from shots var
                var recentShot = shots[recentStat.team].pop(); // validate it's correct, based on statId


                // made shot?
                if (recentShot.shotSuccess == true) {

                    // reduce shotCounter obj (FGM/FGA), update review_summary table
                    shotCounter[recentStat.team]["FGM"] -= 1;
                    shotCounter[recentStat.team]["FGA"] -= 1;
                    $("#review_game_stats #"+ recentStat.team +" #FG").text(reviewSummaryTableToPercentage(shotCounter[recentStat.team]["FGM"], shotCounter[recentStat.team]["FGA"]));

                    // reduce boxScore obj (team/indiv.)
                    boxScore[recentStat.team]['total']['FGM'] -= 1;
                    boxScore[recentStat.team]['total']['FGA'] -= 1;
                    boxScore[recentStat.team][recentStat.playerNumber]['FGM'] -= 1;
                    boxScore[recentStat.team][recentStat.playerNumber]['FGA'] -= 1;

                    // update box_score table
                    $("#review_box_score #"+ recentStat.team +"_box_score #summary").children().eq(2).text(madeAttemptedToHtml(boxScore[recentStat.team]['total']['FGM'], boxScore[recentStat.team]['total']['FGA']))
                    $("#review_box_score #"+ recentStat.team +"_box_score #"+ recentStat.playerNumber).children().eq(2).text(madeAttemptedToHtml(boxScore[recentStat.team][recentStat.playerNumber]['FGM'], boxScore[recentStat.team][recentStat.playerNumber]['FGA']));


                    // reduce input score widget
                    var previousScore = parseInt( $('#'+ currentDirection[recentStat.team] +'_team_score').text() );
                    $("#"+ currentDirection[recentStat.team] +"_team_score").html( previousScore - recentShot.points );

                    // highlight how many points the shot was worth
                    //highlightShotPoints(direction, points);
                    // need negativ highlight ^^^


                    // update global score var
                    scores[recentStat.team] -= recentShot.points;
                    scores[gameReset.period][recentStat.team] -= recentShot.points;

                    // update the review_summary for current quarter
                    $("#review_scores #"+ recentStat.team +" #"+gameReset.period).text(scores[gameReset.period][recentStat.team]);

                    // update the review_summary final score
                    $("#review_scores #"+ recentStat.team +" #F").text(scores[recentStat.team]);

                    // update boxScore var (team/indiv.)
                    boxScore[recentStat.team]['total']['PTS'] -= recentShot.points;
                    boxScore[recentStat.team][recentStat.playerNumber]['PTS'] -= recentShot.points;

                    // update box_score table (team/indiv)
                    $("#review_box_score #"+ recentStat.team +"_box_score #summary").children().eq(12).text(boxScore[recentStat.team]['total']['PTS']);
                    $("#review_box_score #"+ recentStat.team +"_box_score #"+ recentStat.playerNumber).children().eq(12).text(boxScore[recentStat.team][recentStat.playerNumber]['PTS']);


                    // 3 pointer
                    if (recentShot.points == 3) {

                        // reduce shotCounter obj, update review_summary table
                        shotCounter[recentStat.team]["3PM"] -= 1;
                        shotCounter[recentStat.team]["3PA"] -= 1;

                        // update review_summary table
                        $("#review_game_stats #"+ recentStat.team +" #3PT").text(reviewSummaryTableToPercentage(shotCounter[recentStat.team]["3PM"], shotCounter[recentStat.team]["3PA"]));

                        // update boxScore obj (team/indiv.)
                        boxScore[recentStat.team]['total']['3PM'] -= 1;
                        boxScore[recentStat.team]['total']['3PA'] -= 1;
                        boxScore[recentStat.team][recentStat.playerNumber]['3PM'] -= 1;
                        boxScore[recentStat.team][recentStat.playerNumber]['3PA'] -= 1;

                        // update box_score table (team/indiv.)
                        $("#review_box_score #"+ recentStat.team +"_box_score #summary").children().eq(3).text(madeAttemptedToHtml(boxScore[recentStat.team]['total']['3PM'], boxScore[recentStat.team]['total']['3PA']));
                        $("#review_box_score #"+ recentStat.team +"_box_score #"+ recentStat.playerNumber).children().eq(3).text(madeAttemptedToHtml(boxScore[recentStat.team][recentStat.playerNumber]['3PM'], boxScore[recentStat.team][recentStat.playerNumber]['3PA']));

                    } 


                // missed shot
                } else {


                    // reduce shotCounter obj (FGM/FGA), update review_summary table
                    shotCounter[recentStat.team]["FGA"] -= 1;
                    $("#review_game_stats #"+ recentStat.team +" #FG").text(reviewSummaryTableToPercentage(shotCounter[recentStat.team]["FGM"], shotCounter[recentStat.team]["FGA"]));

                    // reduce boxScore obj (team/indiv.)
                    boxScore[recentStat.team]['total']['FGA'] -= 1;
                    boxScore[recentStat.team][recentStat.playerNumber]['FGA'] -= 1;

                    // update box_score table
                    $("#review_box_score #"+ recentStat.team +"_box_score #summary").children().eq(2).text(madeAttemptedToHtml(boxScore[recentStat.team]['total']['FGM'], boxScore[recentStat.team]['total']['FGA']))
                    $("#review_box_score #"+ recentStat.team +"_box_score #"+ recentStat.playerNumber).children().eq(2).text(madeAttemptedToHtml(boxScore[recentStat.team][recentStat.playerNumber]['FGM'], boxScore[recentStat.team][recentStat.playerNumber]['FGA']));



                    // 3 pointer
                    if (recentShot.points == 3) {

                        // reduce shotCounter obj, update review_summary table
                        shotCounter[recentStat.team]["3PA"] -= 1;

                        // update review_summary table
                        $("#review_game_stats #"+ recentStat.team +" #3PT").text(reviewSummaryTableToPercentage(shotCounter[recentStat.team]["3PM"], shotCounter[recentStat.team]["3PA"]));

                        // update boxScore obj (team/indiv.)
                        boxScore[recentStat.team]['total']['3PA'] -= 1;
                        boxScore[recentStat.team][recentStat.playerNumber]['3PA'] -= 1;

                        // update box_score table (team/indiv.)
                        $("#review_box_score #"+ recentStat.team +"_box_score #summary").children().eq(3).text(madeAttemptedToHtml(boxScore[recentStat.team]['total']['3PM'], boxScore[recentStat.team]['total']['3PA']));
                        $("#review_box_score #"+ recentStat.team +"_box_score #"+ recentStat.playerNumber).children().eq(3).text(madeAttemptedToHtml(boxScore[recentStat.team][recentStat.playerNumber]['3PM'], boxScore[recentStat.team][recentStat.playerNumber]['3PA']));

                    } 


                }


                // update UI input
                $("#game_body #basketball_court .shot").each(function() {
                    if ($(this).attr('id') == recentStat.statId) {
                        $(this).remove();
                    }
                })

                




            // free throw
            } else if (recentStat.objectType == 'freeThrows') {
                
                // remove from global variables
                var recentFreeThrow = freeThrows[recentStat.team].pop();

                

                // made free throw
                if (recentStat.shotSuccess == true) {


                    // reduce input score widget
                    var previousScore = parseInt( $('#'+ currentDirection[recentStat.team] +'_team_score').text() );
                    $("#"+ currentDirection[recentStat.team] +"_team_score").html( previousScore - recentFreeThrow.points );

                    // highlight how many points the shot was worth
                    //highlightShotPoints(direction, points);
                    // need negativ highlight ^^^


                    // update global score var
                    scores[recentStat.team] -= recentFreeThrow.points;
                    scores[gameReset.period][recentStat.team] -= recentFreeThrow.points;

                    // update the review_summary for current quarter
                    $("#review_scores #"+ recentStat.team +" #"+gameReset.period).text(scores[gameReset.period][recentStat.team]);

                    // update the review_summary final score
                    $("#review_scores #"+ recentStat.team +" #F").text(scores[recentStat.team]);




                    // update shotCounter obj (FTM/FTA), update review_summary table
                    shotCounter[recentStat.team]["FTM"] -= 1;
                    shotCounter[recentStat.team]["FTA"] -= 1;

                    // update review_summary table
                    $("#review_game_stats #"+ recentStat.team +" #FT").text(reviewSummaryTableToPercentage(shotCounter[recentStat.team]["FTM"], shotCounter[recentStat.team]["FTA"]));






                    // update boxScore var (team/indiv.)
                    boxScore[recentStat.team]['total']['PTS'] -= recentFreeThrow.points;
                    boxScore[recentStat.team][recentStat.playerNumber]['PTS'] -= recentFreeThrow.points;

                    // update box_score table (team/indiv)
                    $("#review_box_score #"+ recentStat.team +"_box_score #summary").children().eq(12).text(boxScore[recentStat.team]['total']['PTS']);
                    $("#review_box_score #"+ recentStat.team +"_box_score #"+ recentStat.playerNumber).children().eq(12).text(boxScore[recentStat.team][recentStat.playerNumber]['PTS']);




                    // update boxScore obj FTM/FTA (team/indiv)
                    boxScore[recentStat.team]['total']['FTM'] -= 1;
                    boxScore[recentStat.team]['total']['FTA'] -= 1;
                    boxScore[recentStat.team][recentStat.playerNumber]['FTM'] -= 1;
                    boxScore[recentStat.team][recentStat.playerNumber]['FTA'] -= 1;

                    // update box_score table FTM-A (team/indiv)
                    $("#review_box_score #"+ recentStat.team +"_box_score #summary").children().eq(4).text(madeAttemptedToHtml(boxScore[recentStat.team]['total']['FTM'], boxScore[recentStat.team]['total']['FTA']))
                    $("#review_box_score #"+ recentStat.team +"_box_score #"+ recentStat.playerNumber).children().eq(4).text(madeAttemptedToHtml(boxScore[recentStat.team][recentStat.playerNumber]['FTM'], boxScore[recentStat.team][recentStat.playerNumber]['FTA']));



                // missed free throw
                } else {

                    // update boxScore obj FTM/FTA (team/indiv)
                    boxScore[recentStat.team]['total']['FTA'] -= 1;
                    boxScore[recentStat.team][recentStat.playerNumber]['FTA'] -= 1;

                    // update box_score table FTM-A (team/indiv)
                    $("#review_box_score #"+ recentStat.team +"_box_score #summary").children().eq(4).text(madeAttemptedToHtml(boxScore[recentStat.team]['total']['FTM'], boxScore[recentStat.team]['total']['FTA']))
                    $("#review_box_score #"+ recentStat.team +"_box_score #"+ recentStat.playerNumber).children().eq(4).text(madeAttemptedToHtml(boxScore[recentStat.team][recentStat.playerNumber]['FTM'], boxScore[recentStat.team][recentStat.playerNumber]['FTA']));


                    

                    // update shotCounter obj (FTM/FTA), update review_summary table
                    shotCounter[recentStat.team]["FTA"] -= 1;

                    // update review_summary table
                    $("#review_game_stats #"+ recentStat.team +" #FT").text(reviewSummaryTableToPercentage(shotCounter[recentStat.team]["FTM"], shotCounter[recentStat.team]["FTA"]));

                }






            // secondaryStat
            } else {
                
                var recentSecondaryStat = secondaryStats[recentStat.team][recentStat.statType].pop();

                console.log(recentStat);

                // stat (i.e. REB, STL, AST)
                if (recentStat.foul == false) {
                
                    console.log('secondayStat')
                    console.log(recentSecondaryStat);

                    // update review_summary table
                    $("#review_game_stats #"+ recentStat.team +" #"+ recentStat.statType).text(secondaryStats[recentStat.team][recentStat.statType].length);

                    // update boxScore obj (team/indiv.)
                    boxScore[recentStat.team]['total'][statAbbreiationLookup[recentStat.statType]] -= 1;
                    boxScore[recentStat.team][recentStat.playerNumber][statAbbreiationLookup[recentStat.statType]] -= 1;

                    // update box_score table (team/indiv)
                    $("#review_box_score #"+ recentStat.team +"_box_score #summary").children().eq(statIndexLookup[recentStat.statType]).text(boxScore[recentStat.team]['total'][statAbbreiationLookup[recentStat.statType]]);
                    $("#review_box_score #"+ recentStat.team +"_box_score #"+ recentStat.playerNumber).children().eq(statIndexLookup[recentStat.statType]).text(boxScore[recentStat.team][recentStat.playerNumber][statAbbreiationLookup[recentStat.statType]]);

                    console.log(recentStat.playerNumber)
                    console.log(recentStat.statType)



                // foul (i.e. Shooting, Flagrant, etc.)
                } else {

                    console.log('foul')
                    console.log(recentSecondaryStat);

                    // update boxScore obj FTM/FTA (team/indiv)
                    boxScore[recentStat.team]['total']['PF'] -= 1;
                    boxScore[recentStat.team][recentStat.playerNumber]['PF'] -= 1;

                    // update box_score table FTM-A (team/indiv)
                    $("#review_box_score #"+ recentStat.team +"_box_score #summary").children().eq(10).text(boxScore[recentStat.team]['total']['PF']);
                    $("#review_box_score #"+ recentStat.team +"_box_score #"+ recentStat.playerNumber).children().eq(10).text(boxScore[recentStat.team][recentStat.playerNumber]['PF']);


                }

            }

        } 

    });






 

/*
    // Alert user before reloading/leaving page
    $(window).bind('beforeunload', function(){

        return 'Are you sure you want to leave?';

    });
*/

});
