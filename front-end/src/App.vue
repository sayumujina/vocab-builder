<template>
  <div id="app" :class="{ dark: isDarkMode }">
    <div class="ui inverted segment navbar">
      <div class="ui center aligned container">
        <div class="ui large secondary inverted pointing menu compact">
          <router-link to="/words" exact class="item">
            <i class="comment outline icon"></i> Words
          </router-link>
          <router-link to="/words/new" class="item">
            <i class="plus circle icon"></i> New
          </router-link>
          <router-link to="/test" class="item">
            <i class="graduation cap icon"></i> Test
          </router-link>

          <button @click="toggleDarkMode" class="ui button" :class="{ dark: isDarkMode }">
            {{ isDarkMode ? '☀ Light' : '🌙 Dark' }}
          </button>

        </div>
      </div>
    </div>

    <div class="ui text container" :class="{ dark: isDarkMode }">
      <div class="ui one column grid">
        <div class="column">
          <router-view :key="$route.fullPath"></router-view>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { onMounted } from 'vue'
  import { useDarkMode } from './composables/useDarkMode'

  const { isDarkMode, toggleDarkMode, initDarkMode } = useDarkMode()

  onMounted(() => {
    initDarkMode()
  })
</script>

<style>
#app > div.navbar {
  margin-bottom: 1.5em;
  background: #282b25;
  border-bottom: 2px solid white;
}
#app {
  background: #fdefd8;
  transition: background 0.3s, color 0.3s;
}
#app.dark {
  background: #1f211d;
}
.myFlash {
  width: 250px;
  margin: 10px;
  position: absolute;
  top: 50;
  right: 0;
}
.ui.text.container {
  background: #fdefd8;
  color: #1b1c1d;
  min-height: 100vh;
  padding: 20px;
  transition: background 0.3s, color 0.3s;
}
.ui.text.container.dark {
  background: #1f211d;
  color: #f0f0f0;
}

input {
  width: 300px;
}
.ui.text.container.dark input {
  background: #1b1c1d;
  color: #f0f0f0;
  border: 1px solid #444;
}

div.label {
  width: 120px;
}
div.input {
  margin-bottom: 10px;
}

button.ui.button {
  height: 41.81px;
  margin: 0 0 -2px 10px;
  border: 1px solid #282b25;
  background: #fdefd8;
  color: #282b25;
  text-align: middle;
  font-size: 15px;
}

button.ui.button.dark {
  border: 1px solid #f0f0f0;
  background: #282b25;
  color: #f0f0f0;
}

</style>