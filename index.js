const express = require("express");
const fetch = require("node-fetch");
require('dotenv').config();

const app = express();
const server = app.listen(3000, () =>
    console.log("Starting server at :" + server.address().port)
);
app.use(express.static("public"));
app.use(express.json({ limit: "1mb" }));

//  Run Server side code and pass data to client: https://www.youtube.com/watch?v=ZtLVbJk7KcM&list=PLRqwX-V7Uu6YxDKpFzf_2D84p0cyk4T7X&index=17
const tokenAG = process.env.GH_TOKEN;

app.get('/github', async function (request, response) {
    // console.log(request.query)
    const usereid = request.query.user
    const headers = {
        Authorization: `bearer ${tokenAG}`
    };
    const body = {
        query: `query {
                user(login: "${usereid}") {
                  name
                  contributionsCollection {
                    contributionCalendar {
                      colors
                      totalContributions
                      weeks {
                        contributionDays {
                          color
                          contributionCount
                          date
                          weekday
                        }
                        firstDay
                      }
                    }
                  }
                }
              }`
    };
    const fetch_response = await fetch("https://api.github.com/graphql", {
        method: "POST",
        body: JSON.stringify(body),
        headers: headers
    });
    const data = await fetch_response.json();
    // console.log(data.data.user.contributionsCollection.contributionCalendar.totalContributions)
    response.json(data);
});
