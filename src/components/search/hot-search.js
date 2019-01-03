/**
 * Created by Administrator on 2018/6/14.
 */
import React, { Component } from 'react';
import axios from 'axios'
import { ActivityIndicator ,List } from 'antd-mobile';
import "./style.less"

const Item = List.Item;
class HotSearch extends Component {

    constructor(){
        super()
        this.state={
            records: [],
            isLoaded: false,
            error: null,
        }
    }

    componentDidMount() {
        //let path = '/sproxy/api/v3/search/hot?format=json&plat=0';
        let path = 'https://bird.ioliu.cn/v1?url=http://mobilecdn.kugou.com/api/v3/search/hot?format=json&plat=0';
        axios.get(path).then(res=>{
            let data = res.data
            console.log(data)
            this.setState({
                records: data.data.info,
                isLoaded: true
            })
        }).catch(error=>
            this.setState({
                isLoaded: true,
                error
            }))
    }

    //点击热门搜索回调父组件函数传回关键字
    search(index){
        console.log(this.state.records[index].keyword)
        this.props.onChangeSearch(this.state.records[index].keyword)
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
                              onClick={this.search.bind(this,index)}>
                    {item.keyword}
                </Item>)
            })
        }
        return(
            <div>
                    <List renderHeader={'最近热门'}>
                        {data}
                    </List>

            </div>
        )
    }
}

export default HotSearch