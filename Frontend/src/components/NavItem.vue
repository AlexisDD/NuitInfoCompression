<script setup lang="ts">

const props = defineProps({
    url: {
        type: String,
        required: true
    },
    text: {
        type: String,
        required: true
    }
})

</script>

<template>
    <RouterLink :to="url" class="no-underline block mt-4 sm:inline-block sm:mt-0 text-indigo-100 hover:text-white mr-4">
        {{ text }}
    </RouterLink>
</template>