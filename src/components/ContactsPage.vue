<script setup>
    import { ref, onMounted } from 'vue';
    import { useData } from '../stores/Data';
    import DoctorCard from './DoctorCard.vue';
    import axios from 'axios';
    const API_KEY = import.meta.env.VITE_API_KEY;
    const dataStore = useData();
    const doctors = ref();
    const leftColumn = ref();
    const rightColumn = ref();
    onMounted(async () => {
        if(!dataStore.allDoctors){
            axios
            .get(`https://medical-server-six.vercel.app/users/doctors?key=${API_KEY}`)
            .then(data => {
                console.log(data.data);
                doctors.value = data.data;
                dataStore.changeAllDoctors(data.data);
            })
            .catch(err => {
                console.log(err);
            })
        } else{
            doctors.value = dataStore.allDoctors;
        }
    });


</script>

<template>
    <h2>Контакты и время работы врачей</h2>
    <div class="contacts">
        <div class="col">
            <DoctorCard v-for="item in doctors" :key="item" :name="item.name" :surname="item.surname" :type="item.type" />
        </div>
        <div class="col">
            <!-- <DoctorCard v-for="item in doctors" :key="item" :name="item.name" :surname="item.surname" /> -->
        </div>
    </div>
</template>

<style lang="scss" scoped>
    .col{
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 50px;
        flex-wrap: wrap;
    }
</style>