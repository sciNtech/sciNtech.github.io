var config = {
    apiKey: "AIzaSyD-cFVmZKWmjKqs9fLbmczU_JwomdgJwo0",
    authDomain: "snt-june-camp.firebaseapp.com",
    databaseURL: "https://snt-june-camp.firebaseio.com",
    projectId: "snt-june-camp",
    storageBucket: "",
    messagingSenderId: "304983406415"
};
firebase.initializeApp(config);
var firebaseRef = firebase.database().ref();
var currentTeam = "";
var currentTeamData = [];

function startTimer(duration, display) {
    var timer = duration, minutes, seconds;
    setInterval(function() {
        minutes = parseInt(timer / 60, 10)
        seconds = parseInt(timer % 60, 10);

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        display.textContent = "Timer: " + minutes + ":" + seconds;

        if (--timer < 0) {
            timer = duration;
        }
    }, 1000);
}

document.addEventListener('DOMContentLoaded', function() {

    console.log('App loaded')
    LoginView = document.getElementById('loginPage');
    PlaygroundView = document.getElementById('playgroundPage');
    // PlaygroundView.style.display = "none";

    // var emailID = document.getElementById('email');
    var password = document.getElementById('password');
    var team = document.getElementById('teamChoose');
    var loginBtn = document.getElementById('login');

    loginBtn.addEventListener('click', function() {
        firebaseRef.child("Teams").child(team.value).once("value", function(snapshot) {
            snapshot.forEach(function(child) {
                currentTeamData.push(child.val())
            })
            if (password.value != currentTeamData[2]) {
                window.alert('Invalid credentials. Try again...')
                password.value = ""
            } else if (password.value === currentTeamData[2]) {
                LoginView.style.display = "none";
                PlaygroundView.style.display = "block";
                currentTeam = team.value;
                beginGames(currentTeam, currentTeamData)
            }
        })
    })

})

function beginGames(team, teamData) {
    console.log(team, teamData);
    var gameCodeBox = document.getElementById('game-code');
    var gameCodeBoxText = document.getElementById('text');
    var gameCode = document.getElementById('gameCode');
    var confirmIDBtn = document.getElementById('confirmID');
    var newStationGiver = document.getElementById('next-station-giver');

    gameCodeBox.style.visibility = "visible";
    confirmIDBtn.addEventListener('click', function() {
        firebaseRef.child("Game Codes").once("value", function(snapshot) {
            if (snapshot.val().includes(gameCode.value)) {
                gameCodeBox.style.visibility = "hidden";
                loadGame(gameCodeBox, newStationGiver, gameCode, team, gameCode.value);
            } else {
                gameCodeBoxText.innerText = "Please re-enter valid code..."
            }
        })
    })
}

