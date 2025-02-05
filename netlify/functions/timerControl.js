let endTime = null; // Global timer variable

exports.handler = async (event) => {
    if (event.httpMethod === "GET") {
        // Return the current timer state to all users
        return {
            statusCode: 200,
            body: JSON.stringify({ endTime }),
        };
    }

    // Handle POST requests for starting/stopping the timer
    const { action, authCode } = JSON.parse(event.body);
    const VALID_AUTH_CODE = "vadithya16"; // Change this for better security

    if (authCode !== VALID_AUTH_CODE) {
        return {
            statusCode: 401,
            body: JSON.stringify({ success: false, message: "Unauthorized" }),
        };
    }

    if (action === "start") {
        if (!endTime) {
            endTime = Date.now() + 24 * 60 * 60 * 1000; // 24-hour timer
        }
        return {
            statusCode: 200,
            body: JSON.stringify({ success: true, endTime }),
        };
    } else if (action === "stop") {
        endTime = null; // Reset the timer for all users
        return {
            statusCode: 200,
            body: JSON.stringify({ success: true, endTime: null }),
        };
    }

    return {
        statusCode: 400,
        body: JSON.stringify({ success: false, message: "Invalid action" }),
    };
};
