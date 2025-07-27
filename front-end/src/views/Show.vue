<template>
    <div>
      <h1>Show Word</h1>
  
      <div class="ui labeled input fluid">
        <div class="ui label">
          <i class="germany flag"></i> German
        </div>
        <input type="text" readonly :value="word.german"/>
      </div>
      <div class="ui labeled input fluid">
        <div class="ui label">
          <i class="united kingdom flag"></i> English
        </div>
        <input type="text" readonly :value="word.english"/>
      </div>
      <div class="ui labeled input fluid">
        <div class="ui label">
          <i class="japan flag"></i> Japanese
        </div>
        <input type="text" readonly :value="word.japanese"/>
      </div>
      <button class="ui button" :class="{ dark: isDarkMode }">
        <router-link :to="{ name: 'edit', params: { wordId: route.params.wordId } }">
          Edit word
        </router-link>
      </button>
    </div>
  </template>
  
<script setup>
  import { ref, onMounted } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import { useDarkMode } from '../composables/useDarkMode';
  import { api } from '../helpers/helpers';

  const word = ref({});
  const route = useRoute();
  const router = useRouter();

  const { isDarkMode, initDarkMode } = useDarkMode();

  onMounted(async () => {
    try {
      initDarkMode();
      const id = route.params.wordId; 
      word.value = await api.getWord(id);
    } catch (error) {
      console.error('Error fetching word:', error);
    }
  });

</script>
  
<style scoped>

button.ui.button {
  margin: 0;
}

.ui.button > a {
  color: #1b1c1d;
}

.ui.button.dark > a {
  color: #f0f0f0;
}

</style>