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
    const time = defineModel("time");
    const startTime = ref();
    const endTime = ref();
    const API_KEY = import.meta.env.VITE_API_KEY;
    const isLoading = ref(false);
    const doctors = ref();
    const visits = ref();
    const referrals = ref();
    const formError = ref();
    onMounted(async() => {  
        if(type.accountType === 'pacient'){
            if(!dataStore.doctors){
                isLoading.value = true;
                axios.get(`https://medical-server-six.vercel.app/users/doctors/Терапевт?key=${API_KEY}`)
                .then((data) =>{
                    currentDoctor.value = data.data[0];
                    startTime.value = JSON.parse(currentDoctor.value.type).workTime.start;
                    endTime.value = JSON.parse(currentDoctor.value.type).workTime.end;
                    time.value = startTime.value;
                    terapevts.value = data.data;
                    dataStore.changeDoctors(data.data);
                    isLoading.value = false;
                }).catch((err) => {
                    console.log(err);
                })
            } else{
                terapevts.value = dataStore.doctors;
            }

            if(!dataStore.activeDoctors){
                axios.get(`https://medical-server-six.vercel.app/users/doctors?key=${API_KEY}`)
                .then((data) => {
                    const result = [];
                    const currentTime = `${currentDate.getHours()}:${currentDate.getMinutes()}`;
                    data.data.forEach(item => {
                        const workTime = JSON.parse(item.type).workTime;
                        if(currentTime > workTime.start && currentTime < workTime.end){
                            result.push(item);
                        }
                    })
                    doctors.value = result;
                    dataStore.changeActiveDoctors(result);
                    dataStore.changeAllDoctors(data.data);
                    isLoading.value = false;
                }).catch((err) =>{
                    console.log(err);
                })
            }else{
                doctors.value = dataStore.activeDoctors;
            }

            if(!dataStore.visits){
                axios.get(`https://medical-server-six.vercel.app/visits/?key=${API_KEY}&pacientId=${userObj._id}`).then(data => {
                    console.log(data);
                })
            } else{
                visits.value = dataStore.visits;
            }
        }
    })
    const currentDate = new Date();
    let month = currentDate.getMonth() + 1;
    if(month < 10){
        month = `0${month}`;
    }
    const minAllowedTime = `${currentDate.getFullYear()}-${month}-${currentDate.getDate()}`;
    // console.log(month)
    let maxAllowedTime = `${currentDate.getFullYear()}-${month}-${currentDate.getDate() + 7}`;
    if(currentDate.getDate() > 24){
        if(month === 12){
            maxAllowedTime = `${currentDate.getFullYear() + 1}-01-0${(currentDate.getDate() + 7) - 30}`
        }
        else if(month > 12){
            maxAllowedTime = `${currentDate.getFullYear()}-${+month + 1}-01`
        }else{
            maxAllowedTime = `${currentDate.getFullYear()}-0${+month.split('0')[1] + 1}-01`
        }
    }
    const date = defineModel('date');

    function changeTimes(){
        startTime.value = JSON.parse(JSON.parse(currentDoctor.value).type).workTime.start;
        endTime.value = JSON.parse(JSON.parse(currentDoctor.value).type).workTime.end;
    }

    function addVisit(){
        const currentTime = `${currentDate.getHours()}:${currentDate.getMinutes()}`;
        let doctor;
        console.log(currentDoctor.value);
        console.log(date.value);
        console.log(time.value);
        if((typeof currentDoctor) == "string"){
            doctor = JSON.parse(currentDoctor.value);
        } else{
            doctor = currentDoctor.value;
        }
        axios.post(`https://medical-server-six.vercel.app/visits?key=${API_KEY}`, {
            doctor: doctor,
            pacient: userObj,
            date: date.value,
            time: time.value,
            diagnose: "",
            treatment: "",
            status: "Не завершён",
            refferal: []
        })

    }
    console.log(minAllowedTime, maxAllowedTime)
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
                    <div class="notfound" v-if="!visits">
                        <h3>Ничего не найдено</h3>
                        <h4>Хотите записаться к терапевту?</h4>
                        <form class="visit--form" @submit="addVisit">
                            <div class="formError" v-if="formError">
                                <p>{{ formError }}</p>
                            </div>  
                            <FormSelect @input="changeTimes" :doctors="terapevts" v-model="currentDoctor"/>
                            <FormInput @change="console.log(date)" :placeholder="minAllowedTime" v-model="date" :type="'date'" :min="minAllowedTime" :max="maxAllowedTime" required/>
                            <FormInput :value="startTime" :min="startTime" :max="endTime" :type="'time'" v-model="time" required/>
                            <StyledButton :text="'Записаться'" />
                        </form>
                    </div>
                <!-- <VisitCard />
                <VisitCard />
                <VisitCard /> -->
            </div>
        </div>
        
        <div class="referrals" v-if="!isLoading">
            <h2>Направления</h2>
            <div class="body">
                <div class="not-found" v-if="!referrals">
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
                <h3 v-if="!doctors"> На данный момент врачей нет</h3>
                <DoctorCard v-for="item in doctors" :key="item" :name="item.name" :surname="item.surname" :type="item.type" />
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
    gap: 20px;
}

.body{
    border: 3px solid var(--primary-color);
    padding: 10px;
}

.doctors{
    max-width: fit-content;

    .body{
        width: fit-content;
    }
}

.visit--form{
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.formError{
    background: red;
    color:aliceblue;
    padding: 5px 15px;
    width: 100%;
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