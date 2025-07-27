<template>
  <form action="#" @submit.prevent="onSubmit">
     <p v-if="errorsPresent" class="error">Please fill out both fields!</p>
 
     <div class="ui labeled input fluid">
       <div class="ui label">
         <i class="united kingdom flag"></i> English
       </div>
       <input type="text" placeholder="Enter word..." v-model="word.english" />
     </div>

     <div class="ui labeled input fluid">
       <div class="ui label">
         <i class="germany flag"></i> German
       </div>
       <input type="text" placeholder="Enter word..." v-model="word.german" />
     </div>

     <div class="ui labeled input fluid">
       <div class="ui label">
         <i class="japan flag"></i> Japanese
       </div>
       <input type="text" placeholder="Enter word..." v-model="word.japanese" />
     </div>

     <button class="ui button" :class="{ dark: isDarkMode }">Submit</button>
   </form>
 </template>
 

<script setup>
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  import { useDarkMode } from '../composables/useDarkMode';
  import { computed } from 'vue'; // Create a reactice proerty -- updates immediately when the word changes

  const router = useRouter();
  const emit = defineEmits(['createOrUpdate']);

  const { isDarkMode } = useDarkMode();

  // Define props
  const props = defineProps({
    word: {
      type: Object,
      required: false,
      default: () => ({  english: '', german: '',japanese: '' })
    }
  });

  const word = computed({
    get() { return props.word; },
    set(val) {}
  });

  // State
  const errorsPresent = ref(false);

  // Submit handler
  function onSubmit() {
    console.log(`English: ${word.value.english}`);
    console.log(`German: ${word.value.german}`);
    console.log(`Japanese: ${word.value.japanese}`);

    // Validate input
    if (word.value.english === '' || word.value.german === '' || word.value.japanese === '') {
      errorsPresent.value = true;
      return;
    }
    else {
      emit('createOrUpdate', word.value); // Emit the event with the word data
    }
  }
</script>

<style scoped>
.error {
  color: red;
}
button.ui.button {
  margin: 0
}
</style>