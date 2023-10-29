<script setup lang="ts">
import InputNumber from 'primevue/inputnumber'
import InputText from 'primevue/inputtext'
import Textarea from 'primevue/textarea'
import Dropdown from 'primevue/dropdown'
import Button from 'primevue/button'
import { EventType } from '../enums/event-type.enum'
import { type DropdownItem } from '../interfaces/dropdown-item.interface'
import { type Event } from '../interfaces/event.interface'
import { onMounted, ref, type Ref } from 'vue'
import axios from '../lib/axios'
import Toast from 'primevue/toast'
import { useToast } from 'primevue/usetoast'
import { useRoute } from 'vue-router'
import router from '../router'
import { AxiosError } from 'axios'

const toast = useToast()
const route = useRoute()

const event: Ref<Event> = ref({
  id: 1,
  name: '',
  description: '',
  type: EventType.APP,
  priority: 0
})

const types: Ref<DropdownItem[]> = ref([
  { name: EventType.CROSSPROMO, value: EventType.CROSSPROMO },
  { name: EventType.LIVEOPS, value: EventType.LIVEOPS },
  { name: EventType.APP, value: EventType.APP }
])

const priorities: Ref<DropdownItem[]> = ref([])
for (let i: number = 0; i <= 10; i++) {
  priorities.value.push({ name: i.toString(), value: i })
}

const isEdit = () => {
  return route.name == 'edit'
}

const fetchEvent = async () => {
  try {
    const response = await axios.get<Event>('event/' + route.params.id)
    event.value = response.data
  } catch (error) {
    console.error('Error occurred while fetching event:', error)
    toast.add({
      summary: 'Error',
      severity: 'error',
      detail: 'Error occurred while fetching event.'
    })
    //lets redirect back to list
    router.push({ name: 'list' })
  }
}

const checkPermission = async () => {
  try {
    const adsPermission = await axios.get('event/type/validation')
    if (adsPermission.data.ads) {
      types.value.push({ name: EventType.ADS, value: EventType.ADS })
    }
  } catch (error) {
    console.error('Error while fetching permission:' + error)
  }
}

onMounted(async () => {
  checkPermission()

  if (isEdit()) {
    fetchEvent()
  }
})

const save = async () => {
  try {
    isEdit()
      ? await axios.patch('event/' + route.params.id, event.value)
      : await axios.post('event', event.value)

    //lets redirect back to list
    router.push({ name: 'list' })
  } catch (error) {
    console.error('Error occurred while saving event:', error)
    toast.add({
      summary: 'Error',
      severity: 'error',
      detail:
        error instanceof AxiosError
          ? error.response?.data.message
          : 'Error occurred while saving event'
    })
  }
}
</script>

<template>
  <main>
    <Toast />
    <div class="card flex flex-wrap gap-3 p-fluid">
      <div class="flex-auto">
        <label for="integeronly" class="font-bold block mb-2"> Id </label>
        <InputNumber v-model="event.id" inputId="integeronly" :min="0" />
      </div>
      <div class="flex-auto mt-3">
        <label class="font-bold block mb-2"> Name </label>
        <InputText v-model="event.name" type="text" />
      </div>
      <div class="flex-auto mt-3">
        <label for="description" class="font-bold block mb-2"> Description </label>
        <Textarea v-model="event.description" rows="5" cols="30" />
      </div>
      <div class="flex-auto mt-3">
        <label for="types" class="font-bold block mb-2"> Type </label>
        <Dropdown
          :options="types"
          optionLabel="name"
          optionValue="value"
          placeholder="Select type of event"
          class="w-full md:w-14rem"
          v-model="event.type"
        />
      </div>
      <div class="flex-auto mt-3">
        <label for="minmax" class="font-bold block mb-2"> Priority </label>
        <Dropdown
          :options="priorities"
          optionLabel="name"
          optionValue="value"
          placeholder="Select priority"
          class="w-full md:w-14rem"
          v-model="event.priority"
        />
      </div>
      <Button class="mt-3" label="Save" @click="save" />
    </div>
  </main>
</template>
