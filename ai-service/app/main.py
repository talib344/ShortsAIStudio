from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field

from app.services.gemini import generate_short_content


app = FastAPI(
    title="Shorts AI Studio AI Service",
    version="1.0.0",
)


class GenerateRequest(BaseModel):
    topic: str = Field(..., min_length=1)
    language: str = "English"
    duration: str = "10 seconds"
    style: str = "Viral"


@app.get("/")
async def root():
    return {
        "success": True,
        "message": "Shorts AI Studio AI Service is running",
    }


@app.get("/health")
async def health():
    return {
        "success": True,
        "status": "healthy",
        "service": "ai-service",
    }


@app.post("/generate")
async def generate(request: GenerateRequest):
    try:
        result = await generate_short_content(
            topic=request.topic.strip(),
            language=request.language,
            duration=request.duration,
            style=request.style,
        )

        return {
            "success": True,
            "data": result,
        }

    except Exception as exc:
        print(f"Generation error: {exc}")

        raise HTTPException(
            status_code=500,
            detail="AI generation failed. Check the Python console for the exact error.",
        ) from exc