const { schedule } = require('@netlify/functions');

let endTime = null;

exports.handler = async (event) => {
    if (event.httpMethod === "GET") {
        return {
            statusCode: 200,
            body: JSON.stringify({ endTime })
        };
    }

    if (event.httpMethod === "POST") {
        const { action, authCode } = JSON.parse(event.body);
        if (authCode !== "vadithya16") {
            return { statusCode: 403, body: JSON.stringify({ error: "Unauthorized" }) };
        }

        if (action === "start") {
            endTime = new Date(new Date().getTime() + 24 * 60 * 60 * 1000); // 24 hours timer
            console.log("Timer started:", endTime);
        } else if (action === "stop") {
            endTime = null;
            console.log("Timer stopped");
        }

        return {
            statusCode: 200,
            body: JSON.stringify({ success: true, endTime })
        };
    }

    return { statusCode: 405, body: "Method Not Allowed" };
};
