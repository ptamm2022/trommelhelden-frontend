<template>
    <div class="h-screen w-full bg-gradient-to-r from-blue-500 to-pink-700 flex justify-center items-center flex-col gap-y-12 justify-end">
        <div class="rounded-xl bg-white px-16 py-8 shadow-2xl  h-3/4 w-3/4 flex flex-col gap-y-8  justify-center ">
            <div class="flex justify-center items-center flex-col">
                <ProgressSpinner aria-label="Basic ProgressSpinner" />
                
                <h1
                    class="bg-gradient-to-r from-blue-500 to-pink-700 bg-clip-text py-4 text-4xl font-extrabold text-transparent">
                    Datenbank wird geladen...
                </h1>

                Es wird empfohlen, die Konsolenausgaben zu beachten und die Seite sonst gelegentlich neuzuladen.
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { onMounted } from 'vue';
    import ProgressSpinner from 'primevue/progressspinner';
    import { useStore } from '@/store';

    const store = useStore();

    onMounted(async () => {
        try {
          await store.startUp();
        } catch (error) {
          console.error(error);
        }
    });
</script>

<style >
    .p-slider .p-slider-range {
        background-image: linear-gradient(to right, #3b82f6, #be185d) !important;
    }

    @keyframes p-progress-spinner-color {
        100%,
        0% {
            stroke: #3b82f6;
        }
        90% {
            stroke: #be185d;
        }
    }
</style>