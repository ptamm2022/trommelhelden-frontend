<template>
  <div class="mx-auto mt-8 flex-1">
    <div class="card flex flex-col items-stretch justify-center rounded-xl bg-white p-6 shadow-2xl">
      <div class="flex items-center justify-between">
        <h1 class="bg-gradient-to-l from-blue-500 to-pink-700 bg-clip-text py-4 text-6xl font-extrabold text-transparent">
          3. Auftrag erledigen
        </h1>

        <router-link to="/orders/create">
            <Button
              icon="pi pi-plus"
              class="mr-2 mb-2 rounded-lg !border-none text-center text-2xl font-medium text-white shadow-lg hover:scale-105 hover:transform"
              label="1. Auftrag erstellen"
            />
        </router-link>

        <router-link to="/orders/plan">
          <Button
            icon="pi pi-map"
            class="mr-2 mb-2 rounded-lg !border-none text-center text-2xl font-medium text-white shadow-lg hover:scale-105 hover:transform"
            label="2. Auftrag planen"
            />
        </router-link>

        <router-link to="/orders">
            <Button
              style="background-color: #d92979"
              icon="pi pi-home"
              class="mr-2 mb-2 rounded-lg !border-none text-center text-2xl font-medium text-white shadow-lg hover:scale-105 hover:transform"
              label="Übersicht"
            />
        </router-link>

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
        :opt-params="{ status: 'planned' }"
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
import { ref } from "vue";
import { useDialog } from "primevue/usedialog";
import disableScroll from "disable-scroll";
import CompleteOrderForm from "@/components/Order/CompleteOrderForm.vue";

const reRender = ref(0);
const dialog = useDialog();

const onButtonClick = (order: IAuftrag) => {
  console.log(order);

  disableScroll.on(document.body);
  dialog.open(CompleteOrderForm, {
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

const columns: IMasterDataField[] = [
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
    name: "Mitarbeiter.MitID",
    label: "MitID",
    type: "text",
    allowCreate: false,
    allowUpdate: false,
  },
  {
    name: "Mitarbeiter.MitName",
    label: "Mitarbeitername",
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
    name: "ErlDat", 
    label: "ErlDat", 
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
