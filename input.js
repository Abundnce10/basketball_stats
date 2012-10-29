$(document).ready(function(){
   
//--- Player class ---\\
  var Player = function(name) {
  	this.name = name;
  	this.points = 0;
  	this.twoPtMake = 0;
  	this.twoPtMiss = 0;
  	this.getTwoPtFg = function() {
  		return(this.twoPtMake+'/'+(this.twoPtMake+this.twoPtMiss));
  	};
   	this.threePtMake = 0;
  	this.threePtMiss = 0;
  	this.getThreePtFg = function() {
  		return(this.threePtMake+'/'+(this.threePtMake+this.threePtMiss));
  	};
  	this.getFieldGoals = function() {
  		var make = this.twoPtMake+this.threePtMake;
  		var miss = this.twoPtMiss+this.threePtMiss;
  		return(make+'/'+(make+miss));
  	};
  	this.ftMake = 0;
  	this.ftMiss = 0;
  	this.getFreeThrows = function() {
  		return(this.ftMake+'/'+(this.ftMake+this.ftMiss));
  	};
  	this.dReb = 0;
  	this.oReb = 0;
  	this.asst = 0;
  	this.block = 0;
  	this.steal = 0;
  	this.turnover = 0;
  };
//--- End Player Class ---\\ 


//--- PLAYER 1 ---\\
  // If player scores increase the global score variable
  $('.player1').on('click', '.2ptMake', function(event) {
  	score += 2;
  	player1.points += 2;
  	player1.twoPtMake += 1;
  	$("#score").empty().append(score);
  	$("#player1Points").empty().append(player1.points);
  	$("#player1FieldGoals").empty().append(player1.getFieldGoals());
  	$("#player12ptFieldGoals").empty().append(player1.getTwoPtFg());
  });

  // If player misses 2pt Field Goal
  $('.player1').on('click', '.2ptMiss', function(event) {
  	player1.twoPtMiss += 1;
  	$("#player1FieldGoals").empty().append(player1.getFieldGoals());
  	$("#player12ptFieldGoals").empty().append(player1.getTwoPtFg());
  });

  // If player scores a 3 Pt Field Goal
  $('.player1').on('click', '.3ptMake', function(event) {
  	score += 3;
  	player1.points += 3;
  	player1.threePtMake += 1;
  	$("#score").empty().append(score);
  	$("#player1Points").empty().append(player1.points);
  	$("#player1FieldGoals").empty().append(player1.getFieldGoals());
  	$("#player13ptFieldGoals").empty().append(player1.getThreePtFg());
  });

  // If player misses 3pt Field Goal
  $('.player1').on('click', '.3ptMiss', function(event) {
  	player1.threePtMiss += 1;
  	$("#player1FieldGoals").empty().append(player1.getFieldGoals());
  	$("#player13ptFieldGoals").empty().append(player1.getThreePtFg());
  });

  // If player makes a Free Throw
  $('.player1').on('click', '.FtMake', function(event) {
  	score += 1;
  	player1.points += 1;
  	player1.ftMake += 1;
  	$("#score").empty().append(score);
  	$("#player1Points").empty().append(player1.points);
  	$("#player1FreeThrows").empty().append(player1.getFreeThrows());
  });

  // If player misses a Free Throw
  $('.player1').on('click', '.FtMiss', function(event) {
  	player1.ftMiss += 1;
  	$("#player1FreeThrows").empty().append(player1.getFreeThrows());
  });

  // If player secures Defensive Rebound
  $('.player1').on('click','.DefReb', function(event) {
  	player1.dReb += 1;
  	$("#player1DefReb").empty().append(player1.dReb);
  });

  // If player secures Offensive Rebound
  $('.player1').on('click','.OffReb', function(event) {
  	player1.oReb += 1;
  	$("#player1OffReb").empty().append(player1.oReb);
  });

  // If player makes an Assist
  $('.player1').on('click','.Asst', function(event) {
  	player1.asst += 1;
  	$("#player1Asst").empty().append(player1.asst);
  });

  // If player Blocks an opponent
  $('.player1').on('click','.Block', function(event) {
  	player1.block += 1;
  	$("#player1Block").empty().append(player1.block);
  });

  // If player Steals the ball
  $('.player1').on('click','.Steal', function(event) {
  	player1.steal += 1;
  	$("#player1Steal").empty().append(player1.steal);
  });

  // If player makes a Turnover
  $('.player1').on('click','.Turnover', function(event) {
  	player1.turnover += 1;
  	$("#player1Turnover").empty().append(player1.turnover);
  });
//--- End PLAYER 1 ---\\

//--- PLAYER 2 ---\\
  // If player scores increase the global score variable
  $('.player2').on('click', '.2ptMake', function(event) {
  	score += 2;
  	player2.points += 2;
  	player2.twoPtMake += 1;
  	$("#score").empty().append(score);
  	$("#player2Points").empty().append(player2.points);
  	$("#player2FieldGoals").empty().append(player2.getFieldGoals());
  	$("#player22ptFieldGoals").empty().append(player2.getTwoPtFg());
  });

  // If player misses 2pt Field Goal
  $('.player2').on('click', '.2ptMiss', function(event) {
  	player2.twoPtMiss += 1;
  	$("#player2FieldGoals").empty().append(player2.getFieldGoals());
  	$("#player22ptFieldGoals").empty().append(player2.getTwoPtFg());
  });

  // If player scores a 3 Pt Field Goal
  $('.player2').on('click', '.3ptMake', function(event) {
  	score += 3;
  	player2.points += 3;
  	player2.threePtMake += 1;
  	$("#score").empty().append(score);
  	$("#player2Points").empty().append(player2.points);
  	$("#player2FieldGoals").empty().append(player2.getFieldGoals());
  	$("#player23ptFieldGoals").empty().append(player2.getThreePtFg());
  });

  // If player misses 3pt Field Goal
  $('.player2').on('click', '.3ptMiss', function(event) {
  	player2.threePtMiss += 1;
  	$("#player2FieldGoals").empty().append(player2.getFieldGoals());
  	$("#player23ptFieldGoals").empty().append(player2.getThreePtFg());
  });

  // If player makes a Free Throw
  $('.player2').on('click', '.FtMake', function(event) {
  	score += 1;
  	player2.points += 1;
  	player2.ftMake += 1;
  	$("#score").empty().append(score);
  	$("#player2Points").empty().append(player2.points);
  	$("#player2FreeThrows").empty().append(player2.getFreeThrows());
  });

  // If player misses a Free Throw
  $('.player2').on('click', '.FtMiss', function(event) {
  	player2.ftMiss += 1;
  	$("#player2FreeThrows").empty().append(player2.getFreeThrows());
  });

  // If player secures Defensive Rebound
  $('.player2').on('click','.DefReb', function(event) {
  	player2.dReb += 1;
  	$("#player2DefReb").empty().append(player2.dReb);
  });

  // If player secures Offensive Rebound
  $('.player2').on('click','.OffReb', function(event) {
  	player2.oReb += 1;
  	$("#player2OffReb").empty().append(player2.oReb);
  });

  // If player makes an Assist
  $('.player2').on('click','.Asst', function(event) {
  	player2.asst += 1;
  	$("#player2Asst").empty().append(player2.asst);
  });

  // If player Blocks an opponent
  $('.player2').on('click','.Block', function(event) {
  	player2.block += 1;
  	$("#player2Block").empty().append(player2.block);
  });

  // If player Steals the ball
  $('.player2').on('click','.Steal', function(event) {
  	player2.steal += 1;
  	$("#player2Steal").empty().append(player2.steal);
  });

  // If player makes a Turnover
  $('.player2').on('click','.Turnover', function(event) {
  	player2.turnover += 1;
  	$("#player2Turnover").empty().append(player2.turnover);
  });
//--- End PLAYER 2 ---\\ 

//--- PLAYER 3 ---\\
  // If player scores increase the global score variable
  $('.player3').on('click', '.2ptMake', function(event) {
  	score += 2;
  	player3.points += 2;
  	player3.twoPtMake += 1;
  	$("#score").empty().append(score);
  	$("#player3Points").empty().append(player3.points);
  	$("#player3FieldGoals").empty().append(player3.getFieldGoals());
  	$("#player32ptFieldGoals").empty().append(player3.getTwoPtFg());
  });

  // If player misses 2pt Field Goal
  $('.player3').on('click', '.2ptMiss', function(event) {
  	player3.twoPtMiss += 1;
  	$("#player3FieldGoals").empty().append(player3.getFieldGoals());
  	$("#player32ptFieldGoals").empty().append(player3.getTwoPtFg());
  });

  // If player scores a 3 Pt Field Goal
  $('.player3').on('click', '.3ptMake', function(event) {
  	score += 3;
  	player3.points += 3;
  	player3.threePtMake += 1;
  	$("#score").empty().append(score);
  	$("#player3Points").empty().append(player3.points);
  	$("#player3FieldGoals").empty().append(player3.getFieldGoals());
  	$("#player33ptFieldGoals").empty().append(player3.getThreePtFg());
  });

  // If player misses 3pt Field Goal
  $('.player3').on('click', '.3ptMiss', function(event) {
  	player3.threePtMiss += 1;
  	$("#player3FieldGoals").empty().append(player3.getFieldGoals());
  	$("#player33ptFieldGoals").empty().append(player3.getThreePtFg());
  });

  // If player makes a Free Throw
  $('.player3').on('click', '.FtMake', function(event) {
  	score += 1;
  	player3.points += 1;
  	player3.ftMake += 1;
  	$("#score").empty().append(score);
  	$("#player3Points").empty().append(player3.points);
  	$("#player3FreeThrows").empty().append(player3.getFreeThrows());
  });

  // If player misses a Free Throw
  $('.player3').on('click', '.FtMiss', function(event) {
  	player3.ftMiss += 1;
  	$("#player3FreeThrows").empty().append(player3.getFreeThrows());
  });

  // If player secures Defensive Rebound
  $('.player3').on('click','.DefReb', function(event) {
  	player3.dReb += 1;
  	$("#player3DefReb").empty().append(player3.dReb);
  });

  // If player secures Offensive Rebound
  $('.player3').on('click','.OffReb', function(event) {
  	player3.oReb += 1;
  	$("#player3OffReb").empty().append(player3.oReb);
  });

  // If player makes an Assist
  $('.player3').on('click','.Asst', function(event) {
  	player3.asst += 1;
  	$("#player3Asst").empty().append(player3.asst);
  });

  // If player Blocks an opponent
  $('.player3').on('click','.Block', function(event) {
  	player3.block += 1;
  	$("#player3Block").empty().append(player3.block);
  });

  // If player Steals the ball
  $('.player3').on('click','.Steal', function(event) {
  	player3.steal += 1;
  	$("#player3Steal").empty().append(player3.steal);
  });

  // If player makes a Turnover
  $('.player3').on('click','.Turnover', function(event) {
  	player3.turnover += 1;
  	$("#player3Turnover").empty().append(player3.turnover);
  });
//--- End PLAYER 3 ---\\ 

//--- PLAYER 4 ---\\
  // If player scores increase the global score variable
  $('.player4').on('click', '.2ptMake', function(event) {
  	score += 2;
  	player4.points += 2;
  	player4.twoPtMake += 1;
  	$("#score").empty().append(score);
  	$("#player4Points").empty().append(player4.points);
  	$("#player4FieldGoals").empty().append(player4.getFieldGoals());
  	$("#player42ptFieldGoals").empty().append(player4.getTwoPtFg());
  });

  // If player misses 2pt Field Goal
  $('.player4').on('click', '.2ptMiss', function(event) {
  	player4.twoPtMiss += 1;
  	$("#player4FieldGoals").empty().append(player4.getFieldGoals());
  	$("#player42ptFieldGoals").empty().append(player4.getTwoPtFg());
  });

  // If player scores a 3 Pt Field Goal
  $('.player4').on('click', '.3ptMake', function(event) {
  	score += 3;
  	player4.points += 3;
  	player4.threePtMake += 1;
  	$("#score").empty().append(score);
  	$("#player4Points").empty().append(player4.points);
  	$("#player4FieldGoals").empty().append(player4.getFieldGoals());
  	$("#player43ptFieldGoals").empty().append(player4.getThreePtFg());
  });

  // If player misses 3pt Field Goal
  $('.player4').on('click', '.3ptMiss', function(event) {
  	player4.threePtMiss += 1;
  	$("#player4FieldGoals").empty().append(player4.getFieldGoals());
  	$("#player43ptFieldGoals").empty().append(player4.getThreePtFg());
  });

  // If player makes a Free Throw
  $('.player4').on('click', '.FtMake', function(event) {
  	score += 1;
  	player4.points += 1;
  	player4.ftMake += 1;
  	$("#score").empty().append(score);
  	$("#player4Points").empty().append(player4.points);
  	$("#player4FreeThrows").empty().append(player4.getFreeThrows());
  });

  // If player misses a Free Throw
  $('.player4').on('click', '.FtMiss', function(event) {
  	player4.ftMiss += 1;
  	$("#player4FreeThrows").empty().append(player4.getFreeThrows());
  });

  // If player secures Defensive Rebound
  $('.player4').on('click','.DefReb', function(event) {
  	player4.dReb += 1;
  	$("#player4DefReb").empty().append(player4.dReb);
  });

  // If player secures Offensive Rebound
  $('.player4').on('click','.OffReb', function(event) {
  	player4.oReb += 1;
  	$("#player4OffReb").empty().append(player4.oReb);
  });

  // If player makes an Assist
  $('.player4').on('click','.Asst', function(event) {
  	player4.asst += 1;
  	$("#player4Asst").empty().append(player4.asst);
  });

  // If player Blocks an opponent
  $('.player4').on('click','.Block', function(event) {
  	player4.block += 1;
  	$("#player4Block").empty().append(player4.block);
  });

  // If player Steals the ball
  $('.player4').on('click','.Steal', function(event) {
  	player4.steal += 1;
  	$("#player4Steal").empty().append(player4.steal);
  });

  // If player makes a Turnover
  $('.player4').on('click','.Turnover', function(event) {
  	player4.turnover += 1;
  	$("#player4Turnover").empty().append(player4.turnover);
  });
//--- End PLAYER 4 ---\\

//--- PLAYER 5 ---\\
  // If player scores increase the global score variable
  $('.player5').on('click', '.2ptMake', function(event) {
  	score += 2;
  	player5.points += 2;
  	player5.twoPtMake += 1;
  	$("#score").empty().append(score);
  	$("#player5Points").empty().append(player5.points);
  	$("#player5FieldGoals").empty().append(player5.getFieldGoals());
  	$("#player52ptFieldGoals").empty().append(player5.getTwoPtFg());
  });

  // If player misses 2pt Field Goal
  $('.player5').on('click', '.2ptMiss', function(event) {
  	player5.twoPtMiss += 1;
  	$("#player5FieldGoals").empty().append(player5.getFieldGoals());
  	$("#player52ptFieldGoals").empty().append(player5.getTwoPtFg());
  });

  // If player scores a 3 Pt Field Goal
  $('.player5').on('click', '.3ptMake', function(event) {
  	score += 3;
  	player5.points += 3;
  	player5.threePtMake += 1;
  	$("#score").empty().append(score);
  	$("#player5Points").empty().append(player5.points);
  	$("#player5FieldGoals").empty().append(player5.getFieldGoals());
  	$("#player53ptFieldGoals").empty().append(player5.getThreePtFg());
  });

  // If player misses 3pt Field Goal
  $('.player5').on('click', '.3ptMiss', function(event) {
  	player5.threePtMiss += 1;
  	$("#player5FieldGoals").empty().append(player5.getFieldGoals());
  	$("#player53ptFieldGoals").empty().append(player5.getThreePtFg());
  });

  // If player makes a Free Throw
  $('.player5').on('click', '.FtMake', function(event) {
  	score += 1;
  	player5.points += 1;
  	player5.ftMake += 1;
  	$("#score").empty().append(score);
  	$("#player5Points").empty().append(player5.points);
  	$("#player5FreeThrows").empty().append(player5.getFreeThrows());
  });

  // If player misses a Free Throw
  $('.player5').on('click', '.FtMiss', function(event) {
  	player5.ftMiss += 1;
  	$("#player5FreeThrows").empty().append(player5.getFreeThrows());
  });

  // If player secures Defensive Rebound
  $('.player5').on('click','.DefReb', function(event) {
  	player5.dReb += 1;
  	$("#player5DefReb").empty().append(player5.dReb);
  });

  // If player secures Offensive Rebound
  $('.player5').on('click','.OffReb', function(event) {
  	player5.oReb += 1;
  	$("#player5OffReb").empty().append(player5.oReb);
  });

  // If player makes an Assist
  $('.player5').on('click','.Asst', function(event) {
  	player5.asst += 1;
  	$("#player5Asst").empty().append(player5.asst);
  });

  // If player Blocks an opponent
  $('.player5').on('click','.Block', function(event) {
  	player5.block += 1;
  	$("#player5Block").empty().append(player5.block);
  });

  // If player Steals the ball
  $('.player5').on('click','.Steal', function(event) {
  	player5.steal += 1;
  	$("#player5Steal").empty().append(player5.steal);
  });

  // If player makes a Turnover
  $('.player5').on('click','.Turnover', function(event) {
  	player5.turnover += 1;
  	$("#player5Turnover").empty().append(player5.turnover);
  });
//--- End PLAYER 5 ---\\



//--- BEGIN GAME ---\\\
  //$("#output").hide();

  //--- Declare variables ---\\
  var score = 0;
  $("#score").empty().append(score);

  // Declare Player1 and post name to output table
  var player1 = new Player('Michael Stitt');
  $(".player1Name").empty().append(player1.name);

  // Declare Player2 and post name to output table
  var player2 = new Player('Kellen Alley');
  $(".player2Name").empty().append(player2.name);

  // Declare Player3 and post name to output table
  var player3 = new Player('Joe Bollinger');
  $(".player3Name").empty().append(player3.name);

  // Declare Player4 and post name to output table
  var player4 = new Player('Sam Flemister');
  $(".player4Name").empty().append(player4.name);

  // Declare Player5 and post name to output table
  var player5 = new Player('Marvin Williams');
  $(".player5Name").empty().append(player5.name);

/*
  // Switch Input/Output Mode
  $("#inputOutput").click(function() {
  	$("#output").toggle();
  	$("#input").toggle();
  });
*/

});