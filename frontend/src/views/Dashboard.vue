<template>
  <div>
    <div class="w-full block items-end my-8">
      <div class="mb-6 text-6xl">
        Herzlich Willkommen bei
        <h1 class="inline-block bg-gradient-to-r from-blue-500 to-pink-700 bg-clip-text text-6xl font-extrabold text-transparent ">
            Trommelhelden
        </h1> 
        !
      </div>

      <div class="mb-2 text-3xl">
        Hier finden Sie alle Informationen und Tools, die Sie benötigen, um die Reparaturaufträge im Unternehmen zu verwalten. Von der Auftragserstellung über die Rechnungsverwaltung und das Pflegen von Kunden- und Mitarbeiterdaten ist hier alles integriert!
      </div>
    </div>

    <Divider />

    <div class="flex items-end my-8">  
      <!-- Anzahl Mitarbeiter -->
      <router-link to="/masterdata/employees">
      <CardStats
        class="max-w-sm mr-10 mb-10"
        stat-subtitle="Anzahl der Mitarbeiter"
        :stat-title="String(singleStats.employees)"
        stat-arrow="up"
        stat-percent="12"
        stat-percent-color="text-emerald-500"
        stat-descripiron="Since last month"
        stat-icon-name="pi pi-users"
        stat-icon-color="bg-orange-400"
      />
      </router-link>

      <!-- Anzahl Kunden -->
      <router-link to="/masterdata/customers">
      <CardStats
        class="max-w-sm mr-10 mb-10"
        stat-subtitle="Anzahl der Kunden"
        :stat-title="String(singleStats.customers)"
        stat-arrow="up"
        stat-percent="12"
        stat-percent-color="text-emerald-500"
        stat-descripiron="Since last month"
        stat-icon-name="pi pi-users"
        stat-icon-color="bg-orange-600"
      />
      </router-link>

      <!-- Anzahl Ersatzteile -->
      <router-link to="/masterdata/spareparts">
      <CardStats
        class="max-w-sm mr-10 mb-10"
        stat-subtitle="Anzahl der Ersatzteile"
        :stat-title="String(singleStats.spareparts)"
        stat-arrow="up"
        stat-percent="12"
        stat-percent-color="text-emerald-500"
        stat-descripiron="Since last month"
        stat-icon-name="pi pi-tags"
        stat-icon-color="bg-purple-600"
      />
      </router-link>

      <!-- Anzahl Niederlassungen -->
      <router-link to="/masterdata/branches">
      <CardStats
        class="max-w-sm mr-10 mb-10"
        stat-subtitle="Anzahl der Niederlassungen"
        :stat-title="String(singleStats.branches)"
        stat-arrow="up"
        stat-percent="12"
        stat-percent-color="text-emerald-500"
        stat-descripiron="Since last month"
        stat-icon-name="pi pi-home"
        stat-icon-color="bg-pink-600"
      />
      </router-link>
    </div>

    <Divider />
    
    <div class="w-full items-end my-8">  
      <div class="flex" style="margin-bottom: 3em;">
        <!-- Anzahl Aufträge insgesamt -->
        <router-link to="/orders">
        <CardStats
          class="max-w-sm mr-10 mb-10"
          stat-subtitle="Anzahl der Aufträge"
          :stat-title="String(singleStats.orders)"
          stat-percent-color="text-emerald-500"
          stat-icon-name="pi pi-chart-line"
          stat-icon-color="bg-cyan-500"
        />
        </router-link>

        <!-- Anzahl Umsatz -->
        <CardStats
          class="max-w-sm mr-10 mb-10"
          stat-subtitle="Gesamter Umsatz"
          :stat-title="new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(singleStats.revenue)"
          stat-arrow="up"
          stat-percent="12"
          stat-percent-color="text-emerald-500"
          stat-descripiron="Since last month"
          stat-icon-name="pi pi-money-bill"
          stat-icon-color="bg-emerald-500"
        />
      </div>

      <div class="flex w-full align-middle" style="align-items: center; margin-bottom: 3em;">
        
        <i class="pi pi-angle-right" style="font-size: 2.5rem; margin-left: 2em;"></i>

        <!-- Anzahl Aufträge erstellt -->
        <router-link to="/orders/plan">
        <CardStats
          class="mr-10 mb-10"
          style="margin-left: 1em;"
          stat-subtitle="davon erst erstellt"
          :stat-title="String(singleStats.orders_created)"
          stat-percent-color="text-emerald-500"
          stat-icon-name="pi pi-chart-line"
          stat-icon-color="bg-cyan-200"
        />
        </router-link>
      </div>

      <div class="flex w-full align-middle" style="align-items: center; margin-bottom: 3em;">
        <i class="pi pi-angle-right" style="font-size: 2.5rem; margin-left: 4em;"></i>

        <!-- Anzahl Aufträge geplant -->
        <router-link to="/orders/complete">
        <CardStats
          class="mr-10 mb-10"
          style="margin-left: 1em;"
          stat-subtitle="davon erst geplant"
          :stat-title="String(singleStats.orders_planned)"
          stat-percent-color="text-emerald-500"
          stat-icon-name="pi pi-chart-line"
          stat-icon-color="bg-cyan-300"
        />
        </router-link>
      </div> 

      <div class="flex w-full align-middle" style="align-items: center; margin-bottom: 3em;">
        <i class="pi pi-angle-right" style="font-size: 2.5rem; margin-left: 6em;"></i>

        <div class="flex"> 
          <!-- Anzahl Aufträge erledigt -->
          <router-link to="/invoices">
          <CardStats
            class="max-w-sm mr-10 mb-10"
            style="margin-left: 1em;"
            stat-subtitle="davon schon erledigt"
            :stat-title="String(singleStats.orders_finished)"
            stat-percent-color="text-emerald-500"
            stat-icon-name="pi pi-chart-line"
            stat-icon-color="bg-cyan-400"
          />
          </router-link>

          <!-- Anzahl Rechnungen -->
          <router-link to="/invoices">
          <CardStats
            class="max-w-sm mr-10 mb-10"
            stat-subtitle="Anzahl der Rechnungen"
            :stat-title="String(singleStats.invoices)"
            stat-percent-color="text-emerald-500"
            stat-icon-name="pi pi-book"
            stat-icon-color="bg-rose-400"
          />
          </router-link>
        </div>
      </div>
    </div>

    <Divider />
  </div>
