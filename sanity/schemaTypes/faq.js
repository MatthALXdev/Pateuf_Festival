export default {
  name: 'faq',
  type: 'document',
  title: 'FAQ',
  fields: [
    {
      name: 'questionId',
      type: 'string',
      title: 'ID de la question',
      description: 'Identifiant unique pour la question',
      validation: Rule => Rule.required(),
    },
    {
      name: 'theme',
      type: 'string',
      title: 'Thème',
      description: 'Thème de la question (libre)',
      validation: Rule => Rule.required(),
    },
    {
      name: 'question',
      type: 'text',
      title: 'Question',
      description: 'Contenu de la question',
      validation: Rule => Rule.required().min(10).max(200),
    },
    {
      name: 'reponse',
      type: 'text',
      title: 'Réponse',
      description: 'Contenu de la réponse',
      validation: Rule => Rule.required().min(10).max(200),
    },
    {
      name: 'pinned',
      type: 'boolean',
      title: 'Mise en avant',
      description: 'Afficher cette question sur la page d’accueil',
      initialValue: false,
    },
    {
      name: 'order',
      type: 'number',
      title: 'Ordre d’affichage (si épinglée)',
      description: 'Utilisé pour organiser les questions mises en avant',
      hidden: ({ parent }) => !parent?.pinned,
    },
  ],
}
