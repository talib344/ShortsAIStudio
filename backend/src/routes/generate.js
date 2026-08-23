const express = require("express");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const {
      topic,
      language = "English",
      duration = "10 seconds",
      style = "Viral",
    } = req.body;

    if (!topic || !topic.trim()) {
      return res.status(400).json({
        success: false,
        error: "Topic is required",
      });
    }

    const aiServiceUrl =
      process.env.AI_SERVICE_URL || "http://127.0.0.1:8000";

    const targetUrl = `${aiServiceUrl}/generate`;

    console.log("=================================");
    console.log("Node -> Python AI request");
    console.log("Target:", targetUrl);
    console.log("Topic:", topic);
    console.log("=================================");

    const response = await fetch(targetUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        topic: topic.trim(),
        language,
        duration,
        style,
      }),
    });

    const responseText = await response.text();

    console.log("Python HTTP status:", response.status);
    console.log("Python response:", responseText);

    let data;

    try {
      data = JSON.parse(responseText);
    } catch (parseError) {
      return res.status(502).json({
        success: false,
        error: "Python returned invalid JSON",
        details: responseText,
      });
    }

    if (!response.ok) {
      return res.status(response.status).json({
        success: false,
        error: data.detail || data.error || "AI service returned an error",
      });
    }

    return res.status(200).json(data);
  } catch (error) {
    console.error("=================================");
    console.error("NODE -> PYTHON CONNECTION ERROR");
    console.error(error);
    console.error("=================================");

    return res.status(500).json({
      success: false,
      error: "Unable to connect to AI service",
      details: error.message,
    });
  }
});

module.exports = router;