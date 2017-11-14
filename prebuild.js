if(!process.env.CI) process.exit(0)
let fs = require('fs')
let user = process.env.GITHUB_USER
let token = process.env.GITHUB_TOKEN

if(!user) throw Error('Could not find GITHUB_USER in environment variables')
if(!token) throw Error('Could not find GITHUB_TOKEN in environment variables')

fs.writeFileSync('./src/keys.json', JSON.stringify({user, token}))
