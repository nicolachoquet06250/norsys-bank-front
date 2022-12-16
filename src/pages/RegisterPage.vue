<template>
  <q-page class="flex column flex-center">
    <img
      alt="Quasar logo"
      src="~assets/norsys.png"
      style="width: 200px; height: 200px" />

    <q-form class="q-gutter-md flex column flex-center"
            style="min-width: 50%;">
      <q-input v-model="user.email"
               dense
               type="email"
               :label="$t('register.form.email')"
               style="width: 100%" />
      <q-input v-model="user.password"
               dense
               type="password"
               :label="$t('register.form.password')"
               style="width: 100%" />
      <q-toggle v-model="user.biometricLogin"
               :label="$t('register.form.useBiometric')"
                style="width: 100%"
                class="self-start" />

      <q-btn :label="$t('register.button')"
             :icon="createUserIcon"
             @click.prevent="handleRegister" />

      <router-link :to="{ name: 'login' }">
        {{ $t('register.link') }}
      </router-link>
    </q-form>
  </q-page>
</template>

<script setup>
import { reactive } from 'vue'

const createUserIcon = 'person_add'

const user = reactive({
  email: '',
  password: '',
  biometricLogin: false
})

const handleRegister = () => {
  console.log(user.email, user.password, user.biometricLogin)
}
</script>
