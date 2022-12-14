<template>
  <q-page class="flex column flex-center">
    <img
      alt="Quasar logo"
      src="~assets/norsys.png"
      style="width: 200px; height: 200px"
    >

    <q-form class="q-gutter-md flex column flex-center" style="min-width: 50%;">
      <q-input v-model="user.email" dense type="email" label="e-mail" style="width: 100%" />
      <q-input v-model="user.password" dense type="password" label="Mot de passe" style="width: 100%" />
      <q-toggle v-model="user.biometricLogin" label="Utiliser votre emprinte digitale" style="width: 100%" class="self-start" />

      <q-btn label="S'inscrire" icon="person_add" @click.prevent="handleRegister" />

      <router-link :to="{ name: 'login' }">
        Déjà inscrit ?
      </router-link>
    </q-form>
  </q-page>
</template>

<script setup>
import { reactive } from 'vue'

const user = reactive({
  email: '',
  password: '',
  biometricLogin: false
})
</script>
