/*
TODO line chart comparing gimi commits to own historical values
Do this with all companies in array.
*/

import React, { Component } from 'react'
import './App.css';
import { ScatterChart, Scatter, BarChart, Bar, XAxis, YAxis, ZAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import keys from './keys.json' // Keys are being fetched from local file keys.json

// Auth
const USER = keys.user
const TOKEN = keys.token

if(!USER) throw Error('Could not find GITHUB_USER in keys.json') //Goto: See README for instructions on how to obtain your token
if(!TOKEN) throw Error('Could not find GITHUB_TOKEN in keys.json') //Goto: See README for instructions on how to obtain your token

const AUTH = btoa(`${USER}:${TOKEN}`)
const HEADER = {Accept: 'application/json', 'Content-Type': 'application/json', Authorization: `Basic ${AUTH}`}
const OPTIONS = {method: "GET", headers: HEADER}

const GIT_URL =  'https://api.github.com' // '/github'
const CALL = '/stats/participation'
const COMPANIES = [
  {name: 'gimi-server', url: '/repos/gimi-org/gimi-server'},
  {name: 'Angular', url: '/repos/angular/angular.js'},
  {name: 'Linux', url: '/repos/torvalds/linux'},
  {name: 'React', url: '/repos/facebook/react'},
  {name: 'React Native', url: '/repos/facebook/react-native'},
  {name: 'VLC', url: '/repos/videolan/vlc'},
  {name: 'NodeJS', url: '/repos/nodejs/node'},
  {name: 'Bitcoin', url: '/repos/bitcoin/bitcoin'},
  {name: 'TensorFlow', url: '/repos/tensorflow/tensorflow'},
  {name: 'Gimi Tech', url: '/repos/gimi-org/gimi-app'},
]

const PAIRED_REPOS = ['gimi-server', 'Gimi Tech']

let data = []
let gatherCommits = []
let gimiHistory = []

class App extends Component {
  state = {stats: [], gimiHistory: []}
  componentWillMount () {

    COMPANIES.forEach((org) => {
      let url = this.urlBuilder(org.url)
      fetch(url, OPTIONS)
        .then((res) => res.json())
        .then((res) => {
          let lastWeeksCommits = res.all[res.all.length - 2]
          let commitCount = {name: org.name, data: lastWeeksCommits}
          if (PAIRED_REPOS.includes(org.name)){
            this.combineCount(commitCount)
          }
          else{
            data.push(commitCount)
          }
        })
        .then(() => this.setState({stats: data}))
        .catch(e => console.error(e))
    })

    // get gimi history

    let gimi_url = this.urlBuilder('/repos/gimi-org/gimi-app')
    let gimi_server_url = this.urlBuilder('/repos/gimi-org/gimi-server')
    fetch(gimi_url, OPTIONS)
      .then((res) => res.json())
      .then(res => res.all)
      .then(gimiApp => {
        return fetch(gimi_server_url, OPTIONS)
          .then((res) => res.json())
          // .then(res => console.log('server', res.all))
          .then(res => {
            let gimiServerCounts = res.all
            for (let i = 0; i < gimiApp.length; i++) {
              gimiHistory.push({count: gimiApp[i] + gimiServerCounts[i], week: i + 1})
            }
          })
          .then(() => this.setState({gimiHistory}))
      })




  }

  urlBuilder(org) {
    return GIT_URL + org + CALL
  }

  combineCount(commitCount) {
    gatherCommits.push(commitCount.data)
    let sum = gatherCommits.reduce((s, v) => s + v)
    if(commitCount.name === 'Gimi Tech') data.push({...commitCount, data: sum})
  }

  render() {
    return (
      <div style={{flex: 1, marginTop: 20}} className="App">
        {this.renderChart()}
        {this.renderGimiChart()}
      </div>
    )
  }

  renderChart () {
    var {stats} = this.state

    return stats.length === (COMPANIES.length - PAIRED_REPOS.length / 2) ? (
      <div style={{width: 1200, height: 700}}>
        <h3 style={{fontSize: 30}}>Commits last week</h3>
        <p>(Week starts sunday)</p>
          <BarChart width={1200} height={600} data={stats}>
            <XAxis dataKey="name" tick={{stroke: 'black', padding: 5, strokeWidth: 1, fontSize: 18}} />
            <YAxis />
            <Bar type="monotone" dataKey="data" barSize={30} fill="#007fff"
              label={{ fill: 'white', fontSize: 20 }} />
          </BarChart>
      </div>
    ) : <div style={{flex: 1, marginTop: 200, fontSize: 25, height: 700}}>Loading...</div>
  }

  renderGimiChart () {
    var {gimiHistory} = this.state
    return gimiHistory.length === 52 ? (
      <div style={{width: 1200, height: 620}}>
        <h3 style={{fontSize: 30}}>Gimi Commit History</h3>
      	<ScatterChart width={1200} height={600} margin={{top: 20, right: 20, bottom: 20, left: 20}}>
        	<XAxis tickCount={10} type="number" dataKey={'week'} name='week' label='week' />
        	<YAxis tickCount={10} type="number" dataKey={'count'} name='commits' label='commits'/>
          <CartesianGrid />
        	<Tooltip cursor={{strokeDasharray: '3 3'}}/>
        	<Scatter name='Gimi' data={gimiHistory} fill='#007fff' line shape="circle"/>
        </ScatterChart>
      </div>) : <div style={{flex: 1, marginTop: 200, fontSize: 25, height: 620}}>Loading...</div>
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
