/**
 * Created by Administrator on 2018/6/14.
 */
import React, { Component } from 'react';
import axios from 'axios'
import { ActivityIndicator ,List } from 'antd-mobile';
import Scroll from 'react-bscroll'
import 'react-bscroll/lib/react-scroll.css'
import "./style.less"

const Item = List.Item;
class UserSearch extends Component {

    constructor(){
        super()
        this.state={
            records: [],
            isLoaded: false,
            error: null,
            page: 1,
            hasMore: true, //还有没有更多数据
            isLoadingMore: false, //是加载中还是加载更多,
        }
    }

    componentDidMount() {
       this.setPage()
    }

    setPage(){
        //let path = `/sproxy/api/v3/search/song?format=json&keyword=${this.props.search}&page=${this.state.page}&pagesize=10&showtype=1`
        let path = `https://bird.ioliu.cn/v1?url=http://mobilecdn.kugou.com/api/v3/search/song?format=json&keyword=${this.props.search}&page=${this.state.page}&pagesize=10&showtype=1`
        axios.get(path).then(res=>{
            let data = res.data
            console.log(data)
            this.setState({
                records: data.data.info,
                isLoaded: true
            })
        })
    }


    play(index){

    }

    render(){
        const {error,isLoaded,records} = this.state
        let data
        if(error){
            data = <div>加载失败... </div>
        }else if(!isLoaded){
            data = <ActivityIndicator text="Loading..."/>
        }else{
            data = records.map((item,index)=>{
                return (<Item key={index} arrow="horizontal" multipleLine
                              onClick={this.play.bind(this,index)}>
                                   {item.filename}
                </Item>)
            })
        }
        return(
            <Scroll click={true}>
            <div className="user-search">

                    <List>
                        {data}
                    </List>

            </div>
            </Scroll>

        )
    }
}

export default UserSearch