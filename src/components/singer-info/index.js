/**
 * Created by Administrator on 2018/6/13.
 */
import React, { Component } from 'react';
import { ActivityIndicator,List,Icon } from 'antd-mobile';
import axios from 'axios'
import Scroll from 'react-bscroll'
import 'react-bscroll/lib/react-scroll.css'
import './style.less'


const Item = List.Item;
class SingerInfo extends Component {

    constructor(){
        super()
        this.state={
            title: '',
            records: [],
            isLoaded: false,
            error: null
        }
    }

    componentDidMount() {
        //let path = `/proxy/singer/list/${this.props.match.params.id}?json=true`
        let path = `https://bird.ioliu.cn/v1?url=http://m.kugou.com/singer/list/${this.props.match.params.id}?json=true`
        axios.get(path).then(res=>{
            let data = res.data
            console.log(data)
            this.setState({
                title: data.classname,
                records: data.singers.list.info,
                isLoaded: true
            })
        }).catch(error=>
            this.setState({
                isLoaded: true,
                error
            }))
    }

    detail(index){
        let id = this.state.records[index].singerid
        let path = `/singer/song/${id}`
        this.props.history.push(path)
    }

    back(){
        this.props.history.push('/singer')
    }

    render() {
        let data
        const {error,isLoaded,records} = this.state
        if(error){
            data = <div>加载失败... </div>
        }else if(!isLoaded){
            data = <ActivityIndicator text="Loading..."/>
        }else{
            data = records.map((item,index)=>{
                return (<Item key={index}
                              thumb={item.imgurl.replace('{size}','400')}
                              multipleLine
                              onClick={this.detail.bind(this,index)}>
                    {item.singername}
                </Item>)
            })
        }
        return (
            <div class="singer-info">
                <Scroll click={true}>
                <div class="top-goback">
                    <p class="page-title">{this.state.title}</p>
                    <div class="goback" >
                        <Icon type="left" size='lg' color="#6e6e6e" onClick={this.back.bind(this)}/>
                    </div>
                </div>
                <List className="info-list">
                    {data}
                </List>
                </Scroll>
            </div>
        )
    }

}

export default SingerInfo;