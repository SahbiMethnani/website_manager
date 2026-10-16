import json
from pathlib import Path
from typing import Optional


class TemplateStore:
    """Persistance simple des templates en fichiers JSON (suffisant pour un MVP,
    remplaçable plus tard par une vraie base de données)."""

    def __init__(self, directory: Path):
        self.directory = directory

    def _path(self, template_id: str) -> Path:
        return self.directory / f"{template_id}.json"

    def save(self, template_id: str, data: dict) -> None:
        self._path(template_id).write_text(
            json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8"
        )

    def load(self, template_id: str) -> Optional[dict]:
        path = self._path(template_id)
        if not path.exists():
            return None
        return json.loads(path.read_text(encoding="utf-8"))
