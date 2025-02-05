let endTime = null;
let timerInterval;

document.addEventListener("DOMContentLoaded", async () => {
    const startButton = document.getElementById("startButton");
    const timerElement = document.getElementById("timer");

    // Fetch the current end time from the server
    const response = await fetch("/.netlify/functions/timerControl");
    const result = await response.json();

    if (result.endTime) {
        endTime = new Date(result.endTime);
        startCountdown();
        startButton.textContent = "Stop Timer";
    }

    startButton.addEventListener("click", async () => {
        const authCode = prompt("Enter authentication code:");
        if (!authCode) return;

        const action = endTime ? "stop" : "start";
        const response = await fetch("/.netlify/functions/timerControl", {
            method: "POST",
            body: JSON.stringify({ action, authCode }),
        });

        const result = await response.json();
        if (!result.success) {
            alert("Authentication failed!");
            return;
        }

        if (action === "start") {
            endTime = new Date(result.endTime);
            startCountdown();
            startButton.textContent = "Stop Timer";
        } else {
            clearInterval(timerInterval);
            endTime = null;
            timerElement.textContent = "00:00:00";
            startButton.textContent = "Start Timer";
        }
    });
});

function startCountdown() {
    timerInterval = setInterval(updateTimer, 1000);
    updateTimer();
}

function updateTimer() {
    if (!endTime) return;
    
    const now = new Date();
    const timeRemaining = endTime - now;

    if (timeRemaining <= 0) {
        clearInterval(timerInterval);
        document.getElementById("timer").textContent = "Time Over";
        document.getElementById("buzzer").play();
        return;
    }

    const hours = String(Math.floor((timeRemaining / (1000 * 60 * 60)) % 24)).padStart(2, "0");
    const minutes = String(Math.floor((timeRemaining / (1000 * 60)) % 60)).padStart(2, "0");
    const seconds = String(Math.floor((timeRemaining / 1000) % 60)).padStart(2, "0");

    document.getElementById("hours").textContent = hours;
    document.getElementById("minutes").textContent = minutes;
    document.getElementById("seconds").textContent = seconds;
}
