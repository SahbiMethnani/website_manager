export default function BlockEditor({ block, onChange }) {
  if (!block) return <div className="panel editor empty">Sélectionnez un bloc pour l'éditer</div>

  const setProp = (key, value) => {
    onChange({ ...block, props: { ...block.props, [key]: value } })
  }

  return (
    <div className="panel editor">
      <h3>Propriétés — {block.type}</h3>
      {Object.entries(block.props).map(([key, value]) => {
        if (Array.isArray(value)) return null // édition avancée (listes) omise pour cette v1
        return (
          <label key={key}>
            {key}
            <input value={value} onChange={(e) => setProp(key, e.target.value)} />
          </label>
        )
      })}
    </div>
  )
}
