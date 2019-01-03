/**
 * Created by Administrator on 2018/6/8.
 */
import React, { Component } from 'react';
import {Link} from 'react-router-dom'
import Scroll from 'react-bscroll'
import 'react-bscroll/lib/react-scroll.css'
import "./style.less"

class Singer extends Component {

    componentDidMount(){
       //http://m.kugou.com/singer/class&json=true
    }

    render(){
        return(
            <div className="singer">
                <Scroll click={true}>
                    <div>
                        <ul className="singer-class-list">
                            <li>
                                <Link to="/singer/88">
                                    <i className="singer-list-arrow"></i>
                                    热门歌手
                                </Link>
                            </li>
                        </ul>
                        <ul className="singer-class-list">
                            <li>
                                <Link to="/singer/1">
                                    <i className="singer-list-arrow"></i>
                                    华语男歌手
                                </Link>
                            </li>
                            <li>
                                <Link to="/singer/2">
                                    <i className="singer-list-arrow"></i>
                                    华语女歌手
                                </Link>
                            </li>
                            <li>
                                <Link to="/singer/3">
                                    <i className="singer-list-arrow"></i>
                                    华语组合
                                </Link>
                            </li>
                        </ul>
                        <ul className="singer-class-list">
                            <li>
                                <Link to="/singer/4">
                                    <i className="singer-list-arrow"></i>
                                    日韩男歌手
                                </Link>
                            </li>
                            <li>
                                <Link to="/singer/5">
                                    <i className="singer-list-arrow"></i>
                                    日韩女歌手
                                </Link>
                            </li>
                            <li>
                                <Link to="/singer/6">
                                    <i className="singer-list-arrow"></i>
                                    日韩组合
                                </Link>
                            </li>
                        </ul>
                        <ul className="singer-class-list">
                            <li>
                                <Link to="/singer/7">
                                    <i className="singer-list-arrow"></i>
                                    欧美男歌手
                                </Link>
                            </li>
                            <li>
                                <Link to="/singer/8">
                                    <i className="singer-list-arrow"></i>
                                    欧美女歌手
                                </Link>
                            </li>
                            <li>
                                <Link to="/singer/9">
                                    <i className="singer-list-arrow"></i>
                                    欧美组合
                                </Link>
                            </li>
                        </ul>
                    </div>
                </Scroll>

            </div>
        )
    }
}

export default Singer;