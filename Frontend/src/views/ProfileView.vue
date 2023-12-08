<script setup lang="ts">
import { computed } from 'vue';
import { useStore } from 'vuex';

const store = useStore();

// Récupération de l'utilisateur connecté depuis le store
const currentUser = computed(() => {
  return store.getters.currentUser;
});
</script>

<template>
  <h1 class="text-4xl font-bold text-center">Profil</h1>

  <div class="flex flex-col items-center justify-center mt-8">
    <img src="@/assets/img/logo-N2I2023-monochrome.svg" width="200" height="200" />
    <p class="text-center text-xl mt-4">Vous êtes connecté : {{ currentUser.email }}</p>
  </div>
</template>