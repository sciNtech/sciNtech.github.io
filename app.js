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

function init_firebase() {
    firebaseRef = firebase.database().ref();

    firebaseRef.child("Teams").child("Team 1").child("Completed").set("1")
    firebaseRef.child("Teams").child("Team 2").child("Completed").set("1")
    firebaseRef.child("Teams").child("Team 3").child("Completed").set("1")
    firebaseRef.child("Teams").child("Team 4").child("Completed").set("1")
    firebaseRef.child("Teams").child("Team 5").child("Completed").set("1")

    console.log("Updated database");
}

// init_firebase();

// ----------------------------------------------------------------------------------------------------------------

document.addEventListener("DOMContentLoaded", function() {

    console.log("App Loaded");

    var email = document.getElementById("email");
    var password = document.getElementById("password");
    var loginButton = document.getElementById("login");
    var teamChoose = document.getElementById("teamChoose");

    var loginPage = document.getElementById("loginPage");
    var pgPage = document.getElementById("playgroundPage");

    loginButton.addEventListener("click", function() {
        console.log(email.value);
        console.log(password.value);
        console.log(teamChoose.value);
        firebaseRef.child("Teams").child(teamChoose.value).once("value", function(snapshot) {
            var teamData = []

            snapshot.forEach(function(child) {
                teamData.push(child.val());
            });

            if (email.value != teamData[2] || password.value != teamData[3]) {
                window.alert("Invalid credentials. Try again...")
                email.value = "";
                password.value = "";
            } else if (email.value == teamData[2] || password.value == teamData[3]) {
                currentTeam = teamChoose.value;
                firebaseRef.child("Teams").child(teamChoose.value).child("LoggedIn").set(1);
                console.log("Logged in", currentTeam);

                // Switching to playground from login
                loginPage.style.display = "none";
                pgPage.style.display = "block";
            }
        })
    })

// ----------------------------------------------------------------------------------------------------------------
    
    var teamId = document.getElementById("team-id");
    var currency = document.getElementById("team-currency");
    var timer = document.getElementById("team-timer");

    var gameIDBox = document.getElementById("game-code")
    var textbox = document.getElementById("text")
    var GAMECODE = document.getElementById("gameID")
    var confirmID = document.getElementById("confirmID");
    gameIDBox.style.visibility = "visible";

    function startGame() {
        var task = window.confirm("You have 30 minutes to finish this activity and find the next location. You only have 1 try so make it count!");
        if (task) {
            startTimer(30 * 60, timer);
        };
    };

    function loadStats() {
        firebaseRef.child("Teams").child(currentTeam).once("value", function(snapshot) {
            var teamStats = []

            snapshot.forEach(function(child) {
                teamStats.push(child.val());
            });

            console.log(teamStats);

            teamId.innerText = "Team: " + currentTeam;
            currency.innerText = "Flex Bucks: " + teamStats[0];

            console.log("Configured user...")

        })
    }

    function randomStation(win, loc) {

        randomStation = "Station " + Math.floor(Math.random() * Math.floor(5));

        firebaseRef.child("Stations").child(randomStation).child("CODE").once("value", function(snapshot) {
            console.log("Random station code: ", snapshot.val());
            if (win) {
                newStationDiv = document.createElement("div");
                newStationPara = document.createElement("p");
                newStationPara2 = document.createElement("p");
                newStationText = document.createTextNode("Congrats! You have answered the question correctly. Quickly hurry to your next station: ")
                newStationText2 = document.createTextNode(snapshot.val())
                newStationPara2.style.color = "white";
                newStationPara2.style.fontSize = "22px";
                newStationPara2.style.letterSpacing = "5px";
                newStationPara2.style.fontFamily = "monospace";
                newStationDiv.style.width = "300px";
                newStationDiv.style.height = "250px";
                newStationDiv.style.backgroundColor = "#feca57";
                newStationDiv.style.textAlign = "center";
                newStationDiv.style.position = "absolute";
                newStationDiv.style.marginTop = "50px";
                newStationDiv.style.marginLeft = "auto";
                newStationDiv.style.marginRight = "auto";
                newStationDiv.style.left = "0";
                newStationDiv.style.right = "0";
                newStationDiv.style.zIndex = "1500";
                newStationDiv.style.color = "white";
                newBtn = document.createElement("input");
                newBtn.setAttribute("type", "button");
                newBtn.setAttribute("value", "Confirm")
                newBtn.id = "newConfirmBtn";

                newBtn.addEventListener("click", function() {
                    console.log("Going back")
                    playgroundPage.style.display = "none";
                    loginPage.style.display = "block";
                    email.value = "";
                    password.value = "";
                });
                newStationPara.appendChild(newStationText);
                newStationPara2.appendChild(newStationText2);
                newStationDiv.appendChild(newStationPara);
                newStationDiv.appendChild(newStationPara2);
                newStationDiv.appendChild(newBtn);
                loc.appendChild(newStationDiv);

            } else {
                station = snapshot.val()
                newStationDiv = document.createElement("div");
                newStationPara = document.createElement("p");
                newStationPara2 = document.createElement("p");
                newStationText = document.createTextNode("Unfortunately, you have answered the question incorrectly. Try again in the next station: ")
                newStationText2 = document.createTextNode(snapshot.val())
                newStationPara2.style.color = "white";
                newStationPara2.style.fontSize = "22px";
                newStationPara2.style.fontFamily = "monospace";
                newStationPara2.style.letterSpacing = "5px";
                newStationDiv.style.width = "300px";
                newStationDiv.style.height = "250px";
                newStationDiv.style.backgroundColor = "#feca57";
                newStationDiv.style.textAlign = "center";
                newStationDiv.style.position = "absolute";
                newStationDiv.style.marginTop = "50px";
                newStationDiv.style.marginLeft = "auto";
                newStationDiv.style.marginRight = "auto";
                newBtn = document.createElement("input");
                newBtn.setAttribute("type", "button");
                newBtn.setAttribute("value", "Confirm")
                newBtn.id = "newConfirmBtn";
                newStationDiv.style.left = "0";
                newStationDiv.style.right = "0";
                newStationDiv.style.zIndex = "1500";
                newStationDiv.style.color = "white";

                newBtn.addEventListener("click", function() {
                    console.log("Going back")
                    playgroundPage.style.display = "none";
                    loginPage.style.display = "block";
                    email.value = "";
                    password.value = "";
                });

                newStationPara.appendChild(newStationText);
                newStationPara2.appendChild(newStationText2);
                newStationDiv.appendChild(newStationPara);
                newStationDiv.appendChild(newStationPara2);
                newStationDiv.appendChild(newBtn);
                loc.appendChild(newStationDiv);

            }
        })

    }

    function loadGame(gamecode) {
        var playgroundPage = document.getElementById("playgroundPage")
        if (playgroundPage.style.display == "block") {
            console.log("Loading team stats...")
            loadStats()
        }
        
        var playground = document.getElementById("playground");
        playground.style.visibility = "visible";

        var pgQuestion = document.getElementById("pg-question");
        var pgHint = document.getElementById("pg-hint");
        var pgOption1 = document.getElementById("pg-option1");
        var pgOption2 = document.getElementById("pg-option2");
        var pgOption3 = document.getElementById("pg-option3");
        var pgOption4 = document.getElementById("pg-option4");

        var submitBTN = document.getElementById("answerSubmit")
        var userAnswer = document.getElementById("answerBox");

        var numOptions;
        var correctOptionIndex;
        var hintTaken;

        firebase.database().ref().child("Games").child(gamecode).once("value", function(snapshot) {
            var StationInfo = []

            snapshot.forEach(function(child) {
                StationInfo.push(child.val());
            });

            console.log(StationInfo);
 
            pgQuestion.innerText = StationInfo[5]
            pgHint.innerText = StationInfo[1]

            var options = StationInfo[4]
            console.log(options)
            pgOption1.innerText = "1. " + options['Option 1']
            pgOption2.innerText = "2. " + options['Option 2']
            pgOption3.innerText = "3. " + options['Option 3']
            pgOption4.innerText = "4. " + options['Option 4']

            numOptions = StationInfo[3]
            hintTaken = StationInfo[2]
            correctOptionIndex = StationInfo[0]
        })

        function GetElementInsideContainer(containerID, childID) {
            var elm = document.getElementById(childID);
            var parent = elm ? elm.parentNode : {};
            return (parent.id && parent.id === containerID) ? elm : {};
        }

        submitBTN.addEventListener("click", function() {
            if (userAnswer.value == correctOptionIndex) {
                // Correct answer
                
                firebaseRef.child("Teams").child(currentTeam).child("Flex Bucks").once("value", function(snapshot) {
                    currentCurrecy = snapshot.val()
                    firebaseRef.child("Teams").child(currentTeam).child("Flex Bucks").set(currentCurrecy + 20)
                })

                firebaseRef.child("Teams").child(currentTeam).child("LoggedIn").set(0)
                
                var playground = GetElementInsideContainer("playgroundPage", "playground");
                playground.style.display = "none";
                setTimeout(randomStation(true, playgroundPage), 2000)

                console.log("User logged out")
                
            } else {
                // Incorrect answer

                firebase.database().ref().child("Teams").child(currentTeam).child("Flex Bucks").once("value", function(snapshot) {
                    currentCurrecy = snapshot.val()
                    firebaseRef.child("Teams").child(currentTeam).child("Flex Bucks").set(currentCurrecy)
                })
                firebaseRef.child("Teams").child(currentTeam).child("LoggedIn").set(0)                

                var playground = GetElementInsideContainer("playgroundPage", "playground");
                playground.style.display = "none";
                setTimeout(randomStation(true, playgroundPage), 2000)
                // loginPage.style.display = "block";
                // playgroundPage.style.display = "none";

                // email.value = "";
                // password.value = "";

                console.log("User logged out")
                
            }
        })

    }

    confirmID.addEventListener("click", function() {
        firebase.database().ref().child("Game Codes").child("GAMECODE").once("value", function(snapshot) {
            var GAMESCODES = []

            snapshot.forEach(function(child) {
                GAMESCODES.push(child.val());
                if (GAMECODE.value == child.val()) {
                    console.log("game loading...");
                    gameIDBox.style.visibility = "hidden";
                    loadGame(GAMECODE.value); // Loading game
                    startGame(); // Game loads and starts the timer
                } else {
                    textbox.innerText = "Please re-enter valid code...";
                }
            });

        })
    });

});
