<template>
    <div class="h-screen w-full bg-gradient-to-r from-blue-500 to-pink-700 flex justify-center items-center flex-col gap-y-12 justify-end">
        <div class="rounded-xl bg-white px-16 py-8 shadow-2xl  h-3/4 w-3/4 flex flex-col gap-y-8  justify-center ">
            <div v-if="!isLoading">
                <h2
                    class="bg-gradient-to-r from-blue-500 to-pink-700 bg-clip-text py-4 text-6xl font-extrabold text-transparent"
                >
                Trommelhelden DB
                </h2>

                <div class="flex justify-end">
                    <Button
                        label="Start"
                        class="p-button-raised  !px-12 !text-2xl  mt-4  ml-auto w-fit"
                        @click="createData"
                    />
                </div>

            </div>

            <div
                v-else
                class="flex justify-center items-center flex-col"
            >

                <ProgressSpinner aria-label="Basic ProgressSpinner" />
                <h1
                    class="bg-gradient-to-r from-blue-500 to-pink-700 bg-clip-text py-4 text-4xl font-extrabold text-transparent">
                    Daten werden erstellt...
                </h1>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { ref, onMounted } from 'vue';
    import ProgressSpinner from 'primevue/progressspinner';
    import { useStore } from '@/store';
    import { useRouter } from 'vue-router';
    import GenericService from '@/api/services/Generic';
    import Button from 'primevue/button';

    const store = useStore();
    const router = useRouter();

    const first = ref(false);
    const isLoading = ref(false);
    const startUpService = new GenericService("startup");

    const createData = async () => {
        isLoading.value = true;

        await startUpService._axiosInstance.post("/startUp", {
            ...settings.value
        })

        isLoading.value = false;

        store.firstStartUp = false;

        router.push("/");
    }

    const settings = ref({
        customers: 100,         // 500
        employees: 14,          // 14
        orders: 100,            // 1000
        branches: 3,            // 3
        spareparts: 26          // 26
    })

    // autonmatisch Daten erstellen
    onMounted(() => {
        createData();
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