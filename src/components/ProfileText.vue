<script setup>
    import { useUser } from '../stores/User';
    const user = useUser();
    const userObj = user.obj
    const info = JSON.parse(userObj.type)
</script>

<template>
    <div class="info">
        <h2>Информация о пользователе: </h2>
        <p>Имя : {{ userObj.name }}</p>
        <p>Фамилия : {{ userObj.surname }}</p>
        <p>Логин : {{ userObj.login }}</p>
    </div>    
</template>

<style lang="scss" scoped>
    .info{
        display: flex;
        flex-direction: column;

        gap: 15px;

        h2{
            font-size: 60px;
            text-decoration: underline;
        }
        p{
            font-size: 25px;
            font-weight: bold;
        }
    }

    @media(max-width: 600px){
        .info{
            h2{
            font-size: 35px;
            }
        }
        
    }
</style>