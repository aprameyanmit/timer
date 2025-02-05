let endTime = localStorage.getItem("endTime") ? new Date(parseInt(localStorage.getItem("endTime"))) : null;
let timerInterval;

document.addEventListener("DOMContentLoaded", () => {
    const startButton = document.getElementById("startButton");
    const timerElement = document.getElementById("timer");

    if (endTime) {
        startButton.textContent = "Stop Timer";
        startCountdown();
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
            localStorage.setItem("endTime", endTime.getTime());
            startCountdown();
            startButton.textContent = "Stop Timer";
        } else {
            clearInterval(timerInterval);
            localStorage.removeItem("endTime");
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
    const now = new Date();
    const timeRemaining = endTime - now;

    if (timeRemaining <= 0) {
        clearInterval(timerInterval);
        document.getElementById("timer").textContent = "Time Over";
        document.getElementById("buzzer").play();
        localStorage.removeItem("endTime");
        return;
    }

    const hours = String(Math.floor((timeRemaining / (1000 * 60 * 60)) % 24)).padStart(2, "0");
    const minutes = String(Math.floor((timeRemaining / (1000 * 60)) % 60)).padStart(2, "0");
    const seconds = String(Math.floor((timeRemaining / 1000) % 60)).padStart(2, "0");

    document.getElementById("hours").textContent = hours;
    document.getElementById("minutes").textContent = minutes;
    document.getElementById("seconds").textContent = seconds;
}
