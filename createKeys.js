let fs = require('fs')
let user = process.env.GITHUB_USER || 'No GITHUB_USER env var plz check'
let token = process.env.GITHUB_TOKEN || 'No GITHUB_TOKEN env var plz check'
if(!user) throw Error('Could not find GITHUB_USER in environment variables')
if(!token) throw Error('Could not find GITHUB_TOKEN in environment variables')

console.log({user, token})
fs.writeFileSync('./src/keys.json', JSON.stringify({user, token}))
