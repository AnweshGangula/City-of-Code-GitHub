// GRAPHQL (GitHub API v4 and after)
// Reference:  https://stackoverflow.com/a/59042992/6908282

async function getContributions(username) {
    const response = await fetch(`/github?user=${username}`)
    const data = await response.json()
    return data;
}

export default getContributions;
