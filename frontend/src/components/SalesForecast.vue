<template>
  <div>
    <h2>Sales Forecast</h2>
    <form @submit.prevent="addSalesForecast">
      <input type="number" v-model="newSalesForecast.year" placeholder="Year" required>
      <input type="number" v-model="newSalesForecast.month" placeholder="Month" required>
      <input type="number" v-model="newSalesForecast.expectedRevenue" placeholder="Expected Revenue" required>
      <input type="number" v-model="newSalesForecast.actualRevenue" placeholder="Actual Revenue">
      <input type="text" v-model="newSalesForecast.notes" placeholder="Notes">
      <button type="submit">Add Sales Forecast</button>
    </form>

    <ul>
      <li v-for="forecast in salesForecasts" :key="forecast._id">
        Year: {{ forecast.year }}, Month: {{ forecast.month }}, Expected: ${{ forecast.expectedRevenue }}, Actual: ${{ forecast.actualRevenue }}
        <button @click="deleteSalesForecast(forecast._id)">Delete</button>
      </li>
    </ul>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'SalesForecast',
  data() {
    return {
      salesForecasts: [],
      newSalesForecast: {
        year: new Date().getFullYear(),
        month: new Date().getMonth() + 1,
        expectedRevenue: 0,
        actualRevenue: 0,
        notes: '',
      },
    };
  },
  created() {
    this.fetchSalesForecasts();
  },
  methods: {
    async fetchSalesForecasts() {
      try {
        const response = await axios.get('/api/salesforecasts');
        this.salesForecasts = response.data;
      } catch (error) {
        console.error('Error fetching sales forecasts:', error);
      }
    },
    async addSalesForecast() {
      try {
        await axios.post('/api/salesforecasts', this.newSalesForecast);
        this.newSalesForecast = {
          year: new Date().getFullYear(),
          month: new Date().getMonth() + 1,
          expectedRevenue: 0,
          actualRevenue: 0,
          notes: '',
        };
        this.fetchSalesForecasts();
      } catch (error) {
        console.error('Error adding sales forecast:', error);
      }
    },
    async deleteSalesForecast(id) {
      try {
        await axios.delete(`/api/salesforecasts/${id}`);
        this.fetchSalesForecasts();
      } catch (error) {
        console.error('Error deleting sales forecast:', error);
      }
    },
  },
};
</script>

<style scoped>
/* Add some basic styling for the form and list */
div {
  margin-top: 20px;
  padding: 20px;
  border: 1px solid #eee;
  border-radius: 8px;
  background-color: #f9f9f9;
}
h2 {
  color: #333;
  margin-bottom: 15px;
}
form {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin-bottom: 20px;
}
form div {
  grid-column: 1 / -1;
}
form button[type="submit"] {
  grid-column: 1 / -1;
  padding: 10px 15px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
form button[type="submit"]:hover {
  background-color: #0056b3;
}
ul {
  list-style: none;
  padding: 0;
}
li {
  background-color: #fff;
  border: 1px solid #ddd;
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 4px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
li button {
  background-color: #dc3545;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 4px;
  cursor: pointer;
}
li button:hover {
  background-color: #c82333;
}
</style>