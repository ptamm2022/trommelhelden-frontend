<template>
  <div>
    <Card>
      <template #content>
        <h1 class="bg-gradient-to-r from-blue-500 to-pink-700 bg-clip-text py-4 text-6xl font-extrabold text-transparent">
          Settings
        </h1>

        <div class="mb-2 flex flex-col">
          <div class="mb-2">Which method shall be used to create invoices?</div>
          <SelectButton
            v-model="mode"
            class="flex-1"
            option-label="name"
            :options="options"
            option-value="value"
            aria-labelledby="single"
            @change="onInvoiceMethodChange"
          />
        </div>

        <div class="mb-2 flex flex-col">
          <div class="mb-2">Which method shall be used to fetch Business Data?</div>
          <SelectButton
            v-model="store.settings.calcType"
            class="flex-1"
            option-label="name"
            :options="options2"
            option-value="value"
            aria-labelledby="single"
            @change="onCalcMethodChange"
          />
        </div>

        <div class="card flex flex-wrap justify-content-center align-items-center">
          <Checkbox
            v-model="store.showDebugBar"
            inputId="debugBar"
            :binary="true"
            :value="store.showDebugBar"
            @input="onChangeShowDebugBar"
          />
          <label for="debugBar" class="ml-2">Show debug Bar</label>
        </div>
      </template>
    </Card>
  </div>
</template>

<script setup lang="ts">
  import Checkbox from "primevue/checkbox";
  import { useStore } from "@/store";
  import Card from "primevue/card";
  import SelectButton, { SelectButtonChangeEvent } from "primevue/selectbutton";
  import { ref } from "vue";
  import { useLocalStorage, useStorage } from '@vueuse/core'
  
  const store = useStore();
  
  const mode = ref(store.settings.useTrigger ? 1 : 2);
  const calcMode = ref(store.settings.calcType);
  
  console.log(mode.value);
  
  const onChangeShowDebugBar = (e: any) => {
    window.localStorage.setItem("show-debug-bar", e);
  }
  
  const options = [
    {
      name: "use Backend",
      value: 2,
    },
    {
      name: "use Database trigger",
      value: 1,
    },
  ];
  
  const options2 = [
    {
      name: "use Backend (node)",
      value: "backend",
    },
    {
      name: "use SQL",
      value: "database",
    },
  
  ];
  
  const onModuleMethodChange = async (event: SelectButtonChangeEvent) => {
    
  };
  
  const onInvoiceMethodChange = async (event: SelectButtonChangeEvent) => {
    await store.updateSettings("useTrigger", event.value === 1);
  };
  
  const onCalcMethodChange = async (event: SelectButtonChangeEvent) => {
    // await store.updateSettings("calcType", calcMode.value);
    window.localStorage.setItem("calc-type", event.value);
  };
</script>

<style scoped>

</style>
