<script setup>
import { onMounted, ref } from 'vue';
import SideBar from './components/SideBar.vue';
import { usePages } from './stores/Pages';
import axios from "axios";
import md5 from "crypto-js/md5";
import { getCookie, setCookie} from './functions/Cookies';
import UserPage from './components/UserPage.vue';
const pages = usePages();
const isRegistered = ref(false);
const isLoginForm = ref(true);
const login = defineModel('login');
const password = defineModel('password');
const formError = ref();
const API_KEY = import.meta.env.VITE_API_KEY;
const userObject = ref();
// console.log(API_KEY);
onMounted(async ()=>{
  if(getCookie("_id")){
    const response = await axios.get(`https://medical-server-six.vercel.app/users?key=${API_KEY}`);
    const users = response.data;
    users.forEach(item => {
      if(item._id === getCookie("_id")){
        userObject.value = item;
      }
    })
    isRegistered.value = true;
    isLoginForm.value = false;
  }
});

function registrationHandler(e){
  e.preventDefault();
  isRegistered.value = true;
}

async function loginHandler(e){
  e.preventDefault();
  const response = await axios.get(`https://medical-server-six.vercel.app/users?key=${API_KEY}`);
  const users = response.data;
  let user;
  users.some(item => {
    if(item.login === login.value){
      if(md5(password.value).toString() == item.password){
        console.log(item);
        isLoginForm.value = false;
        isRegistered.value = true;
        if(!getCookie("_id")) setCookie("_id", item._id, 3);
        
        return true;
        
      } else{
        console.log("incorrect");
        formError.value = "Логин или пароль неверны"
        return false;
      }
    } else{
      console.log("Not found")
      formError.value = "Аккаунт не найден";
      return false;
    }
  })
}


</script>

<template>
  <SideBar :pages="pages"/>
  <main>
    <div class="container">
      <h1>Городская Больница</h1>
      <section class="registration" v-if="!isRegistered && !isLoginForm">
        <h2>Регистрация</h2>
        <form @submit="registrationHandler">
          <input type="text" placeholder="Логин" v-model="login">
          <input type="password" placeholder="Пароль" v-model="password">
          <button type="submit">Зарегестрироваться</button>
          <p>Уже есть аккаунт? <a href="#" class="form__link" @click="isLoginForm = true">войти</a></p>
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
          <input type="text" placeholder="Логин" v-model="login">
          <input type="password" placeholder="Пароль" v-model="password">
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
      <UserPage :userObj="userObject" v-else-if="pages.currentPage == 'user'" />
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

      input{
        padding: 5px 15px;
        font-size: 30px;
      }
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
