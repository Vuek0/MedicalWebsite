<script setup>
    import SelectOption from './SelectOption.vue';    
    import { useUser } from "../stores/User"
    const user = useUser();
    const props = defineProps({
        doctors: Array,
        name: String,
        id: String,
    })
    const emit = defineEmits(['update:modelValue'])

</script>

<template>
    <select :name="name" :id="id" @input="emit('update:modelValue', $event.target.value)">
        <SelectOption @click="console.log(doctor)" v-for="doctor in props.doctors" :key="doctor" :value="doctor._id" :innerValue="`${doctor.name} ${doctor.surname} (${JSON.parse(doctor.type) .workTime.start} - ${JSON.parse(doctor.type) .workTime.end})`"/>
    </select>
</template>

<style lang="scss" scoped>
    select{
        padding: 10px;
        border-radius: 5px;
        outline: 1px solid var(--primary-color);
    }
</style> 