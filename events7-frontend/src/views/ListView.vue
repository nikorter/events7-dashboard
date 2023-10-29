<script setup lang="ts">
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import axios from '../lib/axios'
import Toast from 'primevue/toast'
import { useToast } from 'primevue/usetoast'
import { type Ref, onMounted, ref } from 'vue'
import router from '../router'
import ConfirmDialog from 'primevue/confirmdialog'
import { useConfirm } from 'primevue/useconfirm'

const confirm = useConfirm()
const toast = useToast()

const events: Ref<Event[]> = ref([])

const fetchData = async () => {
  try {
    const response = await axios.get<Event[]>('event')
    events.value = response.data
  } catch (error) {
    console.error('Error fetching data:', error)
    toast.add({ severity: 'error', summary: 'Error', detail: 'Error fetching data', life: 5000 })
  }
}

onMounted(async () => {
  fetchData()
})

const edit = (id: number) => {
  router.push({ name: 'edit', params: { id } })
}

const deleteModal = (id: number) => {
  confirm.require({
    message: 'Are you sure you want to delete?',
    header: 'Confirmation',
    icon: 'pi pi-exclamation-triangle',
    accept: async () => {
      try {
        await axios.delete('event/' + id)
        toast.add({
          severity: 'error',
          summary: 'Deleted',
          detail: 'You have deleted event',
          life: 3000
        })

        fetchData()
      } catch (e) {
        console.error('Error while deleting event:', e)
        toast.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error while deleting event',
          life: 5000
        })
      }
    },
    reject: () => {}
  })
}
</script>

<template>
  <div class="table">
    <Toast />
    <ConfirmDialog></ConfirmDialog>
    <DataTable :value="events" tableStyle="min-width: 50rem">
      <Column field="id" header="Id"></Column>
      <Column field="name" header="Name"></Column>
      <Column field="description" header="Description"></Column>
      <Column field="type" header="Type"></Column>
      <Column field="priority" header="Priority"></Column>
      <Column header="Action">
        <template #body="slotProps">
          <div>
            <i class="pi pi-pencil pointer" @click="edit(slotProps.data.id)"></i>
            <i class="pi pi-trash pointer m-2" @click="deleteModal(slotProps.data.id)"></i>
          </div>
        </template>
      </Column>
    </DataTable>
  </div>
</template>

<style>
@media (min-width: 1024px) {
  .table {
    min-height: 100vh;
    display: flex;
  }
}
</style>
