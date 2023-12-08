<script setup lang="ts">
import axios from 'axios';
import { ref } from 'vue';

const ressourceUrl = ref('');
const size = ref('');
const error = ref('');
const loading = ref(false);
const resultDisplay = ref(false);
const result = ref();

const compress = async () => {
    error.value = '';
    loading.value = true;

    await axios.post('/compression/compress', {
        url: ressourceUrl.value,
        ...(size.value && { size: size.value }), // Add size only if it's not empty
    }).then((res) => {
        result.value = res.data;
        resultDisplay.value = true;
    }).catch((err) => {
        console.log(err);
    }).finally(() => {
        loading.value = false;
    });
}

const bytesToSize = (bytes: number) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes === 0) return '0 Byte';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i)) + ' ' + sizes[i];
}
</script>

<template>
    <div v-if="!resultDisplay" class="flex min-h-full min-h flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div class="sm:mx-auto sm:w-full sm:max-w-sm">
            <img class="mx-auto h-10 w-auto" src="https://www.nuitdelinfo.com/img/logo_n2i_color_moon.svg"
                alt="Logo nuit de l'info" />
            <h2 class="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">Compression</h2>
        </div>

        <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
            <form class="space-y-6" @submit.prevent="compress">
                <div>
                    <label for="ressourceUrl" class="block text-sm font-medium leading-6 text-gray-900">URL de
                        l'image/vidéo</label>
                    <div class="mt-2">
                        <input v-model="ressourceUrl" id="ressourceUrl" name="ressourceUrl" type="text"
                            placeholder="https://nuitdelinfo.com/img/logo-n2i-2023.png" required="true"
                            class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                    </div>
                </div>

                <div>
                    <label for="size" class="block text-sm font-medium leading-6 text-gray-900">Taille maximale désirée
                        (optionnel)</label>
                    <div class="mt-2">
                        <input v-model="size" id="size" name="size" type="text" required="true" placeholder="10MB"
                            class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                    </div>
                </div>

                <div>
                    <button type="submit"
                        class="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Compresser</button>
                    <p class="text-center text-sm mt-4">Le traitement peut prendre plusieurs minutes.</p>

                </div>
                <div v-if="loading" class="flex justify-center">
                    <div role="status">
                        <svg aria-hidden="true"
                            class="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                            viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                fill="currentColor" />
                            <path
                                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                fill="currentFill" />
                        </svg>
                        <span class="sr-only">Chargement...</span>
                    </div>
                </div>
                <p v-if="error" class="text-center text-red-500 text-sm">{{ error }}</p>
            </form>
        </div>
    </div>

    <div v-else class="flex min-h-full min-h flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div class="sm:mx-auto sm:w-full sm:max-w-sm">
            <h2 class="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">Résultats</h2>
        </div>

        <div class="sm:mx-auto sm:w-full sm:max-w-sm">
            <div class="flex flex-col items-center justify-center mt-4">
                <img :src="ressourceUrl" width="200" height="200" />
                <p class="text-center text-lg mt-2">Lien du fichier compressé :</p><a :href="result.compressed"
                    target="_blank" class="underline">{{ result.compressed }}</a>
                <p class="text-center text-lg mt-2">Taille originale : {{ bytesToSize(result.originalSize) }}</p>
                <p class="text-center text-lg mt-2">Dimensions originale : {{ result.originalDimensions.width }}x{{ result.originalDimensions.height }}</p>
                <p class="text-center text-lg mt-2">Taille compressée : {{ bytesToSize(result.compressedSize) }}</p>
                <p class="text-center text-lg mt-2">Dimensions compressée : {{ result.compressedDimensions.width }}x{{ result.compressedDimensions.height }}</p>
            </div>
        </div>

        <div class="mt-6 text-center mx-auto my-auto">
          <button @click="resultDisplay = false" class="flex w-60 justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Réessayer</button>
        </div>
    </div>

</template>