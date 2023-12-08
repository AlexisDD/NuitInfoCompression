<script lang="ts">
import { computed, ref } from 'vue';
import { useStore } from 'vuex';
import NavItem from './NavItem.vue';
import router from '@/router';

export default {
    components: {
        NavItem
    },
    setup() {
        const store = useStore();

        const isLoggedIn = computed(() => {
            return store.getters.isAuthenticated;
        });
        const currentUser = computed(() => {
            return store.getters.currentUser;
        });

        const open = ref(false);

        function toggle() {
            open.value = !open.value;
        };

        function logout() {
            router.push('/login').then(() => {
                store.dispatch('logout');
            });
        };

        return {
            isLoggedIn,
            open,
            toggle,
            logout
        };
    }
};
</script>

<template>
    <nav class="flex items-center justify-between flex-wrap bg-indigo-500 p-6">
        <RouterLink to="/">
            <div class="flex items-center flex-no-shrink text-white mr-6">
                <img src="@/assets/img/logo-N2I2023-monochrome.svg" width="54" height="54" />
                <span class="font-semibold text-xl tracking-tight ml-2">Nuit de l'info 2023</span>
            </div>
        </RouterLink>
        <div class="block sm:hidden">
            <button @click="toggle"
                class="flex items-center px-3 py-2 border rounded text-indigo-100 border-indigo-300 hover:text-white hover:border-white">
                <svg class="fill-current h-3 w-3" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <title>Menu</title>
                    <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
                </svg>
            </button>
        </div>
        <div :class="open ? 'block' : 'hidden'" class="w-full flex-grow sm:flex sm:items-center sm:w-auto">
            <div class="text-sm sm:flex-grow">
                <NavItem url="/" text="Accueil" />
                <NavItem url="/compression" text="Compression" />
                <NavItem v-if="isLoggedIn" url="/profile" text="Profil" />
            </div>
            <div>
                <RouterLink v-if="!isLoggedIn" to="/login"
                    class="no-underline inline-block text-sm px-4 py-2 leading-none border rounded text-white border-white hover:border-transparent hover:text-indigo-400 hover:bg-white mt-4 sm:mt-0">
                    Se
                    connecter
                </RouterLink>
                <a href="/logout" v-else @click.prevent="logout"
                    class="no-underline inline-block text-sm px-4 py-2 leading-none border rounded text-white border-white hover:border-transparent hover:text-indigo-400 hover:bg-white mt-4 sm:mt-0">
                    Se
                    déconnecter
                </a>
            </div>
        </div>
    </nav>
</template>