exports.handler = async (event) => {
    const { action, authCode } = JSON.parse(event.body);

    // Secure authentication (You can later move this to an environment variable in Netlify)
    const VALID_AUTH_CODE = "secure123"; 

    if (authCode !== VALID_AUTH_CODE) {
        return {
            statusCode: 401,
            body: JSON.stringify({ success: false, message: "Unauthorized" }),
        };
    }

    if (action === "start") {
        const endTime = Date.now() + 24 * 60 * 60 * 1000; // 24 hours from now
        return {
            statusCode: 200,
            body: JSON.stringify({ success: true, endTime }),
        };
    } else if (action === "stop") {
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
