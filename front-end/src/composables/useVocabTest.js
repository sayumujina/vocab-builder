import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { api } from '../helpers/helpers'
import { toast } from 'vue3-toastify'

export function useVocabTest() {
  const route = useRoute()
  const router = useRouter()

  const numQuestions = ref(parseInt(route.params.numQuestions || '5'))
  const testLang = ref(route.params.testLang || 'english')
  const comparedLang = ref(route.params.comparedLang || 'german')
  const testType = ref(route.params.testType || 'maskedWords')
  const timeLimit = ref(parseInt(route.params.timeLimit || '0'))
  const timeRemaining = ref(parseInt(route.params.timeLimit || '0'))
  const timerActive = ref(false)
  const questions = ref([])
  const userAnswers = ref([])
  const showResults = ref(false)
  const score = ref(0)
  
  let timerInterval = null

  // Start the timer if there's a time limit
  function startTimer() {
    if (timeLimit.value > 0) {
      // Ensure we start with the full time limit
      timeRemaining.value = timeLimit.value
      timerActive.value = true
      
      console.log("Starting timer with", timeLimit.value, "seconds")
      
      timerInterval = setInterval(() => {
        timeRemaining.value--
        console.log("Time remaining:", timeRemaining.value)
        
        if (timeRemaining.value <= 0) {
          stopTimer()
          submitAnswers()
        }
      }, 1000)
    }
  }

  // Stop the timer
  function stopTimer() {
    clearInterval(timerInterval)
    timerActive.value = false
  }

  // Format time for display (converts seconds to MM:SS format)
  function formatTime(seconds) {
    if (seconds === 0) return 'No Limit'
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  // Clean up timer on component unmount
  onUnmounted(() => {
    stopTimer()
  })

  // Check if test languages are valid
  async function validateTestSetup() {
    if (testLang.value === comparedLang.value) {
      toast.error("You cannot test the same language against itself!")
      router.push({ name: 'test' })
      return false
    }
    return true
  }

  // Fetch all vocabulary words
  async function fetchAllWords() {
    try {
      const allWords = await api.getAllWords()
      return allWords
    } catch (err) {
      console.error('Error loading words', err)
      toast.error("Failed to load vocabulary words.")
      return []
    }
  }

  // Get a subset of words for the test
  function getTestWords(allWords, count) {
    const shuffled = shuffle(allWords)
    return shuffled.slice(0, count)
  }

  // Extract word in the target language
  function getWordInLanguage(word, language) {
    if (language === 'english') return word.english
    if (language === 'german') return word.german
    if (language === 'japanese') return word.japanese
    return ''
  }

  // Helper function to get proper language names
  function getLanguageName(code) {
    const names = {
      'english': 'English',
      'german': 'German',
      'japanese': 'Japanese'
    }
    return names[code] || code
  }

  // Create masked words for hints
  function randomMask(word) {
    // Ignore words that are too short
    if (word.length < 3) return word

    // Maximum 85% of the word can be masked
    const maxMaskableRatio = 0.85
    const maxMaskable = Math.max(1, Math.floor(word.length * maxMaskableRatio))
    const maskCount = Math.max(1, Math.floor(Math.random() * maxMaskable) || 1)

    // Create array of indices and shuffle them
    const indices = Array.from({length: word.length}, (_, i) => i)
    const shuffledIndices = indices.sort(() => Math.random() - 0.5)
    const positionsToMask = new Set(shuffledIndices.slice(0, maskCount))

    // Build masked string
    return word
      .split('')
      .map((char, i) => (positionsToMask.has(i) ? '_' : char))
      .join('')
  }

  // Shuffle array of words
  function shuffle(array) {
    let arr = array.slice()
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[arr[i], arr[j]] = [arr[j], arr[i]]
    }
    return arr
  }

  // Initialize the answers array
  function initializeAnswers(length) {
    userAnswers.value = Array(length).fill('')
  }

  // Set the user's answer for a specific question
  function selectAnswer(index, answer) {
    userAnswers.value[index] = answer
  }

  // Check if all questions have been answered
  const allQuestionsAnswered = computed(
    () =>
      userAnswers.value.length === questions.value.length &&
      userAnswers.value.every(a => a !== '')
  )

  // Check if a specific answer is correct
  function isCorrect(i) {
    return (
      userAnswers.value[i]?.trim().toLowerCase() ===
      questions.value[i].answer.trim().toLowerCase()
    )
  }

  // Submit answers and calculate score
  function submitAnswers() {
    stopTimer() // Stop the timer when submitting
    showResults.value = true
    score.value = questions.value.reduce(
      (acc, _, i) => acc + (isCorrect(i) ? 1 : 0),
      0
    )
  }

  // Return to test selection
  function goBack() {
    stopTimer() // Stop the timer when going back
    router.push({ name: 'test' })
  }

  return {
    numQuestions,
    testLang,
    comparedLang,
    testType,
    timeLimit,
    timeRemaining,
    timerActive,
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
    shuffle,
    initializeAnswers,
    selectAnswer,
    startTimer,
    stopTimer,
    formatTime,
    allQuestionsAnswered,
    isCorrect,
    submitAnswers,
    goBack
  }
}
