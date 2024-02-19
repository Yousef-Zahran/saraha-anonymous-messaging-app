const schedule = require('node-schedule');
const userModel = require('../models/userModel');

const deleteUnconfirmedAccounts = () => {
    // Runs at midnight on the first day of every month
    schedule.scheduleJob('0 0 1 * *', async function() {
        try {
            // Find unconfirmed accounts older than 30 days
            const unconfirmedAccounts = await userModel.deleteMany({
                isConfirmed: false,
                createdAt: { $lte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } // Older than 30 days
            });

            console.log(`Deleted ${unconfirmedAccounts.deletedCount} unconfirmed accounts.`);
        } catch (error) {
            console.error('Error deleting unconfirmed accounts:', error);
        }
    });
};

module.exports = deleteUnconfirmedAccounts;