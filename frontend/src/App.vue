<template>
  <div id="app">
    <h1>MiniCRM</h1>

    <el-tabs type="border-card">
      <el-tab-pane label="Customers">
        <form @submit.prevent="addCustomer">
          <input type="text" v-model="newCustomer.name" placeholder="Name" required>
          <input type="email" v-model="newCustomer.email" placeholder="Email" required>
          <input type="text" v-model="newCustomer.phone" placeholder="Phone">
          <input type="text" v-model="newCustomer.address" placeholder="Address">
          <button type="submit">Add Customer</button>
        </form>

        <h2>Customers</h2>
        <ul>
          <li v-for="customer in customers" :key="customer._id">
            {{ customer.name }} ({{ customer.email }}) - {{ customer.phone }} - {{ customer.address }}
            <button @click="deleteCustomer(customer._id)">Delete</button>
          </li>
        </ul>
      </el-tab-pane>

      <el-tab-pane label="Products">
        <h2>Products</h2>
        <form @submit.prevent="addProduct">
          <input type="text" v-model="newProduct.name" placeholder="Product Name" required>
          <input type="text" v-model="newProduct.description" placeholder="Description">
          <input type="number" v-model="newProduct.price" placeholder="Price" required>
          <input type="number" v-model="newProduct.stock" placeholder="Stock" required>
          <button type="submit">Add Product</button>
        </form>
        <ul>
          <li v-for="product in products" :key="product._id">
            {{ product.name }} ({{ product.description }}) - ${{ product.price }} - Stock: {{ product.stock }}
            <button @click="deleteProduct(product._id)">Delete</button>
          </li>
        </ul>
      </el-tab-pane>

      <el-tab-pane label="Leads">
        <h2>Leads</h2>
        <form @submit.prevent="addLead">
          <input type="text" v-model="newLead.name" placeholder="Lead Name" required>
          <input type="email" v-model="newLead.email" placeholder="Email">
          <input type="text" v-model="newLead.phone" placeholder="Phone">
          <input type="text" v-model="newLead.company" placeholder="Company">
          <select v-model="newLead.status">
            <option value="New">New</option>
            <option value="Contacted">Contacted</option>
            <option value="Qualified">Qualified</option>
            <option value="Unqualified">Unqualified</option>
          </select>
          <button type="submit">{{ editingLead ? 'Update Lead' : 'Add Lead' }}</button>
          <button type="button" v-if="editingLead" @click="cancelEditLead">Cancel Edit</button>
        </form>
        <ul>
          <li v-for="lead in leads" :key="lead._id">
            {{ lead.name }} ({{ lead.email }}) - {{ lead.company }} - Status: {{ lead.status }}
            <button @click="editLead(lead)">Edit</button>
            <button @click="deleteLead(lead._id)">Delete</button>
          </li>
        </ul>
      </el-tab-pane>

      <el-tab-pane label="Opportunities">
        <h2>Opportunities</h2>
        <form @submit.prevent="addOpportunity">
          <input type="text" v-model="newOpportunity.name" placeholder="Opportunity Name" required>
          <select v-model="newOpportunity.customer" required>
            <option disabled value="">Select a Customer</option>
            <option v-for="customer in customers" :key="customer._id" :value="customer._id">{{ customer.name }}</option>
          </select>
          <input type="number" v-model="newOpportunity.amount" placeholder="Amount" required>
          <select v-model="newOpportunity.stage">
            <option value="Qualification">Qualification</option>
            <option value="Needs Analysis">Needs Analysis</option>
            <option value="Value Proposition">Value Proposition</option>
            <option value="Id. Decision Makers">Id. Decision Makers</option>
            <option value="Perception Analysis">Perception Analysis</option>
            <option value="Proposal/Price Quote">Proposal/Price Quote</option>
            <option value="Negotiation/Review">Negotiation/Review</option>
            <option value="Closed Won">Closed Won</option>
            <option value="Closed Lost">Closed Lost</option>
          </select>
          <input type="date" v-model="newOpportunity.expectedCloseDate" required>
          <button type="submit">Add Opportunity</button>
        </form>
        <ul>
          <li v-for="opportunity in opportunities" :key="opportunity._id">
            {{ opportunity.name }} - {{ opportunity.customer ? opportunity.customer.name : 'N/A' }} - ${{ opportunity.amount }} - Stage: {{ opportunity.stage }} - Close: {{ new Date(opportunity.expectedCloseDate).toLocaleDateString() }}
            <button @click="deleteOpportunity(opportunity._id)">Delete</button>
          </li>
        </ul>
      </el-tab-pane>

      <el-tab-pane label="Orders">
        <h2>Orders</h2>
        <form @submit.prevent="addOrder">
          <select v-model="newOrder.customer" required>
            <option disabled value="">Select a Customer</option>
            <option v-for="customer in customers" :key="customer._id" :value="customer._id">{{ customer.name }}</option>
          </select>
          <div>
            <h3>Products for Order</h3>
            <div v-for="(item, index) in newOrder.products" :key="index">
              <select v-model="item.product" required>
                <option disabled value="">Select a Product</option>
                <option v-for="product in products" :key="product._id" :value="product._id">{{ product.name }}</option>
              </select>
              <input type="number" v-model="item.quantity" placeholder="Quantity" required min="1">
              <button type="button" @click="removeProductFromOrder(index)">Remove</button>
            </div>
            <button type="button" @click="addProductToOrder">Add Product</button>
          </div>
          <input type="number" v-model="newOrder.totalAmount" placeholder="Total Amount" required>
          <select v-model="newOrder.status">
            <option value="Pending">Pending</option>
            <option value="Processing">Processing</option>
            <option value="Shipped">Shipped</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>
          <button type="submit">Add Order</button>
        </form>
        <ul>
          <li v-for="order in orders" :key="order._id">
            Customer: {{ order.customer ? order.customer.name : 'N/A' }} - Total: ${{ order.totalAmount }} - Status: {{ order.status }}
            <ul>
              <li v-for="item in order.products" :key="item._id">
                {{ item.product ? item.product.name : 'N/A' }} x {{ item.quantity }}
              </li>
            </ul>
            <button @click="deleteOrder(order._id)">Delete</button>
          </li>
        </ul>
      </el-tab-pane>

      <el-tab-pane label="Billings">
        <h2>Billings</h2>
        <form @submit.prevent="addBilling">
          <select v-model="newBilling.customer" required>
            <option disabled value="">Select a Customer</option>
            <option v-for="customer in customers" :key="customer._id" :value="customer._id">{{ customer.name }}</option>
          </select>
          <select v-model="newBilling.order" required>
            <option disabled value="">Select an Order</option>
            <option v-for="order in orders" :key="order._id" :value="order._id">Order #{{ order._id }} ({{ order.customer ? order.customer.name : 'N/A' }})</option>
          </select>
          <input type="number" v-model="newBilling.amount" placeholder="Amount" required>
          <input type="date" v-model="newBilling.billingDate">
          <select v-model="newBilling.status">
            <option value="Pending">Pending</option>
            <option value="Paid">Paid</option>
            <option value="Overdue">Overdue</option>
            <option value="Cancelled">Cancelled</option>
          </select>
          <button type="submit">Add Billing</button>
        </form>
        <ul>
          <li v-for="billing in billings" :key="billing._id">
            Customer: {{ billing.customer ? billing.customer.name : 'N/A' }} - Order: {{ billing.order ? billing.order._id : 'N/A' }} - Amount: ${{ billing.amount }} - Date: {{ new Date(billing.billingDate).toLocaleDateString() }} - Status: {{ billing.status }}
            <button @click="deleteBilling(billing._id)">Delete</button>
          </li>
        </ul>
      </el-tab-pane>

      <el-tab-pane label="Invoices">
        <h2>Invoices</h2>
        <form @submit.prevent="addInvoice">
          <select v-model="newInvoice.customer" required>
            <option disabled value="">Select a Customer</option>
            <option v-for="customer in customers" :key="customer._id" :value="customer._id">{{ customer.name }}</option>
          </select>
          <select v-model="newInvoice.order" required>
            <option disabled value="">Select an Order</option>
            <option v-for="order in orders" :key="order._id" :value="order._id">Order #{{ order._id }} ({{ order.customer ? order.customer.name : 'N/A' }})</option>
          </select>
          <input type="number" v-model="newInvoice.amount" placeholder="Amount" required>
          <input type="date" v-model="newInvoice.invoiceDate">
          <select v-model="newInvoice.status">
            <option value="Pending">Pending</option>
            <option value="Paid">Paid</option>
            <option value="Cancelled">Cancelled</option>
          </select>
          <button type="submit">Add Invoice</button>
        </form>
        <ul>
          <li v-for="invoice in invoices" :key="invoice._id">
            Customer: {{ invoice.customer ? invoice.customer.name : 'N/A' }} - Order: {{ invoice.order ? invoice.order._id : 'N/A' }} - Amount: ${{ invoice.amount }} - Date: {{ new Date(invoice.invoiceDate).toLocaleDateString() }} - Status: {{ invoice.status }}
            <button @click="deleteInvoice(invoice._id)">Delete</button>
          </li>
        </ul>
      </el-tab-pane>

      <el-tab-pane label="Sales Reports">
        <SalesReports />
      </el-tab-pane>

      <el-tab-pane label="Quotes">
        <Quotes />
      </el-tab-pane>

      <el-tab-pane label="Sales Forecast">
        <SalesForecast />
      </el-tab-pane>

      <el-tab-pane label="Events">
        <Events />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import axios from 'axios';
