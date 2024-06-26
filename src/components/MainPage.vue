<script setup>
import { ref } from "vue";
import { useUser } from "../stores/User";
import { useData } from "../stores/Data";
import { usePages } from "../stores/Pages";
import Loading from "./Loading.vue";
import FormInput from "./FormInput.vue";
import StyledButton from "./StyledButton.vue";
import FormSelect from "./FormSelect.vue";
import VisitCard from "./VisitCard.vue";
import RefferalCard from "./RefferalCard.vue";
import DoctorCard from "./DoctorCard.vue";
import axios from "axios";

import { onMounted } from "vue";
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
const activeDoctors = ref();
const visits = ref();
const activeVisits = ref();
const referrals = ref();
const formError = ref();
onMounted(async () => {
  isLoading.value = true;
  if (type.accountType === "pacient") {
    if (!dataStore.doctors) {
      axios
        .get(
          `https://medical-server-six.vercel.app/users/doctors/Терапевт?key=${API_KEY}`
        )
        .then((data) => {
          currentDoctor.value = data.data[0];
          startTime.value = JSON.parse(currentDoctor.value.type).workTime.start;
          endTime.value = JSON.parse(currentDoctor.value.type).workTime.end;
          time.value = startTime.value;
          terapevts.value = data.data;
          dataStore.changeDoctors(data.data);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      terapevts.value = dataStore.doctors;
    }

    if (!dataStore.activeDoctors) {
      axios
        .get(
          `https://medical-server-six.vercel.app/users/doctors?key=${API_KEY}`
        )
        .then((data) => {
          const result = [];
          let hours = currentDate.getHours();
          let minutes = currentDate.getMinutes();

          data.data.forEach((item) => {
            const workTime = JSON.parse(item.type).workTime;
            const startHrs = +workTime.start.split(":")[0];
            const startMnts = +workTime.start.split(":")[1];
            const endHrs = +workTime.end.split(":")[0];
            const endMnts = +workTime.end.split(":")[1];

            // console.log(currentTime);
            // console.log(item);
            // console.log(workTime)
            // if(currentTime > workTime.start && currentTime < workTime.end){
            //     result.push(item);
            // }
            if (hours > startHrs && hours < endHrs) {
              result.push(item);
            } else if (hours === startHrs && minutes > startMnts) {
              result.push(item);
            } else if (hours === endHrs && minutes < endMnts) {
              result.push(item);
            }
          });
          // console.log(result);
          activeDoctors.value = result;
          dataStore.changeActiveDoctors(result);
          dataStore.changeAllDoctors(data.data);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      activeDoctors.value = dataStore.activeDoctors;
    }
    if (!dataStore.visits) {
      axios
        .get(`https://medical-server-six.vercel.app/visits/?key=${API_KEY}`)
        .then((data) => {
          visits.value = data.data;
          dataStore.visits = data.data;
          // console.log(data.data);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      visits.value = dataStore.visits;
    }

    if (!dataStore.activeVisits) {
      axios
        .get(
          `https://medical-server-six.vercel.app/visits/?key=${API_KEY}&pacientId=${userObj._id}&notDone=true`
        )
        .then((data) => {
          if (data.data.status !== 204) {
            activeVisits.value = data.data;
            dataStore.activeVisits = data.data;
          } else {
            dataStore.referrals = [];
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      activeVisits.value = dataStore.activeVisits;
    }

    if (!dataStore.referrals) {
      axios
        .get(
          `https://medical-server-six.vercel.app/visits/referrals?key=${API_KEY}&pacientId=${userObj._id}`
        )
        .then((data) => {
          if (data.data.status != 204) {
            referrals.value = data.data;
            dataStore.referrals = data.data;
          } else {
            dataStore.referrals = [];
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      if (dataStore.referrals.length > 0) {
        referrals.value = dataStore.referrals;
      }
    }

    isLoading.value = false;
  }
});
const currentDate = new Date();
let month = currentDate.getMonth() + 1;
if (month < 10) {
  month = `0${month}`;
}
const minAllowedDate = `${currentDate.getFullYear()}-${month}-${currentDate.getDate()}`;
// console.log(month)
let maxAllowedDate = `${currentDate.getFullYear()}-${month}-${
  currentDate.getDate() + 7
}`;
if (currentDate.getDate() > 24) {
  if (month === 12) {
    maxAllowedDate = `${currentDate.getFullYear() + 1}-01-0${
      currentDate.getDate() + 7 - 30
    }`;
  } else if (month > 12) {
    maxAllowedDate = `${currentDate.getFullYear()}-${+month + 1}-01`;
  } else {
    maxAllowedDate = `${currentDate.getFullYear()}-0${
      +month.split("0")[1] + 1
    }-01`;
  }
}
const date = defineModel("date");

function changeTimes() {
  startTime.value = JSON.parse(
    JSON.parse(currentDoctor.value).type
  ).workTime.start;
  endTime.value = JSON.parse(JSON.parse(currentDoctor.value).type).workTime.end;
}

function addVisit(e) {
  e.preventDefault();
  formError.value = "";
  const hours = currentDate.getHours();
  const minutes = currentDate.getMinutes();
  const currentHours = +time.value.split(":")[0];
  const currentMinutes = +time.value.split(":")[1];
  let doctor;
  // console.log(currentDoctor.value);
  console.log(date.value);
  console.log(time.value);
  // console.log(visits.value);
  if (
    minAllowedDate == date.value &&
    currentHours === hours &&
    currentMinutes < minutes + 40
  ) {
    formError.value = "Введите корректное время";
    return;
  }
  if (minAllowedDate == date.value && currentHours < hours) {
    formError.value = "Введите корректное время";
    return;
  }
  visits.value.forEach((item) => {
    if (item.date == date.value) {
      const visitHours = +item.time.split(":")[0];
      const visitMinutes = +item.time.split(":")[1];
      if (currentHours === visitHours && currentMinutes <= visitMinutes + 20) {
        formError.value = "Это время занято";
        return;
      }
    }
  });
  if (typeof currentDoctor.value == "string") {
    doctor = JSON.parse(currentDoctor.value);
  } else {
    doctor = currentDoctor.value;
  }
  // console.log((typeof doctor) == "string");
  axios
    .post(`https://medical-server-six.vercel.app/visits?key=${API_KEY}`, {
      doctor: doctor,
      pacient: userObj,
      date: date.value,
      time: time.value,
    })
    .then((data) => {
      if (!activeVisits.value) {
        activeVisits.value = [data];
      } else {
        activeVisits.value.push(data);
      }
    })
    .catch((error) => {});
}
</script>

<template>
  <section v-if="type.accountType === 'pacient'" class="pacient">
    <Loading v-if="isLoading" />
    <div class="visits" v-if="!isLoading">
      <div class="headers">
        <h2>Приёмы</h2>
        <a href="#" @click="pages.setPage('visits')">Перейти ко всем приёмам</a>
      </div>
      <div class="body">
        <div class="notfound" v-if="!activeVisits">
          <h3>Ничего не найдено</h3>
          <h4>Хотите записаться к терапевту?</h4>
          <form class="visit--form" @submit="addVisit">
            <div class="formError" v-if="formError">
              <p>{{ formError }}</p>
            </div>
            <FormSelect
              @input="changeTimes"
              :doctors="terapevts"
              v-model="currentDoctor"
            />
            <FormInput
              @change="console.log(date)"
              :placeholder="minAllowedDate"
              v-model="date"
              :type="'date'"
              :min="minAllowedDate"
              :max="maxAllowedDate"
              required
            />
            <FormInput
              :min="startTime"
              :max="endTime"
              :type="'time'"
              v-model="time"
              required
            />
            <StyledButton :text="'Записаться'" />
          </form>
        </div>
        <div class="cards" v-if="activeVisits">
          <VisitCard
            v-for="item in activeVisits"
            :visit="item"
            :key="item"
            :name="item.doctor.name"
            :surname="item.doctor.surname"
            :date="item.date"
            :time="item.time"
            :status="item.status"
            :type="item.doctor.type"
            :isMainPage="true"
          />
        </div>
      </div>
    </div>

    <div class="referrals" v-if="!isLoading">
      <h2>Направления</h2>
      <div class="body">
        <div class="not-found" v-if="!referrals">
          <h3>Ничего не найдено</h3>
          <h3>
            Здесь будут отображаться ваши<br />
            направления к другим врачам
          </h3>
        </div>
        <RefferalCard v-for="referral in referrals" :key="referral" />
        <!-- <RefferalCard />
                <RefferalCard />
                <RefferalCard /> -->
      </div>
    </div>

    <div class="doctors" v-if="!isLoading">
      <h2>Врачи активные на данный момент:</h2>
      <div class="body">
        <h3 v-if="!activeDoctors">На данный момент врачей нет</h3>
        <DoctorCard
          v-for="item in activeDoctors"
          :key="item"
          :name="item.name"
          :surname="item.surname"
          :type="item.type"
        />
      </div>
    </div>
  </section>

  <section v-else-if="type.accountType === 'doctor'" class="doctor">
    doctor
  </section>

  <section v-else-if="type.accountType === 'admin'" class="admin">
    admin
  </section>
</template>

<style lang="scss" scoped>
.pacient {
  display: flex;
  flex-wrap: wrap;
  gap: 30px;
}

.visits {
  .body {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
}

.headers {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
}

.body {
  border: 3px solid var(--primary-color);
  padding: 10px;
}

.visit--form {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.formError {
  background: red;
  color: aliceblue;
  padding: 5px 15px;
  width: 100%;
}

@media (max-width: 768px) {
  .visits {
    width: 100%;
  }

  .referrals {
    width: 100%;
  }

  .doctors {
    width: 100%;
  }
}
</style>
