// Handling if no HTML found inside transaction table we should ingnore
// Handling if no internet connection or 504
const CronJob = require('cron').CronJob;
const scrapping = require('./controller/scrapping');
const job = new CronJob({
    //runs every monday
    cronTime: '*/1 * * * *',
    onTick: function () {
        (async () => {
            try {
                const now = moment().format("YYYY-MM-DD HH:mm:ss");
                console.log(`Start Scrapping Mandiri Internet Banking Mutation ${now}`);
                /******************************LAUNCH MAIN PAGE********************/
                    // Start headless browser
                let browserConfig = {
                        args: ['--no-sandbox', '--disable-setuid-sandbox'],
                        executablePath: '/usr/bin/chromium-browser'
                    };

                if (config.get('NODE_ENV') === 'development') {
                    browserConfig = {
                        headless: true
                    };
                }
                const browser = await puppeteer.launch(browserConfig);
                const page = await browser
                    .newPage()
                    .catch((e) => {
                        console.log("Error define new page");
                    });
                // Go to main page
                await page
                    .goto(mandiriInternetUrl, {waitUntil: 'networkidle2'})
                    .catch((e) => {
                        console.log("Error opening page");
                        console.log(e);
                    });

                const mainFrame = page.frames().find(
                    frame => frame.name() === 'mainFrame'
                );
                /**************************************************************/

                /******************************TYPING USERNAME PASSWORD AND CLICK LOGIN BUTTON********************/
                console.log("Begin typing username and password");
                const userName = await mainFrame
                    .$("input#userid_sebenarnya")
                    .catch((e) => {
                        console.log("Error getting on username");
                        console.log(e);
                    });
                await userName
                    .type(mandiriUsername)
                    .catch((e) => {
                        console.log("Error typing username");
                        console.log(e);
                    });
                const password = await mainFrame
                    .$("input#pwd_sebenarnya")
                    .catch((e) => {
                        console.log("Error getting on password");
                        console.log(e);
                    });
                await password
                    .type(mandiripassword)
                    .catch((e) => {
                        console.log("Error typing password");
                        console.log(e);
                    });
                const login = await mainFrame
                    .$("button#btnSubmit")
                    .catch((e) => {
                        console.log("Error getting on button submit");
                        console.log(e);
                    });


                await login
                    .click()
                    .catch((e) => {
                        console.log("Error clicking button submit");
                        console.log(e);
                    });

                //await page.screenshot({path: 'mandiri_before_login.png'});
                console.log("Successfully type username and password and hit login button");
                /*****************************************************************************************/

                await page.waitFor(7000);

                /******************************TAKE SCREENSHOOT AFTER LOGIN PAGE************************/

                //await page.screenshot({path: 'mandiri_success_login.png'});
                /*****************************************************************************/

                await page.waitFor(10000);

                /******************************MODAL ACTION ACCOUNT****************************/
                const dropdown = await mainFrame.$("div.dropdown").catch((e) => {
                    console.log("No selector found for dropdown list transaction");
                    console.log(e);
                });
                console.log("Begin clicking dropdown to see modal action account");
                await dropdown
                    .click()
                    .catch((e) => {
                        console.log("Error clicking dropdown for list transaction");
                        console.log(e);
                    });

                console.log("Successfully clicking dropdown to see modal action account");
                /****************************************************************************/


                await page.waitFor(7000);

                /********************************TRANSACTION HISTORY***************************/
                console.log("Begin clicking link to see transaction history");
                const transactionLink = await mainFrame
                    .$("ul.dropdown-menu.dropdown-accounts li:first-child a")
                    .catch((e) => {
                        console.log("No selector found for list transaction link");
                        console.log(e);
                    });
                transactionLink
                    .click()
                    .catch((e) => {
                        console.log("Error clicking transaction link");
                        console.log(e);
                    });

                await page.waitFor(10000);
                //await page.screenshot({path: 'mandiri_transaction_view.png'});
                console.log("Successfully clicking link to see transaction history");
                /****************************************************************************/

                /********************************SAVE TRANSACTION HISTORY***************************/
                const data = await mainFrame.evaluate(() => {
                    const tds = Array.from(document.querySelectorAll('table#globalTable tbody tr td'));
                    return tds.map(td => td.textContent.trim())
                });

                const dataLength = data.length;
                for (let i = 0; i < dataLength; i++) {
                    if (i === 0 || (i % 4) === 0) {
                        const reference = data[i + 1];
                        const credit = data[i + 3];
                        mutation.findOne({
                                where: {
                                    reference: reference
                                },
                                order: [['id', 'DESC']]
                            }
                        ).then(async mutationData => {
                            if (mutationData === null) {
                                if (credit !== '-') {
                                    const headerOptions = {
                                        'Content-Type': 'application/json'
                                    };
                                    let creditNoComma = credit.replace(/,/g, '');
                                    creditNoComma = parseFloat(creditNoComma);
                                    let payload = {
                                        "bankCode": "MANDIRI",
                                        "nominal": creditNoComma,
                                        "RefNo": reference
                                    };
                                    const requestConfig = {
                                        method: 'POST',
                                        uri: `${config.get('TOPUP_SERVICE')}unique-code/update-status-code`,
                                        headers: headerOptions,
                                        body: payload,
                                        json: true
                                    };
                                    // Send to payment code service
                                    await request(requestConfig);
                                }
                                // Send to payment code service
                                await mutation.create({
                                    date: data[i],
                                    reference: reference,
                                    debit: data[i + 2],
                                    credit: credit
                                }).then(() => {
                                    console.log("Success save to Mandiri mutation")
                                }).catch((e) => {
                                    console.log(e);
                                    console.log("Error save to Mandiri mutation")
                                });
                            }
                        });
                    }
                }
                /**********************************************************************************/

                /********************************LOGOUT***************************/
                const showLogoutButton = await mainFrame.$("div#nav-logout a").catch((e) => {
                    console.log("No selector found fo logout button shower");
                    console.log(e);
                });

                await showLogoutButton
                    .click()
                    .catch((e) => {
                        console.log("Error clicking logout button shower");
                        console.log(e);
                    });

                await page.waitFor(10000);

                const logoutButton = await mainFrame.$("a#btnCancelReg").catch((e) => {
                    console.log("No selector found for logout button");
                    console.log(e);
                });

                await logoutButton
                    .click()
                    .catch((e) => {
                        console.log("Error clicking logout button");
                        console.log(e);
                    });

                await page.waitFor(10000);
                //await page.screenshot({path: 'mandiri_after_logout.png'});
                console.log('Successfully logout from Mandiri Internet Banking');
                /***********************************************************/
                console.log('Done Scrapping Mandiri Mutation');
                await browser.close();
            } catch (e) {
                console.log("Inside error");
                console.log(e);
            }
        })();
    },
    start: false,
    runOnInit: true,
    timeZone: 'Asia/Jakarta'
});
job.start();

