<template>
  <div class="my-8 h-fit">
    <div class="h-full rounded-xl bg-white px-6 py-8 shadow-2xl">
      <div class="flex items-center justify-between">
        <h1 class="bg-gradient-to-r from-blue-500 to-pink-700 bg-clip-text py-4 text-6xl font-extrabold text-transparent">
          Rechungen
        </h1>
      </div>
      <Divider /> 
      
      <EntityTable
        :key="reRender"
        name="Rechnungen"
        primary-key="AufNr"
        :show-rows="25"
        :columns="columns"
        resource-name="invoices"
        :allow-edit="false"
        :allow-delete="false"
        :emit-edit-only="true"
        @on-row-select="onRowClick"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
  import EntityTable from "@/components/Entity/EntityTable.vue";
  import { ref } from "vue";
  import { IMasterDataField, IRechnung } from "@/types";
  import { router } from "@/router";

  const reRender = ref(0);

  const columns: IMasterDataField[] = [
    {
      label: "AufNr",
      name: "AufNr",
      type: "relation",
      allowCreate: false,
      allowUpdate: false,
      relation: {
        label: "Auftrag",
        name: "Auftrag",
        resourceName: "orders",
        primaryKey: "AufNr",
      },
    },  
    {
      label: "Kunde",
      name: "Auftrag.Kunde.KunName",
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
      label: "Mitarbeiter",
      name: "Auftrag.Mitarbeiter.MitName",
      type: "relation",
      allowCreate: false,
      allowUpdate: false,
      relation: {
        label: "Mitarbeiter",
        name: "Mitarbeiter",
        resourceName: "masterdata/employees",
        primaryKey: "Auftrag.Mitarbeiter.MitID",
      },
    },
    {
      label: "RechDat",
      name: "RechDat",
      type: "date",
      allowCreate: false,
      allowUpdate: false,
    },
    {
      label: "Betrag",
      name: "RechBetrag",
      type: "money",
      allowCreate: false,
      allowUpdate: false,
    },
  ];

  const onRowClick = (order: IRechnung) => {
    router.push({
      name: "Invoice",
      params: { AufNr: order.AufNr, KunNr: order.KunNr },
    });
  };
</script>

<style scoped>

</style>
