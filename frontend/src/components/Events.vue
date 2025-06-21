<template>
  <div>
    <h2>Events</h2>
    <form @submit.prevent="addEvent">
      <select v-model="newEvent.type" required>
        <option disabled value="">Select Event Type</option>
        <option value="Call">Call</option>
        <option value="Email">Email</option>
        <option value="Meeting">Meeting</option>
        <option value="Task">Task</option>
      </select>
      <input type="text" v-model="newEvent.description" placeholder="Description" required>
      <input type="date" v-model="newEvent.date" required>
      <input type="time" v-model="newEvent.time" required>
      
      <select v-model="newEvent.relatedToModel">
        <option disabled value="">Select Related To Type</option>
        <option value="Customer">Customer</option>
        <option value="Lead">Lead</option>
        <option value="Opportunity">Opportunity</option>
        <option value="Quote">Quote</option>
        <option value="Order">Order</option>
      </select>

      <select v-if="newEvent.relatedToModel === 'Customer'" v-model="newEvent.relatedTo">
        <option disabled value="">Select Customer</option>
        <option v-for="item in customers" :key="item._id" :value="item._id">{{ item.name }}</option>
      </select>
      <select v-else-if="newEvent.relatedToModel === 'Lead'" v-model="newEvent.relatedTo">
        <option disabled value="">Select Lead</option>
        <option v-for="item in leads" :key="item._id" :value="item._id">{{ item.name }}</option>
      </select>
      <select v-else-if="newEvent.relatedToModel === 'Opportunity'" v-model="newEvent.relatedTo">
        <option disabled value="">Select Opportunity</option>
        <option v-for="item in opportunities" :key="item._id" :value="item._id">{{ item.name }}</option>
      </select>
      <select v-else-if="newEvent.relatedToModel === 'Quote'" v-model="newEvent.relatedTo">
        <option disabled value="">Select Quote</option>
        <option v-for="item in quotes" :key="item._id" :value="item._id">Quote #{{ item._id }}</option>
      </select>
      <select v-else-if="newEvent.relatedToModel === 'Order'" v-model="newEvent.relatedTo">
        <option disabled value="">Select Order</option>
        <option v-for="item in orders" :key="item._id" :value="item._id">Order #{{ item._id }}</option>
      </select>

      <div>
        <h3>Reminders</h3>
        <div v-for="(reminder, index) in newEvent.reminders" :key="index">
          <select v-model="reminder.method">
            <option value="email">Email</option>
            <option value="message">Message</option>
          </select>
          <input type="number" v-model="reminder.timeBefore" placeholder="Minutes before" required>
          <button type="button" @click="removeReminder(index)">Remove</button>
        </div>
        <button type="button" @click="addReminder">Add Reminder</button>
      </div>

      <button type="submit">{{ editingEvent ? 'Update Event' : 'Add Event' }}</button>
      <button type="button" v-if="editingEvent" @click="resetNewEvent">Cancel Edit</button>
    </form>

    <ul>
      <li v-for="event in events" :key="event._id">
        {{ event.type }}: {{ event.description }} on {{ new Date(event.date).toLocaleDateString() }} at {{ event.time }}
        <span v-if="event.relatedTo"> (Related to: {{ event.relatedToModel }}: {{ event.relatedTo.name || event.relatedTo._id }})</span>
        <span v-if="event.reminders && event.reminders.length > 0"> (Reminders: {{ event.reminders.map(r => `${r.timeBefore}min before via ${r.method}`).join(', ') }})</span>
        <button @click="editEvent(event)">Edit</button>
        <button @click="deleteEvent(event._id)">Delete</button>
      </li>
    </ul>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'Events',
  data() {
    return {
      events: [],
      customers: [],
      leads: [],
      opportunities: [],
      quotes: [],
      orders: [],
      newEvent: {
        type: '',
        description: '',
        date: '',
        time: '',
        relatedTo: null,
        relatedToModel: '',
        reminders: [],
        completed: false,
      },
      editingEvent: null, // New property to hold the event being edited
    };
  },
  created() {
    this.fetchEvents();
    this.fetchRelatedData();
  },
  methods: {
    async fetchEvents() {
      try {
        const response = await axios.get('/api/events');
        this.events = response.data;
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    },
    async fetchRelatedData() {
      try {
        const [customersRes, leadsRes, opportunitiesRes, quotesRes, ordersRes] = await Promise.all([
          axios.get('/api/customers'),
          axios.get('/api/leads'),
          axios.get('/api/opportunities'),
          axios.get('/api/quotes'),
          axios.get('/api/orders'),
        ]);
        this.customers = customersRes.data;
        this.leads = leadsRes.data;
        this.opportunities = opportunitiesRes.data;
        this.quotes = quotesRes.data;
        this.orders = ordersRes.data;
      } catch (error) {
        console.error('Error fetching related data:', error);
      }
    },
    async addEvent() {
      try {
        if (this.editingEvent) {
          await axios.patch(`/api/events/${this.editingEvent._id}`, this.newEvent);
          this.editingEvent = null;
        } else {
          await axios.post('/api/events', this.newEvent);
        }
        this.resetNewEvent();
        this.fetchEvents();
      } catch (error) {
        console.error('Error adding/updating event:', error);
      }
    },
    editEvent(event) {
      this.editingEvent = event;
      this.newEvent = { ...event, date: event.date.substring(0, 10) }; // Format date for input type="date"
    },
    async deleteEvent(id) {
      try {
        await axios.delete(`/api/events/${id}`);
        this.fetchEvents();
      } catch (error) {
        console.error('Error deleting event:', error);
      }
    },
    addReminder() {
      this.newEvent.reminders.push({ method: 'email', timeBefore: 15 });
    },
    removeReminder(index) {
      this.newEvent.reminders.splice(index, 1);
    },
    resetNewEvent() {
      this.newEvent = {
        type: '',
        description: '',
        date: '',
        time: '',
        relatedTo: null,
        relatedToModel: '',
        reminders: [],
        completed: false,
      };
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