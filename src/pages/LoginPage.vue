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

      <q-btn label="Se connecter" icon="login" @click.prevent="handleLogin" />
      <router-link :to="{ name: 'register' }">
        Vous n'avez pas de compte ?
      </router-link>
    </q-form>
  </q-page>
</template>

<script setup>
import { reactive } from 'vue'

const user = reactive({
  email: '',
  password: ''
})

const handleLogin = () => {
  console.log(user.email, user.password)
}
</script>
