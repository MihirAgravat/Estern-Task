<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import Navbar from './components/Navbar.vue';

const route = useRoute()
const isLogin = computed(() => route.name == 'login' ? true : false)
</script>

<template>
  <div class="fixed top-0 left-0 right-0 bottom-0">
    <div class="flex h-full w-full flex-col">
      <div class="fixed z-10 top-0 left-0 right-0 bg-white" v-if="!isLogin">
        <Navbar/>
      </div>
      <router-view :class="!isLogin ? 'pt-28' : ''" class="h-full w-full overflow-y-auto"/>
    </div>
  </div>
</template>

