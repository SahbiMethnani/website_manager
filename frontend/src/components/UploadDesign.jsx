import { useState } from 'react'
import { uploadDesign, sendEmail } from '../api'

export default function UploadDesign() {
  const [file, setFile] = useState(null)
  const [uploadId, setUploadId] = useState(null)
  const [client, setClient] = useState({ clientName: '', clientEmail: '', clientPhone: '', message: '' })
  const [status, setStatus] = useState('')

  const handleUpload = async () => {
    if (!file) return
    setStatus('Envoi du fichier au serveur...')
    const res = await uploadDesign(file)
    setUploadId(res.uploadId)
    setStatus("Fichier reçu ✓ — complétez vos coordonnées pour l'envoyer à la société")
  }

  const handleSend = async (e) => {
    e.preventDefault()
    setStatus('Envoi en cours...')
    await sendEmail({ ...client, uploadId })
    setStatus('Envoyé à la société ✓')
  }

  return (
    <div className="panel upload-design">
      <h3>Vous avez déjà votre maquette ?</h3>
      <p>HTML/CSS/JS (zip), export Figma, ou tout autre format UI/UX connu.</p>
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <button onClick={handleUpload} disabled={!file}>Envoyer le fichier au serveur</button>

      {uploadId && (
        <form onSubmit={handleSend} className="email-form">
          <input required placeholder="Votre nom" value={client.clientName}
                 onChange={(e) => setClient({ ...client, clientName: e.target.value })} />
          <input required type="email" placeholder="Votre email" value={client.clientEmail}
                 onChange={(e) => setClient({ ...client, clientEmail: e.target.value })} />
          <input placeholder="Téléphone (optionnel)" value={client.clientPhone}
                 onChange={(e) => setClient({ ...client, clientPhone: e.target.value })} />
          <textarea placeholder="Message (optionnel)" value={client.message}
                    onChange={(e) => setClient({ ...client, message: e.target.value })} />
          <button type="submit">Envoyer à la société</button>
        </form>
      )}
      {status && <p className="status">{status}</p>}
    </div>
  )
}
