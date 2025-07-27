<template>
    <div>
        <h1>Create a New Word</h1>
        <word-form @createOrUpdate="onCreateOrUpdate" :word="word"></word-form>
    </div>
</template>

<script setup>
    import { ref, onMounted } from 'vue';
    import { useRoute, useRouter } from 'vue-router';
    import WordForm from '@/components/WordForm.vue';
    import { useDarkMode } from '../composables/useDarkMode';
    import { api } from '../helpers/helpers';
    import { toast } from 'vue3-toastify';

    const word = ref({});
    const route = useRoute();
    const router = useRouter();

    const { isDarkMode, initDarkMode } = useDarkMode();

    async function onCreateOrUpdate(createdWord) {
        try {
            initDarkMode();
            const result = await api.createWord(createdWord);
            toast.success('Word created successfully!');
            // Redirect to the newly created word's show page
            router.push({ 
                name: 'show', 
                params: { wordId: result._id },
                query: { refresh: Date.now() }
            });
        } catch (error) {
            toast.error('Error creating word: ' + (error.response ? error.response.statusText : error.message));
            console.error('Error creating word:', error);
        }
    }
</script>