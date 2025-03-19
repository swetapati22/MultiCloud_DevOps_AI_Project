import * as aiService from "../services/aiService.js";

export const startOpenAIConversationController = async (req, res) => {
  try {
    const threadId = await aiService.createOpenAIConversation();
    res.json({ threadId });
  } catch (error) {
    console.error("Error starting OpenAI conversation:", error);
    res
      .status(500)
      .json({ error: "Error starting conversation", details: error.message });
  }
};

export const sendOpenAIMessageController = async (req, res) => {
  try {
    const { threadId, message } = req.body;
    if (!threadId || !message) {
      return res
        .status(400)
        .json({ error: "ThreadId and message are required" });
    }
    const response = await aiService.sendOpenAIMessage(threadId, message);
    res.json({ response });
  } catch (error) {
    console.error("Error sending message to OpenAI:", error);
    res
      .status(500)
      .json({ error: "Error processing message", details: error.message });
  }
};

export const startBedrockConversationController = async (req, res) => {
  try {
    const conversationId = await aiService.createBedrockConversation();
    res.json({ conversationId });
  } catch (error) {
    console.error("Error starting Bedrock conversation:", error);
    res
      .status(500)
      .json({ error: "Error starting conversation", details: error.message });
  }
};

export const sendBedrockMessageController = async (req, res) => {
  try {
    const { conversationId, message } = req.body;
    if (!conversationId || !message) {
      return res
        .status(400)
        .json({ error: "ConversationId and message are required" });
    }
    const response = await aiService.sendBedrockMessage(
      conversationId,
      message
    );
    res.json({ response });
  } catch (error) {
    console.error("Error sending message to Bedrock:", error);
    res
      .status(500)
      .json({ error: "Error processing message", details: error.message });
  }
};

export const analyzeSentimentAndSaveController = async (req, res) => {
  try {
    const { thread } = req.body;
    if (!thread) {
      return res.status(400).json({ error: "Thread data is required" });
    }
    const result = await aiService.analyzeSentimentAndSave(thread);
    res.json(result);
  } catch (error) {
    console.error("Error analyzing sentiment and saving:", error);
    res
      .status(500)
      .json({ error: "Error processing request", details: error.message });
  }
};
