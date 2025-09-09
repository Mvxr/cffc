export async function handler(event, context) {
  try {
    const body = JSON.parse(event.body || "{}");
    const { type, password } = body;

    const accessPass = process.env.ACCESS_PASSWORD;
    const resetPass = process.env.RESET_PASSWORD;

    let ok = false;

    if (type === "access" && password === accessPass) ok = true;
    if (type === "reset" && password === resetPass) ok = true;

    return {
      statusCode: 200,
      body: JSON.stringify({ success: ok })
    };
  } catch (err) {
    return { statusCode: 400, body: JSON.stringify({ error: "Bad request" }) };
  }
}
