var config = {
    apiKey: "AIzaSyChdbOclLmne3t9Cl9I68U5cSBLHv9kLxI",
    authDomain: "june-camp.firebaseapp.com",
    databaseURL: "https://june-camp.firebaseio.com",
    projectId: "june-camp",
    storageBucket: "",
    messagingSenderId: "1015045375537"
  };
firebase.initializeApp(config);

document.addEventListener("DOMContentLoaded", function() {

    var firebaseRef = firebase.database().ref();

    console.log("App Loaded");

    var email = document.getElementById("email");
    var password = document.getElementById("password");
    var loginButton = document.getElementById("login");
    var teamChoose = document.getElementById("teamChoose");

    loginButton.addEventListener("click", function() {
        console.log(email.value);
        console.log(password.value);
        console.log(teamChoose.value);
        firebaseRef.child("Teams").child(teamChoose.value).once("value", function(snapshot) {
            var teamData = []

            snapshot.forEach(function(child) {
                teamData.push(child.val());
            });

            console.log(teamData);

            if (email.value != teamData[2] || password.value != teamData[3]) {
                window.alert("Invalid credentials. Try again...")
                email.value = "";
                password.value = "";
            } else if (email.value == teamData[2] || password.value == teamData[3]) {
                console.log("Logged in");
                firebaseRef.child("Teams").child(teamChoose.value).child("LoggedIn").set(1);
                window.location.href = "./playground.html";
            }
        })
    })
    
});