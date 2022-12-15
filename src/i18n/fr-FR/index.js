// This is just an example,
// so you can safely delete all default props below

const loginForm = {
  email: 'E-mail',
  password: 'Mot de passe'
}

export default {
  login: {
    button: 'Se connecter',
    link: "Vous n'avez pas de compte ?",
    form: loginForm
  },
  register: {
    button: "S'inscrire",
    link: 'Déjà inscrit ?',
    form: {
      ...loginForm,
      useBiometric: 'Utiliser votre emprinte digitale'
    }
  },
  biometric: {
    buttons: {
      login: 'Se connecter',
      register: "S'inscrire",
      clear: 'Réinitialiser'
    },
    labels: {
      domain: 'Domaine',
      email: 'E-mail',
      completeName: 'Nom complet'
    }
  },
  home: {
    title: 'Accueil'
  },
  notFound: {
    title: '404',
    label: "Oupss ... Il n'y a rien ici 😯",
    button: "Retour à l'accueil"
  }
}
