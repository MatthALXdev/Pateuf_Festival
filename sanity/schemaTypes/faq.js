export default {
  name: 'faq',
  type: 'document',
  title: 'faq',
  fields: [
    {
      name: 'questionId',
      type: 'string',
      title: 'questionId',
      description: 'Identifiant unique pour la question',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'theme',
      type: 'string',
      title: 'theme',
      description: 'Thème de la question',
      options: {
        list: [
          {title: 'Sécurité et Secours', value: 'Sécurité et Secours'},
          {title: 'Alimentation', value: 'Alimentation'},
          {title: 'Moyens de Transport', value: 'Moyens de Transport'},
          {title: 'Logement', value: 'restauration'},
          {title: 'Paiement et Réseaux', value: 'Paiement et Réseaux'},
        ],
      },
    },
    {
      name: 'question',
      type: 'text',
      title: 'question',
      description: 'Question',
      validation: (Rule) => Rule.required().min(10).max(200),
    },
    {
      name: 'reponse',
      type: 'text',
      title: 'reponse',
      description: 'Réponse à la question',
      validation: (Rule) => Rule.required().min(10).max(200),
    },
  ],
}
