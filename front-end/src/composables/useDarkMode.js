import { ref } from 'vue'

const isDarkMode = ref(false)

export function useDarkMode() {
  // Toggle function
  const toggleDarkMode = () => {
    isDarkMode.value = !isDarkMode.value
    localStorage.setItem('darkMode', isDarkMode.value)
  }
  
  // Initialize from localStorage
  const initDarkMode = () => {
    const savedMode = localStorage.getItem('darkMode') === 'true' //local storage returns a string, not boolean
    isDarkMode.value = savedMode
  }
  
  return {
    isDarkMode,
    toggleDarkMode,
    initDarkMode
  }
}