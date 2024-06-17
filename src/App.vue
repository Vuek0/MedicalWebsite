<script setup>
import { onMounted, ref } from 'vue';
import FormInput from './components/FormInput.vue';
import SubmitButton from './components/SubmitButton.vue';
import SideBar from './components/SideBar.vue';
import { usePages } from './stores/Pages';
import { useUser } from './stores/User';
import axios from "axios";
import md5 from "crypto-js/md5";
import { getCookie, setCookie } from './functions/Cookies';
import UserPage from './components/UserPage.vue';
const pages = usePages();
const user = useUser();
const isRegistered = ref(false);
const isLoginForm = ref(true);
const name = defineModel('name');
const surname = defineModel('surname');
const login = defineModel('login');
const password = defineModel('password');
const formError = ref();
const API_KEY = import.meta.env.VITE_API_KEY;

onMounted(async ()=>{
  const urlParams = new URLSearchParams(window.location.search);
  name.value = urlParams.get('name');
  surname.value = urlParams.get('surname');
  login.value = urlParams.get('login');
  password.value = urlParams.get('password');
  if(name.value && surname.value && login.value && password.value){
    isLoginForm.value = false;
    registrationHandler();
  } else if(login.value && password.value){
    loginHandler();
  }
  if(getCookie("_id")){
    const response = await axios.get(`https://medical-server-six.vercel.app/users?key=${API_KEY}`);
    const users = response.data;
    users.forEach(item => {
      if(item._id === getCookie("_id")){
        user.obj = item;
      }
    })
    isRegistered.value = true;
    isLoginForm.value = false;
  }
});


async function loginHandler(e){
  if(e){
    e.preventDefault();
  }
  formError.value = "";
  const response = await axios.get(`https://medical-server-six.vercel.app/users?key=${API_KEY}`);
  if(response.status!=200){
    formError.value="Произошла какая-то ошибка";
    return;
  }
  const users = response.data;
  users.forEach(item => {
    if(item.login === login.value){
      if(md5(password.value).toString() == item.password){
        console.log(item);
        isLoginForm.value = false;
        isRegistered.value = true;
        if(!getCookie("_id")) setCookie("_id", item._id, 3);
        user.obj = item;
      } else{
        formError.value = "Логин или пароль неверны"
      }
    } else{
      if(formError.value!=="Логин или пароль неверны") formError.value = "Аккаунт не найден";
    }
  })
}

async function registrationHandler(e){
  if(e){
    e.preventDefault();
  }
  const data = {
    name: name.value,
    surname: surname.value,
    login: login.value,
    password: password.value,
    type: "pacient",
  }
  const req = await axios.post(`https://medical-server-six.vercel.app/users?key=${API_KEY}`, data, 
  {
    headers: {
      'Content-Type' : 'application/json'
    }
  })
  
  const res = await req;
  console.log(await res);
  if(res.status == 200){
    isRegistered.value = true;
  }

}


</script>

<template>
  <SideBar :pages="pages"/>
  <main>
    <div class="container">
      <h1>MedCareUz</h1>
      <section class="registration" v-if="!isRegistered && !isLoginForm">
        <h2>Регистрация</h2>
        <form @submit="registrationHandler">
          <FormInput type="text" placeholder="Name" v-model="name" :value="name" />
          <FormInput type="text" placeholder="Surname" v-model="surname" :value="surname" />
          <FormInput type="text" placeholder="Логин" v-model="login" :value="login" />
          <FormInput type="password" placeholder="Пароль" v-model="password" :value="password" />
          <button type="submit">Зарегестрироваться</button>
          <p>Уже есть аккаунт? <a href="#" class="form__link" @click="isLoginForm = true">войти</a></p>
          name:
          {{ name }}
          surname:
          {{ surname }}
          login:
          {{ login }}
          password:
          {{ password }}
        </form>
        
      </section>
      <section class="login" v-else-if="isLoginForm">
        <form @submit="loginHandler">
          <h2>Вход</h2>
          <div class="formError" v-if="formError">
            <p>{{ formError }}</p>
          </div>
          <FormInput type="text" placeholder="Логин" v-model="login" :value="login" />
          <FormInput type="password" placeholder="Пароль" v-model="password" :value="password" />
          <button type="submit">Войти</button>
          <p>Вы пациент? <a href="#" class="form__link" @click="isLoginForm = false">Зарегестрироваться</a></p>
          login:
          {{ login }}
          password:
          {{ password }}
        </form>
        
      </section>
      <section v-else-if="pages.currentPage == 'main'">
        It's the main page<br />
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Nihil cupiditate dignissimos reiciendis sint facere voluptatibus asperiores exercitationem, veniam molestiae saepe?
      </section>
      <UserPage :userObj="user.obj" v-else-if="pages.currentPage == 'user'" />
    </div>
    
  </main>
</template>

<style lang="scss" scoped>
  h1{
    font-size: 100px;
  }

  main{
    width: 100%;
  }

  .container{
    padding: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .formError{
    background: red;
    color:aliceblue;
    padding: 5px 15px;
    width: 100%;
  }

  .registration, .login{

    display: flex;
    flex-direction: column;
    gap: 30px;

    h2{
      font-size: 60px;
    }
    form{
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 10px;
      width: 400px;
      button{
        width: fit-content;
        padding: 10px 20px;
        font-size: 25px;
      }

      a{
        color: cornflowerblue;

        &:hover{
          color: dodgerblue;
        }
      }
      
    }
  }

</style>
