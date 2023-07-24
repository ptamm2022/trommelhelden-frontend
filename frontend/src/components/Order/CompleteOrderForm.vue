<template>
  <div
    id="co"
    ref="el"
  >
    <Divider />

    <div class="grid grid-cols-2">
      <span>Auftragsnummer: </span>     <span>{{ order?.Aufnr }}</span>
      <span>Auftragsdatum: </span>      <span>{{ useDateFormat(order?.AufDat, "DD.MM.YYYY").value }}</span>
      <span>Erledigungsdatum: </span>   <span>{{ useDateFormat(order?.ErlDat, "DD.MM.YYYY").value }}</span>
      <span>Beschreibung: </span>       <span>{{ order?.Beschreibung }}</span>
    </div>

    <Divider />

    <div class="grid grid-cols-2">
      <span>Kundennummer: </span>       <span>{{ order?.KunNr }}</span>
      <span>Kunden-Name: </span>        <span>{{ order.Kunde.KunName }}</span>
    </div>

    <Divider />

    <div
      v-if="employee"
      class="grid grid-cols-2"
    >
      <span>Mitarbeiter-ID: </span>       <span>{{ employee.MitID }}</span>
      <span>Mitarbeiter-Name: </span>     <span>{{ employee.MitVorname }} {{ employee.MitName }}</span>
      <span>Mitarbeiter-Beruf: </span>    <span>{{ employee.MitJob }}</span>
    </div>

    <Divider />

    <div class="grid grid-cols-2 col-span-2 row-span-2 gap-4 mb-4">
      <InputNumber
        v-model="order.Anfahrt"
        class="col-start-1 col-end-1"
        placeholder="Anfahrt in km*"
      ></InputNumber>

      <InputNumber
        v-model="order.Dauer"
        class="col-start-2 col-end-2 "
        placeholder="Dauer in h*"
      ></InputNumber>

      <!-- Ersatz für DropDown: -->
      <MultiSelect
        id="multiselect_ersatzteile"
        filter
        v-model="selectedSpareParts"
        :options="spareparts"
        option-label="EtBezeichnung"
        placeholder="Ersatzteil(e) auswählen (optional)"
        @change="onSparePartsSelectionChange"
      >
        <template #option="slotProps">

          <div class="flex justify-between">
            <Chip>{{ slotProps.option?.EtPreis }} €</Chip>
            
            <span class="w-3/4">{{
              slotProps.option?.EtBezeichnung
            }}</span>
          </div>

        </template>
      </MultiSelect>

      <div v-if="selectedSparePartsData.length > 0">
        <ul>
          <li v-for="sparePartData in selectedSparePartsData" :key="sparePartData.EtID">
            {{ sparePartData.Anzahl }}x {{ sparePartData.EtBezeichnung }}
          </li>
        </ul>
      </div>
    </div>
    
    <div />
    <Button
      type="submit"
      icon="pi pi-check"
      label="Auftrag erledigen"
      class="w-full"
      :disabled="!order.Anfahrt || !order.Dauer"
      @click="planOrder"
    />
  </div>
</template>

<script setup lang="ts">
  import Chip from 'primevue/chip';
  import { useDateFormat } from "@vueuse/core";
  import { inject, onMounted, ref } from "vue";
  import { IAuftrag, IErsatzteil, IMitarbeiter, IKunde } from "@/types";
  import EmployeesService from "@/api/services/Employees";
  import OrderService from "@/api/services/Order";
  import { useToast } from "primevue/usetoast";
  import { unflatten } from "flat";
  import Divider from "primevue/divider";
  import disableScroll from "disable-scroll";
  import GenericService from '@/api/services/Generic';
  import MultiSelect from "primevue/multiselect";

  const sparepartsService = new GenericService<IErsatzteil>("spareparts");
  const dialogRef: any = inject("dialogRef");
  const selectedSpareParts = ref<IErsatzteil[]>([] as IErsatzteil[]);
  const toast = useToast();
  const employee = ref<IMitarbeiter>({} as IMitarbeiter);
  const orderService = new OrderService();
  const employeesSevice = new EmployeesService();
  const order = ref<IAuftrag>({} as IAuftrag);
  const spareparts = ref<IErsatzteil[]>([] as IErsatzteil[]);
  const customer = ref<IKunde>({} as IKunde);

  // --------------------
  const selectedSparePartsData = ref<{ EtID: string; EtBezeichnung: string; Anzahl: number }[]>([]);

  // Funktion, um ausgewählte Ersatzteile und deren Anzahl zu aktualisieren
  const updateSelectedSpareParts = (sparePart: IErsatzteil) => {
    // Prüfen, ob das Ersatzteil bereits ausgewählt wurde
    const existingSparePart = selectedSparePartsData.value.find(
      (item) => item.EtID === sparePart.EtID
    );

    if (existingSparePart) {
      // Wenn das Ersatzteil bereits ausgewählt wurde, erhöhen Sie die Anzahl um 1
      existingSparePart.Anzahl += 1;
    } else {
      // Wenn das Ersatzteil noch nicht ausgewählt wurde, fügen Sie es mit der Anzahl 1 hinzu
      selectedSparePartsData.value.push({ EtID: sparePart.EtID, EtBezeichnung: sparePart.EtBezeichnung, Anzahl: 1 });
    }
  };

  const onSparePartsSelectionChange = () => {
    // Entfernen Sie alle vorhandenen Daten aus der Datenstruktur
    selectedSparePartsData.value = [];

    // Aktualisieren Sie die Datenstruktur für jedes ausgewählte Ersatzteil
    selectedSpareParts.value.forEach((sparePart: IErsatzteil) => {
      updateSelectedSpareParts(sparePart);
    });
  };
  // --------------------

  onMounted(async () => {
    disableScroll.off();

    console.log(order.value);

    spareparts.value = await sparepartsService.list([], {}, 0, 1000);
    order.value = unflatten(dialogRef.value.data.order);
    console.log(order.value);

    order.value.Status = "Erledigt";

    employee.value = await employeesSevice.get(order?.value?.MitID as string);
  });

  const planOrder = async () => {
    try {
      let { Aufnr, MitID, Kunde, Mitarbeiter, Rechnung, ...x }: any = order.value;

      console.log(x);

      if (selectedSpareParts.value.length > 0) {
        x.Montage = {
          create: selectedSpareParts.value.map((sparePart) => {
            const sparePartData = selectedSparePartsData.value.find((item) => item.EtID === sparePart.EtID);
            const anzahl = sparePartData ? sparePartData.Anzahl : 1;

            return {
              EtID: sparePart.EtID,
              Anzahl: anzahl,
            };
          }),
        };
      };

      await orderService.update(String(Aufnr), {
        ...x,
      });

      toast.add({
        severity: "success",
        summary: "Auftrag erledigt.",
        detail: "Der Auftrag wurde erfolgreich erledigt.",
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