//var queryURL = "https://opentdb.com/api.php?amount=10&category=18&difficulty=medium&type=multiple";
//this program uses the above api key, which is free and open to the public, credit to opentdb.com
var questionApi;
var gameDifficulty;
var questionArr = []
var questionDiv = $("#question");
var answerDiv = $(".answer-div");
var timeRemaining = $("#time-remaining");
var shuffleAnswerArr = [];
var currentQuestionObject = 0;
var intervalId;
var currentQuestionWin = false;
var currentQuestionObject = 0;
var intervalStart = 30;
var wins = 0;
var losses = 0;
var unanswered = 0;
// Get the modal
var modal = document.getElementById("myModal");
// Get the button that opens the modal
var btn = document.getElementById("myBtn");
// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];
// When the user clicks the button, open the modal 
btn.onclick = function() {
    modal.style.display = "block";
}
// When the user clicks on <span> (x), close the modal
span.onclick = function() {
    modal.style.display = "none";
}
// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}
$(".start-game").on("click", function() {
    wins = 0;
    losses = 0;
    unanswered = 0;
    currentQuestionWin = 0;
    currentQuestionObject = 0;
    //intervalStart = 30;
    //$(timeRemaining).html(intervalStart);
    answerDiv.html("");
    questionDiv.html("");
    $(".answer-text").html("")
    $(".correct-answer-div").html("")
    $(".start-game").css({"visibility": "hidden"});
    $(".question-div").css({"visibility": "visible"});
    $(".difficulty-button").css({"visibility": "visible"});      
});

$(".difficulty-button").on("click", function() {
    $(".difficulty-button").css({"visibility": "hidden"});  
    console.log("test")
    difficulty();      
});


function difficulty(){

    gameDifficulty = ($(this).attr("id"));
    var queryURL = "https://opentdb.com/api.php?amount=10&category=18&" + gameDifficulty + "=medium&type=multiple";
        $.ajax({
            url: queryURL,
            method: "GET"
        }).done(function(response) {
    console.log(response);
    questionApi = response;
    for(var i = 0; i < questionApi.results.length; i++ ){
        questionArr.push(questionApi.results[i]);
    }
    console.log(questionArr);
    questionIterator(currentQuestionObject); 
    });
      
}


function run() {
    intervalStart = 30;
      clearInterval(intervalId);
      intervalId = setInterval(decrement, 1000);
    }

    //  The decrement function.
function decrement() {
    $(timeRemaining).html(intervalStart);
      //  Decrease number by one.
      intervalStart--;

      //  Show the intervalStart.
      $(timeRemaining).html(intervalStart);


      //  Once intervalStart hits 0
      if (intervalStart === 0) {

        checkWin();
 
      }
    }

    //  The stop function
function stop() {
      //  Clears our intervalId
      clearInterval(intervalId);
    }


function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}
//populates the answers with h3s and the questions/answers of the object passed in
function populateAnswers(object){
    console.log(object);
    var currentQuestion = $("<h3>");    
    var currentAnswer1 = $("<h3>");
    var br = $("<br>");
    var currentAnswer2 = $("<h3>");
    var currentAnswer3 = $("<h3>");
    var currentAnswer4 = $("<h3>");
    var currentAnswerH3Arr = [currentAnswer1, currentAnswer2, currentAnswer3, currentAnswer4];
    shuffleAnswerArr = [object.incorrect_answers[0], object.incorrect_answers[1], object.incorrect_answers[2], object.correct_answer];
    //shuffles questions
    shuffleAnswerArr = shuffle(shuffleAnswerArr);
    console.log(shuffleAnswerArr);
    //displays questions
    currentQuestion.html(object.question);
    questionDiv.html(currentQuestion);
//adds IDs and classes to each of the answers so we can identify the correct one even when theyre shuffled
    for(var i = 0; i < currentAnswerH3Arr.length; i++){
        currentAnswerH3Arr[i].addClass("current-answers");
        currentAnswerH3Arr[i].attr("id", shuffleAnswerArr[i]);
        currentAnswerH3Arr[i].html(shuffleAnswerArr[i]);
        answerDiv.append(currentAnswerH3Arr[i]);
    }
    run();
    

}

$(answerDiv).on("click", ".current-answers", function() {
        //checks if the answer was correct
        if (questionArr[currentQuestionObject].correct_answer==($(this).attr("id"))){
        currentQuestionWin = true;
        console.log("win");
        console.log($(this).attr("id"));
            checkWin();
            
        }
//or incorrect
        else if (questionArr[currentQuestionObject].correct_answer!==($(this).attr("id"))){
            currentQuestionWin = false;
            checkWin();
            console.log($(this).attr("id"));
            console.log("lose");
            
        }

        });
//interates through the questions using currentQuestionObject counter
function questionIterator(x){
    intervalStart = 30;
    $(timeRemaining).html(intervalStart);
    if (x < questionArr.length){
        $(".answer-text").html("")
        $(".correct-answer-div").html("")
        populateAnswers(questionArr[x])
    }
    //this is the game over condition
    else{
        $(".question-div").css({"visibility": "hidden"});
        answerDiv.html("<h1>Game Over<h1>")
        $(".answer-text").html("Your Score is")
        $(".correct-answer-div").html("Correct Guesses: " + wins + "<br>"+"Incorrect Guesses: "+ losses + "<br>" + "Unanswered Questions: "+ unanswered)
       console.log("game over");
       $(".start-game").html("Play again?")
       $(".start-game").css({"visibility": "visible"});
    }
}
//checks to see which outcome has currently occured for the user
function checkWin(){
    
    console.log(currentQuestionObject);
    stop();
//outcome when the inverval = 0
    if (intervalStart == 0){
        $(".answer-text").html(" <h3> Bummer, you ran out of time, the answer was:  </h3>")
        $(".correct-answer-div").html("<h3>"+ questionArr[currentQuestionObject].correct_answer+ "</h3>")
        unanswered++;
        answerDiv.html("");
        $(".current-answers").html("");
    } 
//outcome when the question was guess correctly
    if (intervalStart > 0 && currentQuestionWin === true){
        $(".answer-text").html("<h3>Congrats, you guessed correctly, the answer was: </h3>")
        $(".correct-answer-div").html("<h3>" + questionArr[currentQuestionObject].correct_answer + "</h3>")
        wins++;
        answerDiv.html("");
        $(".current-answers").html("");

    }
    //outcome when the questionw as guessed incorrectly
        if ((intervalStart > 0 && currentQuestionWin === false)){
        $(".answer-text").html("<h3> Sorry, you guessed incorrectly, the answer was:  <\h3>")
        $(".correct-answer-div").html(questionArr[currentQuestionObject].correct_answer)
        losses++;
        answerDiv.html("");
        $(".current-answers").html("");


    }
//iterates through quetions with a timeout between each question
    currentQuestionObject++;
    setTimeout(questionIterator, 1000, currentQuestionObject);

}
