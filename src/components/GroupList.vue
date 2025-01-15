<template>
  <div>
    <div
      v-for="(group, index) in groups"
      :key="index"
      class="border-2 border-_darkBlue01 p-2 rounded-lg mb-2 w-full flex items-center"
    >
      <img
        :src="group.image"
        alt="Logo de {{ group.name }}"
        class="w-12 h-12 rounded-md border border-black shadow-lg mr-4"
      />
      <div class="flex-1">
        <p class="text-sm font-medium font-title">{{ group.name }}</p>
        <p class="text-sm text-gray-600">{{ group.start }}</p>
      </div>
      <img src="/src/assets/images/marker.svg" alt="logo de marqueur" />
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  groups: Array,
})
</script>
