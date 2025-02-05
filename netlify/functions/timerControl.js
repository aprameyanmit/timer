let endTime = null; // Store the timer globally on the server

exports.handler = async (event) => {
    if (event.httpMethod === "GET") {
        return {
            statusCode: 200,
            body: JSON.stringify({ endTime }),
        };
    }

    const { action, authCode } = JSON.parse(event.body);
    const VALID_AUTH_CODE = "secure123"; // Change this for better security

    if (authCode !== VALID_AUTH_CODE) {
        return {
            statusCode: 401,
            body: JSON.stringify({ success: false, message: "Unauthorized" }),
        };
    }

    if (action === "start") {
        endTime = Date.now() + 24 * 60 * 60 * 1000; // Set timer for 24 hours
        return {
            statusCode: 200,
            body: JSON.stringify({ success: true, endTime }),
        };
    } else if (action === "stop") {
        endTime = null;
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
