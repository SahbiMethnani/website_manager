import os
import shutil
import uuid
import zipfile
from pathlib import Path
from typing import List, Optional

from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from pydantic import BaseModel, EmailStr

from generator import generate_site_files
from email_service import send_email_with_attachment
from store import TemplateStore

BASE_DIR = Path(__file__).parent
STORAGE_DIR = BASE_DIR / "storage"
TEMPLATES_DIR = STORAGE_DIR / "templates"
EXPORTS_DIR = STORAGE_DIR / "exports"
UPLOADS_DIR = STORAGE_DIR / "uploads"

for d in (TEMPLATES_DIR, EXPORTS_DIR, UPLOADS_DIR):
    d.mkdir(parents=True, exist_ok=True)

app = FastAPI(title="Website Manager API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # à restreindre à votre domaine en production
    allow_methods=["*"],
    allow_headers=["*"],
)

store = TemplateStore(TEMPLATES_DIR)


# ---------- Schémas ----------

class Block(BaseModel):
    id: str
    type: str
    props: dict = {}


class SiteMeta(BaseModel):
    title: str = "Mon site"
    primaryColor: str = "#2563eb"
    font: str = "Inter, sans-serif"


class Template(BaseModel):
    id: Optional[str] = None
    name: str
    meta: SiteMeta
    blocks: List[Block]


class SendEmailPayload(BaseModel):
    clientName: str
    clientEmail: EmailStr
    clientPhone: Optional[str] = None
    message: Optional[str] = None
    templateId: Optional[str] = None
    uploadId: Optional[str] = None


# ---------- Endpoints Templates (mode "créer un template") ----------

@app.post("/api/templates")
def save_template(template: Template):
    template.id = template.id or str(uuid.uuid4())
    store.save(template.id, template.dict())
    return {"id": template.id}


@app.get("/api/templates/{template_id}")
def get_template(template_id: str):
    data = store.load(template_id)
    if not data:
        raise HTTPException(404, "Template introuvable")
    return data


@app.post("/api/templates/{template_id}/generate")
def generate(template_id: str):
    data = store.load(template_id)
    if not data:
        raise HTTPException(404, "Template introuvable")

    files = generate_site_files(data)
    export_dir = EXPORTS_DIR / template_id
    if export_dir.exists():
        shutil.rmtree(export_dir)
    export_dir.mkdir(parents=True)

    for filename, content in files.items():
        (export_dir / filename).write_text(content, encoding="utf-8")

    zip_path = EXPORTS_DIR / f"{template_id}.zip"
    with zipfile.ZipFile(zip_path, "w", zipfile.ZIP_DEFLATED) as zf:
        for filename in files:
            zf.write(export_dir / filename, arcname=filename)

    return {"downloadUrl": f"/api/templates/{template_id}/download"}


@app.get("/api/templates/{template_id}/download")
def download(template_id: str):
    zip_path = EXPORTS_DIR / f"{template_id}.zip"
    if not zip_path.exists():
        raise HTTPException(404, "Export introuvable, générez-le d'abord")
    return FileResponse(zip_path, filename=f"site_{template_id}.zip")


# ---------- Upload d'une maquette déjà prête (HTML/CSS/JS zippé, export Figma, PDF, etc.) ----------

@app.post("/api/uploads")
async def upload_design(file: UploadFile = File(...)):
    upload_id = str(uuid.uuid4())
    ext = Path(file.filename).suffix
    dest = UPLOADS_DIR / f"{upload_id}{ext}"
    with dest.open("wb") as f:
        shutil.copyfileobj(file.file, f)
    return {"uploadId": upload_id, "filename": file.filename}


# ---------- Envoi par email vers la société (depuis un template généré OU un upload) ----------

@app.post("/api/send-email")
def send_email(payload: SendEmailPayload):
    attachment_path = None
    original_name = "site.zip"

    if payload.templateId:
        zip_path = EXPORTS_DIR / f"{payload.templateId}.zip"
        if not zip_path.exists():
            raise HTTPException(400, "Générez d'abord le site avant l'envoi")
        attachment_path = zip_path
        original_name = f"site_{payload.templateId}.zip"

    elif payload.uploadId:
        matches = list(UPLOADS_DIR.glob(f"{payload.uploadId}.*"))
        if not matches:
            raise HTTPException(404, "Fichier uploadé introuvable")
        attachment_path = matches[0]
        original_name = attachment_path.name

    else:
        raise HTTPException(400, "templateId ou uploadId requis")

    subject = f"Nouvelle maquette de site web — {payload.clientName}"
    body = (
        f"Client : {payload.clientName}\n"
        f"Email : {payload.clientEmail}\n"
        f"Téléphone : {payload.clientPhone or '-'}\n\n"
        f"Message :\n{payload.message or '(aucun)'}\n"
    )

    send_email_with_attachment(
        to_address=os.environ.get("COMPANY_EMAIL", "contact@votre-societe.tn"),
        reply_to=payload.clientEmail,
        subject=subject,
        body=body,
        attachment_path=attachment_path,
        attachment_name=original_name,
    )
    return {"status": "sent"}


@app.get("/api/health")
def health():
    return {"status": "ok"}
