import React, { Component } from 'react'
import './App.css';
import { BarChart, Bar, XAxis, YAxis } from 'recharts';
import keys from './keys.json' // Keys are being fetched from local file keys.json

// Auth
const USER = keys.user
const TOKEN = keys.token

if(!USER) throw Error('Could not find GITHUB_USER in keys.json') //Goto: See README for instructions on how to obtain your token
if(!TOKEN) throw Error('Could not find GITHUB_TOKEN in keys.json') //Goto: See README for instructions on how to obtain your token
console.log(USER, TOKEN)
const AUTH = btoa(`${USER}:${TOKEN}`)
const HEADER = {Accept: 'application/json', 'Content-Type': 'application/json', Authorization: `Basic ${AUTH}`}
const OPTIONS = {method: "GET", headers: HEADER}

const GIT_URL = '/github' //'https://api.github.com'
const CALL = '/stats/participation'
const COMPANIES = [
  {name: 'Angular', url: '/repos/angular/angular.js'},
  {name: 'Linux', url: '/repos/torvalds/linux'},
  {name: 'React', url: '/repos/facebook/react'},
  {name: 'React Native', url: '/repos/facebook/react-native'},
  {name: 'VLC', url: '/repos/videolan/vlc'},
  {name: 'Bootstrap', url: '/repos/twbs/bootstrap'},
  {name: 'NodeJS', url: '/repos/nodejs/node'},
  {name: 'Atom', url: '/repos/atom/atom'},
  {name: 'VS Code', url: '/repos/Microsoft/vscode'},
  {name: 'TensorFlow', url: '/repos/tensorflow/tensorflow'},
  {name: 'Veckopengen', url: '/repos/gimi-org/gimi-app'}
]

class App extends Component {
  state = {stats: []}
  componentWillMount () {
    var data = []

    COMPANIES.forEach((company) => {
      let url = this.urlBuilder(company.url)
      console.log(OPTIONS)
      fetch(url, OPTIONS)
      .then((res) => res.json())
      .then((res) => {
        let lastWeeksCommits = res.all[res.all.length - 2]
        data.push({name: company.name, data: lastWeeksCommits})
      })
      .then(() => this.setState({stats: data}))
      .catch(console.error)
    })
  }

  urlBuilder(company) {
    return GIT_URL + company + CALL
  }

  render() {
    return (
      <div style={{flex: 1, marginTop: 20}} className="App">
        <h1>Commits last week</h1>
        <p>(Week starts Sunday)</p>
        {this.renderChart()}
      </div>
    )
  }

  renderChart () {
    var {stats} = this.state

    return stats.length === COMPANIES.length ? (
      <BarChart width={1200} height={600} data={stats}>
        <XAxis dataKey="name" tick={{stroke: 'black', padding: 5, strokeWidth: 1, fontSize: 18}} />
        <YAxis />
        <Bar type="monotone" dataKey="data" barSize={30} fill="#66ccff"
          label={{ fill: 'red', fontSize: 20 }} />
      </BarChart>
    ) : <div style={{flex: 1, marginTop: 200, fontSize: 25}}>Waiting...</div>
  }

  renderStat(stat, index) {
    return (
      <div key={index}>
        <span>{stat.name}</span>
        <br/>
        <div>
          <p>Commits this week: {stat.data}</p>
        </div>
      </div>
    )
  }


}

export default App;
