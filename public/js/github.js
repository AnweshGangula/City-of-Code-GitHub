// GRAPHQL (GitHub API v4 and after)
// Reference:  https://stackoverflow.com/a/59042992/6908282
const username = "AnweshGangula"

async function getContributions() {
  const response = await fetch(`/github/${username}`)
  const data = await response.json()
  return data;
}

const ghData = await getContributions()

export default ghData;