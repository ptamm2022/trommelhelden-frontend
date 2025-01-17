<template>
  <div
    v-if="invoice"
    class="box-border text-2xl w-full main-app"
  >
    <div class="main-header">
      
      <h1 
      class="bg-gradient-to-r from-blue-500 to-pink-700 bg-clip-text py-4 text-7xl font-extrabold text-transparent"
      >
        Rechnung {{ invoice?.Auftrag?.Aufnr }}
      </h1>
    </div>

    <Divider />

    <div class=" big-top-margin">
      <div class="addr">
        {{ invoice?.Auftrag?.Kunde?.KunName }}
        <br> 
        {{ invoice?.Auftrag?.Kunde?.KunStrasse }}
        <br> 
        {{ invoice?.Auftrag?.Kunde?.KunPLZ }} {{ invoice?.Auftrag?.Kunde?.KunOrt }} 
      </div>
      
      <Divider />
      
      <div class="main-content">

        <div class="inv">
          <span class="order_column_header">
            AufNr:
          </span>
          <span>
            # {{ invoice?.Auftrag?.Aufnr }}
          </span>
        </div>

        <div class="customer">
          <span class="order_column_header">
            KunNr:
          </span>
          # {{ invoice?.Auftrag?.Kunde?.KunNr }}
        </div>
      
        <div class="due">
          <span class="order_column_header">
            Auftragsdatum:
          </span>
          <span>
            {{
            useDateFormat(invoice?.Auftrag?.AufDat, "DD.MM.YYYY", {
              locales: "de-DE",
            }).value
            }}
          </span>
        </div>

        <div class="due">
          <span class="order_column_header">
            Erledigungsdatum:
          </span>
          <span>
            {{
            useDateFormat(invoice?.Auftrag?.ErlDat, "DD.MM.YYYY", {
              locales: "de-DE",
            }).value
            }}
          </span>
        </div>
      </div>
    </div>

    <Divider />

    <div>
      <div class="main-content-tab">
       
        <table
          aria-colcount="4"
          class="inv-table"
        >
          <thead class="dark-bg-1">
            <tr>
              <th>Bezeichnung</th>
              <th>Einzelpreis</th>
              <th>Menge Einh.</th>
              <th>Betrag</th>
            </tr>
          </thead>
          <tbody>
            <tr style="padding-left: 1rem;">
              <td>Arbeitsleistung {{ invoice?.Auftrag?.Mitarbeiter?.MitJob }}</td>
              <td>{{ invoice?.Auftrag?.Mitarbeiter?.MitStundensatz }} €</td>
              <td>{{ invoice?.Auftrag?.Dauer }} (h.)</td>
              <td>{{ Number(invoice?.Auftrag?.Dauer) * invoice?.Auftrag.Mitarbeiter.MitStundensatz }} €</td>
            </tr>
            
            <tr>
              <td>Fahrkosten</td>
              <td>2.50 €</td>
              <td>{{ invoice?.Auftrag.Anfahrt }} (km.)</td>
              <td>{{ (invoice?.Auftrag.Anfahrt * 2.50) < 30 ? 30 : (invoice?.Auftrag.Anfahrt * 2.50) }} €</td>
            </tr>
          
            <tr v-for="ersatzteil in order.Montage" :key="ersatzteil.EtID">
              <td>{{ ersatzteil.EtID }}: {{ ersatzteil.Ersatzteil.EtBezeichnung }}</td>
              <td> {{ ersatzteil.Ersatzteil.EtPreis }} € </td>
              <td> {{ ersatzteil.Anzahl }} (Stk.) </td>
              <td> {{ (ersatzteil.Ersatzteil.EtPreis * ersatzteil.Anzahl).toFixed(2) }} € </td>
            </tr>
          </tbody>
        </table>

        <div>
          <div class="definition"> 
            Beschreibung (falls vorhanden): {{ invoice?.Auftrag.Beschreibung }}
          </div>

          <div class="definition"> 
            Es bediente Sie: {{ invoice?.Auftrag?.Mitarbeiter?.MitVorname }} {{ invoice?.Auftrag?.Mitarbeiter?.MitName }} ({{ invoice?.Auftrag?.Mitarbeiter?.MitJob }})
          </div>
        </div>

        <div class="summary">
          <div>
            <span>
              Netto: 
            </span>
            <span>
              {{ 
                ((invoice?.Auftrag?.Rechnung[0].RechBetrag * 1) / 1.19).toFixed(2) 
              }} €
            </span>
          </div>

          <div>
            <span>
              19 % MwSt.: 
            </span>
            <span>
              {{ 
                (((invoice?.Auftrag.Rechnung[0].RechBetrag * 1) / 1.19) * 0.19).toFixed(2) 
              }} €
            </span>
          </div>

          <div class="sum">
            <span style="padding-left: 1rem; padding-right: 1rem;">
              Gesamt (EUR)
            </span>
            <span> 
              {{
                invoice?.Auftrag.Rechnung[0].RechBetrag
              }} €
            </span>
          </div>

        </div>
        
        <Divider />

        <div class="flex justify-between">
        
          <Button
          style="background-color: #d92979"
          label="Zurück"
          icon="pi pi-backward"
          @click="$router.go(-1)"
          />

          <Button
          label="Drucken"
          icon="pi pi-print"
          @click="printWindow()"
          />

        </div>
        
      </div>
    </div>
  </div>
  <div>
  </div>

