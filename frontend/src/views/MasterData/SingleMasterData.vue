<template>
  <div
    v-if="!isLoading"
    class="h-full w-fit rounded-xl bg-white py-8 px-[10%] shadow-2xl"
  >
    <h1 class="bg-gradient-to-r from-blue-500 to-pink-700 bg-clip-text py-4 text-5xl font-extrabold text-transparent">
      {{ props.label }}-Übersicht
    </h1>
    
    <div class="col-span-1 grid grid-cols-1 justify-items-center gap-x-4 gap-y-6 py-8">
      <span
        v-for="field in props.fields"
        :id="`input-${field.name}`"
        :key="field.name"
        class="w-full"
      >
        <div class="grid grid-cols-2">
          <div>
            {{ field.label }}:
          </div>  

          <div 
            v-if="field.type === 'date'" 
          > 
            {{ useDateFormat(data[field.name], "DD.MM.YYYY").value }}
          </div> 

          <div 
            v-if="field.type != 'date'" 
          > 
            {{ data[field.name] }}
          </div> 
        </div>
      </span>
    </div>

    <div class="flex justify-between">
      <Button
        style="background-color: #d92979"
        label="Zurück"
        icon="pi pi-backward"
        @click="$router.go(-1)"
      />
    </div>
    
    <ConfirmDialog></ConfirmDialog>
  </div>
</template>

<script setup lang="ts">
  import ConfirmDialog from "primevue/confirmdialog";
  import GenericService from "@/api/services/Generic";
  import { router } from "@/router";
  import { TGenericService } from "@/types";
  import { onMounted, ref } from "vue";
  import { useRoute } from "vue-router";
  import { useDateFormat } from "@vueuse/core";

  const isLoading = ref(false);
  const data: any = ref({});
  const route = useRoute();
  const props = defineProps([
    "resourceName",
    "fields",
    "label",
    "labelSingular",
    "name",
    "primaryKey",
  ]);

  const service = new GenericService<TGenericService>(
    props.resourceName as string,
  );

  onMounted(async () => {
    isLoading.value = true;
    data.value = await service.get(route.params.id as string);
    if (data.value === null) {
      router.push({ name: "404" });
    }
    isLoading.value = false;
  });
</script>

<style scoped>

</style>
