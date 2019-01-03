/**
 * Created by Administrator on 2018/6/8.
 */
import React, { Component } from 'react';
import axios from 'axios'
import { ActivityIndicator,List } from 'antd-mobile';
import Slide from '../slide'
import Scroll from 'react-bscroll'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import {savePlayList,loadPlayList} from '../common/js/cache'
import * as songActions from '../redux/actions/song'
import * as songListActions from '../redux/actions/song_list'
import * as songListIndexActions from '../redux/actions/song_list_index'
import 'react-bscroll/lib/react-scroll.css'
import './style.less'

const Item = List.Item;
class News extends Component {

    constructor(){
        super()
        this.state={
            banner: [],
            records: [],
            isLoaded: false,
            error: null
        }
    }

    componentDidMount(){
        //let path = 'https://m.kugou.com/?json=true'
        //let path = '/proxy/?json=true'
        let path = 'https://bird.ioliu.cn/v1?url=m.kugou.com/?json=true'
        axios.get(path).then(res=>{
            let data = res.data
            console.log(data)
            this.setState({
                banner: data.banner,
                records: data.data,
                isLoaded: true
            })
        }).catch(error=>
            this.setState({
                isLoaded: true,
                error
            }))

        //加载播放列表,更新redux
        //this.props.songListActions.update(loadPlayList())
    }

    play(index){
        //console.log(index)
        let hash = this.state.records[index].hash
        let duration = this.state.records[index].duration
        //let path = `/dproxy/yy/index.php?r=play/getdata&hash=${hash}`
        let path = `https://bird.ioliu.cn/v1?url=http://www.kugou.com/yy/index.php?r=play/getdata&hash=${hash}`
        axios.get(path).then(res=>{
            let data = res.data

            //从redux中取song
            const song = this.props.song
            //修改song的当前播放歌曲
            song.currentItem = data.data
            song.currentItem.duration = duration
            //修改redux
            this.props.songActions.update(song)
            //this.props.history.push('/player')
            //存诸播放列表
            savePlayList(song)
            //修改redux中的播放列表
            //console.log(loadPlayList())
            console.log('修改播放索引')
            //修改redux中的播放索引
            let index = {
                currentIndex: 0
            };
            this.props.songListIndexActions.update(index)
            this.props.songListActions.update(loadPlayList())
            //修改redux中的播放索引为0

        })
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
            <div className="my-list">
                <Scroll click={true}>
                    <Slide banner={this.state.banner}/>
                    <List>
                        {data}
                    </List>
                </Scroll>
            </div>
        )
    }
}

//redux react绑定
function mapStateToProps(state) {
    return {
        //把reducer中的userinfo返回的值绑定到userinfo json中,可以通过this.props.userinfo来访问
        song: state.song,
        songList: state.songList,
        songListIndex: state.songListIndex
    }
}

function mapDispatchToProps(dispatch) {
    return {
        //把action绑定到属性userInfoActions中,就可以通过this.props.userInfoActions来访问
        songActions: bindActionCreators(songActions, dispatch),
        songListActions: bindActionCreators(songListActions,dispatch),
        songListIndexActions: bindActionCreators(songListIndexActions,dispatch)
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(News)
