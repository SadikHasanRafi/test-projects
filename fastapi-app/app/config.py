# Settings are read from environment variables or the .env file.
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    api_token: str = "secret123"  # env var API_TOKEN
    database_url: str = "sqlite:///database.sqlite"

    model_config = SettingsConfigDict(env_file=".env")


settings = Settings()
