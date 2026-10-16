"""Générateur HTML/CSS/JS à partir d'un template (JSON de blocs).

Chaque type de bloc a un rendu dédié. Ajouter un nouveau type de bloc = ajouter
une fonction décorée avec @block("mon_type") + son équivalent côté front
(src/components/Preview.jsx et src/blockDefinitions.js).
"""

from html import escape

BLOCK_RENDERERS = {}


def block(block_type):
    def decorator(fn):
        BLOCK_RENDERERS[block_type] = fn
        return fn
    return decorator


@block("hero")
def render_hero(props):
    title = escape(props.get("title", ""))
    subtitle = escape(props.get("subtitle", ""))
    button = escape(props.get("buttonText", ""))
    return f"""
    <section class="block hero">
      <h1>{title}</h1>
      <p>{subtitle}</p>
      {f'<a class="btn" href="#">{button}</a>' if button else ''}
    </section>
    """


@block("text")
def render_text(props):
    heading = escape(props.get("heading", ""))
    body = escape(props.get("body", "")).replace("\n", "<br>")
    return f"""
    <section class="block text-block">
      {f'<h2>{heading}</h2>' if heading else ''}
      <p>{body}</p>
    </section>
    """


@block("image")
def render_image(props):
    src = escape(props.get("src", ""))
    alt = escape(props.get("alt", ""))
    caption = escape(props.get("caption", ""))
    return f"""
    <section class="block image-block">
      <img src="{src}" alt="{alt}">
      {f'<figcaption>{caption}</figcaption>' if caption else ''}
    </section>
    """


@block("gallery")
def render_gallery(props):
    images = props.get("images", [])
    items = "".join(
        f'<img src="{escape(img.get("src",""))}" alt="{escape(img.get("alt",""))}">'
        for img in images
    )
    return f'<section class="block gallery">{items}</section>'


@block("cta")
def render_cta(props):
    heading = escape(props.get("heading", ""))
    button = escape(props.get("buttonText", "En savoir plus"))
    return f"""
    <section class="block cta">
      <h2>{heading}</h2>
      <a class="btn btn-alt" href="#">{button}</a>
    </section>
    """


@block("footer")
def render_footer(props):
    text = escape(props.get("text", ""))
    links = props.get("links", [])
    links_html = "".join(
        f'<a href="{escape(l.get("url","#"))}">{escape(l.get("label",""))}</a>'
        for l in links
    )
    return f"""
    <footer class="block footer">
      <p>{text}</p>
      <nav>{links_html}</nav>
    </footer>
    """


def generate_site_files(template: dict) -> dict:
    """Retourne {"index.html": ..., "style.css": ..., "script.js": ...}"""
    meta = template.get("meta", {})
    blocks = template.get("blocks", [])

    body_html = "\n".join(
        BLOCK_RENDERERS.get(b["type"], lambda p: "")(b.get("props", {}))
        for b in blocks
    )

    primary = meta.get("primaryColor", "#2563eb")
    font = meta.get("font", "Inter, sans-serif")
    title = escape(meta.get("title", template.get("name", "Mon site")))

    html = f"""<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{title}</title>
<link rel="stylesheet" href="style.css">
</head>
<body>
{body_html}
<script src="script.js"></script>
</body>
</html>
"""

    css = f"""
:root {{
  --primary: {primary};
  --font: {font};
}}
* {{ box-sizing: border-box; }}
body {{
  margin: 0;
  font-family: var(--font);
  color: #1f2937;
  line-height: 1.6;
}}
.block {{ padding: 4rem 2rem; max-width: 1100px; margin: 0 auto; }}
.hero {{ text-align: center; }}
.hero h1 {{ font-size: 2.5rem; margin-bottom: .5rem; }}
.btn {{
  display: inline-block;
  background: var(--primary);
  color: #fff;
  padding: .75rem 1.5rem;
  border-radius: 8px;
  text-decoration: none;
  margin-top: 1rem;
}}
.btn-alt {{ background: #111827; }}
.gallery {{ display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; }}
.gallery img {{ width: 100%; border-radius: 8px; }}
.cta {{ background: #f3f4f6; text-align: center; }}
.footer {{ background: #111827; color: #d1d5db; text-align: center; }}
.footer a {{ color: #d1d5db; margin: 0 .5rem; }}
"""

    js = "// Script généré automatiquement — ajoutez ici vos interactions JS.\n"

    return {"index.html": html, "style.css": css, "script.js": js}
