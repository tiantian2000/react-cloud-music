import React, { Component } from 'react';
import {Route} from 'react-router-dom'
import './app.css';

import Header from './components/header'
import Menu from './components/menu'
import News from './components/news'
import Rank from './components/rank'
import Sheet from './components/sheet'
import Singer from './components/singer'
import Player from './components/player'
import RankInfo from './components/rank_info'
import SheetInfo from './components/sheet-info'
import SingerInfo from './components/singer-info'
import SingerSongs from './components/singer-songs'
import Search from './components/search'
import User from './components/user'

class App extends Component {
  render() {
    return (
      <div>
        <Header props={this.props}/>
        <Player  />
        <Menu/>
            <Route exac path="/"      component={News} />
            <Route exac path="/rank"  component={Rank} />
            <Route path="/rank/:id"   component={RankInfo} />
            <Route path="/sheet"       component={Sheet} />
            <Route path="/sheet/:id"   component={SheetInfo} />
            <Route path="/singer"      component={Singer} />
            <Route path="/singer/:id"  component={SingerInfo} />
            <Route path="/singer/song/:id" component={SingerSongs} />
            <Route path="/search" component={Search} />
            <Route path="/user" component={User} />
      </div>
    );
  }
}

export default App
