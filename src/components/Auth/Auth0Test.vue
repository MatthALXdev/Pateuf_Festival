<template>
    <div class="p-6 bg-white rounded shadow max-w-xl mx-auto mt-10">
      <h2 class="text-2xl font-bold mb-4 text-center">🔐 Test Auth0</h2>
  
      <div v-if="authStore.loading" class="text-gray-500">Chargement...</div>
  
      <div v-else>
        <div v-if="!authStore.isAuthenticated">
          <p class="text-red-500">Non connecté</p>
          <button
            @click="authStore.login"
            class="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-800"
          >
            Se connecter
          </button>
        </div>
  
        <div v-else>
          <p class="text-green-600 font-semibold">Connecté en tant que :</p>
          <pre class="bg-gray-100 p-2 rounded text-sm text-gray-800">{{ authStore.getUser }}</pre>
  
          <p class="mt-4 font-medium">Token d'accès :</p>
          <pre class="bg-gray-100 p-2 rounded text-xs overflow-x-auto max-h-40">{{ authStore.getToken }}</pre>
  
          <button
            @click="authStore.logout"
            class="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700"
          >
            Se déconnecter
          </button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { onMounted } from 'vue'
  import { useAuthStore } from '@/stores/authStore'
  
  const authStore = useAuthStore()
  
  onMounted(() => {
    authStore.init()
  })
  </script>
  