export const BLOCK_TYPES = [
  { type: 'hero', label: 'Bannière (Hero)', defaultProps: { title: 'Titre principal', subtitle: 'Sous-titre accrocheur', buttonText: 'Commencer' } },
  { type: 'text', label: 'Texte', defaultProps: { heading: 'Titre de section', body: 'Votre texte ici...' } },
  { type: 'image', label: 'Image', defaultProps: { src: 'https://via.placeholder.com/800x400', alt: 'Description', caption: '' } },
  { type: 'gallery', label: 'Galerie', defaultProps: { images: [{ src: 'https://via.placeholder.com/300', alt: '' }] } },
  { type: 'cta', label: "Appel à l'action", defaultProps: { heading: 'Prêt à démarrer ?', buttonText: 'Contactez-nous' } },
  { type: 'footer', label: 'Pied de page', defaultProps: { text: '© 2026 Votre société', links: [{ label: 'Accueil', url: '#' }] } },
]
