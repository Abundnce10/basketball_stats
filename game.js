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


var localStorageTeamsToHtml = function(teamNames) {
    var openDiv = "<div class='local_storage_team_container'><a href='#' class='local_storage_team'>";
    var closeDiv = "</a><a href='#' class='local_storage_delete'>delete</a></div>";
    var html = '';
    for (var i=0; i<teamNames.length; i++) {
        html += openDiv + teamNames[i] + closeDiv;
    }
    return html;
}





$(document).ready(function(e) {

    $("#rosters_container").hide();
/*
    // Hide input buttons
    $("#game_review").hide();
    $("#game_input").hide();
    $("#substitute").hide();
    $("#timeout").hide();
    $("#start_game").hide();
    $("#resume_game").hide();

    // Hide #game div
    $("#game").hide();

*/

    // teams object, away/home
    var teams = {};

    // shots object, away/home
    var shots = { away: {}, home: {} };

    // Submitted Rosters
    var rostersSubmitted = 0;

    // Selected Player
    var selectedPlayer = { team: '', number: '' };

    // Test for double click (Shot) variables
    var DELAY = 225,
        clicks = 0,
        timer = null;



    // Store Team to localStorage
    $(".save_players_form").on("click", function(e) {

        e.preventDefault();

        rostersSubmitted += 1;

        // localStorage Object
        var teamObj = { players: [] };

        // determine which team (home or away) was saved
        var team = ($(this).closest('form').attr('id')).split('_')[0];

        // save team name
        teamObj.teamName = $('#'+team+'_form .team_name input').val();

        // save team abbreviation
        teamObj.teamAbbreviation = $('#'+team+'_form .team_abbreviation input').val();

        // save player objects into array
        $('#'+team+'_form .form_player_add').each(function(ix, elem) {
            var i = $(elem).find('input');
            teamObj.players.push( { number: i[0].value, name: i[1].value } );
        });


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

                var html = localStorageTeamsToHtml(teamNames);

                // insert into .saved_teams div
                $('#'+ roster +' .local_storage_teams').append(html);

            // if teams don't exist
            } else {
                $('#'+ roster +' .local_storage_teams').append("<div>No Teams Available</div>");
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

        // store teamObj into global team
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


        // show court and hide roster view
        $("#rosters_container").hide();
        $("#game").show();

        // show buttons in 
        $("#game_review").show();
        $("#game_input").show();
        $("#substitute").show();
        $("#timeout").show();

        // populate team name abbreviations
        $("#away_score_wrapper .team_name_abbrev").children().text(teams.away.teamAbbreviation);
        $("#home_score_wrapper .team_name_abbrev").children().text(teams.home.teamAbbreviation);

    });


    // Click on Player, add selected class
    $(".players_wrapper").on("click", ".player_border_container", function(e) {
        

    /*
        // Remove class from previously selected player
        $(".player_border_container").removeClass("selected");

        // Add selected class
        $(this).addClass("selected");
    */

        // Remove hidden & selected class (click 2 diff players consec)
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
        selectedPlayer.team = $(this).parent().parent().attr('id').split('_')[0];
        selectedPlayer.number = $(this).children().last().html().substring(1);

        //console.log(selectedPlayer);

    });


    // Click on SVG to input shot
    $('#basketball_court').on('click', function(e) {

        clicks++;

        var shotSuccess = false;

        // Get position of parent coords
        var posX = $(this.parentNode).offset().left;
        var posY = $(this.parentNode).offset().top;


        // Remove hidden & selected class
        $(".player_border_container").each(function() {
            $(this).removeClass("hidden").removeClass("selected");
        });


        // shot location



        // If 1 click => Miss
        if (clicks === 1) {
            timer = setTimeout(function() {
                clicks = 0;
                console.log("Miss: " + selectedPlayer.team + ' #' + selectedPlayer.number);



            }, DELAY);
        } else {
            clearTimeout(timer);
            clicks = 0;
            shotSuccess = true;
            console.log("Make: " + selectedPlayer.team + ' #' + selectedPlayer.number);


        }

    })
    .on("dblclick", function(e) {
        // cancel system double click event
        e.preventDefault();
    });




});
