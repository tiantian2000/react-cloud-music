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
class RankInfo extends Component {

    constructor() {
        super()
        this.state = {
            currIndex: 0,
            page: 1,
            error: null,
            isLoaded: false,
            rankInfo: {},   //排行榜详情
            records: [],    //排行榜列表
            hasMore: true, //还有没有更多数据
            isLoadingMore: false //是加载中还是加载更多
        }
    }

    componentDidMount() {
        this.setPage()
    }

    //加载首页
    setPage() {
        //let path = `/proxy/rank/info/?rankid=${this.props.match.params.id}&page=${this.state.page}&json=true`
        let path = `https://bird.ioliu.cn/v1?url=http://m.kugou.com/rank/info/?rankid=${this.props.match.params.id}&page=${this.state.page}&json=true`
        axios.get(path).then(res=>{
            let data = res.data
            console.log(data)
            this.state.rankInfo?this.setState({
                rankInfo: data.info,
                records: this.state.records.concat(data.songs.list),
                isLoaded: true
            }):''
        })
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

    loadMoreData() {
        //console.log('加载更多')
        this.setState({
                page: this.state.page + 1
            }, () => {
                this.setPage()
            }
        )
    }

    back(){
        this.props.history.push('/rank')
    }

    render(){
        const update = this.state.records[0]?`${this.state.records[0].addtime.slice(0,10)}`:''
        let img = this.state.rankInfo.banner7url + ''
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
                    <span className={`panel-songs-item-num ${index===0?'one':''} ${index===1?'two':''}
                    ${index===2?'three':''}`}>{index+1}</span>{item.filename}
                </Item>)
            })
        }

        return(
                <div className="rank-info">
                    <Scroll click={true} pullUpLoad={true} pullUpLoadMoreData={this.loadMoreData.bind(this)}>
                    <div>
                        <div className="hd">
                            <img src={img.replace('{size}','400')} alt="图片"/>
                            <div className="rank-info-time">
                                <span>上次更新时间：{update}</span>
                            </div>
                            <div className="top">
                                <div className="back">
                                    <Icon type="left" size='lg' onClick={this.back.bind(this)}/>
                                </div>
                                <span>{this.state.rankInfo.rankname}</span>
                            </div>
                        </div>

                        <div>

                            <List className="info-list">
                                {data}
                            </List>

                        </div>
                    </div>
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
)(RankInfo)
