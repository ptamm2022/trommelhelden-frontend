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
      <span>Auftragsnummer: </span>     <span>{{ order?.Aufnr }}</span>
      <span>Auftragsdatum: </span>      <span>{{ useDateFormat(order?.AufDat, "DD.MM.YYYY").value }}</span>
      <span>Erledigungsdatum: </span>   <span>{{ useDateFormat(order?.ErlDat, "DD.MM.YYYY").value }}</span>
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
        placeholder="Dauer (Arbeitszeit) in h*"
      ></InputNumber>

      <!-- Ersatz für DropDown: -->
      <MultiSelect
        id="multiselect_ersatzteile"
        class="h-12"
        filter
        v-model="selectedSpareParts"
        :options="spareparts"
        option-label="EtBezeichnung"
        placeholder="Ersatzteil(e) auswählen (optional)"
        @change="onSparePartsSelectionChange"
      >
        <template #option="slotProps">
          <div class="flex justify-between">
            <span>
               {{ slotProps.option?.EtBezeichnung }}
            </span>
             
            <span>
              &nbsp; á {{ slotProps.option?.EtPreis }} €
            </span>

            <span>
              &nbsp;({{ slotProps.option?.EtHersteller }})
            </span>
          </div>
        </template>
      </MultiSelect>

      <div v-if="selectedSpareParts.length > 0">
        <ul>
          <li v-for="sparePartData in selectedSpareParts" :key="sparePartData.EtID">
            <Button 
              class="w-3 h-3 text-xs text-center items-center justify-center"
              style="margin-right: 0.5rem; margin-top: 0.1rem; margin-bottom: 0.1rem; font-size: 0.75rem" 
              @click="incrementQuantity(sparePartData.EtID)" 
            >+</Button>
            
            <Chip class="w-8 flex items-center justify-center">
              {{ getQuantity(sparePartData.EtID) }}
            </Chip> 
            
            <Button 
              class="w-3 h-3 text-xs text-center items-center justify-center" 
              style="margin-left: 0.5rem; margin-right: 0.5rem; margin-top: 0.1rem; margin-bottom: 0.1rem; font-size: 0.75rem" 
              @click="decrementQuantity(sparePartData.EtID)" 
            >-</Button>

            {{ sparePartData.EtBezeichnung }}
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
  selectedSparePartsData.value = [];

  const updateSelectedSpareParts = (sparePart: IErsatzteil) => {
    const existingSparePartIndex = selectedSparePartsData.value.findIndex(
    (item) => item.EtID === sparePart.EtID
    );

    if (existingSparePartIndex == -1) {
      selectedSparePartsData.value.push(
        { 
          EtID: sparePart.EtID, 
          EtBezeichnung: sparePart.EtBezeichnung, 
          Anzahl: 1
        });
    } 
  };

  const onSparePartsSelectionChange = () => {
    selectedSpareParts.value.forEach((sparePart: IErsatzteil) => {
      updateSelectedSpareParts(sparePart);
    });
  };

  const getQuantity = (index: string) => {
    const existingSparePart = selectedSparePartsData.value.find(
      (item) => item.EtID === index
    );
    return existingSparePart.Anzahl;
  }

  const incrementQuantity = (index: string) => {
    const existingSparePart = selectedSparePartsData.value.find(
      (item) => item.EtID === index
    );
    existingSparePart.Anzahl++;
  };

  const decrementQuantity = (index: string) => {
    const existingSparePart = selectedSparePartsData.value.find(
      (item) => item.EtID === index
    );
    if (existingSparePart.Anzahl > 1) existingSparePart.Anzahl--;
  };
  // --------------------

  onMounted(async () => {
    disableScroll.off();

    console.log(order.value);

    spareparts.value = await sparepartsService.list([], {}, 0, 1000);
    order.value = unflatten(dialogRef.value.data.order);
    console.log(order.value);

    employee.value = await employeesSevice.get(order?.value?.MitID as string);
  });

  const planOrder = async () => {
    try {
      let { Aufnr, MitID, Kunde, Mitarbeiter, Rechnung, ...x }: any = order.value;

      console.log(x);

      if (selectedSpareParts.value.length > 0) {
        x.Montage = {
          create: selectedSpareParts.value.map((sparePart) => {
            const sparePartData = selectedSpareParts.value.find((item) => item.EtID === sparePart.EtID);
            const anzahl = getQuantity(sparePartData.EtID);

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
  .max-h-40 {
    max-height: 10rem;
  }

  .multi-select .selected-text {
    word-wrap: break-word;
    white-space: nowrap;
    overflow: hidden; 
  }
</style>