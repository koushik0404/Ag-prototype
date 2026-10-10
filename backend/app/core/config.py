from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env")

    demo_mode: bool = True
    demo_otp: str = "123456"
    database_url: str = "sqlite:///./godam.db"
    sarvam_api_key: str = ""
    anthropic_api_key: str = ""
    gemini_api_key: str = ""
    agent_model: str = "gemini-3.1-flash-lite"


settings = Settings()