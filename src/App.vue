<template>
  <div>
    <h1>{{ currentTime }}</h1>
    <div>{{ currentDate }}</div>
    <div class="flex justify-center gap-x-3 mt-4">
      <Button @click="punchIn" :disabled="hasPunchedIn">上班打卡</Button>
      <Button @click="punchOut" :disabled="!canPunchOut">下班打卡</Button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';
import Button from './components/Button.vue';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/punch';

const currentDate = ref('');
const currentTime = ref('');
const lastPunchInTime = ref(null);
const hasPunchedIn = ref(false);

const updateDateTime = () => {
  const now = new Date();
  currentDate.value = now.toLocaleDateString();
  currentTime.value = now.toLocaleTimeString();
};

const canPunchOut = computed(() => {
  if (!lastPunchInTime.value) return false;
  const now = new Date();
  const timeDiff = now - lastPunchInTime.value;
  return timeDiff >= 8 * 60 * 60 * 1000; // 8 hours in milliseconds
});

const punchIn = async () => {
  try {
    const position = await getCurrentPosition();
    console.log('Sending request to:', API_URL);
    const response = await axios.post(API_URL, {
      type: '上班',
      date: currentDate.value,
      time: currentTime.value,
      location: position
    });
    if (response.data.success) {
      hasPunchedIn.value = true;
      lastPunchInTime.value = new Date();
      alert('上班打卡成功！');
    }
  } catch (error) {
    console.error('打卡失敗:', error);
    alert('打卡失敗，請稍後再試。');
  }
};

const punchOut = async () => {
  try {
    const position = await getCurrentPosition();
    const response = await axios.post(API_URL, {
      type: '下班',
      date: currentDate.value,
      time: currentTime.value,
      location: position
    });
    if (response.data.success) {
      hasPunchedIn.value = false;
      lastPunchInTime.value = null;
      alert('下班打卡成功！');
    }
  } catch (error) {
    console.error('打卡失敗:', error);
    alert('打卡失敗，請稍後再試。');
  }
};

const getCurrentPosition = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject('瀏覽器不支持地理位置');
    } else {
      navigator.geolocation.getCurrentPosition(
        position => resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        }),
        () => reject('無法獲取位置信息')
      );
    }
  });
};

onMounted(() => {
  updateDateTime();
  setInterval(updateDateTime, 1000);
});
</script>