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
        <label for="order-description">Auftragsbeschreibung (optional)</label>
      </span>

      <span class="ml-4 text-sm">{{ order.Beschreibung ? order.Beschreibung.length : 0 }}/500</span>
    </div>

    <Divider />

    <div class="grid grid-cols-2">
      <span>AufNr: </span>    <span>{{ order?.Aufnr }}</span>
      <span>AufDat: </span>   <span>{{ useDateFormat(order?.AufDat, "DD.MM.YYYY").value }}</span>
    </div>

    <Divider />

    <div class="grid grid-cols-2">
      <span>KunNr: </span>    <span>{{ order?.KunNr }}</span>
      <!-- <span>Name: </span>     <span>{{ order?.Kunde.KunName }}</span>
      <span>Straße: </span>   <span>{{ order?.Kunde.KunStrasse }}</span>
      <span>Ort: </span>      <span>{{ order?.Kunde.KunPLZ }} {{ order?.Kunde.KunOrt }}</span> -->
    </div>

    <Divider />

    <Button
        type="button"
        icon="pi pi-search"
        :label="'Mitarbeiter wählen*'"
        aria-haspopup="true"
        aria-controls="overlay_panel"
        style="margin-bottom: 1rem;"
        @click="toggle"
    />

    <div
      v-if="order.MitID"
      class="grid grid-cols-2"
    >
        <span>MitID: </span>        <span> {{ employee.MitID }} </span>
        <span>Name: </span>         <span> {{ employee?.MitVorname }} {{ employee?.MitName }} </span>
        <span>Job: </span>          <span> {{ employee?.MitJob }} </span>
        <span>Stundensatz: </span>  <span> {{ employee?.MitStundensatz }} €/h</span>
    </div>

    <OverlayPanel
        ref="op"
        :show-close-icon="true"
        style="width: 1000px"
        :auto-z-index="false"
        :dismissable="false"
        class="-mt-40 -ml-40 z-[2102]"
        :breakpoints="{ '960px': '75vw' }"
      >
        <EntityTable
          name="Aufträge"
          primary-key="MitID"
          :show-rows="5"
          :columns="columns"
          resource-name="employees"
          :allow-edit="false"
          :allow-delete="false"
          :opt-params="{ filterJob: 'montage' }"
          @onRowSelect="onSelectEmployee"
        />
    </OverlayPanel>

    <Divider />

    <div>
      <span class="p-float-label my-8">
        <Calendar
            id="plan-order-calendar"
            v-model="order.ErlDat"
            dateFormat="dd.mm.yy"
            :show-icon="true"
        ></Calendar>
        <label for="plan-order-calendar">Erledigungsdatum*</label>
      </span>
    </div>

    <Divider />

    <Button
      type="submit"
      icon="pi pi-check"
      label="Auftrag planen"
      :disabled="!order.ErlDat || !employee.MitJob"
      class="w-full"
      @click="planOrder"
    />

  </div>
</template>

<script setup lang="ts">
  import Calendar from "primevue/calendar";
  import { useDateFormat } from "@vueuse/core";
  import { inject, onMounted, ref } from "vue";
  import EntityTable from "@/components/Entity/EntityTable.vue";
  import { IAuftrag, IEntityTableColumns, IMasterDataField, IMitarbeiter, IKunde } from "@/types";
  import OrderService from "@/api/services/Order";
  import { useToast } from "primevue/usetoast";
  import { unflatten } from "flat";

  const order = ref<IAuftrag>({
    ErlDat: new Date()
  } as IAuftrag);

  const dialogRef: any = inject("dialogRef");
  const employee = ref<IMitarbeiter>({} as IMitarbeiter);
  const orderService = new OrderService();

  console.log(useDateFormat(new Date(), "DD.MM.YYYY").value);

  const op = ref();
  const toast = useToast();

  const columns: IMasterDataField[] = [
    {
      label: "MitID",
      name: "MitID",
      type: "text",
      allowCreate: false,
      allowUpdate: false,

    },
    {
      label: "Vorname",
      name: "MitVorname",
      type: "text",
      allowCreate: false,
      allowUpdate: false,
    },
    {
      label: "Nachname",
      name: "MitName",
      type: "text",
      allowCreate: false,
      allowUpdate: false,
    },
    {
      label: "Job",
      name: "MitJob",
      type: "text",
      allowCreate: false,
      allowUpdate: false,
    },
    {
      label: "Niederlassung",
      name: "NlNr",
      type: "text",
      allowCreate: false,
      allowUpdate: false,
    },
    {
      label: "Stundensatz (in €/h)",
      name: "MitStundensatz",
      type: "numeric",
      allowCreate: false,
      allowUpdate: false,
    },
  ];

  const toggle = async (event: Event) => {
    op.value.toggle(event);
  };

  onMounted(async () => {
    order.value = dialogRef.value.data.order;
    order.value.ErlDat = new Date();
  });

  const onSelectEmployee = (employeeP: IMitarbeiter) => {
    op.value.hide();
    order.value.MitID = employeeP.MitID;
    employee.value = employeeP;
  };

  const planOrder = async () => {
    try {
      let { Aufnr, MitID, Kunde, Mitarbeiter, Rechnung, ...x }: any = unflatten(
        order.value,
      );
      console.log(x);

      await orderService.update(String(Aufnr), {
        ...x,
        MitID,
      });
      toast.add({
        severity: "success",
        summary: "Auftrag geplant.",
        detail: "Der Auftrag wurde erfolgreich geplant.",
        life: 3000,
      });
      dialogRef.value.close();
    } catch (e) {
      toast.add({
        severity: "error",
        summary: "Fehler!",
        detail: e,
        life: 3000,
      });
    }
  };
</script>

<style>

</style>
