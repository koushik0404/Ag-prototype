from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env")

    demo_mode: bool = True
    demo_otp: str = "123456"
    database_url: str = "sqlite:///./godam.db"
    gemini_api_key: str = ""  # removed when the agent moves to OpenRouter
    agent_model: str = "gemini-3.1-flash-lite"  # removed with it
    openrouter_api_key: str = ""
    openrouter_model: str = "openrouter/free"


settings = Settings()