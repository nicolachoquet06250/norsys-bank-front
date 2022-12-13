<template>
  <q-form>
    <q-input v-model="rpId" disable dense type="text" label="domaine" />
    <q-input v-model="user.email" dense type="email" label="e-mail" />
    <q-input v-model="user.displayName" dense type="name" label="Nom complet" />

    <q-btn label="Register" icon="fingerprint" @click.prevent="createRegistration" />
    <q-btn label="Login" icon="fingerprint" @click.prevent="checkRegistration()" />
    <q-btn label="Clear registrations" icon="fingerprint" @click.prevent="clearRegistration()" />
  </q-form>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { Cookies, useQuasar } from 'quasar'
import { getBackendUrl } from 'boot/helpers.js'

const $q = useQuasar()

const AVAILABLE_ID_CHARS = '0123456789abcdefghijklmnopqrstuvwxyz'
const BACKEND_URL = getBackendUrl()
const URLS = {
  GET_CREATE_ARGS: {
    url: '/api/get-create-args',
    method: 'get'
  },
  GET_GET_ARGS: {
    url: '/api/get-get-args',
    method: 'get'
  },
  PROCESS_CREATE: {
    url: '/api/process-create',
    method: 'post'
  },
  PROCESS_GET: {
    url: '/api/process-get',
    method: 'post'
  },
  CLEAR_REGISTRATIONS: {
    url: '/api/clear-registrations',
    method: 'get'
  },
  QUERY_FIDO_META_DATA_SERVICE: {
    url: '/api/query-fido-meta-data-service',
    method: 'get'
  }
}

const token = ref(null)

const rpId = ref(location.hostname)

const user = reactive({
  id: randomString(16, AVAILABLE_ID_CHARS),
  email: null,
  displayName: null
})

const query = reactive({
  apple: '1',
  yubico: '1',
  solo: '1',
  hypersecu: '1',
  google: '1',
  microsoft: '0',
  mds: '1',
  requireResidentKey: '0',
  type_usb: '0',
  type_nfc: '0',
  type_ble: '0',
  type_int: '1',
  'fmt_android-key': '1',
  'fmt_android-safetynet': '1',
  fmt_apple: '1',
  'fmt_fido-u2f': '1',
  fmt_none: '1',
  fmt_packed: '1',
  fmt_tpm: '1',
  userVerification: 'discouraged'
})

const queryParams = computed(() => {
  const url = []

  for (const key of Object.keys(query)) {
    url.push(`${key}=${query[key]}`)
  }

  url.push(`rpId=${encodeURIComponent(rpId.value)}`)

  url.push(`userId=${encodeURIComponent(user.id)}`)
  url.push(`userName=${encodeURIComponent(user.email)}`)
  url.push(`userDisplayName=${encodeURIComponent(user.displayName)}`)

  if (!Cookies.get('PHPSESSID')) {
    Cookies.set('PHPSESSID', randomString(16, AVAILABLE_ID_CHARS), {
      domain: 'norsys-bank.local',
      httpOnly: true,
      secure: true
    })
  }

  url.push(`sid=${Cookies.get('PHPSESSID')}`)

  return '?' + url.join('&')
})

/**
 * creates a new FIDO2 registration
 * @returns {undefined}
 */
function createRegistration () {
  // check browser support
  if (!window.fetch || !navigator.credentials || !navigator.credentials.create) {
    const err = new Error('Browser not supported.')

    console.error(err)
    $q.notify({
      type: 'negative',
      message: err.message,
      timeout: 5000
    })
  }

  fetch(BACKEND_URL + URLS.GET_CREATE_ARGS.url + queryParams.value, {
    method: URLS.GET_CREATE_ARGS.method,
    cache: 'no-cache'
  }).then(r => r.json())
    .then(createArgs => {
      // error handling
      if (createArgs.success === false) {
        throw new Error(createArgs.msg || 'unknown error occured')
      }

      if (createArgs.token) {
        token.value = createArgs.token

        createArgs = { publicKey: createArgs.publicKey }
      }

      // replace binary base64 data with ArrayBuffer. a other way to do this
      // is the reviver function of JSON.parse()
      recursiveBase64StrToArrayBuffer(createArgs)

      // create credentials
      return navigator.credentials.create(createArgs)
    })
    .then(cred => {
      // create object
      const authenticatorAttestationResponse = {
        clientDataJSON: cred.response.clientDataJSON ? arrayBufferToBase64(cred.response.clientDataJSON) : null,
        attestationObject: cred.response.attestationObject ? arrayBufferToBase64(cred.response.attestationObject) : null
      }

      return fetch(BACKEND_URL + URLS.PROCESS_CREATE.url + queryParams.value, {
        method: URLS.PROCESS_CREATE.method,
        body: JSON.stringify(authenticatorAttestationResponse),
        cache: 'no-cache',
        headers: {
          Authorization: `Bearer ${token.value ?? 'no-token'}`
        }
      })
    })
    .then(r => r.json())
    .then(authenticatorAttestationServerResponse => {
      if (authenticatorAttestationServerResponse.success) {
        // reloadServerPreview()
        $q.notify({
          type: 'positive',
          message: authenticatorAttestationServerResponse.msg || 'registration success',
          timeout: 5000
        })
      } else {
        throw new Error(authenticatorAttestationServerResponse.msg)
      }
    })
    .catch(err => {
      // reloadServerPreview()

      console.error(err)
      $q.notify({
        type: 'negative',
        message: err.message || 'unknown error occured',
        timeout: 5000
      })
    })
}

/**
 * checks a FIDO2 registration
 * @returns {undefined}
 */
