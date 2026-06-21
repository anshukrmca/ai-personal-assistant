import { generateChatTitle } from "../src/lib/ai/chat";

async function run() {
  const title = await generateChatTitle("can you tell me if I have any meetings today?");
  console.log("Generated Title:", title);
}

run().catch(console.error);
