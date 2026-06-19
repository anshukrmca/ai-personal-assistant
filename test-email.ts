import { sendGmailEmail } from "./src/lib/syncService";

async function run() {
  const userId = "9d4845ce-ee29-4562-9c20-bbf9d5907708"; // The user's ID
  const success = await sendGmailEmail(userId, "test@example.com", "Test Subject", "Test Body");
  console.log("Success:", success);
}
run();
