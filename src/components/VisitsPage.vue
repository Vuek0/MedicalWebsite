<script setup>
import { ref, onMounted } from "vue";
import { useData } from "../stores/Data";
import { useUser } from "../stores/User";
import DoctorCard from "./DoctorCard.vue";
import SearchInput from "./SearchInput.vue";
import SearchButton from "./SearchButton.vue";
import EditVisitModal from "./EditVisitModal.vue";
import { getPathFromUrl } from "../functions/getPathFromUrl";
import Modal from "./Modal.vue";
import axios from "axios";
import VisitCard from "./VisitCard.vue";
const isEditVisit = defineModel("isEditVisit");
const API_KEY = import.meta.env.VITE_API_KEY;
const isModalOpen = defineModel("modalopen");
const dataStore = useData();
const userStore = useUser();
const userObj = userStore.obj;
const visits = ref();
const doctorVisits = ref();
const currentVisit = defineModel("currentVisit");
const search = defineModel("search");
onMounted(async () => {
  if (JSON.parse(userObj.type).accountType === "pacient") {
    if (!dataStore.myVisits) {
      axios
        .get(
          `https://medical-server-six.vercel.app/visits/?key=${API_KEY}&pacientId=${userObj._id}`
        )
        .then((data) => {
          if (data.data.status != 204) {
            visits.value = data.data;
            dataStore.myVisits = data.data;
            let urlParams = new URLSearchParams(window.location.search);
            if (urlParams.has("visit")) {
              const url = new URL(window.location.href);
              const visitId = urlParams.get("visit");
              data.data.forEach((item) => {
                if (item._id === visitId) {
                  currentVisit.value = item;
                }
              });
              isModalOpen.value = true;
              url.searchParams.delete("visit");
              window.history.pushState(null, "", url.toString());
            }
          } else {
            dataStore.myVisits = [];
          }
        })
        .catch((err) => {
          console.log(err);
          console.log("yes");
        });
    } else {
      if (dataStore.myVisits.length > 0) {
        visits.value = dataStore.myVisits;
        let urlParams = new URLSearchParams(window.location.search);
        if (urlParams.has("visit")) {
          const url = new URL(window.location.href);
          const visitId = urlParams.get("visit");
          visits.value.forEach((item) => {
            if (item._id === visitId) {
              currentVisit.value = item;
            }
          });
          isModalOpen.value = true;
          url.searchParams.delete("visit");
          window.history.pushState(null, "", url.toString());
        }
      }
    }
  }

  if (JSON.parse(userObj.type).accountType === "doctor") {
    if (!dataStore.doctorVisits) {
      axios
        .get(
          `https://medical-server-six.vercel.app/visits/?key=${API_KEY}&doctorId=${userObj._id}`
        )
        .then((data) => {
          if (data.data.status != 204) {
            doctorVisits.value = data.data;
            dataStore.doctorVisits = data.data;
          } else {
            dataStore.doctorVisits = [];
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      if (dataStore.doctorVisits.length > 0) {
        doctorVisits.value = dataStore.doctorVisits;
      }
    }
  }
});

function searching(e) {
  e.preventDefault();
  const result = [];
  console.log(search.value);
  const input = search.value.toLowerCase();
  if (doctorVisits.value.length == 0) {
    doctorVisits.value = dataStore.doctorVisits;
  }
  doctorVisits.value.forEach((item) => {
    console.log(item);
    const visit = `${item.pacient.name.toLowerCase()} ${item.pacient.surname.toLowerCase()}`;
    if (visit.includes(input)) {
      result.push(item);
    }
  });
  doctorVisits.value = result;
}

function putBack() {
  if (!search.value) {
    doctorVisits.value = dataStore.doctorVisits;
  }
}
</script>

<template>
  <div class="visits" v-if="JSON.parse(userObj.type).accountType === 'pacient'">
    <h2>Все визиты</h2>
    <VisitCard
      v-for="visit in visits"
      :visit="visit"
      :key="visit"
      v-model:isModalOpen="isModalOpen"
      v-model:currentVisit="currentVisit"
      :name="visit.doctor.name"
      :surname="visit.doctor.surname"
      :date="visit.date"
      :time="visit.time"
      :status="visit.status"
      :type="visit.doctor.type"
    />
    <Modal
      v-if="isModalOpen"
      v-model="isModalOpen"
      :visit="currentVisit"
      :text="'Visit'"
    />
  </div>

  <div class="visits" v-if="JSON.parse(userObj.type).accountType === 'doctor'">
    <h2>Все визиты</h2>
    <form class="search" @submit="searching">
      <SearchInput v-model="search" :type="'text'" @change="putBack" />
      <SearchButton />
    </form>
    <p v-if="doctorVisits && doctorVisits.length == 0">Ничего не найдено</p>
    <VisitCard
      v-for="visit in doctorVisits"
      :visit="visit"
      :key="visit"
      v-model:isModalOpen="isEditVisit"
      v-model:currentVisit="currentVisit"
      :name="visit.doctor.name"
      :surname="visit.doctor.surname"
      :userName="visit.pacient.name"
      :userSurname="visit.pacient.surname"
      :date="visit.date"
      :time="visit.time"
      :status="visit.status"
      :type="visit.doctor.type"
    />
    <EditVisitModal
      v-if="isEditVisit"
      v-model="isEditVisit"
      :visit="currentVisit"
    />
  </div>
</template>

<style lang="scss" scoped>
.visits {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.search {
  display: flex;
  input {
    // width: 200px;
    transition: 0.5s;
    &:focus {
      width: 240px;
    }
  }
}
</style>
