<script setup>
import { ref, onMounted } from "vue";
import { useData } from "../stores/Data";
import { useUser } from "../stores/User";
import DoctorCard from "./DoctorCard.vue";
import { getPathFromUrl } from "../functions/getPathFromUrl";
import Modal from "./Modal.vue";
import axios from "axios";
import VisitCard from "./VisitCard.vue";
const API_KEY = import.meta.env.VITE_API_KEY;
const isModalOpen = defineModel("modalopen");
const dataStore = useData();
const userStore = useUser();
const userObj = userStore.obj;
const visits = ref();
const currentVisit = defineModel("currentVisit");
onMounted(async () => {
  if (!dataStore.myVisits) {
    axios
      .get(
        `https://medical-server-six.vercel.app/visits/?key=${API_KEY}&pacientId=${userObj._id}`
      )
      .then((data) => {
        console.log(
          `https://medical-server-six.vercel.app/visits/?key=${API_KEY}&pacientId=${userObj._id}`
        );
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
});
</script>

<template>
  <div class="visits">
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
</template>

<style lang="scss" scoped>
.visits {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}
</style>
