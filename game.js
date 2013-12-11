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
    var openDiv = "<a href='#' class='local_storage_team'>";
    var closeDiv = "</a>";
    var html = '';
    for (var i=0; i<teamNames.length; i++) {
        html += openDiv + teamNames[i] + closeDiv;
    }
    return html;
}





$(document).ready(function(e) {

    console.log('load');

    // Hide input buttons
    $("#game_review").hide();
    $("#game_input").hide();
    $("#substitute").hide();
    $("#timeout").hide();
    $("#start_game").hide();
    $("#resume_game").hide();

    // Hide #game div
    $("#game").hide();

    // teams object, away/home
    var teams = {};

    // Submitted Rosters
    var rostersSubmitted = 0;


    // Store Team to localStorage
    $(".save_players_form").on("click", function(e) {

        e.preventDefault();

        rostersSubmitted += 1;

        // localStorage Object
        var teamObj = { players: [] };

        // determine which team (home or away) was saved
        var team = ($(this).closest('form').attr('id')).split('_')[0];
        console.log(team);

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

        console.log(teams);

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
        var teams;

        console.log(roster);

        if (typeof(Storage) !== "undefined") {
            teams = JSON.parse(localStorage.getItem("teams"));

            // if teams exist
            if (teams !== null) {

                for (var i=0; i < teams.length; i++) {
                    teamNames.push(teams[i]['teamName']);
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
    $('.local_storage_teams').on("click", "a", function(e) {

        rostersSubmitted += 1;

        var teamName = $(this).html();
        //console.log(teamName);

        var roster = $(this).parent().parent().attr('id');
        console.log(roster);

        var homeAway = roster.split('_')[0]

        var team = { players: [] };
        team.teamName = teamName;
        //console.log(team);

        // find team in localStorage
        var teams = JSON.parse(localStorage.getItem("teams"));
        console.log(teams);

        for (var i=0; i < teams.length; i++) {
            if (teamName === teams[i]['teamName']) {
                team.players = teams[i]['players'];
                team.teamAbbreviation = teams[i]['teamAbbreviation'];
            }
        }

        // Remove Form and display team roster
        $('#'+roster).empty();
        $('#'+roster).append(createRosterHtml(team.teamName, team.players, homeAway));


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


    $('#start_resume_button_container').on("click", "a", function(e) {
  
        e.preventDefault();

        $("#rosters_container").hide();
        $("#game").show();

        // show buttons in 
        $("#game_review").show();
        $("#game_input").show();
        $("#substitute").show();
        $("#timeout").show();


    });


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





});
