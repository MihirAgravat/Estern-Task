<script setup lang="ts">
//@ts-ignore
import { ref, onMounted, watch } from 'vue'
//@ts-ignore
import { initFlowbite } from 'flowbite'
import { apiGetUsers, apiDeleteUsers, apiDeleteMultipleUsers } from '@/API/utils';
import SearchIcon from '@/components/Icons/Search.vue'
//@ts-ignore
import TableDataModel from '@/components/TableDataModel.vue';

const loading = ref<boolean>(true)

onMounted(() => {
    initFlowbite();
    getUserData();
})

const activeButton = ref<string>('Listing')
const tableHeader = ref<string[]>(['Name', 'Email', 'Role', 'Dob', 'Gender','Status', 'Actions'])
const currentPage = ref<number>(1)
const totalData = ref<number>(0)
const perPage = ref<number>(5)
const handlesearch = ref<string>('')
const handleFilter = ref<string>('')
const users = ref()
const selectedData = ref()
const selectedOptions = ref([])
const selectAll = ref<boolean>(false)

watch(handlesearch, (newValue, oldValue) => {
    getUserData()
})

watch(selectAll, (newValue, oldValue) => {
    if (newValue) {
        selectedOptions.value = users.value.map((user: any) => user.id);
    } else {
        selectedOptions.value = []
    }
})

const getUserData = async () => {
    loading.value = true;
      await apiGetUsers({
            page : currentPage.value,
            search: handlesearch.value,
            filter: handleFilter.value,
            sort: '',
            order_by: 'asc'
        }).then((res : any) => {
            users.value = res.data 
            totalData.value = res.total      
            loading.value = false;
        })
}

const deleteUserData = async (id: number) => {
    loading.value = true;

    await apiDeleteUsers(id).then((res) => {
        getUserData()
    }).catch((err : any) => {
        loading.value = false;
    })
}

