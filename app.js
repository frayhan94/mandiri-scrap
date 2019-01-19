// Handling if no HTML found inside transaction table we should ingnore
// Handling if no internet connection or 504
const CronJob = require('cron').CronJob;
const scrapping = require('./controller/scrapping');
const job = new CronJob({
    //runs every monday
    cronTime: '*/1 * * * *',
    onTick: function () {
        (scrapping)();
    },
    start: false,
    timeZone: 'Asia/Jakarta'
});
job.start();

