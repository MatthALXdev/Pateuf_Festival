<template>
  <div
    class="flex flex-col gap-4 justify-around bg-[#E5C992] p-4 border border-_black01 rounded-lg shadow-lg mb-4"
  >
    <div class="flex flex-row justify-between items-center">
      <div>
        <p v-if="isCurrent">Actuellement</p>
        <p v-else>À venir</p>
        <p>{{ group.name }}</p>
        <p>De {{ group.start }} &#8658; {{ group.end }}</p>
      </div>
      <img
        :src="group.image"
        alt="Feature Image"
        class="w-20 h-20 rounded-md border border-_black01 shadow-lg"
      />
    </div>
    <p>{{ group.description }}</p>
  </div>
</template>

<script setup>
defineProps({
  group: Object, // Informations sur le groupe
  isCurrent: Boolean, // Indique si c'est le groupe en live
})
</script>
