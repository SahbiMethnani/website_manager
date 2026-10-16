export default function Canvas({ blocks, selectedId, onSelect, onMove, onRemove }) {
  return (
    <div className="panel canvas">
      <h3>Structure du site</h3>
      {blocks.length === 0 && <p className="empty">Ajoutez un bloc depuis la palette →</p>}
      <ul>
        {blocks.map((b, i) => (
          <li
            key={b.id}
            className={b.id === selectedId ? 'selected' : ''}
            onClick={() => onSelect(b.id)}
          >
            <span>{b.type}</span>
            <div className="row-actions">
              <button onClick={(e) => { e.stopPropagation(); onMove(i, -1) }} disabled={i === 0}>↑</button>
              <button onClick={(e) => { e.stopPropagation(); onMove(i, 1) }} disabled={i === blocks.length - 1}>↓</button>
              <button onClick={(e) => { e.stopPropagation(); onRemove(b.id) }}>✕</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
