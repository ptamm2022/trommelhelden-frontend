<template>
    <div
        class=" absolute bottom-0 w-full h-14 bg-gradient-to-r from-blue-500 to-pink-700 shadow flex items-center justify-around z-10 sticky">
        <span class="text-lg font-bold text-white"> 
            Debug-Leiste
        </span>
        <span class="text-lg font-bold text-white ">
            Ladezeit: {{ String(store.getDashboardTimeSeconds) }} ms
        </span>
        <span class="text-lg font-bold text-white">
            Berechnungsart: {{ store.settings.calcType }}
        </span>
    </div>
</template>

<script setup lang="ts">import { useStore } from '@/store';
    const store = useStore()
</script>

<style scoped>

</style>