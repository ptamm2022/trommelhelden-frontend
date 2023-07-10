<template>
  <div class="my-8 h-fit">
    <div class="h-full rounded-xl bg-white px-6 py-8 shadow-2xl">
      <div class="flex items-center justify-between">
        <h1
          class="bg-gradient-to-r from-blue-400 to-pink-800 bg-clip-text py-4 text-6xl font-extrabold text-transparent"
        >
          Aufträge
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
  
        <!-- <template>
            <TabMenu :model="items" />
        </template> -->

      </div>

      <!-- <template>
          <div class="card flex justify-content-center">
              <Breadcrumb :home="home" :model="items">
                  <template #item="{item}">
                      <a :class="item.class">
                          <span :class="item.icon"></span>
                      </a>
                  </template>
              </Breadcrumb>
          </div>
      </template> -->

      <Divider />
      
      <EntityTable
        name="Aufträge"
        primary-key="Aufnr"
        :show-rows="50"
        :columns="columns"
        resource-name="orders"
        :allow-edit="false"
        :allow-delete="false"
        @onRowSelect="(event)=>router.push({name: 'singleOrder', params: {id: event.Aufnr}})"
        >
      </EntityTable>
    </div>
  </div>
</template>

<script setup lang="ts">
  import EntityTable from "@/components/Entity/EntityTable.vue";
  import { IMasterDataField } from "@/types";
  import { useRouter } from "vue-router";
  import { ref } from "vue";
  import Breadcrumb from 'primevue/breadcrumb';

  const router = useRouter()

  const home = ref({ icon: 'pi pi-home', url: 'https://primevue.org/' });
  const items = ref([
    { icon: 'pi pi-sitemap' }, 
    { icon: 'pi pi-book' }, 
    { icon: 'pi pi-wallet' }, 
    { icon: 'pi pi-shopping-bag' }, 
    { icon: 'pi pi-calculator' }
  ]);

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
      type: "numeric",
      allowCreate: false,
      allowUpdate: false,

    },
    {
      name: "KunNr",
      label: "KunNr",
      type: "numeric",
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
      name: "MitID",
      label: "MitID",
      type: "text",
      allowCreate: false,
      allowUpdate: false,

    },
    {
      name: "Mitarbeiter.MitName",
      label: "Mitarbeitername",
      type: "numeric",
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
      name: "Dauer", 
      label: "Dauer", 
      type: "numeric", 
      allowCreate: false,
      allowUpdate: false,
    },
    {
      name: "Anfahrt", 
      label: "Anfahrt", 
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
