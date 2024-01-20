const { Telegraf, Scenes, session } = require("telegraf");
const { Thing, Comparison } = require("../db/db");
const { addThing, addComparison } = require("../db/db");
const axios = require("axios");
const fs = require("fs");
const path = require("path");
const bot = new Telegraf(""); // replace with your bot token
// Create a scene for submitting a name
const nameScene = new Scenes.BaseScene("nameScene");
// Ensure images directory exists
const imagesDir = path.join(__dirname, "../images");
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}

nameScene.enter((ctx) => {
  ctx.reply(
    "Please submit a name for the NUS thing you want to rank. Your Telegram handle is recorded btw, so pls dont send rude stuff!"
  );
});
nameScene.on("text", (ctx) => {
  ctx.session.name = ctx.message.text;
  ctx.reply(
    "Name received. Please send the corresponding image file, or type /done if you are finished."
  );
  return ctx.scene.enter("imageScene");
});

// Create a scene for submitting an image
const imageScene = new Scenes.BaseScene("imageScene");
imageScene.on("text", (ctx) => {
  console.log(ctx.message.text);
  if (ctx.message.text.toLowerCase() === "/done") {
    // console.log(ctx.session.name);
    return ctx.scene.leave();
  }
});
imageScene.on("photo", async (ctx) => {
  //   console.log(ctx.message.photo);
  //   console.log(ctx.session.name);

  try {
    // Get the file ID of the last photo in the array
    const fileId = ctx.message.photo.slice(-1)[0].file_id;

    // Get the file path from Telegram
    const fileLink = await ctx.telegram.getFileLink(fileId);

    // Define the local file path, saving in '../images/' directory
    const fileName = path.join(imagesDir, `${fileId}.jpg`);

    // Download and save the file
    const response = await axios({
      method: "get",
      url: fileLink,
      responseType: "stream",
    });

    response.data.pipe(fs.createWriteStream(fileName));

    console.log(`Photo saved as ${fileName}`);
    //make a Thing
    const thing = new Thing(
      0,
      ctx.session.name,
      fileId,
      ctx.message.from.id,
      ctx.message.from.username,
      1000
    );
    console.log("telegram thing", thing);
    addThing(thing).then(() => {
      console.log("thing added");
      ctx.reply("Submission received. Thank you!");
    });
  } catch (error) {
    console.error("Error downloading photo:", error);
  }
  return ctx.scene.leave();
});

// Set up the stage with scenes
const stage = new Scenes.Stage([nameScene, imageScene], { ttl: 10 });
bot.use(session());
bot.use(stage.middleware());

// Handle /submitThing command
bot.command("submitThing", (ctx) => {
  // Enter the nameScene when /submitThing is executed
  ctx.scene.enter("nameScene");
});

//utils

bot.launch();
