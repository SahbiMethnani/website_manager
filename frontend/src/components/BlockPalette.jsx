import { BLOCK_TYPES } from '../blockDefinitions'

export default function BlockPalette({ onAdd }) {
  return (
    <div className="panel palette">
      <h3>Blocs disponibles</h3>
      {BLOCK_TYPES.map((b) => (
        <button key={b.type} onClick={() => onAdd(b)}>+ {b.label}</button>
      ))}
    </div>
  )
}
