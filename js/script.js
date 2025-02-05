let endTime = null;
let timerInterval;

document.addEventListener("DOMContentLoaded", async () => {
    const startButton = document.getElementById("startButton");

    await fetchEndTime(); // Get the timer state from the server

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

        await fetchEndTime(); // Update the timer
    });

    setInterval(fetchEndTime, 5000); // Poll every 5 seconds
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
    if (timerInterval) clearInterval(timerInterval);
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

        // Debugging log (uncomment if needed)
        console.log("Timer reached zero. Time Over!");

        return;
    }

    const minutes = String(Math.floor((timeRemaining / (1000 * 60)))).padStart(2, "0");
    const seconds = String(Math.floor((timeRemaining / 1000) % 60)).padStart(2, "0");

    document.getElementById("minutes").textContent = minutes;
    document.getElementById("seconds").textContent = seconds;
}
