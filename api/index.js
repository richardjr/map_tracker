const serverless = require('serverless-http');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const cors = require('cors');

const mt_spot_tracker = require('./mt_spot_tracker.js');

global_config = {

    ng_endpoint : 'https://dev-api3.nautoguide.com/devrds/v2/api',
    ng_token    : 'QW123RT6Y',
    schema : 'adventuresyndicate',
    app : 'map_tracker'
};

app.use(cors());

app.use(bodyParser.json({ strict: false }));

app.get('/', function (req, res) {
    res.send('TRACKER ENABLED');
});

app.get('/track', function(req,res) {

    console.log('************* TRACK *********');

    // Firstly retrieve a list of tracker IDs that we are going to update

    let trackers = mt_spot_tracker.tracker_list();

    for(var i in trackers) {

        let update = mt_spot_tracker.update_tracker(trackers[i]);
    }


    res.json({'track' : "worked"});
});

module.exports.handler = serverless(app);