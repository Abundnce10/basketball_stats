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


var teamsToHtml = function(teamNames) {
    var openDiv = "<div class='savedTeam'>";
    var closeDiv = "</div>";
    var html = openDiv;
    for (var i=0; i<teamNames.length; i++) {
        html += openDiv + teamNames[i] + closeDiv;
    }
    return html;
}




$(document).ready(function(e) {

    // Hide input buttons
    $("#game_review").hide();
    $("#game_input").hide();
    $("#substitute").hide();
    $("#timeout").hide();

    // Hide #game div
    $("#game").hide();

    // teams object, away/home
    var teams = {};


    // Store Team to localStorage
    $(".save_players_form").on("click", function(e) {

        // localStorage Object
        var teamObj = { players: [] };

        // determine which team (home or away) was saved
        var team = ($(this).closest('form').attr('id')).split('_')[0];

        // save team name
        teamObj.teamName = $('#'+team+'_form .team_name input').val();

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

        console.log(teams);
        

        // Remove Form and display team
        $('#'+team+'_roster').empty();
        $('#'+team+'_roster').append(createRosterHtml(teams[team]['team_name'], teams[team]['players'], team)); 

    });



    // Retrieve Saved Teams from localStorage
    $(".saved_teams").on("click", function() {
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

                var html = teamsToHtml(teamNames);

                // insert into .saved_teams div
                $('#'+ roster +' .local_storage_teams').append(html);

            // if teams don't exist
            } else {
                $('#'+ roster +' .local_storage_teams').append("<div>No Teams Available</div>");
            }

        } else {
            alert("No saved teams.");
            return false;
        }



    });


});
