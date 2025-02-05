const API_URL = "/.netlify/functions/timer"; // Netlify function URL
let endTime = null;
let timerInterval;

document.addEventListener("DOMContentLoaded", async () => {
    const startButton = document.getElementById("startButton");
    const buzzer = document.getElementById("buzzer");

    // Allow buzzer sound on mobile
    document.addEventListener("click", () => {
        window.hasUserInteracted = true;
    });

    // Fetch current timer status from server
    await fetchTimer();

    startButton.addEventListener("click", async () => {
        const authCode = prompt("Enter authentication code:");
        if (authCode === "vadithya16") {
            await fetch(API_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ action: "start", authCode })
            });
            await fetchTimer(); // Refresh timer after starting
        } else {
            alert("Incorrect authentication code!");
        }
    });
});

// Fetch Timer from Server
async function fetchTimer() {
    try {
        const response = await fetch(API_URL);
        const data = await response.json();
        
        if (data.endTime) {
            endTime = new Date(data.endTime);
            startCountdown();
        } else {
            endTime = null;
            document.getElementById("timer").textContent = "00:00:00";
        }
    } catch (error) {
        console.error("Error fetching timer:", error);
    }
}

// Start Countdown
function startCountdown() {
    clearInterval(timerInterval);
    timerInterval = setInterval(updateTimer, 1000);
    updateTimer();
}

// Update Timer Display
function updateTimer() {
    if (!endTime) return;

    const now = new Date();
    const timeRemaining = endTime - now;

    if (timeRemaining <= 0) {
        clearInterval(timerInterval);
        document.getElementById("timer").textContent = "Time Over";

        // Ensure buzzer plays only if user interacted with page
        if (window.hasUserInteracted) {
            document.getElementById("buzzer").play().catch(err => console.warn("Audio play blocked:", err));
        }
        return;
    }

    const hours = String(Math.floor(timeRemaining / (1000 * 60 * 60))).padStart(2, "0");
    const minutes = String(Math.floor((timeRemaining / (1000 * 60)) % 60)).padStart(2, "0");
    const seconds = String(Math.floor((timeRemaining / 1000) % 60)).padStart(2, "0");

    document.getElementById("hours").textContent = hours;
    document.getElementById("minutes").textContent = minutes;
    document.getElementById("seconds").textContent = seconds;
}

// Global flag to detect user interaction
window.hasUserInteracted = false;
