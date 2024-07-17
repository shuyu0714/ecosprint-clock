<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-2xl font-bold mb-4">打卡記錄</h1>
    <div v-if="loading" class="text-center">
      <p>加載中...</p>
    </div>
    <div v-else-if="error" class="text-center text-red-500">
      <p>{{ error }}</p>
    </div>
    <div v-else>
      <table class="w-full border-collapse border border-gray-300">
        <thead>
          <tr class="bg-gray-100">
            <th class="border border-gray-300 px-4 py-2">日期</th>
            <th class="border border-gray-300 px-4 py-2">類型</th>
            <th class="border border-gray-300 px-4 py-2">時間</th>
            <th class="border border-gray-300 px-4 py-2">位置</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="record in records" :key="record.id" class="hover:bg-gray-50">
            <td class="border border-gray-300 px-4 py-2">{{ record.date }}</td>
            <td class="border border-gray-300 px-4 py-2">{{ record.type }}</td>
            <td class="border border-gray-300 px-4 py-2">{{ record.time }}</td>
            <td class="border border-gray-300 px-4 py-2">
              {{ record.location.latitude }}, {{ record.location.longitude }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="mt-4">
      <router-link to="/">返回首頁</router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const records = ref([]);
const loading = ref(true);
const error = ref(null);

const fetchRecords = async () => {
  try {
    console.log('Fetching records from:', `${API_URL}/records`);
    const response = await axios.get(`${API_URL}/records`);
    records.value = response.data;
    loading.value = false;
  } catch (err) {
    console.error('獲取記錄失敗:', err);
    error.value = '獲取記錄失敗，請稍後再試。';
    loading.value = false;
  }
};

onMounted(() => {
  fetchRecords();
});
</script>