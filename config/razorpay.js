import Razorpay from "razorpay";
import dotenv from "dotenv";

dotenv.config();

const getRazorpayClient = () => {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    throw new Error("Razorpay keys are not configured");
  }

  const cleanKeyId = keyId.trim();
  const cleanKeySecret = keySecret.trim();

  const razorpay = new Razorpay({
    key_id: cleanKeyId,
    key_secret: cleanKeySecret,
  });

  return razorpay;
};

export default getRazorpayClient;