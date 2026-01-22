import twilio from "twilio";

export const sendWhatsApp = async (to, message) => {
  try {
    if (
      !process.env.TWILIO_ACCOUNT_SID ||
      !process.env.TWILIO_AUTH_TOKEN ||
      !process.env.TWILIO_WHATSAPP_FROM
    ) {
      throw new Error("Twilio env variables missing");
    }

    const client = twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );

    await client.messages.create({
      from: process.env.TWILIO_WHATSAPP_FROM,
      to: `whatsapp:${to}`,
      body: message,
    });

    console.log("📲 WhatsApp message sent to:", to);
  } catch (err) {
    console.error("❌ WhatsApp send failed:", err.message);
  }
};
