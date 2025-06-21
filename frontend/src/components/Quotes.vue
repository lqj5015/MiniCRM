<template>
  <div>
    <h2>Quotes</h2>
    <form @submit.prevent="addQuote">
      <select v-model="newProposal.customer" required>
        <option disabled value="">Select a Customer</option>
        <option v-for="customer in customers" :key="customer._id" :value="customer._id">{{ customer.name }}</option>
      </select>
      <select v-model="newProposal.opportunity">
        <option disabled value="">Select an Opportunity (Optional)</option>
        <option v-for="opportunity in opportunities" :key="opportunity._id" :value="opportunity._id">{{ opportunity.name }}</option>
      </select>
      <div>
        <h3>Products for Quote</h3>
        <div v-for="(item, index) in newProposal.products" :key="index">
          <select v-model="item.product" required>
            <option disabled value="">Select a Product</option>
            <option v-for="product in products" :key="product._id" :value="product._id">{{ product.name }}</option>
          </select>
          <input type="number" v-model="item.quantity" placeholder="Quantity" required min="1">
          <input type="number" v-model="item.price" placeholder="Price" required min="0">
          <button type="button" @click="removeProductFromProposal(index)">Remove</button>
        </div>
        <button type="button" @click="addProductToProposal">Add Product</button>
      </div>
      <input type="number" v-model="newProposal.totalAmount" placeholder="Total Amount" required>
      <input type="date" v-model="newProposal.proposalDate">
      <select v-model="newProposal.status">
        <option value="Draft">Draft</option>
        <option value="Sent">Sent</option>
        <option value="Accepted">Accepted</option>
        <option value="Rejected">Rejected</option>
      </select>
      <input type="text" v-model="newProposal.notes" placeholder="Notes">
      <button type="submit">Add Quote</button>
    </form>

    <ul>
      <li v-for="proposal in proposals" :key="proposal._id">
        Customer: {{ proposal.customer ? proposal.customer.name : 'N/A' }} - Opportunity: {{ proposal.opportunity ? proposal.opportunity.name : 'N/A' }} - Total: ${{ proposal.totalAmount }} - Status: {{ proposal.status }}
        <ul>
          <li v-for="item in proposal.products" :key="item._id">
            {{ item.product ? item.product.name : 'N/A' }} x {{ item.quantity }} @ ${{ item.price }}
          </li>
        </ul>
        <button @click="deleteQuote(proposal._id)">Delete</button>
      </li>
    </ul>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'Quotes',
  data() {
    return {
      proposals: [],
      customers: [],
      opportunities: [],
      products: [],
      newProposal: {
        customer: '',
        opportunity: '',
        products: [],
        totalAmount: 0,
        proposalDate: new Date().toISOString().substr(0, 10),
        status: 'Draft',
        notes: '',
      },
    };
  },
  created() {
    this.fetchProposals();
    this.fetchCustomers();
    this.fetchOpportunities();
    this.fetchProducts();
  },
  methods: {
    async fetchProposals() {
      try {
        const response = await axios.get('/api/quotes');
        this.proposals = response.data;
      } catch (error) {
        console.error('Error fetching quotes:', error);
      }
    },
    async fetchCustomers() {
      try {
        const response = await axios.get('/api/customers');
        this.customers = response.data;
      } catch (error) {
        console.error('Error fetching customers:', error);
      }
    },
    async fetchOpportunities() {
      try {
        const response = await axios.get('/api/opportunities');
        this.opportunities = response.data;
      } catch (error) {
        console.error('Error fetching opportunities:', error);
      }
    },
    async fetchProducts() {
      try {
        const response = await axios.get('/api/products');
        this.products = response.data;
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    },
    addProductToProposal() {
      this.newProposal.products.push({ product: '', quantity: 1, price: 0 });
    },
    removeProductFromProposal(index) {
      this.newProposal.products.splice(index, 1);
    },
    async addQuote() {
      try {
        await axios.post('/api/quotes', this.newProposal);
        this.newProposal = {
          customer: '',
          opportunity: '',
          products: [],
          totalAmount: 0,
          proposalDate: new Date().toISOString().substr(0, 10),
          status: 'Draft',
          notes: '',
        };
        this.fetchProposals();
      } catch (error) {
        console.error('Error adding quote:', error);
      }
    },
    async deleteQuote(id) {
      try {
        await axios.delete(`/api/quotes/${id}`);
        this.fetchProposals();
      } catch (error) {
        console.error('Error deleting quote:', error);
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