import SalesReports from './components/SalesReports.vue';
import Quotes from './components/Quotes.vue';
import SalesForecast from './components/SalesForecast.vue';
import Events from './components/Events.vue';

export default {
  components: {
    SalesReports,
    Quotes,
    SalesForecast,
    Events,
  },
  data() {
    return {
      customers: [],
      newCustomer: {
        name: '',
        email: '',
        phone: '',
        address: ''
      },
      products: [],
      newProduct: {
        name: '',
        description: '',
        price: 0,
        stock: 0
      },
      leads: [],
      newLead: {
        name: '',
        email: '',
        phone: '',
        company: '',
        status: 'New'
      },
      opportunities: [],
      newOpportunity: {
        name: '',
        customer: '',
        amount: 0,
        stage: 'Qualification',
        expectedCloseDate: ''
      },
      orders: [],
      newOrder: {
        customer: '',
        products: [],
        totalAmount: 0,
        status: 'Pending'
      },
      billings: [],
      newBilling: {
        customer: '',
        order: '',
        amount: 0,
        billingDate: '',
        status: 'Pending'
      },
      invoices: [],
      newInvoice: {
        customer: '',
        order: '',
        amount: 0,
        invoiceDate: '',
        status: 'Pending'
      },
      editingLead: null
    };
  },
  created() {
    this.fetchCustomers();
    this.fetchProducts();
    this.fetchLeads();
    this.fetchOpportunities();
    this.fetchOrders();
    this.fetchBillings();
    this.fetchInvoices();
  },
  methods: {
    async fetchCustomers() {
      try {
        const response = await axios.get('/api/customers');
        this.customers = response.data;
      } catch (error) {
        console.error('Error fetching customers:', error);
      }
    },
    async addCustomer() {
      try {
        const response = await axios.post('/api/customers', this.newCustomer);
        this.customers.push(response.data);
        this.newCustomer = { name: '', email: '', phone: '', address: '' };
      } catch (error) {
        console.error('Error adding customer:', error);
      }
    },
    async deleteCustomer(id) {
      try {
        await axios.delete(`/api/customers/${id}`);
        this.customers = this.customers.filter(customer => customer._id !== id);
      } catch (error) {
        console.error('Error deleting customer:', error);
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
    async addProduct() {
      try {
        const response = await axios.post('/api/products', this.newProduct);
        this.products.push(response.data);
        this.newProduct = { name: '', description: '', price: 0, stock: 0 };
      } catch (error) {
        console.error('Error adding product:', error);
      }
    },
    async deleteProduct(id) {
      try {
        await axios.delete(`/api/products/${id}`);
        this.products = this.products.filter(product => product._id !== id);
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    },
    async fetchLeads() {
      try {
        const response = await axios.get('/api/leads');
        this.leads = response.data;
      } catch (error) {
        console.error('Error fetching leads:', error);
      }
    },
    async addLead() {
      try {
        if (this.editingLead) {
            await axios.put(`/api/leads/${this.editingLead._id}`, this.newLead);
            this.editingLead = null;
          } else {
            await axios.post('/api/leads', this.newLead);
          }
          this.newLead = { name: '', email: '', phone: '', company: '', status: 'New' };
          this.fetchLeads();
          // If a lead is qualified, a new opportunity is created on the backend.
          // Refresh opportunities to show the newly created one.
          if (this.newLead.status === 'Qualified') {
            this.fetchOpportunities();
          }
      } catch (error) {
        console.error('Error saving lead:', error);
      }
    },
    async deleteLead(id) {
      if (confirm('Are you sure you want to delete this lead?')) {
        try {
          await axios.delete(`/api/leads/${id}`);
          this.fetchLeads();
        } catch (error) {
          console.error('Error deleting lead:', error);
        }
      }
    },
    editLead(lead) {
      this.editingLead = { ...lead };
      this.newLead = { ...lead };
    },
    cancelEditLead() {
      this.editingLead = null;
      this.newLead = {
        name: '',
        email: '',
        phone: '',
        company: '',
        status: 'New'
      };
    },
    async fetchOpportunities() {
      try {
        const response = await axios.get('/api/opportunities');
        this.opportunities = response.data;
      } catch (error) {
        console.error('Error fetching opportunities:', error);
      }
    },
    async addOpportunity() {
      try {
        const response = await axios.post('/api/opportunities', this.newOpportunity);
        this.opportunities.push(response.data);
        this.newOpportunity = { name: '', customer: '', amount: 0, stage: 'Qualification', expectedCloseDate: '' };
      } catch (error) {
        console.error('Error adding opportunity:', error);
      }
    },
    async deleteOpportunity(id) {
      try {
        await axios.delete(`/api/opportunities/${id}`);
        this.opportunities = this.opportunities.filter(opportunity => opportunity._id !== id);
      } catch (error) {
        console.error('Error deleting opportunity:', error);
      }
    },
    addProductToOrder() {
      this.newOrder.products.push({ product: '', quantity: 1 });
    },
    removeProductFromOrder(index) {
      this.newOrder.products.splice(index, 1);
    },
    async fetchOrders() {
      try {
        const response = await axios.get('/api/orders');
        this.orders = response.data;
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    },
    async addOrder() {
      try {
        const response = await axios.post('/api/orders', this.newOrder);
        this.orders.push(response.data);
        this.newOrder = { customer: '', products: [], totalAmount: 0, status: 'Pending' };
      } catch (error) {
        console.error('Error adding order:', error);
      }
    },
    async deleteOrder(id) {
      try {
        await axios.delete(`/api/orders/${id}`);
        this.orders = this.orders.filter(order => order._id !== id);
      } catch (error) {
        console.error('Error deleting order:', error);
      }
    },
    async fetchBillings() {
      try {
        const response = await axios.get('/api/billings');
        this.billings = response.data;
      } catch (error) {
        console.error('Error fetching billings:', error);
      }
    },
    async addBilling() {
      try {
        const response = await axios.post('/api/billings', this.newBilling);
        this.billings.push(response.data);
        this.newBilling = { customer: '', order: '', amount: 0, billingDate: new Date().toISOString().slice(0, 10), status: 'Pending' };
      } catch (error) {
        console.error('Error adding billing:', error);
      }
    },
    async deleteBilling(id) {
      try {
        await axios.delete(`/api/billings/${id}`);
        this.billings = this.billings.filter(billing => billing._id !== id);
      } catch (error) {
        console.error('Error deleting billing:', error);
      }
    },
    async fetchInvoices() {
      try {
        const response = await axios.get('/api/invoices');
        this.invoices = response.data;
      } catch (error) {
        console.error('Error fetching invoices:', error);
      }
    },
    async addInvoice() {
      try {
        const response = await axios.post('/api/invoices', this.newInvoice);
        this.invoices.push(response.data);
        this.newInvoice = { customer: '', order: '', amount: 0, invoiceDate: '', status: 'Pending' };
      } catch (error) {
        console.error('Error adding invoice:', error);
      }
    },
    async deleteInvoice(id) {
      try {
        await axios.delete(`/api/invoices/${id}`);
        this.invoices = this.invoices.filter(invoice => invoice._id !== id);
      } catch (error) {
        console.error('Error deleting invoice:', error);
      }
    }
  }
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

form {
  margin-bottom: 20px;
}

input {
  margin-right: 10px;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

button {
  padding: 8px 15px;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #369f6f;
}

ul {
  list-style: none;
  padding: 0;
}

li {
  background-color: #f9f9f9;
  border: 1px solid #eee;
  padding: 10px;
  margin-bottom: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
