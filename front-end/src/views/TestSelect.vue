<template>
    <h1 :class="{ dark: isDarkMode }">Test Your Knowledge</h1>
    <div class="ui form">
      <div class="field">
        <label :class="{ dark: isDarkMode }">Number of Questions</label>
        <div class="selection-panel">
          <div 
            v-for="count in [5, 10, 15, 20]" 
            :key="count"
            @click="numQuestions = count"
            :class="['selection-item', { active: numQuestions === count, dark: isDarkMode }]"
          >
            {{ count }}
          </div>
        </div>
      </div>

      <div class="field">
        <label :class="{ dark: isDarkMode }">Test Type</label>
        <div class="selection-panel">
          <div 
            @click="testType = 'testMaskedWords'"
            :class="['selection-item', { active: testType === 'testMaskedWords', dark: isDarkMode }]"
          >
            Fill in the Blanks
          </div>
          <div 
            @click="testType = 'testMatchWords'" 
            :class="['selection-item', { active: testType === 'testMatchWords', dark: isDarkMode }]"
          >
            Match Words
          </div>
        </div>
      </div>

      <div class="field">
        <label :class="{ dark: isDarkMode }">Language to Test</label>
        <div class="selection-panel">
          <div 
            v-for="lang in ['english', 'german', 'japanese']" 
            :key="lang"
            @click="testLang = lang"
            :class="['selection-item', { active: testLang === lang, dark: isDarkMode }]"
          >
            {{ lang.charAt(0).toUpperCase() + lang.slice(1) }}
          </div>
        </div>
      </div>

      <div class="field">
        <label :class="{ dark: isDarkMode }">Language to Compare</label>
        <div class="selection-panel">
          <div 
            v-for="lang in ['english', 'german', 'japanese']" 
            :key="lang"
            @click="comparedLang = lang"
            :class="['selection-item', { active: comparedLang === lang, dark: isDarkMode, disabled: testLang === lang }]"
            :style="testLang === lang ? {opacity: 0.5, cursor: 'not-allowed'} : {}"
          >
            {{ lang.charAt(0).toUpperCase() + lang.slice(1) }}
          </div>
        </div>
      </div>

      <div class="field">
        <label :class="{ dark: isDarkMode }">Time Limit</label>
        <div class="selection-panel">
          <div 
            @click="timeLimit = 0"
            :class="['selection-item', { active: timeLimit === 0, dark: isDarkMode }]"
          >
            No Limit
          </div>
          <div 
            v-for="time in [1, 60, 120, 180, 240, 300]" 
            :key="time"
            @click="timeLimit = time"
            :class="['selection-item', { active: timeLimit === time, dark: isDarkMode }]"
          >
            {{ formatTime(time) }}
          </div>
        </div>
      </div>

      <button class="ui primary button" @click="startTest" :class="{ dark: isDarkMode }">
        Start Test
      </button>
    </div>
</template>

<script setup>
  import { ref, onMounted, watch } from 'vue'
  import { useRouter } from 'vue-router'
  import { useDarkMode } from '../composables/useDarkMode'

  const { isDarkMode, toggleDarkMode, initDarkMode } = useDarkMode()

  onMounted(() => {
    initDarkMode()
  })

  const router = useRouter()
  const numQuestions = ref(5)
  const testType = ref('testMaskedWords') 
  const testLang = ref('english')
  const comparedLang = ref('german')
  const timeLimit = ref(0) // Default: no time limit

  // Pick a different language automatically in case the user selects the same language for both
  const langs = ['english', 'german', 'japanese']
  watch(testLang, (newVal) => {
    if (comparedLang.value === newVal) {
      comparedLang.value = langs.find(lang => lang !== newVal) || 'english'
    }
  })

  // Format time for display (converts seconds to MM:SS format)
  function formatTime(seconds) {
    if (seconds === 0) return 'No Limit'
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  function startTest() {
    router.push({
      name: testType.value,
      params: {
        numQuestions: numQuestions.value,
        testLang: testLang.value,
        comparedLang: comparedLang.value,
        timeLimit: timeLimit.value,
        testType: testType.value
      }
    })
  }
</script>

<style scoped>
.dark .ui.form .field > label {
  color: #f0f0f0;
}

button.ui.button {
  margin: 0;
}

</style>

<style>
h1.dark {
  color: #f0f0f0;
}

.selection-panel {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 15px;
}

.selection-item {
  padding: 8px 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
  cursor: pointer;
  text-align: center;
  background-color: #f9f9f9;
  transition: all 0.2s ease;
}

.selection-item.active {
  background-color: #2185d0;
  color: white;
  border-color: #2185d0;
}

.selection-item.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.selection-item.dark {
  background-color: #282b25;
  color: #f0f0f0;
  border-color: #555;
}

.selection-item.dark.active {
  background-color: #1e5f8d;
  border-color: #1e5f8d;
}

.timer-container {
  margin-bottom: 1.5rem;
  border-radius: 4px;
  overflow: hidden;
  border: 1px solid #ddd;
  background-color: #f9f9f9;
}

.timer-container.dark {
  background-color: #282b25;
  border-color: #444;
}

.timer-header {
  padding: 10px 16px;
  font-weight: bold;
  text-align: center;
  font-size: 1.2em;
  background-color: #f0f0f0;
}

.timer-header.timer-warning {
  background-color: #fff6f6;
  color: #9f3a38;
  animation: pulse 1s infinite;
}

.timer-container.dark .timer-header {
  background-color: #32352f;
  color: #f0f0f0;
}

.timer-container.dark .timer-header.timer-warning {
  background-color: #512a2a;
}

.progress-bar-container {
  height: 10px;
  background-color: #e0e0e0;
  width: 100%;
}

.timer-container.dark .progress-bar-container {
  background-color: #444;
}

.progress-bar {
  height: 100%;
  background-color: #2185d0;
  transition: width 1s linear;
}

.progress-bar.warning {
  background-color: #db2828;
}

@keyframes pulse {
  0% { opacity: 1; }
  50% { opacity: 0.8; }
  100% { opacity: 1; }
}
</style>


