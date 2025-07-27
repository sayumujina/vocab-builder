<template>
    <h1 :class="{ dark: isDarkMode }">Vocabulary Test</h1>
    
    <div v-if="timeLimit > 0" class="timer-container" :class="{ dark: isDarkMode }">
      <div class="timer-header" :class="{ 'timer-warning': timeRemaining <= 30 }">
        <i class="clock outline icon"></i>
        Time Remaining: <span v-if="timeRemaining > 0">{{ formatTime(timeRemaining) }}</span><span v-else>0:00</span>
      </div>
      <div class="progress-bar-container">
        <div 
          class="progress-bar" 
          :class="{ 'warning': timeRemaining <= 30 }"
          :style="{ width: `${(timeRemaining / timeLimit) * 100}%` }"
        ></div>
      </div>
    </div>
    
    <form @submit.prevent="submitAnswers">
      
      <div v-for="(q, index) in questions" :key="index" class="question-block">
        <div class="ui segment" :class="{ dark: isDarkMode }">
          <strong :class="{ dark: isDarkMode }">Q{{ index + 1 }}: </strong>
          <span :class="{ dark: isDarkMode }">{{ q.prompt }}</span>

          <div class="ui form" style="margin-top: 1rem;">
            <div class="field">
              <input 
                type="text"
                v-model="userAnswers[index]"
                :disabled="showResults"
                placeholder="Type the full word..."
                :class="{ dark: isDarkMode }"
              />
            </div>
          </div>

          <div v-if="showResults" class="result-indicator" :class="{ dark: isDarkMode }">
            <i v-if="isCorrect(index)" class="check icon green"></i>
            <i v-else class="close icon red"></i>
            <span v-if="!isCorrect(index)" class="correct-answer" :class="{ dark: isDarkMode }">
              Correct answer: {{ q.answer }}
            </span>
          </div>
        </div>
      </div>

      <button v-if="!showResults" class="ui positive button" :disabled="!allQuestionsAnswered" :class="{ dark: isDarkMode }">
        Submit
      </button>
    </form>

    <div v-if="showResults" class="ui message" :class="{ dark: isDarkMode }">
      <strong :class="{ dark: isDarkMode }">Score: {{ score }} / {{ questions.length }}</strong>
      <div class="percentage" :class="{ dark: isDarkMode }">
        {{ Math.round((score / questions.length) * 100) }}%
      </div>
      <div style="margin-top: 1rem;">
        <button class="ui button" :class="{ dark: isDarkMode }" @click="goBack" type="button">
          Try Again
        </button>
      </div>
    </div>
</template>

<script setup>
  import { onMounted } from 'vue'
  import { useDarkMode } from '../composables/useDarkMode'
  import { useVocabTest } from '../composables/useVocabTest'

  const { isDarkMode } = useDarkMode()
  const {
    numQuestions,
    testLang,
    comparedLang,
    timeLimit,
    timeRemaining,
    questions,
    userAnswers,
    showResults,
    score,
    validateTestSetup,
    fetchAllWords,
    getTestWords,
    getWordInLanguage,
    getLanguageName,
    randomMask,
    initializeAnswers,
    startTimer,
    formatTime,
    allQuestionsAnswered,
    isCorrect,
    submitAnswers,
    goBack
  } = useVocabTest()
  
  async function loadTest() {
    try {
      const allWords = await fetchAllWords()
      const selected = getTestWords(allWords, numQuestions.value)
      
      questions.value = selected.map(word => {
        const answer = getWordInLanguage(word, testLang.value)
        
        const hintWord = getWordInLanguage(word, comparedLang.value)
        
        const masked = randomMask(answer)
        
        const prompt = `The ${getLanguageName(testLang.value)} word for "${hintWord}" is ${masked}`
        
        return {
          prompt,
          answer
        }
      })
      
      // Initialize answers array
      initializeAnswers(selected.length)
      
      console.log("Time limit:", timeLimit.value, typeof timeLimit.value)
      
      // Start the timer if there's a time limit
      if (timeLimit.value > 0) {
        console.log("Starting timer with limit:", timeLimit.value)
        startTimer()
      } else {
        console.log("No time limit set")
      }
    } catch (error) {
      console.error('Error loading test:', error)
    }
  }
  
  onMounted(async () => {
    if (await validateTestSetup()) {
      loadTest()
    }
  })
</script>

<style scoped>
.test-container {
  max-width: 600px;
  margin: 2rem auto;
}

.question-block {
  margin-bottom: 1.5rem;
}

.result-indicator {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #e0e0e0;
}

.correct-answer {
  margin-left: 1rem;
  color: #2185d0;
  font-weight: bold;
}

.percentage {
  font-size: 1.2em;
  margin-top: 0.5rem;
}

.ui.radio.checkbox input:disabled ~ label {
  opacity: 0.8;
}

.field {
  margin-bottom: 0.8rem;
}

h1.dark {
  color: #f0f0f0;
}

.ui.segment.dark {
  background-color: #1f211d;
  color: #f0f0f0;
  border-color: #444;
}

.ui.segment.dark input {
  background-color: #282b25;
  color: #f0f0f0;
  border-color: #555;
}

.result-indicator.dark {
  border-top-color: #444;
}

.correct-answer.dark {
  color: #57a7ee;
}

.ui.message.dark {
  background-color: #1f211d;
  color: #f0f0f0;
  border: 1px solid #f0f0f0;
}

strong.dark,
span.dark,
.percentage .dark {
  color: #f0f0f0;
}
</style>
