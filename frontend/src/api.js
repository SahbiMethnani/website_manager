const API_BASE = '/api'

export async function saveTemplate(template) {
  const res = await fetch(`${API_BASE}/templates`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(template),
  })
  if (!res.ok) throw new Error("Échec de la sauvegarde du template")
  return res.json()
}

export async function generateTemplate(templateId) {
  const res = await fetch(`${API_BASE}/templates/${templateId}/generate`, { method: 'POST' })
  if (!res.ok) throw new Error('Échec de la génération')
  return res.json()
}

export function downloadUrl(templateId) {
  return `${API_BASE}/templates/${templateId}/download`
}

export async function uploadDesign(file) {
  const formData = new FormData()
  formData.append('file', file)
  const res = await fetch(`${API_BASE}/uploads`, { method: 'POST', body: formData })
  if (!res.ok) throw new Error("Échec de l'upload")
  return res.json()
}

export async function sendEmail(payload) {
  const res = await fetch(`${API_BASE}/send-email`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!res.ok) throw new Error("Échec de l'envoi de l'email")
  return res.json()
}
