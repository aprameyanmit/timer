const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

let endTime = null;

// Get Timer Status
app.get("/timer", (req, res) => {
    res.json({ endTime });
});

// Start Timer (Admin Auth)
app.post("/start", (req, res) => {
    const { authCode } = req.body;
    if (authCode !== "secure123") return res.status(403).json({ error: "Unauthorized" });

    endTime = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
    res.json({ success: true, endTime });
});

// Stop Timer (Admin Auth)
app.post("/stop", (req, res) => {
    const { authCode } = req.body;
    if (authCode !== "secure123") return res.status(403).json({ error: "Unauthorized" });

    endTime = null;
    res.json({ success: true });
});

// Start Server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
