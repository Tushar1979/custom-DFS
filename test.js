const AWS = require('aws-sdk');

const request = require('request-promise');

const dateFormat = require('dateformat');

var lambda = new AWS.Lambda();


exports.handler = function(event, context, callback) {

    console.log(event)

    let userId;

    let sport;

    if (event.data && event.data.user) {
        userId = event.data.user.id;
    } else {
        userId = 'Master';
    }

    if (event.data && event.data.sportView) {
        sport = event.data.sportView;
    } else {
        sport = 'NBA';
    }

    const documentClient = new AWS.DynamoDB.DocumentClient();

    // const baseUrl = sport === "NBA" ? "https://api.sportsdata.io/v3/nba/scores/json/GamesByDate/" : "https://api.sportsdata.io/v3/nfl/scores/json/Schedules/";

    const baseUrl = "https://api.sportsdata.io/v3/nba/scores/json/GamesByDate/";

    // const apiKey = sport === "NBA" ? "902fc17180634fce8063d61ac5803d6a" : "8eb7405b4ccc48d6846227a3546afac0";

    // const apiKey = sport === "NBA" ? "81f0d2fdc22a48b29ccd20dec906d99a" : "8eb7405b4ccc48d6846227a3546afac0";

    //const apiKey = "81f0d2fdc22a48b29ccd20dec906d99a";  This key is a trial key for NBA limited to 1000 API calls monthly

    const apiKey = "389a99f75cc44ebebe50d2496400f19e";  //This key is for NBA and NFL and allows up to 100k API calls monthly

    let currentDate = new Date();

    console.log(`Current Date: ${currentDate}`);

    let currentTime = currentDate.getHours();

    // i.e. New Day to Pull Data
    if (currentTime >= 7) {

    } else {
        // i.e. Has passed
    }

    console.log(`Current Time: ${currentTime}`);

    dateFormat.masks.sportsdata = 'yyyy-mmm-dd';

    let customDate = dateFormat(currentDate, "sportsdata").toUpperCase();

    console.log(`Custom Date: ${customDate}`);

    const date = "2021-OCT-19"

    const selectGameDate = (url1, url2, date) => {
        let newUrl;

        newUrl = url1 + date + "?key=" + url2;

        // if (sport === 'NBA') {

        // } else if (sport === 'NFL') {
        //   newUrl = url1 + "2020" + "?key=" + url2;
        // }

        return newUrl;
    };

    const apiUrl = selectGameDate(baseUrl, apiKey, date);

    const options = {
        method: 'GET',
        uri: apiUrl,
        json: true
    };

    request(options)
        .then(function (data) {

            console.log(`Data: ${JSON.stringify(data)}`);

            // Player Stats Payload from Sportsdataio
            let playerStatsPayload = data;

            // Array of playerStats to push to batchWriteItem
            let playerStatsArray = [];

            // Building the batches

            // Overall Batch Array
            let batches = [];

            // Current Batch Array
            let current_batch = [];

            // Iteration count
            let item_count = 0;

            let batch_count = 0;


            // For each player stat..
            playerStatsPayload.forEach(element => {

                // Build Id field from StatID
                element.Id = sport === "NBA" ? element.GameID.toString() : element.GameKey.toString();

                if (element.DraftKingsSalary === null) {
                    element.DraftKingsSalary = 0
                }

                // Build item for batchWrite request
                var item = {
                    PutRequest: {
                        Item: element
                    }
                };

                // If an item exists then iterate item count and push to current_batch
                if (item) {
                    item_count++;
                    current_batch.push(item);
                }

                // If item count is 25 then we need to push batch to the batches array and reset the current batch
                if (item_count % 25 === 0) {
                    batches.push(current_batch);
                    current_batch = [];
                    batch_count++;
                }
            });

            // Add remaining batch to the batches array for processing
            if (current_batch.length > 0 && current_batch.length !== 25) {
                batches.push(current_batch);
            }

            // Handler for DB Operations
            let completed_requests = 0;
            let errors = false;


            batches.forEach(element => {

                batch_count--;

                // const tableName = sport === "NBA" ? `${userId}-GameData` : `NFL-${userId}-GameData`;

                const tableName = `${userId}-GameData`;

                console.log(`Table Name: ${tableName}`);

                let response = {
                    statusCode: 200,
                    headers: {
                        "Access-Control-Allow-Origin": "*",
                        "Content-Type": "application/json",
                        "Access-Control-Allow-Credentials" : true,
                        "Access-Control-Allow-Headers": "Content-Type,X-Amz-Date,X-Amz-Security-Token,Authorization,X-Api-Key,X-Requested-With,Accept,Access-Control-Allow-Methods,Access-Control-Allow-Origin,Access-Control-Allow-Headers",
                        "Access-Control-Allow-Methods": "DELETE,GET,HEAD,OPTIONS,PATCH,POST,PUT",
                        "X-Requested-With": "*"
                    },
                    body: {}
                }

                if (element.length <= 0 && element.length > 25) {
                    callback(null, response);
                }

                console.log(`Element: ${element}`);

                var params = {
                    RequestItems: {
                        [tableName] : element
                    }
                }

                documentClient.batchWrite(params, function (err, data) {
                    completed_requests++;

                    if (err) {
                        console.log(err);
                        callback(err, null);
                    }



                    console.log(`Completed Req: ${completed_requests}`);
                    console.log(`Batches.Length: ${batches.length}`);

                    if (completed_requests === batches.length) {

                        const nflBaseUrl = "https://api.sportsdata.io/v3/nfl/scores/json/Schedules/";

                        const week = 6;

                        //const nflApiKey = "ccf59ea993654809a7bcc29abe40e6ec";
                        const nflApiKey = "389a99f75cc44ebebe50d2496400f19e";

                        const nflSelectGameDate = (url1, url2, date) => {
                            let newUrl;

                            newUrl = url1 + "2021" + "?key=" + url2;
                            //newUrl = url1 + "2020POST" + "?key=" + url2;

                            // if (sport === 'NBA') {
                            // newUrl = url1 + date + "?key=" + url2;
                            // } else if (sport === 'NFL') {
                            //   newUrl = url1 + "2020/1" + "?key=" + url2;
                            // }

                            return newUrl;
                        };

                        const nflApiUrl = nflSelectGameDate(nflBaseUrl, nflApiKey, date);

                        const nflOptions = {
                            method: 'GET',
                            uri: nflApiUrl,
                            json: true
                        };

                        request(nflOptions)
                            .then(function(nflData) {

                                // Player Stats Payload from Sportsdataio
                                let nflPlayerStatsPayload = nflData.filter(item => item.Week === week);

                                // Array of playerStats to push to batchWriteItem
                                let nflPlayerStatsArray = [];

                                // Building the batches

                                // Overall Batch Array
                                let nflBatches = [];

                                // Current Batch Array
                                let nfl_current_batch = [];

                                // Iteration count
                                let nfl_item_count = 0;

                                let nfl_batch_count = 0;

                                nflPlayerStatsPayload.forEach(element => {

                                    console.log(`Element: ${JSON.stringify(element)}`);

                                    element.Id = element.GameKey !== null ? element.GameKey.toString() : `123-${userId}`;

                                    if (element.DraftKingsSalary === null) {
                                        element.DraftKingsSalary = 0
                                    }

                                    // Build item for batchWrite request
                                    //var nflItem = {
                                    //  PutRequest: {
                                    //      Item: element
                                    //  }
                                    //};

                                    // Build item for batchWrite request - JT modification 10/3/2020
                                    if (element.GameKey !== null && element.Status == 'Scheduled') {
                                        var nflItem = {
                                            PutRequest: {
                                                Item: element
                                            }
                                        };
                                    }

                                    // If an item exists then iterate item count and push to current_batch
                                    if (nflItem) {
                                        nfl_item_count++;
                                        nfl_current_batch.push(nflItem);
                                    }

                                    // If item count is 25 then we need to push batch to the batches array and reset the current batch
                                    if (nfl_item_count % 25 === 0) {
                                        nflBatches.push(nfl_current_batch);
                                        nfl_current_batch = [];
                                        nfl_batch_count++;
                                    }
                                });

                                // Add remaining batch to the batches array for processing
                                if (nfl_current_batch.length > 0 && nfl_current_batch.length !== 25) {
                                    nflBatches.push(nfl_current_batch);
                                }

                                // Handler for DB Operations
                                let nfl_completed_requests = 0;
                                let nfl_errors = false;

                                nflBatches.forEach(element => {
                                    nfl_batch_count--;

                                    const nflTableName = `NFL-${userId}-GameData`;

                                    console.log(`NFL Table Name: ${nflTableName}`);

                                    if (element.length > 0 && element.length <= 25) {
                                        var nflParams = {
                                            RequestItems: {
                                                [nflTableName] : element
                                            }
                                        };

                                        documentClient.batchWrite(nflParams, function(err2, data2) {
                                            nfl_completed_requests++;

                                            if (err2) {
                                                console.log(err2);
                                                callback(err, null);
                                            }

                                            console.log(`NFL Completed Req: ${nfl_completed_requests}`);
                                            console.log(`NFL Batches.Length: ${nflBatches.length}`);

                                            if (nfl_completed_requests === nflBatches.length) {

                                                callback(null, response); // FINAL CALLBACK
                                            }
                                        })
                                    }
                                })
                            })

                        callback(null, response);
                    }

                })
            });



            return;
        })
        .catch(function (err) {
            console.error(`Operation Error: ${err}`);
            return;
        })
}
