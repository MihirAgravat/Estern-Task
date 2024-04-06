<script setup lang="ts">
import { onMounted } from 'vue'
import { initFlowbite } from 'flowbite'
const props = defineProps(['data'])

onMounted(() => {
    initFlowbite();
})

</script>

<template>
    <div>
        <div class="flex justify-center">
            <button id="button" data-modal-toggle="modal" data-modal-target="modal" type="button"><i
                    class="fa-solid fa-eye"></i></button>
        </div>
        <div id="modal" tabindex="-1" aria-hidden="true"
            class="fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-30 z-50 hidden w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0">
            <div class="relative rounded-lg bg-white overflow-hidden w-full max-w-2xl">
                <div class="py-2 px-4 bg-gray-800 text-2xl font-semibold text-white">
                    View User
                </div>
                <div class="py-4 px-6">
                    <div class="relative overflow-x-auto shadow-md sm:rounded-lg">
                        <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                            <tbody v-if="data">
                                <tr
                                    class="even:bg-white odd:bg-gray-200 border-b">
                                    <th scope="row"
                                        class="px-6 w-[180px] py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                        Name:
                                    </th>
                                    <td class="px-6 py-4">
                                        {{data.name}}
                                    </td>
                                </tr>
                                <tr
                                    class="even:bg-white odd:bg-gray-200 border-b">
                                    <th scope="row"
                                        class="px-6 py-4 w-[180px] font-medium whitespace-nowrap">
                                        Email:
                                    </th>
                                    <td class="px-6 py-4">
                                        {{data.email}}
                                    </td>
                                </tr>
                                <tr
                                    class="even:bg-white odd:bg-gray-200 border-b">
                                    <th scope="row"
                                        class="px-6 py-4 w-[180px] font-medium whitespace-nowrap">
                                        Role:
                                    </th>
                                    <td class="px-6 py-4">
                                        {{ data.role.name }}
                                    </td>
                                </tr>
                                <tr
                                    class="even:bg-white odd:bg-gray-200 border-b">
                                    <th scope="row"
                                        class="px-6 py-4 w-[180px] font-medium whitespace-nowrap">
                                        Dob:
                                    </th>
                                    <td class="px-6 py-4">
                                        {{ data.dob }}
                                    </td>
                                 
                                </tr>
                                <tr class="even:bg-white odd:bg-gray-200 border-b">
                                    <th scope="row"
                                        class="px-6 py-4 w-[180px] font-medium whitespace-nowrap">
                                        Profile:
                                    </th>
                                    <td class="px-6 py-4">
                                        <a href="#" class="font-weight-regular font-size-h6-sm text-[#007190]">
                                            View
                                         </a>
                                    </td>
                                </tr>
                                <tr class="even:bg-white odd:bg-gray-200 border-b">
                                    <th scope="row"
                                        class="px-6 py-4 w-[180px] font-medium">
                                        Gender:
                                    </th>
                                    <td class="px-6 py-4">
                                        {{ data.gender_text }}
                                    </td>
                                </tr>
                                <tr class="even:bg-white odd:bg-gray-200 border-b">
                                    <th scope="row"
                                        class="px-6 py-4 w-[180px] font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                        Status:
                                    </th>
                                    <td class="px-6 py-4">
                                        {{ data.status_text }}
                                    </td>
                                </tr>
                            </tbody>
                            <tbody v-else>
                                <tr>
                                    No data
                                </tr>
                            </tbody>
                        </table>
                    </div>

                </div>
            </div>
        </div>
    </div>
</template>