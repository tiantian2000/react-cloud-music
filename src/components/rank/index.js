/**
 * Created by Administrator on 2018/6/8.
 */
import React, { Component } from 'react';
import { ActivityIndicator,List } from 'antd-mobile';
import axios from 'axios'
import Scroll from 'react-bscroll'
import 'react-bscroll/lib/react-scroll.css'
import './style.less'



const Item = List.Item;
class Rank extends Component {

    constructor(){
        super()
        this.state={
            isLoaded: false,
            error: null
        }
    }

    componentDidMount(){
        //let path = 'http://m.kugou.com/list&json=true'
        //let path = '/proxy/rank/list&json=true'
        let path = 'https://bird.ioliu.cn/v1?url=http://m.kugou.com/rank/list&json=true'
        axios.get(path).then(res=>{
            let data = res.data
            console.log(data)
            this.setState({
                records: data.rank.list,
                isLoaded: true
            })
        }).catch(error=>
            this.setState({
                isLoaded: true,
                error
            }))
    }

    info(index){
        let id = this.state.records[index].rankid
        let path = `/rank/${id}`
        this.props.history.push(path)
    }

    render(){
        const {error,isLoaded} = this.state
        let data
        if(error){
            data = <div>加载失败... {error.message}</div>
        }else if(!isLoaded){
            data = <ActivityIndicator text="Loading..."/>
        }else{
            data = this.state.records.map((item,index)=>{
                return (<Item key={index}
                              thumb={item.imgurl.replace('{size}','400')}
                              arrow="horizontal" multipleLine
                              onClick={this.info.bind(this,index)}>
                    {item.rankname}
                </Item>)
            })
        }
        return(
            <div className="rank">
                <Scroll click={true}>
                    <List>
                        {data}
                    </List>
                </Scroll>
            </div>
        )
    }
}

export default Rank;