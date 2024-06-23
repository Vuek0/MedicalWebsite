<script setup>
    import { ref } from 'vue';
    import { useUser } from '../stores/User';
    import { useData } from '../stores/Data';
    import FormInput from './FormInput.vue';
    import StyledButton from './StyledButton.vue';
    import FormSelect from './FormSelect.vue';
    import VisitCard from './VisitCard.vue';
    import RefferalCard from './RefferalCard.vue';
    import axios from 'axios';
    import { onMounted } from 'vue';
    const user = useUser();
    const data = useData();
    const userObj = user.obj;
    const type = JSON.parse(userObj.type);
    const terapevts = ref();
    const API_KEY = import.meta.env.VITE_API_KEY;
    onMounted(async() => {
        if(!data.doctors){
            const req = await axios.get(`https://medical-server-six.vercel.app/users/doctors/Терапевт?key=${API_KEY}`);
            terapevts.value = await req.data;
            data.doctors = await req.data;
        } else{
            terapevts.value = data.doctors;
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
    const currentDoctor = ref();

</script>

<template>
    <section v-if="type.accountType === 'pacient'" class="pacient">
        <div class="visits">
            <h2>Приёмы</h2>
            <div class="body">
                    <div class="notfound">
                        <h3>Ничего не найдено</h3>
                        <h4>Хотите записаться к терапевту?</h4>
                        <form class="visit--form">
                            <FormSelect :doctors="terapevts" />
                            <FormInput @change="console.log(date)" v-model="date" :placeholder="'Дата'" :type="'date'" :min="minAllowedTime" :max="maxAllowedTime"/>
                            <FormInput min="11:00" max="19:00" :type="'time'" />
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
        
        <div class="referrals">
            <h2>Направления</h2>
            <div class="body">
                <RefferalCard />
                <RefferalCard />
                <RefferalCard />
            </div>
        </div>

        <div class="doctors">
            <h2>Врачи активные на данный момент:</h2>
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

// .visits{
//     .body{
//         display: flex;
//         flex-direction: column;
//         gap: 10px;
//     }    
// }

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