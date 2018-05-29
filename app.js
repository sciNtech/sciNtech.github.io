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

function firebase_config() {
    
}

document.addEventListener('DOMContentLoaded', function() {

    console.log('App loaded')
    LoginView = document.getElementById('loginPage');
    PlaygroundView = document.getElementById('playgroundPage');
    // PlaygroundView.style.display = "none";

    var emailID = document.getElementById('email');
    var password = document.getElementById('password');
    var team = document.getElementById('teamChoose');
    var loginBtn = document.getElementById('login');

    loginBtn.addEventListener('click', function() {
        firebaseRef.child("Teams").child(team.value).once("value", function(snapshot) {
            snapshot.forEach(function(child) {
                currentTeamData.push(child.val())
            })
            if (emailID.value != currentTeamData[2] || password.value != currentTeamData[3]) {
                window.alert('Invalid credentials. Try again...')
                password.value = ""
            } else if (emailID.value === currentTeamData[2] || password.value === currentTeamData[3]) {
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

    gameCodeBox.style.visibility = "visible";
    confirmIDBtn.addEventListener('click', function() {
        firebaseRef.child("Game Codes").once("value", function(snapshot) {
            if (snapshot.val().includes(gameCode.value)) {
                gameCodeBox.style.visibility = "hidden";
                loadGame(gameCodeBox, team, gameCode.value);
            } else {
                gameCodeBoxText.innerText = "Please re-enter valid code..."
            }
        })
    })
}

function loadGame(box, team, GAMECODE) {
    console.log('Loading Game...')
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

        submitBtn.addEventListener('click', function() {
            if (answerBox.value == snapshot.val()['Correct']) {
                console.log('Correct')
                // Give next location
                firebaseRef.child("Route").once("value", function(routeshot) {
                    firebaseRef.child("Teams").child(team).child("GameIndex").once("value").then(function(indexshot) {
                        if (indexshot.val() == 10) {
                            window.alert("Congratulations, You have finished all 10 questions! You may now return to your starting location.")
                            location.reload()
                        } else {
                            window.alert('The next Gamecode is at this location: ' + routeshot.val()[indexshot.val()])
                            firebaseRef.child("Teams").child(team).child("GameIndex").set(indexshot.val() + 1)
                        }
                    })
                    firebaseRef.child("Teams").child(team).child("Flex Bucks").once("value", function(FBshot) {
                        var currentFB = FBshot.val()
                        firebaseRef.child("Teams").child(team).child("Flex Bucks").set(currentFB + 10);
                    })
                })
                answerBox.value = ''
                playground.style.visibility = "hidden";
                box.style.visibility = "visible";
            } else {
                console.log('Incorrect')
                // Give next location
                firebaseRef.child("Route").once("value", function(routeshot) {
                    firebaseRef.child("Teams").child(team).child("GameIndex").once("value").then(function(indexshot) {
                        if (indexshot.val() == 10) {
                            window.alert("Congratulations, You have finished all 10 questions! You may now return to your starting location.")
                            location.reload()
                        } else {
                            window.alert('The next Gamecode is at this location: ' + routeshot.val()[indexshot.val()])
                            firebaseRef.child("Teams").child(team).child("GameIndex").set(indexshot.val() + 1)
                        }
                    })
                    firebaseRef.child("Teams").child(team).child("Flex Bucks").once("value", function(FBshot) {
                        var currentFB = FBshot.val()
                        firebaseRef.child("Teams").child(team).child("Flex Bucks").set(currentFB);
                    })
                })
                answerBox.value = ''
                playground.style.visibility = "hidden";
                box.style.visibility = "visible";
            }
        })

        skipBtn.addEventListener('click', function() {
            var task = window.confirm('Skipping a question will lead to a reduction of 15 points. Are you sure?')
            if (task) {
                // Go to next question  
                firebaseRef.child("Route").once("value", function(routeshot) {
                    firebaseRef.child("Teams").child(team).child("GameIndex").once("value").then(function(indexshot) {
                        if (indexshot.val() == 10) {
                            window.alert("Congratulations, You have finished all 10 questions! You may now return to your starting location.")
                            location.reload()
                        } else {
                            window.alert('The next Gamecode is at this location: ' + routeshot.val()[indexshot.val()])
                            firebaseRef.child("Teams").child(team).child("GameIndex").set(indexshot.val() + 1)
                        }
                    })
                    firebaseRef.child("Teams").child(team).child("Flex Bucks").once("value", function(FBshot) {
                        var currentFB = FBshot.val()
                        firebaseRef.child("Teams").child(team).child("Flex Bucks").set(currentFB - 15);
                    })
                })
                answerBox.value = ''
                playground.style.visibility = "hidden";
                box.style.visibility = "visible";
            } else {
                console.log('Continuing question...')
            }
        })

    })
}