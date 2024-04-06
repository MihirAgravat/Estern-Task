<script setup lang="ts">
//@ts-ignore
import { ref, onMounted } from 'vue'
//@ts-ignore
import { initFlowbite } from 'flowbite'
//@ts-ignore
import { logout } from '@/services/auth';
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

const adminName = ref<any>(localStorage.getItem("user"))

onMounted(() => {
    initFlowbite();
})

const handleLogout = () => {
    logout().then((res : any) => {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        notify("success", res)
        setTimeout(() => {
            window.location.reload();
        }, 1000);
    })
}

const notify = (toastType : any, msg : string) => {
      toast(msg , {
        type : toastType,
        autoClose: 1500,
      });
}

</script>

<template>
    <div class="text-sm sm:text-xl px-10 font-semibold w-full py-3 flex justify-between items-center">
        <div>
            User Management
        </div>
        <button id="dropdownDefaultButton" data-dropdown-toggle="dropdown" type="button">
            <div class="flex space-x-3 items-center">
                <div class="">
                    <span class="text-blue-300">Hi,</span> {{ adminName }}
                </div>
                <img src="https://interview.optimavaluepro.com/images/default.png" class="w-10 h-10 rounded-lg" alt="">
            </div>
        </button>
        <div id="dropdown" class="z-10 hidden bg-blue-500 divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700">
            <ul class="py-2 px-4 text-sm text-white" aria-labelledby="dropdownDefaultButton">
                <li @click="handleLogout" class="cursor-pointer">
                    <i class="fa-solid mr-1 fa-right-from-bracket"></i> Logout
                </li>
            </ul>
        </div>
    </div>
</template>