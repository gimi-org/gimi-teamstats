import React, { Component } from 'react'
import logo from './logo.svg';
import './App.css';
import fetch from 'node-fetch'
import { BarChart, Bar, XAxis, YAxis } from 'recharts';

//Auth
const USER = "barvin"
const TOKEN = "8397285e043d41a9b4b780dfa9630993b2caf2d4"
const AUTH = btoa(`${USER}:${TOKEN}`)
const HEADER = {Accept: 'application/json', 'Content-Type': 'application/json', Authorization: `Basic ${AUTH}`}
const OPTIONS = {method: "GET", headers: HEADER}

const GIT_URL = 'https://api.github.com'
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
  // {name: 'Veckopengen', url: '/repos/gimi-org/gimi-app'}
]

class App extends Component {
  state = {stats: []}
  componentWillMount () {
    var data = []

    COMPANIES.map((company) => {
      let url = this.urlBuilder(company.url)
      fetch(url, OPTIONS)
      .then((res) => res.json())
      .then((res) => {
        // Pop commit count from latest week
        console.log(res)
        data.push({name: company.name, data: res.all.pop()})
      })
      .then(() => this.setState({stats: data}))
    })
  }

  urlBuilder(company) {
    return GIT_URL + company + CALL
  }

  render() {
    var {stats} = this.state
    return (
      <div style={{flex: 1, marginTop: 20}} className="App">
        <h1>Commits this week</h1>
        <p>(Week starts Sunday)</p>
        {this.renderChart()}
      </div>
    )
  }

  renderChart () {
    var {stats} = this.state

    return (
      <BarChart width={1200} height={600} data={stats}>
        <XAxis dataKey="name" tick={{stroke: 'black', padding: 5, strokeWidth: 1, fontSize: 18}} />
        <YAxis />
        <Bar type="monotone" dataKey="data" barSize={30} fill="#66ccff"
          label={{ fill: 'red', fontSize: 20 }} />
      </BarChart>
    )
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
