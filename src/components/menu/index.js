/**
 * Created by Administrator on 2018/6/8.
 */
import React,{Component} from 'react'
import { Link } from 'react-router-dom'
import './style.less'

class Menu extends Component{

    constructor(){
        super()
        this.state = {
            index: 0
        }
    }

    changeMenu(index){
        this.setState({
            index
        })
    }

    render(){
        return(
            <div className="top-nav">
               <ul className="item">
                   <li onClick={this.changeMenu.bind(this,0)}>
                       <Link to="/" className={this.state.index===0?'active':''}>新歌</Link></li>
                   <li onClick={this.changeMenu.bind(this,1)}>
                       <Link to="/rank" className={this.state.index===1?'active':''}>排行</Link></li>
                   <li onClick={this.changeMenu.bind(this,2)}>
                       <Link to="/sheet" className={this.state.index===2?'active':''}>歌单</Link></li>
                   <li onClick={this.changeMenu.bind(this,3)}>
                       <Link to="/singer" className={this.state.index===3?'active':''}>歌手</Link></li>
               </ul>
            </div>
        )

    }
}

export default Menu