const exportToCSV = () => {
    const csvContent = generateCSVContent();
    downloadCSV(csvContent);
  }

  const generateCSVContent = () => {
    let csvContent = "data:text/csv;charset=utf-8,";

    csvContent += "Id,Name,Email,Role,Dob,Gender,Status\n";

    users.value.forEach((user: any) => {
      csvContent += `${user.id},${user.name},${user.email},${user.role.name},${user.dob},${user.gender},${user.status}\n`;
    });

    return encodeURI(csvContent);
  }

  const downloadCSV = (csvContent: string) => {
    const link = document.createElement('a');
    link.setAttribute('href', csvContent);
    link.setAttribute('download', 'users.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

const handlePageChange = async (page: number) => {
    currentPage.value = page;
    await getUserData();
}

const handleMultipleDelete = async () => {
    let data = new FormData()
    data.append('id[]', selectedOptions.value as any);
    await apiDeleteMultipleUsers(data).then((res:any) => {

    })
}


</script>

<template>
    <div class="w-full h-full px-4 sm:px-8 py-8 bg-blue-300">
        <div class="h-fit bg-white rounded-2xl p-4 sm:p-8 lg:p-10">
            <div class="flex items-center space-x-4 text-xs sm:text-base">
                <button value="Listing" @click="activeButton = 'Listing'" :class="activeButton == 'Listing' ? 'bg-sky-300' : ''" class="px-4 font-semibold py-2 rounded-md transition-all duration-300">
                    Listing
                </button>
                <button @click="activeButton = 'Import'" :class="activeButton == 'Import' ? 'bg-sky-300' : ''" class="px-4 py-2 font-semibold rounded-md transition-all duration-300">
                    Import
                </button>
                <button @click="activeButton = 'Import Zip'" :class="activeButton == 'Import Zip' ? 'bg-sky-300' : ''" class="px-4 py-2 font-semibold rounded-md transition-all duration-300">
                    Import Zip
                </button>
            </div>
            <div class="block sm:flex mt-10 items-center justify-between">
                <div class="relative">
                    <div class="absolute z-0 inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                        <SearchIcon />
                    </div>
                    <input @change="getUserData" v-model="handlesearch" type="search" id="default-search" class="block focus:ring-white border-0 w-full px-4 py-2 ps-10 border-b-2 border-gray-600" placeholder="Search" />
                </div>
                <div class="mt-5 sm:mt-0 flex items-center space-x-2">
                    <button id="filterDropDown" data-dropdown-toggle="filter" class="w-10 h-10 shadow rounded-lg text-white bg-blue-500" type="button">
                        <i class="fa-solid fa-filter"></i>
                    </button>
                    <div id="filter" class="z-10 hidden bg-white divide-y divide-gray-100 shadow-xl w-72">
                        <div class="py-2 px-6 w-full text-sm" aria-labelledby="filterDropDown">
                            <div class="text-xs text-blue-600 font-medium">
                                Role
                            </div>
                            <select v-model="handleFilter" class="border-0 w-full focus:ring-white border-b-2 border-gray-600 hover:border-gray-800 pb-2">
                                <option class="hidden" selected value=""></option>
                                <option value="eyJyb2xlX2lkIjpbIjEiXX0">Administrator</option>
                                <option value="eyJyb2xlX2lkIjpbIjIiXX0">Sub Admin</option>
                            </select>
                            <div class="mt-4 w-full flex items-center space-x-2">
                                <button @click="getUserData" class="py-2 w-1/2 px-2 hover:bg-blue-200 text-blue-500 rounded-md transition-all duration-300">Apply Filter</button>
                                <button @click="() => {handleFilter = ''; getUserData()}" class="py-2 w-1/2 px-2 hover:bg-gray-200 text-gray-500 rounded-md transition-all duration-300">Reset Filter</button>
                            </div>
                        </div>
                    </div>
                    <button class="w-10 h-10 shadow rounded-lg text-white bg-teal-500" type="button">
                        <router-link class="w-full-h-full" :to="{name : 'adduser'}"><i class="fa-solid fa-plus"></i></router-link>
                    </button>
                    <button @click="exportToCSV" class="w-6 h-10 rounded-lg text-black" type="button">
                        <i class="fa-solid fa-arrow-down"></i>
                    </button>
                    <button class="w-10 h-10 shadow rounded-lg text-white bg-blue-700" type="button">
                        <i class="fa-solid fa-eye"></i>
                    </button>
                    <button @click="handleMultipleDelete" v-if="selectedOptions.length > 1"class="w-6 h-10 rounded-lg text-teal-500" type="button">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </div>
            </div>
            <div class="mt-8">
                <div class="relative overflow-x-auto shadow-md sm:rounded-lg">
                    <table class="w-full text-sm text-left rtl:text-right text-gray-500">
                        <thead class="text-xs text-white bg-blue-400">
                            <tr>
                                <th scope="col" class="px-6 py-3">
                                    <div class="bg-transparent">
                                        <input v-model="selectAll" type="checkbox" class="border-2 accent-gray-500 w-4 h-4 text-xl focus:ring-offset-transparent focus:outline-transparent focus:ring-transparent" @change="handleChange">
                                    </div>
                                </th>
                                <th scope="col" class="px-6 py-3" v-for="(item, index) in tableHeader" :key="index">
                                    {{ item }}
                                </th>
                            </tr>
                        </thead>
                        <tbody v-if="loading">
                            <tr class="w-full text-center">
                                <td colspan="8" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                    Featching Data...
                                </td>
                            </tr>
                        </tbody>
                        <tbody v-else>
                            <tr v-for="(item, index) in users" :key="index" class="odd:bg-white even:bg-blue-200 border-b">
                                <td scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                    <div class="bg-transparent">
                                        <input v-model="selectedOptions" :value="item.id" type="checkbox" class="border-2 accent-gray-500 w-4 h-4 text-xl focus:ring-offset-transparent focus:outline-transparent focus:ring-transparent" @change="handleChange()">
                                    </div>
                                </td>
                                <td scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                    {{ item.name }}
                                </td>
                                <td scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                    {{ item.email }}
                                </td>
                                <td scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                    {{ item.role.name }}
                                </td>
                                <td scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                    {{ item.dob }}
                                </td>
                                <td scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                    {{ item.gender_text }}
                                </td>
                                <td scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                    {{ item.status_text }}
                                </td>
                                <td scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                    <div class="flex items-center space-x-3">
                                        <TableDataModel @click="selectedData = item" :data="selectedData" />
                                        <router-link :to="{ name: 'adduser', params: { id: item.id } }"><i class="fa-solid fa-pencil"></i></router-link>
                                        <button @click="deleteUserData(item.id)"><i class="fa-solid fa-trash"></i></button>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div class="mt-5 flex justify-center">
                    <vue-awesome-paginate
                        :total-items="totalData"
                        :items-per-page="30"
                        :max-pages-shown="5"
                        v-model="currentPage"
                        :on-click="handlePageChange"
                    />
                </div>
            </div>
        </div>
    </div>
</template>

<style scope>
    .pagination-container {
        display: flex;
        column-gap: 10px;
    }
    .paginate-buttons {
        height: 35px;
        width: 35px;
        border-radius: 5px;
        cursor: pointer;
        color: black;
    }
    .active-page {
        background-color: #3498db;
        border: 1px solid #3498db;
        color: white;
    }
    .active-page:hover {
        background-color: #2988c8;
    }
</style>