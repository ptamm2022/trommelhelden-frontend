<template>
  <div
    id="co"
    ref="el"
  >
    <Divider />
    
    <div class="my-4">
      <span class="p-float-label flex flex-row">
        <Textarea
          id="order-description"
          v-model="order.Beschreibung"
          :auto-resize="true"
          rows="5"
          class="w-3/4"
        />

        <label for="order-description">
          Auftragsbeschreibung (optional)
        </label>
      </span>

      <span class="ml-4 text-sm">
        {{ order.Beschreibung ? order.Beschreibung.length : 0 }}/500
      </span>
    </div>

    <Divider />
    
    <Button
        type="button"
        icon="pi pi-search"
        :label="'Kunde wählen*'"
        aria-haspopup="true"
        aria-controls="overlay_panel"
        style="margin-bottom: 1rem; width: fit-content; white-space: nowrap;"
        @click="toggle"
      />
    
    <div
        v-if="order.Kunde"
        class="grid grid-cols-2"
      >
        <span>KunNr: </span>    <span>{{ order.Kunde.KunNr }}</span>
        <span>Name: </span>     <span>{{ order.Kunde.KunName }}</span>
        <span>Straße: </span>   <span>{{ order.Kunde.KunStrasse }}</span>
        <span>Ort: </span>      <span>{{ order.Kunde.KunPLZ }} {{ order.Kunde.KunOrt }}</span>
    </div>

    <div>
        <OverlayPanel
          id="overlay_panel"
          ref="op"
          append-to="body"
          :show-close-icon="true"
          style="margin-top: -28rem;"
          :dismissable="false"
          :breakpoints="{ '960px': '75vw' }"
        >
          <EntityTable
            :show-rows="5"
            :primary-key="'KunNr'"
            :resource-name="'customers'"
            :columns="columns"
            :name="'Kunden'"
            @on-row-select="onSelectCustomer"
          />
        </OverlayPanel>
      </div>

    <Divider />

    <div>
      <span class="p-float-label my-4">
        <Calendar
          id="order-calendar"
          v-model="order.AufDat"
          dateFormat="dd.mm.yy"
          :show-icon="true"
        />
        <label for="order-calendar">Auftragsdatum*</label>
      </span>
    </div>

    <Divider />
      
    <Button
      type="submit"
      icon="pi pi-check"
      label="Auftrag erstellen"
      class="w-full"
      :disabled="!order.Kunde || !order.AufDat"
      @click="createOrder"
    />
  </div>
</template>

<script setup lang="ts">
  import EntityTable from "@/components/Entity/EntityTable.vue";
  import Calendar from "primevue/calendar";
  import { IKunde, IAuftrag, IMasterDataField } from "@/types";
  import { ref } from "vue";
  import { useToast } from "primevue/usetoast";
  import { useRouter } from "vue-router";
  import OrderService from "@/api/services/Order";

  const router = useRouter();
  const toast = useToast();

  const orderService = new OrderService();
  const op = ref();
  const order = ref<IAuftrag>({
    AufDat: new Date()
  } as IAuftrag);

  const toggle = async (event: Event) => {
    op.value.toggle(event);
  };

  const onSelectCustomer = (customer: IKunde) => {
    console.log(2);
    order.value.Kunde = customer;
    order.value.KunNr = customer.KunNr;
    op.value.hide();
  };

  const createOrder = async () => {
    try {
      if (order.value) {
        await orderService.create(order.value);
        toast.add({
          severity: "success",
          summary: "Auftrag erstellt.",
          detail: "Der Auftrag wurde erfolgreich erstellt.",
          life: 5000,
        });
        router.push("/orders");
      }
    } catch (e) {
      toast.add({
        severity: "error",
        summary: "Fehler!",
        detail: e,
        life: 5000,
      });
    }
  };

  const columns: IMasterDataField[] = [
    {
        label: "KunNr",
        name: "KunNr",
        type: "numeric",
        allowCreate: false,
        allowUpdate: false,
      },  
    {
      label: "Name",
      name: "KunName",
      type: "text",
      allowCreate: false,
      allowUpdate: false,
    },
    {
      label: "Straße",
      name: "KunStrasse",
      type: "text",
      allowCreate: false,
      allowUpdate: false,
    },
    {
      label: "PLZ",
      name: "KunPLZ",
      type: "text",
      allowCreate: false,
      allowUpdate: false,
    },
    {
      label: "Ort",
      name: "KunOrt",
      type: "text",
      allowCreate: false,
      allowUpdate: false,
    },
  ];
</script>

<style>

</style>
