const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const fs = require("fs");

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
app.use(express.static('website'));

const port = 8000;
app.listen(port, function() {
    console.log("server running");
    console.log(`listening from port ${port}`);
});


// const express = require("express");
// const cors = require("cors");
// const bodyParser = require("body-parser");
// const fs = require("fs");


// const app = express();


// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParser.json());

// app.use(cors());

// app.use(express.static('website'));


// const port = 8000;
// app.listen(port, function() {
//     console.log("server running");
//     console.log(`listening from port ${port}`);
// });


let cities;
fs.readFile("website/data/citiesModified.json", "utf8", function(err, data) {
    cities = JSON.parse(data);
    console.log(cities);
})

app.get("/search-suggest/:city", function(req, res) {
    searchExpression = req.params.city;
    const filteredCities = cities.filter((city) => {
        if (city.toLowerCase().indexOf(searchExpression.toLowerCase()) !== -1) {
            return true
        };
    });
    res.send(filteredCities);
})