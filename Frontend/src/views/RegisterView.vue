<script setup lang="ts">
import router from '@/router';
import { onMounted, ref } from 'vue'
import { useStore } from 'vuex'

const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const error = ref('')

const store = useStore()
onMounted(() => {
  if (store.getters.isLoggedIn) {
    router.push('/')
  }
})

const register = async () => {
   error.value = ''

  if (password.value !== confirmPassword.value) {
    error.value = 'Les mots de passe ne correspondent pas'
    return
  }

  // Appel de l'action register du store
  store.dispatch('register', {
    email: email.value,
    password: password.value,
    confirmPassword: confirmPassword.value
  }).then(() => {
    router.push('/')
  }).catch((err) => {
    if (err.message) {
      error.value = "L'adresse email est déjà utilisée"
    } else {
      error.value = 'Une erreur est survenue, veuillez réessayer plus tard.'
    }
  })

  /*const response = await fetch(`${import.meta.env.VITE_API_URL}/user/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      email: email.value,
      password: password.value,
      confirmPassword: confirmPassword.value
    })
  })

  const data = await response.json()
  if (response.ok) {
    if (data.token) {
      localStorage.setItem('token', data.token)
      localStorage.setItem('email', email.value)
      router.push('/')
    } else {
      error.value = 'Une erreur est survenue'
    }
  } else {
    if (data.message) {
      error.value = "L'adresse email est déjà utilisée"
    } else {
      error.value = 'Une erreur est survenue'
    }
  }*/
}
</script>


<template>
  <div class="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-sm">
      <img class="mx-auto h-10 w-auto" src="https://www.nuitdelinfo.com/img/logo_n2i_color_moon.svg" alt="Logo nuit de l'info" />
      <h2 class="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">Inscription</h2>
    </div>

    <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
      <form class="space-y-6" @submit.prevent="register">
        <div>
          <label for="email" class="block text-sm font-medium leading-6 text-gray-900">Adresse email</label>
          <div class="mt-2">
            <input v-model="email" id="email" name="email" type="email" autocomplete="email" required="true" class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
          </div>
        </div>

        <div>
          <div class="flex items-center justify-between">
            <label for="password" class="block text-sm font-medium leading-6 text-gray-900">Mot de passe</label>
          </div>
          <div class="mt-2">
            <input v-model="password" id="password" name="password" type="password" autocomplete="current-password" required="true" class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
          </div>
        </div>

        <div>
          <div class="flex items-center justify-between">
            <label for="confirm-password" class="block text-sm font-medium leading-6 text-gray-900">Confirmer le mot de passe</label>
          </div>
          <div class="mt-2">
            <input v-model="confirmPassword" id="confirm-password" name="confirm-password" type="password" autocomplete="current-password" required="true" class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
          </div>
        </div>

        <div>
          <button type="submit" class="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">S'inscrire</button>
        </div>

        <p v-if="error" class="text-center text-red-500 text-sm">{{ error }}</p>
      </form>

      <p class="mt-10 text-center text-sm text-gray-500">
        Déjà un compte ?
        {{ ' ' }}
        <RouterLink to="/login" class="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">Se connecter</RouterLink>
      </p>
    </div>
  </div>
</template>