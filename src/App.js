import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import fetch from 'node-fetch'
const GIT_URL = 'https://api.github.com'
const CALL = '/stats/code_frequency'
const LINUX = '/repos/torvalds/linux'
const REACT = '/repos/facebook/react'
const REACT_NATIVE = '/repos/facebook/react-native'
const GIMI = '/repos/gimi-org/gimi-app'
const COMPANIES = [{name: 'linux', url: LINUX}, {name: 'react', url: REACT}, {name: 'react-native', url: REACT_NATIVE}]
class App extends Component {
state = {stats: []}
  componentWillMount () {
    var data = []
    const URL = GIT_URL + REACT_NATIVE + CALL
    const DATA = {}
    const OPTIONS = {method: "GET", body: JSON.stringify(DATA), headers: {"Content-Type": "application/json", "Authorization": "token OAUTH-TOKEN"}}
    fetch(GIT_URL + '/rate_limit')
    .then((res) => res.text())
    .then((res) => console.log(res))
    COMPANIES.map((company) => {
      fetch(URL, OPTIONS)
      .then((res) => res.text())
      .then((res) => {
        data.push({name: company.name, data: res})
      })
      .then(() => this.setState({stats: data}))
    })
  }

  render() {
    var {stats} = this.state
    return <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
          {stats.map((stat, index) => this.renderStat(stat, index))}
      </div>
  }

  renderStat(stat, index) {
    return <div key={index}>
      <span>{stat.name}</span>
      <span>{stat.data}</span>
    </div>
  }
}

export default App;
