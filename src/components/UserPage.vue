<script setup>
import { ref } from 'vue';
import { setCookie } from "../functions/Cookies";
import ProfileText from "./ProfileText.vue";
import StyledButton from "./StyledButton.vue";
import { useUser } from '../stores/User';
import Modal from "./Modal.vue";
import axios from 'axios';
const user = useUser();
const userObj = user.obj
const isModalOpen = defineModel('modalopen');
const API_KEY = import.meta.env.VITE_API_KEY;
const type = JSON.parse(userObj.type);
function exitHandler(e){
    e.preventDefault();
    setCookie("_id", "");
    location.reload();
}

async function deleteHandler(){
    const req = await axios.delete(
        `https://medical-server-six.vercel.app/users?key=${API_KEY}`, 
        {
            "_id" : userObj._id
        }
    );
    const res = await req;
    if(res.status === 200){
        console.log(res.data.data);
        // setCookie("_id", "");
        // location.reload();
    }

    // const users = response.data;
};



</script>

<template>
    <section v-if="type.accountType==='pacient'" class="pacient">
        <ProfileText />        
        <StyledButton @click="exitHandler" :text="'Выйти из аккаунта'" />
        <StyledButton @click="isModalOpen = true" :text="'Удалить аккаунт'"/>
        <Modal v-if="isModalOpen" :handler="deleteHandler" v-model="isModalOpen" :text="'Вы уверены в том что хотите удалить свой аккаунт?'" />
    </section>

    <section v-else-if="type.accountType==='doctor'">
        <ProfileText />  
        <StyledButton @click="exitHandler" :text="'Выйти из аккаунта'" />
    </section>

    <section v-else-if="type.accountType==='admin'">
        <h2>Информация о пользователе: </h2>
        <div class="info">
            <p>Имя : {{ userObj.name }}</p>
            <p>Фамилия : {{ userObj.surname }}</p>
            <p>Логин : {{ userObj.login }}</p>
        </div>
        <StyledButton @click="exitHandler" :text="'Выйти из аккаунта'" />
    </section>
</template>

<style lang="scss" scoped>
    .pacient{
        display: flex;
        flex-direction: column;
        gap: 20px;
    }
    button{
        padding: 20px 40px;
        width: 300px;
        font-size: 18px;
    }
</style>