</template>

<script setup lang="ts">
  import CardStats from "@/components/Dashboard/CardStats.vue";
  import { onBeforeMount, onUnmounted, ref } from "vue";
  import { useStore } from "@/store";
  import GenericService from "@/api/services/Generic";
  
  const store = useStore();
  
  const singleStats = ref({
    customers: 0,
    orders: 0,
    orders_created: 0,
    orders_planned: 0,
    orders_finished: 0,
    revenue: 0,
    employees: 0,
    branches: 0,
    spareparts: 0,
    invoices: 0
  });
  
  const fetchSingleStats = async () => {
    const orderService = new GenericService("orders");
    
    // Anzahl Aufträge insgesamt
  
    let orders = 
    (
      await orderService.listAndCount(
        [], 
        {},
      )
    );
  
    singleStats.value.orders = orders.count;
    
    // Anzahl Aufträge erstellt, aber nicht geplant und nicht erledigt
  
    let orders_created = 
    (
      await orderService.listAndCount(
        [], 
        {
          MitID: null
        },
      )
    );
      
    singleStats.value.orders_created = orders_created.count;
      
    // Anzahl Aufträge geplant, aber nicht erledigt
      
    let orders_planned = 
    (
      await orderService.listAndCount(
        [], 
        {
          Dauer: null,
          MitID: 
          {
            gte: 1
          }
        },
      )
    );
      
    singleStats.value.orders_planned = orders_planned.count;
      
    // Anzahl Aufträge erledigt
      
    let orders_finished = 
    (
      await orderService.listAndCount(
        [], 
        {
          Dauer: 
          { 
            gte: 1
          },
          Anfahrt: 
          { 
            gte: 1
          }
        },
      )
    );
      
    singleStats.value.orders_finished = orders_finished.count;
    singleStats.value.revenue = orders_finished.sum
  }
  
  onBeforeMount(async () => {
    const customerService = new GenericService("customers");
    singleStats.value.customers = (await customerService.listAndCount([], {})).count;
  
    const employeesService = new GenericService("employees");
    singleStats.value.employees = (await employeesService.listAndCount([], {})).count;
  
    const sparepartsService = new GenericService("spareparts");
    singleStats.value.spareparts = (await sparepartsService.listAndCount([], {})).count;
  
    const branchesService = new GenericService("branches");
    singleStats.value.branches = (await branchesService.listAndCount([], {})).count;
  
    const invoicesService = new GenericService("invoices");
    singleStats.value.invoices = (await invoicesService.listAndCount([], {})).count;
  
    await fetchSingleStats()
  })
  
  onUnmounted(() => {
    store.firstLoadingTimeStamp = 0;
    store.lastLoadingTimeStamp = 0;
  })
</script>

<style>

</style>
