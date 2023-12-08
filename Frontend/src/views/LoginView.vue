<script setup lang="ts">
import router from '@/router';
import { onMounted, ref } from 'vue'
import { useStore } from 'vuex';

const email = ref('')
const password = ref('')
const error = ref('')

const store = useStore()
onMounted(() => {
  if (store.getters.isLoggedIn) {
    router.push('/')
  }
})

const login = async () => {
  error.value = ''

  // Appel de l'action login du store
  store.dispatch('login', {
    email: email.value,
    password: password.value
  }).then(() => {
    router.push('/')
  }).catch((err) => {
    if (err.message) {
      error.value = "L'adresse email ou le mot de passe est incorrect."
    } else {
      error.value = 'Une erreur est survenue, veuillez réessayer plus tard.'
    }
  })
}
</script>

<template>
  <div class="flex min-h-full min-h flex-1 flex-col justify-center px-6 py-12 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-sm">
      <img class="mx-auto h-10 w-auto" src="https://www.nuitdelinfo.com/img/logo_n2i_color_moon.svg" alt="Logo nuit de l'info" />
      <h2 class="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">Connexion</h2>
    </div>

    <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
      <form class="space-y-6" @submit.prevent="login">
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
          <button type="submit" class="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Connexion</button>
        </div>

        <p v-if="error" class="text-center text-red-500 text-sm">{{ error }}</p>
      </form>

      <p class="mt-10 text-center text-sm text-gray-500">
        Pas de compte ?
        {{ ' ' }}
        <RouterLink to="/register" class="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">S'inscrire</RouterLink>
      </p>
    </div>
  </div>
</template>