import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function (req, res) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message:
          "OpenAI API key not configured, please follow instructions in README.md",
      },
    });
    return;
  }

  const topic = req.body.topic || "";
  if (topic.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Please enter a valid topic",
      },
    });
    return;
  }

  try {
    // const completion = await openai.createCompletion({
    //   model: "text-davinci-003",
    //   prompt: generatePrompt(animal),
    //   temperature: 0.6,
    // });
    const response = await openai.createImage({
      prompt: generatePrompt(topic),
      n: 1,
      size: "512x512",
    });
    const image_url = response.data.data[0].url;
    res.status(200).json({ result: image_url });
  } catch (error) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: "An error occurred during your request.",
        },
      });
    }
  }
}

const generatePrompt = (topic) =>
  `Make a painting of ${topic} similar to what Vincent van Gogh would make`;
