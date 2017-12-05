$(document).ready(function(){
  let opponent;
  let playerOneSym;
  let playerTwoSym;
  let playerOneScore = 0;
  let playerTwoScore = 0;
  let game;
  let difficulty;
  let playerTurn = 1;
  let theWinner;
  const winningSequence = [[1,2,3], [4,5,6], [7,8,9], [1,4,7], [2,5,8], [3,6,9], [1,5,9], [3,5,7]];


  //the player's choice on which opponentthey want; human or computer
  $(".versus button").click(function(){
    opponent = $(this).attr("name");
    if(opponent === "computer"){
      $(".p2").addClass("fa-laptop");
      $(".versus").fadeOut("slow", function(){
        $(".difficulty").fadeIn();
      });
    } else {
      $(".p2").addClass("fa-venus");
      $(".how-hard h5").text("Multiplayer");
      $(".versus").fadeOut("slow",function(){
        $(".player, .symbols").fadeIn();
      });
    }

  });

  //the player chices the difficulty
  $(".level").click(function(){
    difficulty = $(this).attr("name");
    $(".how-hard h5").text(difficulty);
    $(".difficulty").fadeOut("slow",function(){
      $(".player, .symbols").fadeIn();
    });
  });

  //the players can chose between x and o
  $(".symbols button").click(function(){
    playerOneSym = $(this).text();
    otherPlayersSymbol(playerOneSym);
    $(".symbols").fadeOut("slow",function(){
      $(".board, .score").fadeIn();
    });
  });

  //board buttons
  $("td button").click(function(){
    console.log("board button clicked");
    if($(this).text() === "" && game != "over"){
      boardInput(this);
    }
  });

  ///this button chnages the difficulty
  $(".how-hard h5").click(function(){
    if(opponent === "computer"){
      levelToggle();
    }
  });

  $(".p2").click(function(){

    theWinner = "draw";
    playerTurn = 1
    playerOneScore = 0;
    playerTwoScore = 0;
    $(".p1Score").text(playerOneScore);
    $(".p2Score").text(playerTwoScore);
    if(opponent === "computer"){
      opponent = "human";
      $(".how-hard h5").text("Multiplayer");
      $(".p2").removeClass("fa-laptop");
      $(".p2").addClass("fa-venus");

    } else {
      opponent = "computer";
      difficulty = "easy";
      $(".how-hard h5").text(difficulty);
      $(".p2").removeClass("fa-venus");
      $(".p2").addClass("fa-laptop");
    }

    refresh();
  });

  //the play again button
  $(".again").click(function(){
    refresh();
  });


  //this function check if there is a winner, update which player is next
  function endOfMove(playerSym) {

    if(theWinneris(winningSequence, playerSym)){
       if(playerTurn === 1){
          playerTurn++;
        } else{
          playerTurn--;
        }

        if(opponent != "computer") {
          $(".player h2").text("Player " + playerTurn);
        } else {
          $(".player h2").text("Single Player");
        }
      }

  }

  //switch between player 1 and player 2.
  function boardInput(position) {
    if(playerTurn === 2 && opponent === "human"){
      $(position).text(playerTwoSym);
      endOfMove(playerTwoSym);
    } else {
      $(position).text(playerOneSym);
      endOfMove(playerOneSym);
      if(opponent === "computer" && game != "over"){
        computerMove(opponent, playerTwoSym, winningSequence);
        endOfMove(playerTwoSym);
      }
    }
  }

  function levelToggle(){
    if(difficulty === "easy"){
      difficulty = "medium";
      $(".how-hard h5").text("medium");
    } else if(difficulty === "medium"){
      difficulty = "unbeatable";
      $(".how-hard h5").text("unbeatable");
    } else {
      difficulty = "easy";
      $(".how-hard h5").text("easy");
    }
  }

  //the playertwo function will run the game api
  function computerMove(opponent, playerTwoSym, winningSequence) {
    let selectArrey;
    //this identifies if there is two of the same sym in a winningSequence and returns a boolean
    function moveOutThree(arr, playerSym, outOfThree){
      let result = false;
      arr.forEach(function(c){
        if(outOfThree(c, playerSym) > -1){
          result = true;
          selectArrey = c;
        }
      });
      return result;
    }

    //ths function identifes if the selected sym are in 2 positions out of 3
    function twoOutOfThree(arr, playerSym){
      let arrInputs = arr.map(function(c){ return $("."+ c).text();});
      if(arrLength(arrInputs, playerSym) === 2 && arrInputs.indexOf("") > -1){
        return arr[arrInputs.indexOf("")];
      } else {
        return -1;
      }
    }

    //ths function identifes if the selected sym are in 1 positions out of 3
    function oneOutOfThree(arr, playerSym){
      let arrInputs = arr.map(function(c){ return $("."+ c).text();});
      if(arrLength(arrInputs, playerSym) === 1 && arrInputs.indexOf("") > -1 && arrInputs.join().replace(/,/g, '').length === 1){
        if (arrInputs.indexOf(playerSym) === 1){
          return arr[arrInputs.indexOf("")];
        } else {
          return arr[1];
        }
      } else {
        return -1;
      }
    }

    //measure the length of a string
    function arrLength(arr, playerSym) {
      let findSym = {
        "x" : /x/g,
        "o" : /o/g
      }
      if(arr.join().match(findSym[playerSym]) === null){
        return 0;
      }
      return arr.join().match(findSym[playerSym]).length;
    }

    //This function places a random move on the board
    function randomMove(sym){
      let x = Math.floor(Math.random() * 9) + 1;
      if($("." + x).text() === ''){
        $("." + x).text(sym).hide().fadeIn(1000);
      } else {
        randomMove(sym);
      }
    }

    //check board if player 2 is close to winningSequenc
    if(moveOutThree(winningSequence, playerTwoSym, twoOutOfThree) && (difficulty === "medium" || difficulty === "unbeatable")) {
      $("."+ twoOutOfThree(selectArrey, playerTwoSym)).text(playerTwoSym).hide().fadeIn(1000);
      //check board if player 1 is close to winningSequenc
    } else if(moveOutThree(winningSequence, playerOneSym, twoOutOfThree) && (difficulty === "medium" || difficulty === "unbeatable")){
      $("."+ twoOutOfThree(selectArrey, playerOneSym)).text(playerTwoSym).hide().fadeIn(1000);
    } else if(($("td").text().length === 0 || $(".5").text() === "") && difficulty === "unbeatable") {
      $(".5").text(playerTwoSym).hide().fadeIn(1000);;
    } else if (moveOutThree(winningSequence, playerOneSym, oneOutOfThree) &&  difficulty === "unbeatable"){
      $("."+ oneOutOfThree(selectArrey, playerOneSym)).text(playerTwoSym).hide().fadeIn(1000);
    } else {
      //this will be kept for easy and medium mode
      randomMove(playerTwoSym);
    }

  }

  //designates other players symbol
  function otherPlayersSymbol(playerSym) {
    if(playerSym === "x"){
      playerTwoSym = "o";
    }else {
      playerTwoSym = "x"
    }
  }

  function doWeHaveAWinner(arr, playerSym){
    let result = true;
    arr.forEach(function(c){
      if(playerSym != $("."+ c).text()){
      result = false;
      }
    });
    if(result){
      heighLightWinner(arr);
    }
    return result;
  }

  //determin who is the winner and if there is a draw
  function theWinneris(arr, playerSym){
    let result = true;
    arr.forEach(function(seq){
      if(doWeHaveAWinner(seq, playerSym)){
        result = false;
        game = "over";
        $(".player h2").text("Player " + playerTurn + " wins!");
        theWinner = playerTurn;
        $(".player").addClass("playerExpand");
        $(".again").fadeIn();
        updateScore();
      }
    });
    // if there is no winner and all the stops are filled; if both players tie
    if( result &&  $("td").text().length === 9){
      console.log("draw");
      game = "over";
      theWinner = "draw";
      $(".player h2").text("Draw");
      $(".player").addClass("playerExpand");
      $(".again").fadeIn();
      return !result;
    }

    return result;
  }

  function heighLightWinner(arr){
    arr.forEach(function(x){
      $("."+ x).addClass("winner");
    });
  }
  //this refreshs the game to a new one
  function refresh(){
    $("td button").text("");

    if(theWinner === "draw"){
       $(".player h2").text("Player " + playerTurn);
       theWinner = "no one";
     } else {
       playerTurn = theWinner;
       $(".player h2").text("Player " + theWinner);
     }

    game = "play again"
    $(".again").css("display", "none");
    $("td button").removeClass("winner");
    $(".player").removeClass("playerExpand");
    if(playerTurn === 2 && opponent === "computer"){
      $(".player h2").text("Single Player");
      computerMove(opponent, playerTwoSym, winningSequence);
      endOfMove(playerTwoSym);
    }
  }

  //updates the score of the winning player
  function updateScore(){
    if(playerTurn === 1){
      playerOneScore++;
      $(".p1Score").text(playerOneScore);
    } else {
      playerTwoScore++;
      $(".p2Score").text(playerTwoScore);
    }
  }
});