function checkRegistration () {
  if (!window.fetch || !navigator.credentials || !navigator.credentials.create) {
    const err = new Error('Browser not supported.')

    console.error(err)
    $q.notify({
      type: 'negative',
      message: err.message,
      timeout: 5000
    })
  }

  fetch(BACKEND_URL + URLS.GET_GET_ARGS.url + queryParams.value, {
    method: URLS.GET_GET_ARGS.method,
    cache: 'no-cache',
    headers: {
      Authorization: `Bearer ${token.value ?? 'no-token'}`
    }
  })
    .then(r => r.json())
    .then(getArgs => {
      // error handling
      if (getArgs.success === false) {
        throw new Error(getArgs.msg)
      }

      // replace binary base64 data with ArrayBuffer. a other way to do this
      // is the reviver function of JSON.parse()
      recursiveBase64StrToArrayBuffer(getArgs)

      // check credentials with hardware
      return navigator.credentials.get(getArgs)
    })
    .then(cred => {
      // create object for transmission to server
      const authenticatorAttestationResponse = {
        id: cred.rawId ? arrayBufferToBase64(cred.rawId) : null,
        clientDataJSON: cred.response.clientDataJSON ? arrayBufferToBase64(cred.response.clientDataJSON) : null,
        authenticatorData: cred.response.authenticatorData ? arrayBufferToBase64(cred.response.authenticatorData) : null,
        signature: cred.response.signature ? arrayBufferToBase64(cred.response.signature) : null,
        userHandle: cred.response.userHandle ? arrayBufferToBase64(cred.response.userHandle) : null
      }

      // send to server
      return fetch(BACKEND_URL + URLS.PROCESS_GET.url + queryParams.value, {
        method: URLS.PROCESS_GET.method,
        body: JSON.stringify(authenticatorAttestationResponse),
        cache: 'no-cache',
        headers: {
          Authorization: `Bearer ${token.value ?? 'no-token'}`
        }
      })
    })
    .then(r => r.json())
    .then(authenticatorAttestationServerResponse => {
      // check server response
      if (authenticatorAttestationServerResponse.success) {
        // reloadServerPreview()
        $q.notify({
          type: 'positive',
          message: authenticatorAttestationServerResponse.msg || 'login success',
          timeout: 5000
        })
      } else {
        throw new Error(authenticatorAttestationServerResponse.msg)
      }
    })
    .catch(err => {
      // reloadServerPreview()

      console.error(err)
      $q.notify({
        type: 'negative',
        message: err.message || 'unknown error occured',
        timeout: 5000
      })
    })
}

function clearRegistration () {
  if (!window.fetch || !navigator.credentials || !navigator.credentials.create) {
    const err = new Error('Browser not supported.')

    console.error(err)
    $q.notify({
      type: 'negative',
      message: err.message,
      timeout: 5000
    })
  }

  fetch(BACKEND_URL + URLS.CLEAR_REGISTRATIONS.url + queryParams.value, {
    method: URLS.CLEAR_REGISTRATIONS.method,
    cache: 'no-cache',
    headers: {
      Authorization: `Bearer ${token.value ?? 'no-token'}`
    }
  }).then(r => r.json())
    .then(function (json) {
      if (json.success) {
        // reloadServerPreview()
        $q.notify({
          type: 'positive',
          message: json.msg,
          timeout: 5000
        })
      } else {
        throw new Error(json.msg)
      }
    })
    .catch(function (err) {
      // reloadServerPreview()

      console.error(err)
      $q.notify({
        type: 'negative',
        message: err.message || 'unknown error occured',
        timeout: 5000
      })
    })
}

// function queryFidoMetaDataService () {
//   fetch(`${BACKEND_URL}${URLS.QUERY_FIDO_META_DATA_SERVICE.url}?_=_` + getGetParams(), {
//     method: URLS.QUERY_FIDO_META_DATA_SERVICE.method,
//     cache: 'no-cache'
//   }).then(r => r.json())
//     .then(function (json) {
//       if (json.success) {
//         $q.notify({
//           type: 'success',
//           message: json.msg,
//           timeout: 5000
//         })
//       } else {
//         throw new Error(json.msg)
//       }
//     }).catch(function (err) {
//       $q.notify({
//         type: 'negative',
//         message: err.message || 'unknown error occured',
//         timeout: 5000
//       })
//     })
// }

/**
 * convert RFC 1342-like base64 strings to array buffer
 * @param {mixed} obj
 * @returns {undefined}
 */
function recursiveBase64StrToArrayBuffer (obj) {
  const prefix = '=?BINARY?B?'
  const suffix = '?='
  if (typeof obj === 'object') {
    for (const key in obj) {
      if (typeof obj[key] === 'string') {
        let str = obj[key]
        if (str.substring(0, prefix.length) === prefix && str.substring(str.length - suffix.length) === suffix) {
          str = str.substring(prefix.length, str.length - suffix.length)

          const binaryString = atob(str)
          const len = binaryString.length
          const bytes = new Uint8Array(len)
          for (let i = 0; i < len; i++) {
            bytes[i] = binaryString.charCodeAt(i)
          }
          obj[key] = bytes.buffer
        }
      } else {
        recursiveBase64StrToArrayBuffer(obj[key])
      }
    }
  }
}

/**
 * Convert a ArrayBuffer to Base64
 * @param {ArrayBuffer} buffer
 * @returns {String}
 */
function arrayBufferToBase64 (buffer) {
  let binary = ''
  const bytes = new Uint8Array(buffer)
  const len = bytes.byteLength
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i])
  }
  return btoa(binary)
}

function randomString (length, chars) {
  let result = ''
  for (let i = length; i > 0; --i) {
    result += chars[Math.floor(Math.random() * chars.length)]
  }
  return result
}

// function reloadServerPreview () {
//   const iframe = document.getElementById('serverPreview')
//   iframe.src = iframe.src
// }
</script>
