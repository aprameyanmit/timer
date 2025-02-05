let globalEndTime = null; // Stores the global timer

exports.handler = async (event) => {
    if (event.httpMethod === "POST") {
        const { action, authCode } = JSON.parse(event.body);

        if (authCode !== "secure123") { // Secure authentication
            return { statusCode: 403, body: JSON.stringify({ success: false, message: "Unauthorized" }) };
        }

        if (action === "start") {
            globalEndTime = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes timer
        } else if (action === "stop") {
            globalEndTime = null; // Stop the timer
        }

        return { statusCode: 200, body: JSON.stringify({ success: true }) };
    }

    return {
        statusCode: 200,
        body: JSON.stringify({ endTime: globalEndTime }),
    };
};
