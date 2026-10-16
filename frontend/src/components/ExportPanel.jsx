import { useState } from 'react'
import { saveTemplate, generateTemplate, downloadUrl, sendEmail } from '../api'

export default function ExportPanel({ template }) {
  const [templateId, setTemplateId] = useState(template.id || null)
  const [status, setStatus] = useState('')
  const [showEmailForm, setShowEmailForm] = useState(false)
  const [client, setClient] = useState({ clientName: '', clientEmail: '', clientPhone: '', message: '' })

  const ensureSaved = async () => {
    const { id } = await saveTemplate({ ...template, id: templateId })
    setTemplateId(id)
    return id
  }

  const handleGenerate = async () => {
    setStatus('Génération en cours...')
    const id = await ensureSaved()
    await generateTemplate(id)
    setStatus('Site généré ✓')
  }

  const handleDownload = async () => {
    const id = templateId || (await ensureSaved())
    await generateTemplate(id)
    window.location.href = downloadUrl(id)
  }

  const handleSendEmail = async (e) => {
    e.preventDefault()
    setStatus('Envoi en cours...')
    const id = templateId || (await ensureSaved())
    await generateTemplate(id)
    await sendEmail({ ...client, templateId: id })
    setStatus('Envoyé à la société ✓')
    setShowEmailForm(false)
  }

  return (
    <div className="panel export-panel">
      <h3>Export</h3>
      <div className="export-actions">
        <button onClick={handleGenerate}>Générer</button>
        <button onClick={handleDownload}>Télécharger (.zip)</button>
        <button onClick={() => setShowEmailForm(true)}>Envoyer à la société par email</button>
      </div>
      {status && <p className="status">{status}</p>}

      {showEmailForm && (
        <form className="email-form" onSubmit={handleSendEmail}>
          <input required placeholder="Votre nom" value={client.clientName}
                 onChange={(e) => setClient({ ...client, clientName: e.target.value })} />
          <input required type="email" placeholder="Votre email" value={client.clientEmail}
                 onChange={(e) => setClient({ ...client, clientEmail: e.target.value })} />
          <input placeholder="Téléphone (optionnel)" value={client.clientPhone}
                 onChange={(e) => setClient({ ...client, clientPhone: e.target.value })} />
          <textarea placeholder="Message (optionnel)" value={client.message}
                    onChange={(e) => setClient({ ...client, message: e.target.value })} />
          <div className="form-actions">
            <button type="submit">Confirmer l'envoi</button>
            <button type="button" onClick={() => setShowEmailForm(false)}>Annuler</button>
          </div>
        </form>
      )}
    </div>
  )
}
