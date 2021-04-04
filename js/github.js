// GRAPHQL (GitHub API v4 and after)
// Reference:  https://stackoverflow.com/a/59042992/6908282
console.log(process.env.GITHUB_GRAPHQL_URL)
const tokenAG = process.env.GH_TOKEN
// secure (apparently not entirely secure) above token using secrets in GH-Pages https://stackoverflow.com/questions/53648652/how-to-use-environment-variables-in-github-page
const username = "AnweshGangula"

async function getContributions(tkn, uname) {
  const headers = {
    'Authorization': `bearer ${tkn}`,
  }
  const body = {
    "query": `query {
                user(login: "${uname}") {
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
  }
  const response = await fetch('https://api.github.com/graphql', { method: 'POST', body: JSON.stringify(body), headers: headers })
  const data = await response.json()
  return data
}

const ghData = await getContributions(tokenAG, username)

const root = document.querySelector('#root');
root.innerHTML = `<a href= https://github.com/${username} >Name: ${ghData.data.user.name} </a> <p>Total Contributions : ${ghData.data.user.contributionsCollection.contributionCalendar.totalContributions} </p>`


// REST API (GitHub API v3 and before)

// const ghData = await ghFetch('https://api.github.com/users/AnweshGangula')
// console.log(ghData)

// const root = document.querySelector('#root');
// root.innerHTML = `<a href= ${ghData.html_url} >Name: ${ghData.name} </a> <p>Followers : ${ghData.followers} </p>`


// async function ghFetch(url) {
//     const ghFetch = await fetch('https://api.github.com/users/AnweshGangula', {
//         headers: {
//             'Accept': 'application/vnd.github.v3+json'
//         }
//     })
//     const ghResponse = await ghFetch.json()

//     return ghResponse
// }

export default ghData;
