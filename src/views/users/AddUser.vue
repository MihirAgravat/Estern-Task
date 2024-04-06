<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute,useRouter } from 'vue-router'
import { useVuelidate } from '@vuelidate/core';
import { apiGetUser } from '@/API/utils'
//@ts-ignore
import { required, email } from '@vuelidate/validators';
import { apiCreateUser, apiEditUser } from '@/API/utils'
import moment from 'moment'

const router = useRouter()
const route = useRoute()
const password_show = ref<boolean>(false)
const isEdit = ref<boolean>(false)

const adminData = ref<any>({
    name: '',
    email: '',
    password: '',
    role: '',
    dob: '',
    profile: '',
    gender: '',
    status: '',
    userGalleries: [],
    userPictures: [],
})

const rules = {
    name: { required },
    email: { required, email },
    password: isEdit ? '' : { required },
    role: { required },
    dob: { required },
    profile: isEdit ? '' : { required },
    gender: { required },
    status: { required },
    userGalleries: isEdit ? [] : { required },
    userPictures: isEdit ? [] : { required },
}
const vv = useVuelidate(rules, adminData.value)

onMounted(() => {
    if(route.params.id){
        isEdit.value = true
        apiGetUser(route.params.id).then((res : any) => {
            adminData.value.name = res.data.name
            adminData.value.email = res.data.email
            adminData.value.role = res.data.role_id
            adminData.value.dob = res.data.dob
            adminData.value.profile = res.data.profile
            adminData.value.gender = res.data.gender
            adminData.value.status = res.data.status
            adminData.value.userGalleries = res.data.user_galleries
            adminData.value.userPictures = res.data.user_pictures
        })
    }
})

const handleProfile = (e : any) => {
    vv.value.profile.$model = e.target.files[0]
}

const handlegallery = (e : any) => {
    vv.value.userGalleries.$model = e.target.files
}

const handlepicture = (e : any) => {
    vv.value.userPictures.$model = e.target.files
}

const dateTime = (value : any) => {
      return moment(value).format('YYYY-MM-DD');
}

const submit = () => {
    vv.value.$validate()
    if(!vv.value.$error){
        let data = new FormData()
        data.append('name', adminData.value.name)
        data.append('email', adminData.value.email)
        data.append('role_id', adminData.value.role)
        data.append('dob', dateTime(adminData.value.dob))
        data.append('gender', adminData.value.gender)
        data.append('status', adminData.value.status ? '1' : '0')
        if(isEdit.value){
            apiEditUser(route.params.id, data).then((res : any) => {
                router.push({ name: 'users' })
            })
        }else{
            data.append('password', adminData.value.password)
            data.append('profile', adminData.value.profile)
            for(var i = 0; i < adminData.value.userGalleries.length; i++){
                data.append('user_galleries[]', adminData.value.userGalleries[i])
            }
            for(var i = 0; i < adminData.value.userPictures.length; i++){
                data.append('user_pictures[]', adminData.value.userPictures[i])
            }
            apiCreateUser(data).then((res: any) => {
                router.push({ name: 'users' })
            })
        }
    }
}

</script>

