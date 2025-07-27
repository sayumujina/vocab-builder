<template>
    <div>
        <h1>Words</h1>
        <table id="words" class="ui celled compact table" :class="{ dark: isDarkMode }">
        <thead>
            <tr style="font-size: 1.2em; text-align: center;">
            <th>Word</th>
            <th width="250">English</th>
            <th width="250">German</th>
            <th width="250">Japanese</th>
            <th colspan="3"></th>
            </tr>
        </thead>
        <tr v-for="(word, index) in pages" :key="index">
            <td>{{ (currentPage - 1) * itemsPerPage + index + 1 }}</td>
            <td>{{ word.english }}</td>
            <td>{{ word.german }}</td>
            <td>{{ word.japanese }}</td>
            <td class="center aligned">
                <!-- Creates a link to the show page for each word -->
                <router-link :to="{ name: 'show', params: { wordId: word._id } }">Show</router-link>
            </td>
            <td class="center aligned">
                <router-link :to="{ name: 'edit', params: { wordId: word._id } }">Edit</router-link>
            </td>
            <td width="75" class="center aligned" @click.prevent="onDelete(word._id)">
            <a :href="`words/${word._id}/`">Delete</a></td>
        </tr>
        </table>

        <!-- Pagination controls-->
        <div class="page-controls">
            <div class="page-selector" :class="{ dark: isDarkMode }">
                Go to:
                <input 
                    type="number"
                    v-model.number="pageInput"
                    min="1"
                    :max="totalPages"
                    @keyup.enter="goToPage"
                />
                <button 
                    class="ui mini button" 
                    @click="goToPage"
                >Go</button>
            </div>
            
            <div class="ui pagination menu" v-if="totalPages > 1" :class="{ dark: isDarkMode }">
                <a class="item" @click="prevPage" :class="{ disabled: currentPage === 1 }">
                    <i class="angle left icon"></i> Previous
                </a>
                <div class="item">
                    Page {{ currentPage }} of {{ totalPages }}
                </div>
                <a class="item" @click="nextPage" :class="{ disabled: currentPage === totalPages }">
                    Next <i class="angle right icon"></i>
                </a>
            </div>
        </div>
    </div>
</template>

<script setup>
    import { ref, onMounted, computed } from 'vue';
    import { api } from '../helpers/helpers'; 
    import { useDarkMode } from '../composables/useDarkMode'; 
    import { toast } from 'vue3-toastify'; 

    const words = ref([]);
    const { isDarkMode } = useDarkMode()
    const currentPage = ref(1);
    const pageInput = ref(1);
    const itemsPerPage = 25;

    // Split words into pages
    const pages = computed(() => {
        const start = (currentPage.value - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        return words.value.slice(start, end);
    });

    const totalPages = computed(() => 
        Math.ceil(words.value.length / itemsPerPage)
    );

    // Page navigation
    function nextPage() {
    if (currentPage.value < totalPages.value) {
        currentPage.value++;
        }
    }

    function prevPage() {
    if (currentPage.value > 1) {
        currentPage.value--;
        }
    }

    function goToPage() {
    if (pageInput.value >= 1 && pageInput.value <= totalPages.value) {
        currentPage.value = pageInput.value;
    } else {
        toast.error(`Please enter a valid page number between 1 and ${totalPages.value}`);
    }
}
    
    // Deleting a word
    const onDelete = async (id) => {
        try {
            const confirmed = window.confirm('Are you sure you want to delete this word?');
            if (!confirmed) return;
            await api.deleteWord(id);
            toast.success('Word deleted successfully!');
            // Refresh the list of words after deletion
            words.value = words.value.filter(word => word._id !== id);
        } catch (error) {
            toast.error('Error deleting word: ' + (error.response ? error.response.statusText : `Something went wrongs`));
            // console.error('Error deleting word:', error);
        }
    };

    // Use onMounted to fetch data when the component is mounted
    // Fetch all words from the API when the component is mounted
    onMounted(async () => { 
    try {
        words.value = await api.getAllWords();
    } catch (error) {
        console.error('Error fetching words:', error);
    }
    });
</script>

<style scoped>
table.ui.celled.compact.table {
  margin-bottom: 4px;
  border: 4px solid #1f211d;
}

tr:nth-child(odd) {
  background: #e4d7b0;
}

table.ui.celled.compact.table.dark {
  margin-bottom: 4px;
  border: 4px solid #f0f0f0;
  background: #20241d;
  color: #f0f0f0;
}

table.ui.celled.compact.table.dark tr:nth-child(odd) {
  background: #282b25;
}

.ui.pagination.menu {
    font-size: 16px;
    margin-top: 1em;
    display: flex;
    justify-content: center;
    background: transparent;
}

.ui.pagination.menu.item {
    display: flex;
    align-items: center;
}

.ui.pagination.menu.dark .item {
    color: #f0f0f0;
}

.page-controls {
    display: flex;
    justify-content: center;
    margin-top: 16px;
    position: relative;
    width: 100%;
}

.page-controls .page-selector > input {
    width: 40px;
    height: 40px;
}


.page-selector {
    position: absolute;
    left: 0;
    margin-top: 2px;
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.page-selector.dark {
    color: #f0f0f0;
}

.page-selector button.ui.mini.button {
    background: #fdefd8;
    color: #1f211d;
    border: 2px solid #1f211d;
    font-size: 16px;
    text-align: center;
    height: 40px; 
    width: 60px;
    margin: 0;
    padding: 0 10px;
}

.page-selector.dark button.ui.mini.button {
    background: #1f211d;
    color: #f0f0f0;
    border: 2px solid #f0f0f0;
}

.ui.pagination.menu {
    margin: 0;
}
</style>