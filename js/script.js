let endTime = null;
let timerInterval;

document.addEventListener("DOMContentLoaded", async () => {
    const startButton = document.getElementById("startButton");
    const timerElement = document.getElementById("timer");

    // Fetch the global timer from the server
    await fetchEndTime();

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

        location.reload(); // Auto-refresh page to update immediately
    });

    setInterval(fetchEndTime, 5000); // Poll every 5 seconds to keep all users in sync
});

// Fetch the global timer from the server
async function fetchEndTime() {
    const response = await fetch("/.netlify/functions/timerControl");
    const result = await response.json();

    if (result.endTime) {
        endTime = new Date(result.endTime);
        startCountdown();
        document.getElementById("startButton").textContent = "Stop Timer";
    } else {
        clearInterval(timerInterval);
        endTime = null;
        document.getElementById("timer").textContent = "00:00:00";
        document.getElementById("startButton").textContent = "Start Timer";
    }
}

// Start the countdown
function startCountdown() {
    if (timerInterval) clearInterval(timerInterval); // Ensure only one interval
    timerInterval = setInterval(updateTimer, 1000);
    updateTimer();
}

// Update the timer display
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
