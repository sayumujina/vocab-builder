import { createRouter, createWebHistory } from 'vue-router';
import Words from './views/Words.vue';
import New from './views/New.vue';
import Show from './views/Show.vue';
import Edit from './views/Edit.vue';
import TestSelect from './views/TestSelect.vue';
import TestMaskedWords from './components/TestMaskedWords.vue';
import TestMatchWords from './components/TestMatchWords.vue';

const routes = [
    { path: '/', redirect: '/words' },
    { path: '/words', name: 'words', component: Words },
    { path: '/words/new', name: 'new', component: New },
    { path: '/words/:wordId', name: 'show', component: Show },
    { path: '/words/:wordId/edit', name: 'edit', component: Edit },
    { path: '/test', name: 'test', component: TestSelect },
    { path: '/test-masked-words/:testLang/:comparedLang/:numQuestions/:timeLimit', name: 'testMaskedWords', component: TestMaskedWords },
    { path: '/test-match-words/:testLang/:comparedLang/:numQuestions/:timeLimit', name: 'testMatchWords', component: TestMatchWords }
];

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes,
    linkActiveClass: 'active'
});

export default router;