<template>
    <h1 :class="{ dark: isDarkMode }">Vocabulary Matching Test</h1>

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
            <div class="options-container">
              <div 
                v-for="(option, optionIndex) in q.options" 
                :key="optionIndex"
                class="option-item"
                :class="{ 
                  'selected': userAnswers[index] === option,
                  'correct-option': showResults && option === q.answer,
                  'wrong-option': showResults && userAnswers[index] === option && option !== q.answer,
                  'dark': isDarkMode
                }"
                @click="!showResults && selectAnswer(index, option)"
              >
                {{ option }}
              </div>
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
    questions,
    userAnswers,
    showResults,
    score,
    validateTestSetup,
    fetchAllWords,
    getTestWords,
    getWordInLanguage,
    getLanguageName,
    shuffle,
    timeLimit,
    timeRemaining,
    startTimer,
    formatTime,
    selectAnswer,
    allQuestionsAnswered,
    isCorrect,
    submitAnswers,
    goBack
  } = useVocabTest()
  
  async function loadTest() {
    try {
      const allWords = await fetchAllWords()
      
      // Check if there are enough words for the test
      if (allWords.length < numQuestions.value * 3) {
        console.error('Not enough words for creating options')
        return
      }
      
      const selectedWords = getTestWords(allWords, numQuestions.value)
      
      const usedWordsIds = new Set(selectedWords.map(w => w._id))
      const distractorPool = allWords.filter(w => !usedWordsIds.has(w._id))
      
      questions.value = selectedWords.map(word => {
        const answer = getWordInLanguage(word, comparedLang.value)
        
        const questionWord = getWordInLanguage(word, testLang.value)
        
        const prompt = `Select the ${getLanguageName(comparedLang.value)} word for "${questionWord}"`
        
        // Get 3 random decoy words in the same language
        const distractors = getTestWords(distractorPool, 3).map(w => 
          getWordInLanguage(w, comparedLang.value)
        )
        
        // Combine correct answer with distractors and shuffle
        const options = shuffle([answer, ...distractors])
        
        return {
          prompt,
          answer,
          options
        }
      })
      
      // Initialize answers array
      userAnswers.value = Array(selectedWords.length).fill('')
      
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

.options-container {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin: 1rem 0;
}

.option-item {
  flex: 1 0 calc(50% - 10px);
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  text-align: center;
  cursor: pointer;
  background-color: #f9f9f9;
  transition: all 0.2s ease;
  margin-bottom: 10px;
}

.option-item.selected {
  background-color: #2185d0;
  color: white;
  border-color: #2185d0;
}

.option-item.correct-option {
  background-color: #21ba45;
  color: white;
  border-color: #21ba45;
}

.option-item.wrong-option {
  background-color: #db2828;
  color: white;
  border-color: #db2828;
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

.ui.button.dark {
  background-color: #282b25;
  color: #f0f0f0;
  border: 1px solid #555;
}

.option-item.dark {
  background-color: #282b25;
  color: #f0f0f0;
  border-color: #555;
}

.option-item.dark.selected {
  background-color: #1e5f8d;
  border-color: #1e5f8d;
}

strong.dark,
span.dark,
.percentage .dark {
  color: #f0f0f0;
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
