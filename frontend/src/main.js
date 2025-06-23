import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import axios from 'axios'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

axios.defaults.baseURL = 'http://localhost:3000';

const app = createApp(App);
app.use(ElementPlus);
app.mount('#app');
