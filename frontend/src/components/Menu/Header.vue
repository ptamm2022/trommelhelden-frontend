<template>
  <header class="sticky top-0 z-[1000]">
    <div
      class="flex h-10 items-center justify-between bg-gradient-to-r from-blue-500 to-pink-700 shadow"
    >
      <!-- Seitenleiste -->
      <Button
        icon="pi pi-align-justify"
        icon-class="text-[#f6f6f6]"
        class="p-button-rounded p-button-text p-button-plain"
        style="margin-left: 1rem;"
        @click="store.sideBarMenuIsOpen = !store.sideBarMenuIsOpen"
      />

      <!-- Home-Button (nur außerhalb des Dashboards) -->
      <router-link to="/">
        <Button
          icon="pi pi-home"
          icon-class="text-[#f6f6f6]"
          class="p-button-rounded p-button-text p-button-plain"
          style="margin-right: 1rem;"
          v-if="shouldShowButton"
        />
      </router-link>
    </div>
  </header>
</template>

<script setup lang="ts">
  import { useStore } from "@/store";
  import { computed } from "vue";
  import { useRoute } from "vue-router";

  const store = useStore();
  const route = useRoute();
  
  // Home-Button nur einblenden, wenn man sich nicht schon auf der Startseite befindet.
  const shouldShowButton = computed(() => {
    const currentPath = route.path;
    return !['/', '/dashboard'].includes(currentPath);
  });
</script>

<style scoped>

</style>