function renderBlock(block) {
  const p = block.props
  switch (block.type) {
    case 'hero':
      return (
        <section className="pv-block pv-hero" key={block.id}>
          <h1>{p.title}</h1>
          <p>{p.subtitle}</p>
          {p.buttonText && <a className="pv-btn">{p.buttonText}</a>}
        </section>
      )
    case 'text':
      return (
        <section className="pv-block" key={block.id}>
          {p.heading && <h2>{p.heading}</h2>}
          <p>{p.body}</p>
        </section>
      )
    case 'image':
      return (
        <section className="pv-block" key={block.id}>
          <img src={p.src} alt={p.alt} style={{ maxWidth: '100%' }} />
          {p.caption && <figcaption>{p.caption}</figcaption>}
        </section>
      )
    case 'gallery':
      return (
        <section className="pv-block pv-gallery" key={block.id}>
          {(p.images || []).map((img, i) => <img key={i} src={img.src} alt={img.alt} />)}
        </section>
      )
    case 'cta':
      return (
        <section className="pv-block pv-cta" key={block.id}>
          <h2>{p.heading}</h2>
          <a className="pv-btn pv-btn-alt">{p.buttonText}</a>
        </section>
      )
    case 'footer':
      return (
        <footer className="pv-block pv-footer" key={block.id}>
          <p>{p.text}</p>
        </footer>
      )
    default:
      return null
  }
}

export default function Preview({ blocks, meta }) {
  return (
    <div className="preview-frame" style={{ '--primary': meta.primaryColor, fontFamily: meta.font }}>
      {blocks.map(renderBlock)}
    </div>
  )
}
