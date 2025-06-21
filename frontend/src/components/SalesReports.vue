<template>
  <div>
    <h2>Sales Reports</h2>
    <div v-if="reportData">
      <p>Total Customers: {{ reportData.totalCustomers }}</p>
      <p>Won Opportunities: {{ reportData.wonOpportunities }}</p>
      <p>Lost Opportunities: {{ reportData.lostOpportunities }}</p>
      <p>Total Orders: {{ reportData.totalOrders }}</p>
      <p>Total Revenue: ${{ reportData.totalRevenue }}</p>
    </div>
    <div v-else>
      <p>Loading sales report data...</p>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'SalesReports',
  data() {
    return {
      reportData: null,
    };
  },
  created() {
    this.fetchReportData();
  },
  methods: {
    async fetchReportData() {
      try {
        const response = await axios.get('http://localhost:3000/api/reports/sales');
        this.reportData = response.data;
      } catch (error) {
        console.error('Error fetching sales report data:', error);
        this.reportData = { error: 'Failed to load report data.' };
      }
    },
  },
};
</script>

<style scoped>
/* Add some basic styling for the report */
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
p {
  font-size: 1.1em;
  margin-bottom: 8px;
}
</style>