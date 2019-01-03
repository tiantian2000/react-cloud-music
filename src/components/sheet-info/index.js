/**
 * Created by Administrator on 2018/6/13.
 */
import React, { Component } from 'react';
import { ActivityIndicator,List,Icon } from 'antd-mobile';
import axios from 'axios'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import Scroll from 'react-bscroll'
import 'react-bscroll/lib/react-scroll.css'
import {savePlayList,loadPlayList} from '../common/js/cache'
import * as songActions from '../redux/actions/song'
import * as songListActions from '../redux/actions/song_list'
import * as songListIndexActions from '../redux/actions/song_list_index'
import './style.less'


const Item = List.Item;
class SheetInfo extends Component {

    constructor() {
        super()
        this.state = {
            currIndex: 0,
            page: 1,
            error: null,
            isLoaded: false,
            sheetInfo: {},  //歌单榜详情
            records: [],    //排行榜列表
            hasMore: true, //还有没有更多数据
            isLoadingMore: false //是加载中还是加载更多
        }
    }

    componentDidMount() {
        //let path = `/proxy/plist/list/${this.props.match.params.id}?json=true`
        let path = `https://bird.ioliu.cn/v1?url=http://m.kugou.com/plist/list/${this.props.match.params.id}?json=true`
        axios.get(path).then(res=>{
            let data = res.data
            console.log(data)
            this.setState({
                records: data.list.list.info,
                sheetInfo: data.info.list,
                isLoaded: true
            })
        }).catch(error=>
            this.setState({
                isLoaded: true,
                error
            }))

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
                currentIndex: 1
            };
            this.props.songListIndexActions.update(index)
            this.props.songListActions.update(loadPlayList())
        })
    }

    back(){
        this.props.history.push('/sheet')
    }

    render(){
        let data
        let img = this.state.sheetInfo.imgurl + ''
        const {error,isLoaded,records} = this.state
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
            <div className="sheet-info">
                <Scroll click={true}>
                <div>
                    <div className="hd">
                        <img src={img.replace('{size}','400')} alt="图片"/>
                        <div className="top">
                            <div className="back">
                                <Icon type="left" size='lg' onClick={this.back.bind(this)}/>
                            </div>
                            <span>{this.state.sheetInfo.specialname}</span>
                        </div>
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
)(SheetInfo)