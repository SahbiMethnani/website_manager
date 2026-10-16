import { useState } from 'react'
import BlockPalette from './components/BlockPalette'
import Canvas from './components/Canvas'
import BlockEditor from './components/BlockEditor'
import Preview from './components/Preview'
import ExportPanel from './components/ExportPanel'
import UploadDesign from './components/UploadDesign'

let uid = 0
const nextId = () => `b${Date.now()}_${uid++}`

export default function App() {
  const [mode, setMode] = useState('build') // 'build' | 'upload'
  const [name, setName] = useState('Mon site')
  const [meta, setMeta] = useState({ title: 'Mon site', primaryColor: '#2563eb', font: 'Inter, sans-serif' })
  const [blocks, setBlocks] = useState([])
  const [selectedId, setSelectedId] = useState(null)

  const addBlock = (def) => {
    const newBlock = { id: nextId(), type: def.type, props: { ...def.defaultProps } }
    setBlocks([...blocks, newBlock])
    setSelectedId(newBlock.id)
  }

  const updateBlock = (updated) => {
    setBlocks(blocks.map((b) => (b.id === updated.id ? updated : b)))
  }

  const moveBlock = (index, dir) => {
    const newBlocks = [...blocks]
    const target = index + dir
    if (target < 0 || target >= newBlocks.length) return
    ;[newBlocks[index], newBlocks[target]] = [newBlocks[target], newBlocks[index]]
    setBlocks(newBlocks)
  }

  const removeBlock = (id) => {
    setBlocks(blocks.filter((b) => b.id !== id))
    if (selectedId === id) setSelectedId(null)
  }

  const selectedBlock = blocks.find((b) => b.id === selectedId) || null
  const template = { name, meta, blocks }

  return (
    <div className="app">
      <header className="app-header">
        <h1>Gestionnaire de site web</h1>
        <div className="mode-switch">
          <button className={mode === 'build' ? 'active' : ''} onClick={() => setMode('build')}>
            Créer un template
          </button>
          <button className={mode === 'upload' ? 'active' : ''} onClick={() => setMode('upload')}>
            J'ai déjà une maquette
          </button>
        </div>
      </header>

      {mode === 'build' ? (
        <>
          <div className="meta-bar">
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nom du projet" />
            <input value={meta.title} onChange={(e) => setMeta({ ...meta, title: e.target.value })} placeholder="Titre <head>" />
            <input type="color" value={meta.primaryColor} onChange={(e) => setMeta({ ...meta, primaryColor: e.target.value })} />
          </div>
          <div className="builder-grid">
            <BlockPalette onAdd={addBlock} />
            <Canvas blocks={blocks} selectedId={selectedId} onSelect={setSelectedId} onMove={moveBlock} onRemove={removeBlock} />
            <BlockEditor block={selectedBlock} onChange={updateBlock} />
            <div className="preview-col">
              <Preview blocks={blocks} meta={meta} />
              <ExportPanel template={template} />
            </div>
          </div>
        </>
      ) : (
        <UploadDesign />
      )}
    </div>
  )
}
