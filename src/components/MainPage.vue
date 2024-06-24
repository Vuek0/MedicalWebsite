<script setup>
    import { ref } from 'vue';
    import { useUser } from '../stores/User';
    import { useData } from '../stores/Data';
    import { usePages } from '../stores/Pages';
    import Loading from './Loading.vue';
    import FormInput from './FormInput.vue';
    import StyledButton from './StyledButton.vue';
    import FormSelect from './FormSelect.vue';
    import VisitCard from './VisitCard.vue';
    import RefferalCard from './RefferalCard.vue';
    import DoctorCard from './DoctorCard.vue';
    import axios from 'axios';

    import { onMounted } from 'vue';
    const user = useUser();
    const dataStore = useData();
    const pages = usePages();
    const userObj = user.obj;
    const type = JSON.parse(userObj.type);
    const terapevts = ref();
    const currentDoctor = defineModel("currentDoctor");
    const startTime = ref();
    const endTime = ref();
    const API_KEY = import.meta.env.VITE_API_KEY;
    const isLoading = ref(false);
    onMounted(async() => {  
        if(type.accountType === 'pacient'){
            if(!dataStore.doctors){
                isLoading.value = true;
                axios.get(`https://medical-server-six.vercel.app/users/doctors/Терапевт?key=${API_KEY}`)
                .then((data) =>{
                    currentDoctor.value = data.data[0];
                    startTime.value = JSON.parse(currentDoctor.value.type).workTime.start;
                    endTime.value = JSON.parse(currentDoctor.value.type).workTime.end;
                    terapevts.value = data.data;
                    dataStore.changeDoctors(data.data);
                    isLoading.value = false;
                }).catch((err) => {
                    console.log(err);
                })
            } else{
                terapevts.value = dataStore.doctors;
            }
        }
    })
    const currentDate = new Date();
    let month = currentDate.getMonth();
    if(month < 10){
        month = `0${month}`;
    }
    const minAllowedTime = `${currentDate.getFullYear()}-${month}-${currentDate.getDate()}`;
    const maxAllowedTime = `${currentDate.getFullYear()}-${month}-${currentDate.getDate() + 7}`;
    const date = defineModel('date');

    function changeTimes(){
        startTime.value = JSON.parse(JSON.parse(currentDoctor.value).type).workTime.start;
        endTime.value = JSON.parse(JSON.parse(currentDoctor.value).type).workTime.end;
    }

    function addVisit(){
        console.log("yes");
    }
</script>

<template>
    <section v-if="type.accountType === 'pacient'" class="pacient">
        <Loading v-if="isLoading"/>
        <div class="visits" v-if="!isLoading">
            <div class="headers">
                <h2>Приёмы</h2>
                <a href="#" @click="pages.setPage('visits')">Перейти ко всем приёмам</a>
            </div>
            <div class="body">
                    <div class="notfound">
                        <h3>Ничего не найдено</h3>
                        <h4>Хотите записаться к терапевту?</h4>
                        <form class="visit--form" @submit="addVisit">
                            <FormSelect @input="changeTimes" :doctors="terapevts" v-model="currentDoctor"/>
                            <FormInput @change="console.log(date)" :placeholder="minAllowedTime" v-model="date" :type="'date'" :min="minAllowedTime" :max="maxAllowedTime" required/>
                            <FormInput :value="startTime" :min="startTime" :max="endTime" :type="'time'" required/>
                            <StyledButton :text="'Записаться'" />
                        </form>
                    </div>
                <VisitCard />
                <VisitCard />
                <VisitCard />
                <VisitCard />
                <VisitCard />
                <VisitCard />
                <VisitCard />
                <VisitCard />
            </div>
        </div>
        
        <div class="referrals" v-if="!isLoading">
            <h2>Направления</h2>
            <div class="body">
                <div class="not-found">
                    <h3>Ничего не найдено</h3>
                    <h3>Здесь будут отображаться ваши<br /> направления к другим врачам</h3>
                </div>
                <!-- <RefferalCard />
                <RefferalCard />
                <RefferalCard /> -->
            </div>
        </div>

        <div class="doctors" v-if="!isLoading">
            <h2>Врачи активные на данный момент:</h2>
            <div class="body">
                <h3>На данный момент врачей нет</h3>
                <DoctorCard />
            </div>
        </div>
    </section>

    <section v-else-if="type.accountType === 'doctor' " class="doctor">
        doctor
    </section>

    <section v-else-if="type.accountType === 'admin' " class="admin">
        admin
    </section>
</template>

<style lang="scss" scoped>

.pacient{
    display: flex;
    flex-wrap: wrap;
    gap: 30px;
}

.visits{
    .body{
        display: flex;
        flex-direction: column;
        gap: 10px;
    }    
}

.headers{
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.body{
    border: 3px solid var(--primary-color);
    padding: 10px;
}

.visit--form{
    display: flex;
    flex-direction: column;
    gap: 10px;
}

@media(max-width: 768px){
    .visits{
        width: 100%;
    }

    .referrals{
        width: 100%;
    }

    .doctors{
        width: 100%;
    }
}
</style>