<template>
    <div class="w-full h-full px-8 py-8 bg-blue-300">
        <div class="h-fit bg-white rounded-2xl px-4 sm:px-8 lg:px-10 py-3 sm:py-4 lg:pb-12">
            <div class="font-medium text-2xl">
                {{ isEdit ? 'Update Admin User' : 'Create Admin User'}}
            </div>
            <div class="mt-6">
                <div class="flex w-full flex-col justify-center">
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-y-4 sm:gap-y-8 sm:gap-x-10 lg:gap-x-14">
                        <!-- Name -->
                        <div>
                            <div :class="vv.name.$invalid && vv.name.$dirty ? 'border-red-600' : 'border-gray-600'" class="border-b">
                                <input :class="vv.name.$invalid && vv.name.$dirty ? 'placeholder:text-red-600' : '' " class="pb-2 border-0 w-full focus:ring-0" v-model="vv.name.$model" type="text" placeholder="Name">
                            </div>
                            <div v-if="vv.name.$invalid && vv.name.$dirty" class="text-red-600 mt-1 text-sm"> Name required </div>
                        </div>

                        <!-- Email -->
                        <div>
                            <div :class="vv.email.$invalid && vv.email.$dirty ? 'border-red-600' : 'border-gray-600'" class="border-b">
                                <input :class="vv.email.$invalid && vv.email.$dirty ? 'placeholder:text-red-600' : '' " class="pb-2 border-0 w-full focus:ring-0" v-model="vv.email.$model" type="email" placeholder="Email">
                            </div>
                            <div v-if="vv.email.$invalid && vv.email.$dirty" class="text-red-600 mt-1 text-sm"> Email required </div>
                        </div>

                         <!-- Password -->
                        <div v-if="!isEdit">
                            <div :class="vv.password.$invalid && vv.password.$dirty ? 'border-red-600 text-red-600' : 'border-gray-600' " class="border-b flex items-center pr-4">
                                <input :class="vv.password.$invalid && vv.password.$dirty ? 'placeholder:text-red-600' : ''" class="pb-2 w-full border-0 focus:ring-0" :type="password_show ? 'text': 'password'" v-model="vv.password.$model" placeholder="Password">
                                <i @click="password_show = !password_show" class="cursor-pointer fa-solid fa-eye"></i>
                            </div>
                            <div v-if="vv.password.$invalid && vv.password.$dirty" class="text-red-600 mt-1"> Password required </div>
                        </div>

                         <!-- Role -->
                        <div>
                            <div :class="vv.role.$invalid && vv.role.$dirty ? 'border-red-600' : 'border-gray-600'" class="border-b">
                                <select :class="vv.role.$invalid && vv.role.$dirty ? 'placeholder:text-red-600' : '' " class="pb-2 border-0 w-full focus:ring-0" v-model="vv.role.$model">
                                    <option value="1">Administrator</option>
                                    <option value="2">Sub Admin</option>
                                </select>
                            </div>
                            <div v-if="vv.role.$invalid && vv.role.$dirty" class="text-red-600 mt-1"> Role required </div>
                        </div>

                        <!-- Dob -->
                        <div>
                            <div :class="vv.dob.$invalid && vv.dob.$dirty ? 'border-red-600 text-red-600' : 'border-gray-600' " class="border-b flex items-center pr-4">
                                <input :class="vv.dob.$invalid && vv.dob.$dirty ? 'placeholder:text-red-600' : ''" class="pb-2 w-full border-0 focus:ring-0" type="date" v-model="vv.dob.$model" placeholder="Dob">
                            </div>
                            <div v-if="vv.dob.$invalid && vv.dob.$dirty" class="text-red-600 mt-1"> Dob required </div>
                        </div>

                        <!-- Profile -->
                        <div>
                            <div :class="vv.profile.$invalid && vv.profile.$dirty ? 'border-red-600 text-red-600' : 'border-gray-600' " class="border-b pb-1 flex items-center pr-4">
                                <input class="w-full cursor-pointer focus:ring-0" type="file" @change="handleProfile" placeholder="Profile">
                            </div>
                            <div v-if="vv.profile.$invalid && vv.profile.$dirty" class="text-red-600 mt-1"> Profile required </div>
                        </div>

                        <!-- Gender -->
                        <div>
                            <div :class="vv.gender.$invalid && vv.gender.$dirty ? 'text-red-600' : 'text-gray-700'" class="font-medium">Gender</div>
                            <div class="flex items-center space-x-3 mt-3">
                                <div>
                                    <input id="female" :class="vv.gender.$invalid && vv.gender.$dirty ? 'border-red-600' : ''" class="w-4 h-4 border-2 cursor-pointer mr-2 focus:ring-offset-transparent focus:outline-transparent focus:ring-transparent" value="0" type="radio" name="gender" v-model="vv.gender.$model">
                                    <label :class="vv.gender.$invalid && vv.gender.$dirty ? 'text-red-600' : ''" class="cursor-pointer text-sm" for="female">Female</label>
                                </div>
                                <div>
                                    <input id="male" :class="vv.gender.$invalid && vv.gender.$dirty ? 'border-red-600' : ''" class="w-4 h-4 border-2 mr-2 cursor-pointer focus:ring-offset-transparent focus:outline-transparent focus:ring-transparent" value="1" type="radio" name="gender" v-model="vv.gender.$model">
                                    <label :class="vv.gender.$invalid && vv.gender.$dirty ? 'text-red-600' : ''" class="cursor-pointer text-sm" for="male">Male</label>
                                </div>
                            </div>
                            <div v-if="vv.gender.$invalid && vv.gender.$dirty" class="text-red-600 mt-1"> Gender required </div>
                        </div>

                         <!-- Status -->
                        <div>
                            <div :class="vv.status.$invalid && vv.status.$dirty ? 'text-red-600' : 'text-gray-700'" class="font-medium">Status</div>
                            <div class="mt-3">
                                <label :class="vv.status.$invalid && vv.status.$dirty ? 'text-red-600' : ''" class="inline-flex items-center cursor-pointer">
                                    <input :class="vv.status.$invalid && vv.status.$dirty ? 'border-red-600' : ''" class="sr-only peer w-4 h-4 border-2 mr-2 focus:ring-offset-transparent focus:outline-transparent focus:ring-transparent" type="checkbox" v-model="vv.status.$model">
                                    <div :class="vv.status.$invalid && vv.status.$dirty ? 'bg-red-600' : 'bg-gray-200'" class="relative w-11 h-6 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                                    <span class="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">{{ adminData.status ? 'Inactive' : 'Active' }}</span>
                                </label>
                            </div>
                            <div v-if="vv.status.$invalid && vv.status.$dirty" class="text-red-600 mt-1"> Status required </div>
                        </div>

                        <!-- UserGalleries -->
                        <div>
                            <div :class="vv.userGalleries.$invalid && vv.userGalleries.$dirty ? 'border-red-600 text-red-600' : 'border-gray-600' " class="border-b pb-1 flex items-center pr-4">
                                <input class="w-full cursor-pointer focus:ring-0" multiple type="file" @change="handlegallery">
                            </div>
                            <div v-if="vv.userGalleries.$invalid && vv.userGalleries.$dirty" class="text-red-600 mt-1"> This feild is required </div>
                        </div>

                        <!-- UserPicture -->
                        <div>
                            <div :class="vv.userPictures.$invalid && vv.userPictures.$dirty ? 'border-red-600 text-red-600' : 'border-gray-600' " class="border-b pb-1 flex items-center pr-4">
                                <input class="w-full cursor-pointer focus:ring-0" multiple type="file" @change="handlepicture">
                            </div>
                            <div v-if="vv.userPictures.$invalid && vv.userPictures.$dirty" class="text-red-600 mt-1"> This feild is required </div>
                        </div>
                    </div>

                    <div class="flex mt-8 space-x-3 items-center">
                        <button @click="submit" class="px-6 py-[8px] shadow font-bold rounded-sm text-white bg-blue-500" type="button">
                            {{ isEdit ? 'Update' : 'Submit'}}
                        </button>
                        <router-link :to="{ name: 'users' }" class="px-6 py-[8px] shadow font-bold rounded-sm text-white bg-gray-500" type="button">
                            Cancel
                        </router-link>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
