/**
 * Created by Administrator on 2018/6/5.
 */
import React,{Component} from 'react'
import {Link} from 'react-router-dom'
import { Card,Icon  } from 'antd-mobile';
import 'antd-mobile/dist/antd-mobile.css';
import './style.less'
import '../static/css/style.css'
class Header extends Component{

    search(){

    }

    render(){
        return(
            <div className="header">
                <Card full>
                    <Card.Header
                        title={<Link to="/" className="title">天天云音乐</Link>}
                        thumb="https://cdn3.iconfinder.com/data/icons/aurora/PNG/256x256/icontexto-aurora-folders-music.png"
                        extra={<div>
                            <Link to="/search" className="searchMusic"><Icon key="0" type="search"  color="#fff" size="md"/></Link>
                            <Link to="/user" className="mine">
                                <Icon key="1" type="down"  color="#fff" size="lg" className="icon-mine"/>
                                {/*<i className="icon-mine"></i>*/}</Link>
                        </div>}

                    />
                </Card>
            </div>
        )

    }
}

export default Header