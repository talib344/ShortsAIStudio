import os

from dotenv import load_dotenv
from google import genai
from google.genai import types
from pydantic import BaseModel

load_dotenv()


class ShortsOutput(BaseModel):
    hook: str
    script: str
    title: str
    description: str
    hashtags: list[str]
    image_prompt: str
    video_prompt: str


api_key = os.getenv("GEMINI_API_KEY")

if not api_key:
    raise RuntimeError("GEMINI_API_KEY is missing from .env")

client = genai.Client(api_key=api_key)


async def generate_short_content(
    topic: str,
    language: str = "English",
    duration: str = "10 seconds",
    style: str = "Viral",
):
    prompt = f"""
You are an expert YouTube Shorts content creator.

Create a highly engaging short-video content package.

TOPIC:
{topic}

LANGUAGE:
{language}

DURATION:
{duration}

STYLE:
{style}

Requirements:

1. hook:
Create a very strong hook for the first 1-2 seconds.
It should create curiosity immediately.

2. script:
Write a short script that realistically fits the requested duration.

3. title:
Create a highly clickable YouTube Shorts title.

4. description:
Create a concise YouTube Shorts description.

5. hashtags:
Return relevant hashtags as a list.
Include #shorts when appropriate.

6. image_prompt:
Create a detailed prompt for an AI image generator.
Describe subject, environment, lighting, camera and visual style.

7. video_prompt:
Create a detailed AI video generation prompt.
Describe action, movement, camera motion, environment and cinematic details.

Do not include explanations outside the requested fields.
Return the content in the requested language.
"""

    response = await client.aio.models.generate_content(
        model="gemini-3.6-flash",
        contents=prompt,
        config=types.GenerateContentConfig(
            response_mime_type="application/json",
            response_schema=ShortsOutput,
        ),
    )

    result = ShortsOutput.model_validate_json(response.text)

    return result.model_dump()