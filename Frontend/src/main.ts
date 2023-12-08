import './assets/css/main.css'

import { createApp } from 'vue'
import { createStore } from 'vuex'
import App from './App.vue'
import router from './router'
import axios from 'axios'
import auth from './store/auth.store'

axios.defaults.baseURL = import.meta.env.VITE_API_URL

const store = createStore({
    modules: {
        auth,
    },
})

const app = createApp(App)

app.use(router)
app.use(store)

app.mount('#app')
