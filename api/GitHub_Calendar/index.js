//Reference:  https://docs.microsoft.com/en-us/azure/azure-functions/functions-create-function-app-portal
// SWA + Azure Functions: https://www.youtube.com/watch?v=LHpxrAR8dHA

const fetch = require("node-fetch");

module.exports = async function (context, req) {
    // API query parameters: https://www.youtube.com/watch?v=xq34NS4S59o&list=PLpcSpRrAaOargYaCNYxZCiFIp9YTqEl-l&index=18&t=8m
    // console.log(request.query)
    const usereid = req.query.user
    const headers = {
        Authorization: `bearer ${process.env.GH_TOKEN}`
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
    const ghData = await fetch_response.json();
    const ghResponse = `GitHub Data for user "${ghData.data.user.name}" retrieved successfully`
    // // console.log(ghData.data.user.name)
    context.log(ghResponse);
    // response.json(ghData);

    context.res = {
        // status: 200, /* Defaults to 200 */
        body: ghData,
        headers: {
            'Content-Type': 'application/json'
        }
    };

    // context.log('JavaScript HTTP trigger function processed a request.');

    // const name = (req.query.name || (req.body && req.body.name));
    // const responseMessage = name
    //     ? "Hello, " + name + ". This HTTP triggered function executed successfully."
    //     : "This HTTP triggered function executed successfully. Pass a name in the query string or in the request body for a personalized response.";


    // context.res = {
    //     // status: 200, /* Defaults to 200 */
    //     body: responseMessage
    // };
}