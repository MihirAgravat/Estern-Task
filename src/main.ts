import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import Vue3Toastify, { type ToastContainerOptions } from 'vue3-toastify';
//@ts-ignore
import VueAwesomePaginate from "vue-awesome-paginate";
import "vue-awesome-paginate/dist/style.css";

import App from './App.vue'
import router from './router'
import './index.css'
const app = createApp(App)

app.use(createPinia())
app.use(Vue3Toastify, {
    autoClose: 3000,
  } as ToastContainerOptions);
app.use(VueAwesomePaginate)
app.use(router)
app.mount('#app')
