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

document.addEventListener("DOMContentLoaded", function() {

    var teamId = document.getElementById("teamID");
    var currency = document.getElementById("currency");
    var timer = document.getElementById("timer");

    function startGame() {
        var task = window.confirm("You have 30 minutes to finish this activity.");
        if (task) {
            startTimer(30 * 60, timer);
        }
    }

    startGame(); // Game start when page loads

})