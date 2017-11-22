if(!process.env.CI) process.exit(0)
let fs = require('fs')
let user = process.env.GITHUB_USER || 'No GITHUB_USER env var'
let token = process.env.GITHUB_TOKEN || 'No GITHUB_TOKEN env var'

if(!user) throw Error('Could not find GITHUB_USER in environment variables')
if(!token) throw Error('Could not find GITHUB_TOKEN in environment variables')

fs.writeFileSync('./src/keys.json', JSON.stringify({user, token}))
