<script setup lang="ts">
import { ref } from 'vue'
//@ts-ignore
import { login } from '@/services/auth';
//@ts-ignore
import { useVuelidate } from '@vuelidate/core';
//@ts-ignore
import { required, email } from '@vuelidate/validators';
import { useRouter } from 'vue-router';
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

const Router = useRouter()
const password_show = ref<boolean>(false)

const adminCredentials = ref<{ email: string; password: string; }>({
    email: '',
    password: ''
})

const rules = {
    email: { required, email },
    password: { required }
}
const vv = useVuelidate(rules, adminCredentials.value)

const submit = () => {
    vv.value.$validate()
    if(!vv.value.$error){
    login(adminCredentials.value).then((res : any)=>{
        if(res.data.status == '1'){
            notify('success', 'Login successful')
            setTimeout(() => {
                localStorage.setItem('user', res.data.name)
                localStorage.setItem('token', res.data.authorization)
                Router.push('/users')
                vv.value.$reset()
            }, 1000);
        }
    }).catch((err : any)=>{
        notify('error','Invalid credentials')
    })
    }
}

const notify = (toastType : any, msg : string) => {
      toast(msg , {
        type : toastType,
        autoClose: 1500,
      });
}

</script>

<template>
    <div class="w-full h-full flex flex-col lg:flex-row items-center justify-center">
        <div class="w-full lg:w-1/3 bg-blue-400 h-36 lg:h-full"></div>
        <div class="lg:w-2/3 flex flex-col items-center justify-center w-full h-full">
            <div class="text-xl text-gray-600 lg:text-3xl font-bold">
                Sign In
            </div>
            <div class="w-10/12 mt-8 sm:w-8/12 lg:w-5/12">
                <div>
                    <div :class="vv.email.$invalid && vv.email.$dirty ? 'border-red-600' : 'border-gray-600'" class="border-b-2">
                        <input :class="vv.email.$invalid && vv.email.$dirty ? 'placeholder:text-red-600' : '' " class="pb-2 border-0 w-full focus:ring-0" v-model="vv.email.$model" type="email" placeholder="Email">
                    </div>
                    <div v-if="vv.email.$invalid && vv.email.$dirty" class="text-red-600 mt-1"> Email feild is required !</div>
                </div>
                <div>
                    <div :class="vv.password.$invalid && vv.password.$dirty ? 'border-red-600 text-red-600' : 'border-gray-600' " class="border-b-2 flex items-center pr-4 mt-5 sm:mt-8 lg:mt-8">
                        <input :class="vv.password.$invalid && vv.password.$dirty ? 'placeholder:text-red-600' : ''" class="pb-2 w-full border-0 focus:ring-0" :type="password_show ? 'text': 'password'" v-model="vv.password.$model" placeholder="Password">
                        <i @click="password_show = !password_show" class="cursor-pointer fa-solid fa-eye"></i>
                    </div>
                    <div v-if="vv.password.$invalid && vv.password.$dirty" class="text-red-600 mt-1"> Password feild is required !</div>
                </div>
                <div class="text-end cursor-pointer text-blue-400 font-medium mt-2">
                    Forget Password ?
                </div>
                <button @click="submit" class="bg-blue-400 hover:bg-blue-600 w-full rounded-xl mt-5 lg:mt-8 text-white transition-all duration-300 py-3 font-bold">
                    Submit
                </button>
            </div>
        </div>
    </div>
</template>