import os
import smtplib
from email.message import EmailMessage
from pathlib import Path


def send_email_with_attachment(
    to_address: str,
    reply_to: str,
    subject: str,
    body: str,
    attachment_path: Path,
    attachment_name: str,
) -> None:
    """Envoie un email avec pièce jointe via SMTP.
    Configuration attendue en variables d'environnement (voir .env.example).
    """
    msg = EmailMessage()
    msg["From"] = os.environ.get("SMTP_FROM", "noreply@votre-societe.tn")
    msg["To"] = to_address
    msg["Reply-To"] = reply_to
    msg["Subject"] = subject
    msg.set_content(body)

    data = attachment_path.read_bytes()
    msg.add_attachment(
        data,
        maintype="application",
        subtype="octet-stream",
        filename=attachment_name,
    )

    host = os.environ.get("SMTP_HOST", "smtp.gmail.com")
    port = int(os.environ.get("SMTP_PORT", 587))
    user = os.environ.get("SMTP_USER")
    password = os.environ.get("SMTP_PASSWORD")

    with smtplib.SMTP(host, port) as server:
        server.starttls()
        if user and password:
            server.login(user, password)
        server.send_message(msg)
