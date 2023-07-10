<template>
  <div class="mx-auto mt-8 flex-1">
    <div class="card flex flex-col items-stretch justify-center rounded-xl bg-white p-6 shadow-2xl">
      <div class="flex items-center justify-between">

        <h1 class="bg-gradient-to-l from-blue-500 to-pink-700 bg-clip-text py-4 text-6xl font-extrabold text-transparent">
          2. Auftrag planen
        </h1>

        <div>
          <router-link to="/orders/create">
              <Button
                icon="pi pi-plus"
                class="mr-2 mb-2 w-56 h-14 rounded-lg !border-none text-center text-2xl font-medium text-white shadow-lg hover:scale-105 hover:transform"
                style="margin-right: 5rem;"
                label="1. Auftrag erstellen"
              />
          </router-link>

          <router-link to="/orders">
              <Button
                style="background-color: #d92979; margin-right: 5rem;"
                icon="pi pi-home"
                class="mr-2 mb-2 w-56 h-14 rounded-lg !border-none text-center text-2xl font-medium text-white shadow-lg hover:scale-105 hover:transform"
                label="Übersicht"
              />
          </router-link>

          <router-link to="/orders/complete">
            <Button
              icon="pi pi-check"
              class="mr-2 mb-2 w-56 h-14 rounded-lg !border-none text-center text-2xl font-medium text-white shadow-lg hover:scale-105 hover:transform"
              label="3. Auftrag erledigen"
            />
          </router-link>
        </div>

      </div>

      <Divider />
      
      <EntityTable
        :key="reRender"
        name="Aufträge"
        primary-key="Aufnr"
        :show-rows="50"
        :columns="columns"
        resource-name="orders"
        :allow-edit="true"
        :allow-delete="false"
        :opt-params="{ status: 'created' }"
        :emit-edit-only="true"
        @edit-row="onButtonClick"
      />
      <DynamicDialog
        id="test"
        :draggable="false"
        content-class="test"
      />
      
    </div>
  </div>
</template>

<script setup lang="ts">
import EntityTable from "@/components/Entity/EntityTable.vue";

import { IAuftrag, IMasterDataField } from "@/types";
import { onMounted, ref } from "vue";
import { useDialog } from "primevue/usedialog";
import PlanOrderForm from "@/components/Order/PlanOrderForm.vue";
import disableScroll from "disable-scroll";

const reRender = ref(0);
const dialog = useDialog();
const isLoading = ref(false);

const onButtonClick = (order: IAuftrag) => {
  console.log(order);

  disableScroll.on(document.body);
  
  dialog.open(PlanOrderForm, {
    props: {
      header: "Auftrag: " + order.Aufnr,
      style: {
        width: "40vw",
      },
      breakpoints: {
        "960px": "75vw",
        "640px": "90vw",
      },
      modal: true,
    },
    data: {
      order,
    },
    onClose: () => {
      disableScroll.off();
      reRender.value++;
    },
  });
};

onMounted(async () => {
  isLoading.value = true;
  
  isLoading.value = false;
});

const columns: IMasterDataField[] = [
  {
    name: "Status",
    label: "Status",
    type: "text",
    allowCreate: false,
    allowUpdate: false,
  },
  {
    name: "Aufnr",
    label: "AufNr",
    type: "text",
    allowCreate: false,
    allowUpdate: false,
  },
  {
    name: "KunNr",
    label: "KunNr",
    type: "text",
    allowCreate: false,
    allowUpdate: false,
  },
  {
    name: "Kunde.KunName",
    label: "Kundenname",
    type: "text",
    allowCreate: false,
    allowUpdate: false,
  },
  {
    name: "AufDat",
    label: "AufDat",
    type: "date",
    allowCreate: false,
    allowUpdate: false,
  },
  {
    name: "Beschreibung", 
    label: "Beschreibung", 
    type: "text", 
    allowCreate: false,
    allowUpdate: false,
  },
];
</script>

<style>

</style>
