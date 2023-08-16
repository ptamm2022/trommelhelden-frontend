<template>
  <div class="mx-auto mt-8 flex-1">
    <div class="card flex flex-col items-stretch justify-center rounded-xl bg-white p-6 shadow-2xl">
      <div class="flex items-center justify-between">
        <h1 class="bg-gradient-to-r from-blue-500 to-pink-700 bg-clip-text py-4 text-6xl font-extrabold text-transparent">
          Aufträge
        </h1>
        
        <div>
          <Button
            icon="pi pi-plus"
            class="mr-2 mb-2 w-56 h-14 rounded-lg !border-none text-center text-2xl font-medium text-white shadow-lg hover:scale-105 hover:transform"
            style="margin-right: 5rem;"
            label="1. Auftrag erstellen"
            @click="onButtonClickCreateOrder"
          />
        
          <router-link to="/orders/plan">
            <Button
              icon="pi pi-map"
              class="mr-2 mb-2 w-56 h-14 rounded-lg !border-none text-center text-2xl font-medium text-white shadow-lg hover:scale-105 hover:transform"
              style="margin-right: 5rem;"
              label="2. Auftrag planen"
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
        name="Aufträge"
        primary-key="Aufnr"
        :show-rows="25"
        :columns="columns"
        resource-name="orders"
        :allow-edit="false"
        :allow-delete="false"
        @onRowSelect="(event)=>router.push({name: 'singleOrder', params: {id: event.Aufnr}})"
        >
      </EntityTable>

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
  import { useRouter } from "vue-router";
  import { useDialog } from "primevue/usedialog";
  import CreateOrderForm from "@/components/Order/CreateOrderForm.vue";
  import disableScroll from "disable-scroll";

  const router = useRouter();
  const reRender = ref(0);
  const dialog = useDialog();

  const onButtonClickCreateOrder = (order: IAuftrag) => {
    console.log(order);
  
    disableScroll.on(document.body);
    
    dialog.open(CreateOrderForm, {
      props: {
        header: "Auftrag erstellen",
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
      type: "numeric",
      allowCreate: false,
      allowUpdate: false,

    },
    {
      name: "Kunde.KunName", 
      label: "Kunde", 
      type: "relation", 
      allowCreate: false,
      allowUpdate: false,
      relation: {
        label: "Kunde",
        name: "Kunde",
        resourceName: "masterdata/customers",
        primaryKey: "KunNr",
      },
    },
    {
      name: "Mitarbeiter.MitName",
      label: "Mitarbeiter",
      type: "relation",
      allowCreate: false,
      allowUpdate: false,
      relation: {
        label: "Mitarbeiter",
        name: "Mitarbeiter",
        resourceName: "masterdata/employees",
        primaryKey: "MitID",
      },
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
      name: "Dauer", 
      label: "Dauer (in h)", 
      type: "numeric", 
      allowCreate: false,
      allowUpdate: false,
    },
    {
      name: "Anfahrt", 
      label: "Anfahrt (in km)", 
      type: "numeric", 
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