</template>

<script setup lang="ts">
import { useDateFormat } from "@vueuse/core";

import InvoiceService from "@/api/services/Invoices";
import { IErsatzteil, IRechnung, IAuftrag } from "@/types";
import { onBeforeMount, onMounted, ref } from "vue";
import { useRoute, useRouter } from 'vue-router';

import OrderService from '@/api/services/Order';
import GenericService from '@/api/services/Generic';

const route = useRoute()
const router = useRouter()

const order = ref<IAuftrag>({} as IAuftrag)
const orderService = new GenericService<IAuftrag>('orders')

const {
  KunNr,
  AufNr,
}: {
  KunNr: string;
  AufNr: string;
} = route.params as any;

const invoiceService = new InvoiceService();
const invoice = ref<IRechnung>({} as IRechnung);

onBeforeMount(async () => {
  invoice.value = await invoiceService.getInvoice(AufNr, KunNr);
  console.log(invoice.value);

  order.value = await orderService.get(AufNr);

  if (order.value === null) {
    return router.push("/404")
  }
});



function printWindow() {
  window.print();
}

</script>

<style scoped>
/* h1,
h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #426cb9;
}

.single-page {
  background-color: #ffffffe5;
}

.invoice {
  margin-top: 20px;
} */

.main-app {
  border: 1px solid #eee;
  border-radius: 10px;
  padding: 4rem 5rem;
  max-width: 800px;
  min-width: 900px;
  box-shadow: 0 1.5rem 4rem #a4a4a4;
}

.main-header {
  box-sizing: border-box;
  display: -webkit-box;
  -webkit-box-pack: justify;
}

.addr {
  font-size: 1.5rem;
  width: 40%;
  line-height: 150%;
}

.big-top-margin {
  font-size: 1.2rem;
  box-sizing: border-box;
  margin-bottom: 2rem;
}

.main-content {
  font-size: 1.2rem;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
}

.order_column_header {
  color: #a4a4a4;
  display: block;
  text-align: left;
}

.bold-font {
  box-sizing: border-box;
  font-weight: 700 !important;
  text-transform: uppercase;
  background-image: linear-gradient(90deg, #4279b8, #1a2327);
  -webkit-background-clip: text;
  color: transparent;
  display: block;
  text-align: left;
}

.inv {
  text-align: center;
  color: #2c3e50;
  margin: 0;
  /* padding: 1rem; */
  box-sizing: border-box;
}

.due {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  text-align: center;
  color: #2c3e50;
  ;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.amount {
  text-align: center;
  color: #2c3e50;
  font-size: 1.1rem;
  margin: 0;
  padding: 0;
  box-sizing: border-box;

}

.inv-table {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  text-align: left;
  color: #2c3e50;
  font-size: 1.3rem;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  padding-right: 5rem;
  margin-top: 2rem;
  width: 100%;
  margin-bottom: 1rem;
  border-collapse: collapse;
}

.dark-bg-1 {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  text-align: left;
  border-collapse: collapse;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  margin-top: 2rem;
  background-color: #4279b8 !important;
  color: #eee;
}

.summary {
  flex-direction: column;
  align-items: flex-end;
  display: flex;
  text-align: right;
  margin-top: 2rem;
}

.sum {
  box-sizing: border-box;
  font-weight: 700 !important;
  background-color: #4279b8 !important;
  color: #eee;
  display: flex;
  text-align: right;
  width: 20rem;
  justify-content: space-between;
  margin-top: 2rem;
}

.definition {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-size: 1.2rem;
  text-align: left;
  white-space: nowrap;
}

@media print {

  Button,
  button {
    display: none;
  }

  .main-app {
    box-shadow: none;
  }

  .order_column_header,
  .addr,
  .bold-font,
  h1,
  .sum {
    color: black;
  }

  body {
    margin-top: -9rem;
  }
}
</style>