function loadGame(box, boxTextNode, codeInput, team, GAMECODE) {
    var correct = false;
    console.log('Loading Game for ' + team)
    var playground = document.getElementById('playground')
    var pgQuestion = document.getElementById('pg-question')
    var pgImage = document.getElementById('pg-image')
    var pgOption1 = document.getElementById('pg-option1')
    var pgOption2 = document.getElementById('pg-option2')
    var pgOption3 = document.getElementById('pg-option3')
    var pgOption4 = document.getElementById('pg-option4')
    var answerBox = document.getElementById('answerBox')
    var submitBtn = document.getElementById('answerSubmit')
    var skipBtn = document.getElementById('skipQ')

    playground.style.visibility = 'visible';

    firebaseRef.child("Games").child(GAMECODE).once("value").then(function(snapshot) {
        console.log(snapshot.val())
        pgQuestion.innerText = snapshot.val()['Question']
        pgOption1.innerText = "1. " + snapshot.val()['Options']['Option 1']
        pgOption2.innerText = "2. " + snapshot.val()['Options']['Option 2']
        pgOption3.innerText = "3. " + snapshot.val()['Options']['Option 3']
        pgOption4.innerText = "4. " + snapshot.val()['Options']['Option 4']
        if (GAMECODE == '06IQH') {
            pgImage.src = 'Resistance.jpg'
            pgImage.style.width = "300px";
        } else if (GAMECODE == 'P3S7R') {
            pgImage.src = 'capacitor.jpg'
            pgImage.style.width = "225px";
        } else if (GAMECODE == 'XAMIK') {
            pgImage.src = 'transistor.jpg'
            pgImage.style.width = "150px";
        } else {
            pgImage.style.display = 'none';
        }

        submitBtn.addEventListener('click', function() {
            console.log("User answer: " + answerBox.value)
            // console.log("actual: " + snapshot.val()['Correct'] + " user: " + answerBox.value)
            if (snapshot.val()['Correct'] === answerBox.value) { // Correct answer
                answerBox.addEventListener('change', function() {
                    console.log("changed to: " + answerBox.value);
                })
                console.log('Correct')
                correct = true;
                firebaseRef.child("Route").once("value").then(function(routeshot) { // Getting route list
                    firebaseRef.child("Teams").child(team).once("value").then(function(teamShot) { // Getting next route index
                        if (teamShot.val()['GameIndex'] == 10) {
                            window.alert("You have completed the quiz! You may now quit the app and move on to the next activity!")
                            location.reload()
                        } else {
                            var newGame = routeshot.val()[teamShot.val()['GameIndex']]
                            boxTextNode.innerText = "Next Station:\n" + newGame;
                            firebaseRef.child("Teams").child(team).child("GameIndex").set(teamShot.val()['GameIndex'] + 1)
                            firebaseRef.child("Teams").child(team).child("Flex Bucks").set(teamShot.val()['Flex Bucks'] + 10)
                        }
                    })
                })
                playground.style.visibility = "hidden"; // Move back to GAMECODE screen
                box.style.visibility = "visible";
                codeInput.value = "";                

            } else {
                console.log('Incorrect')
                correct = false;
                firebaseRef.child("Route").once("value").then(function(routeshot) { // Getting route list
                    firebaseRef.child("Teams").child(team).once("value").then(function(teamShot) { // Getting next route index
                        if (teamShot.val()['GameIndex'] == 10) {
                            window.alert("You have completed the quiz! You may now quit the app and move on to the next activity!")
                            location.reload()
                        } else {
                            var newGame = routeshot.val()[teamShot.val()['GameIndex']]
                            boxTextNode.innerText = "Next Station:\n" + newGame;
                            firebaseRef.child("Teams").child(team).child("GameIndex").set(teamShot.val()['GameIndex'] + 1)
                            firebaseRef.child("Teams").child(team).child("Flex Bucks").set(teamShot.val()['Flex Bucks'])
                        }
                    })
                })
                playground.style.visibility = "hidden"; // Move back to GAMECODE screen
                box.style.visibility = "visible";
                codeInput.value = "";
            }
        })

        // submitBtn.addEventListener('click', function() {
        //     if ((answerBox.value) === (snapshot.val()['Correct'])) {
        //         console.log('Correct | Your answer: ' + answerBox.value + " | Correct: " + snapshot.val()['Correct'])
        //         // answerBox.value = ''
        //         // Give next location
        //         firebaseRef.child("Route").once("value", function(routeshot) {
        //             firebaseRef.child("Teams").child(team).child("GameIndex").once("value").then(function(indexshot) {
        //                 if (indexshot.val() == 10) {
        //                     window.alert("Congratulations, You have finished all 10 questions! You may now exit the game and return to your starting location.")
        //                     location.reload()
        //                 } else {
        //                     // window.alert('The next Gamecode is at this location: ' + routeshot.val()[indexshot.val()])
        //                     boxTextNode.innerText = "Next Station:\n" + routeshot.val()[indexshot.val()]
        //                     firebaseRef.child("Teams").child(team).child("GameIndex").set(indexshot.val() + 1)
        //                     firebaseRef.child("Teams").child(team).child("Flex Bucks").once("value", function(FBshot) {
        //                         var currentFB = FBshot.val()
        //                         console.log('Old: ' + currentFB + " | New: " + FBshot.val() + 10)
        //                         firebaseRef.child("Teams").child(team).child("Flex Bucks").set(FBshot.val() + 10);
        //                     })
        //                 }
        //             })
        //         })
        //         playground.style.visibility = "hidden";
        //         box.style.visibility = "visible";
        //         codeInput.value = "";

        //     } else {
        //         console.log('Incorrect | Your answer: ' + answerBox.value + " | Correct: " + snapshot.val()['Correct'])
        //         // answerBox.value = ''
        //         // Give next location
        //         firebaseRef.child("Route").once("value", function(routeshot) {
        //             firebaseRef.child("Teams").child(team).child("GameIndex").once("value").then(function(indexshot) {
        //                 if (indexshot.val() == 10) {
        //                     window.alert("Congratulations, You have finished all 10 questions! You may now exit the game and return to your starting location.")
        //                     location.reload()
        //                 } else {
        //                     // window.alert('The next Gamecode is at this location: ' + routeshot.val()[indexshot.val()])
        //                     boxTextNode.innerText = "Next Station:\n" + routeshot.val()[indexshot.val()]
        //                     firebaseRef.child("Teams").child(team).child("GameIndex").set(indexshot.val() + 1)
        //                     firebaseRef.child("Teams").child(team).child("Flex Bucks").once("value", function(FBshot) {
        //                         var currentFB = FBshot.val()
        //                         console.log('Old: ' + currentFB + " | New: " + FBshot.val() - 10)
        //                         firebaseRef.child("Teams").child(team).child("Flex Bucks").set(FBshot.val());
        //                     })
        //                 }
        //             })
        //         })
        //         // answerBox.value = ''
        //         playground.style.visibility = "hidden";
        //         box.style.visibility = "visible";
        //         codeInput.value = "";
        //     }
        // })

    })

    function getAnswer(userAnswer, GAMECODE) {
        firebaseRef.child("")
    }
}
