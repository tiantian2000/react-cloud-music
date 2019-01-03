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
const Brief = Item.Brief;
class Sheet extends Component {

    constructor(){
        super()
        this.state={
            records: [],
            isLoaded: false,
            page: 1,
            error: null
        }
    }

    componentDidMount(){
       this.setPage()
    }

    setPage(){
        //let path = `https://m.kugou.com/plist/index&json=true&page=${this.state.page}`
        //let path = `/proxy/plist/index&json=true&page=${this.state.page}`
        let path = `https://bird.ioliu.cn/v1?url=http://m.kugou.com/plist/index&json=true&page=${this.state.page}`
        axios.get(path).then(res=>{
            let data = res.data
            console.log(data)
            this.setState({
                records: this.state.records.concat(data.plist.list.info),
                isLoaded: true
            })
        }).catch(error=>
            this.setState({
                isLoaded: true,
                error
            }))
    }

    loadMoreData(){
        this.setState({
                page: this.state.page + 1
            }, () => {
                this.setPage()
            }
        )
    }

    info(index){
        let id = this.state.records[index].specialid
        let path = `/sheet/${id}`
        this.props.history.push(path)
    }

    render(){
        const {error,isLoaded,records} = this.state
        let data
        if(error){
            data = <div>加载失败... {error.message}</div>
        }else if(!isLoaded){
            data = <ActivityIndicator text="Loading..."/>
        }else{
            data = records.map((item,index)=>{
                return (<Item key={index}
                              thumb={item.imgurl.replace('{size}','400')}
                              arrow="horizontal" multipleLine wrap
                              onClick={this.info.bind(this,index)}>
                    {item.specialname}<Brief><i class="icon-music"></i>{item.playcount}</Brief>
                </Item>)
            })
        }
        return(
            <div className="rank">
                <Scroll click={true} pullUpLoad={true} pullUpLoadMoreData={this.loadMoreData.bind(this)}>
                    <List >
                        {data}
                    </List>
                </Scroll>
            </div>
        )
    }
}

export default Sheet;