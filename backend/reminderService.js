const Event = require('./models/Event');

const checkReminders = async () => {
  try {
    const now = new Date();
    const events = await Event.find({ completed: false });

    for (const event of events) {
      for (const reminder of event.reminders) {
        const eventDateTime = new Date(event.date);
        const [hours, minutes] = event.time.split(':').map(Number);
        eventDateTime.setHours(hours, minutes, 0, 0);

        const reminderTime = new Date(eventDateTime.getTime() - reminder.timeBefore * 60 * 1000);

        if (now >= reminderTime && now < eventDateTime) {
          // This is where you would integrate with an actual email/message service
          console.log(`Sending ${reminder.method} reminder for event: ${event.description} at ${event.time} on ${event.date.toDateString()}`);
          console.log(`Reminder details: ${reminder.timeBefore} minutes before via ${reminder.method}`);
          // For now, we'll just log it. In a real app, you'd send an email or message.

          // To prevent sending the same reminder multiple times, you might want to
          // add a 'reminded' flag to the reminder object or event itself.
          // For simplicity, we'll assume it's sent once per check if criteria met.
          // A more robust solution would involve tracking sent reminders.
        }
      }
    }
  } catch (error) {
    console.error('Error checking reminders:', error);
  }
};

module.exports = checkReminders;