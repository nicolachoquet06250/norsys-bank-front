<template>
<q-page class="flex column flex-center q-mx-md">
    <img
        alt="Quasar logo"
        src="~assets/norsys.png"
        style="width: 200px; height: 200px"
    >

    <div>
        <biometric-login />
    </div>
</q-page>
</template>

<script setup>
import BiometricLogin from 'components/BiometricLogin.vue'
</script>
