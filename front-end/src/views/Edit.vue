<template>
    <div>
        <h1>Edit Word</h1>
        <word-form @createOrUpdate="onCreateOrUpdate" :word="word"></word-form>
    </div>
</template>

<script setup>
    import { ref, onMounted } from 'vue';
    import { useRoute, useRouter } from 'vue-router';
    import WordForm from '../components/WordForm.vue';
    import { toast } from 'vue3-toastify';
    import { api } from '../helpers/helpers';

    const word = ref({ });
    const route = useRoute();
    const router = useRouter();

    onMounted(async () => {
        try {
            const id = route.params.wordId; // Use this instead cuz $params is not valid in Vue 3
            word.value = await api.getWord(id);
        } catch (error) {
            console.error('Error fetching word:', error);
        }
    });

    async function onCreateOrUpdate(updatedWord) {
        try {
            // Call the API to update the word in the database
            const result = await api.updateWord(updatedWord);
            toast.success('Word updated successfully!');
            
            // Force component refresh
            // Add a delay before redirecting to give users time to see the success message          
            setTimeout(() => {
                router.push({ 
                    name: 'show', 
                    params: { 
                        wordId: result._id || updatedWord._id 
                    },
                    query: { updated: true }
                });
            }, 500); 
           
        } catch (error) {
            toast.error('Error updating word: ' + (error.response ? error.response.statusText : error.message));
            console.error('Error updating word:', error);
        }
    }
</script>