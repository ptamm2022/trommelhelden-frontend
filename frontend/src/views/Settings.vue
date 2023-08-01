<template>
  <div>
    <Card>
      <template #content>
        <h1 class="bg-gradient-to-r from-blue-500 to-pink-700 bg-clip-text py-4 text-6xl font-extrabold text-transparent">
          Settings
        </h1>

        <div class="mb-2 flex flex-col">
          <div class="mb-2">
            Mit welcher Methode sollen Rechnungen erstellt werden?
          </div>

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
          <div class="mb-2">
            Welche Methode soll zum Abrufen von Geschäftsdaten verwendet werden?
          </div>

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
          <label for="debugBar" class="ml-2">Zeige Debug-Leiste</label>
        </div>

        <Divider />

        <span> 
          Erstellt im Rahmen des Projektseminars 2022 an der HTWD <Chip><a href="https://github.com/htw-dresden-ps23/trommelhelden-web-frontend"><i class="pi pi-github"></i> siehe GitHub-Projekt</a></Chip>. 
          <br>
        </span>

        <span>
          Weiterentwickelt im Rahmen einer studentischen Hilfskraftstätigkeit von Paulus Tamm <Chip><a href="https://github.com/ptamm2022/trommelhelden-frontend"><i class="pi pi-github"></i> siehe GitHub-Projekt</a></Chip>.
        </span>
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
  import Chip from "primevue/chip";
  
  const store = useStore();
  
  const mode = ref(store.settings.useTrigger ? 1 : 2);
  
  console.log(mode.value);
  
  const onChangeShowDebugBar = (e: any) => {
    window.localStorage.setItem("show-debug-bar", e);
  }
  
  const options = [
    {
      name: "Backend",
      value: 2,
    },
    {
      name: "Datenbank-Trigger",
      value: 1,
    },
  ];
  
  const options2 = [
    {
      name: "Backend (node)",
      value: "backend",
    },
    {
      name: "SQL",
      value: "database",
    },
  
  ];
  
  const onInvoiceMethodChange = async (event: SelectButtonChangeEvent) => {
    await store.updateSettings("useTrigger", event.value === 1);
  };
  
  const onCalcMethodChange = async (event: SelectButtonChangeEvent) => {
    window.localStorage.setItem("calc-type", event.value);
  };
</script>

<style scoped>

</style>
