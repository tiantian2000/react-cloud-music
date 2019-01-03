/**
 * Created by Administrator on 2018/6/13.
 */
import React, { Component } from 'react';
import axios from 'axios'
import { ActivityIndicator,List,Icon,SearchBar } from 'antd-mobile';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import Scroll from 'react-bscroll'
import 'react-bscroll/lib/react-scroll.css'
import "./style.less"
import HotSearch from './hot-search'
import {savePlayList,loadPlayList} from '../common/js/cache'
import * as songActions from '../redux/actions/song'
import * as songListActions from '../redux/actions/song_list'
import * as songListIndexActions from '../redux/actions/song_list_index'

const Item = List.Item;
class Search extends Component {

    constructor(){
        super()
        this.state={
            total: 0,
            records: [],
            isLoaded: false,
            error: null,
            search: '', //是否有搜索内容,
            page: 1
        }
    }

    componentDidMount() {

    }

    back(){
        this.props.history.goBack()
    }

    onChange= (value) => {
        console.log(value)
        value?this.setPage(value):this.setState({
            page: 1
        })
        this.setState({
            search: value
        })

    };

    setPage(value,page=`${this.state.page}`){
        //let path = `/sproxy/api/v3/search/song?format=json&keyword=${value}
        //&page=${page}&pagesize=10&showtype=1`
        let path = `https://bird.ioliu.cn/v1?url=http://mobilecdn.kugou.com/api/v3/search/song?format=json&keyword=${value}
        &page=${page}&pagesize=10&showtype=1`
        console.log(path)
        axios.get(path).then(res=>{
            let data = res.data
            console.log(data)
            this.setState({
                total: data.data.total,
                records: data.data.info,
                isLoaded: true
            })
        })
    }

    morePage(){
        //let path = `/sproxy/api/v3/search/song?format=json&keyword=${this.state.search}
        //&page=${this.state.page}&pagesize=10&showtype=1`
        let path = `https://bird.ioliu.cn/v1?url=http://mobilecdn.kugou.com/api/v3/search/song?format=json&keyword=${this.state.search}
        &page=${this.state.page}&pagesize=10&showtype=1`
        console.log(path)
        axios.get(path).then(res=>{
            let data = res.data
            console.log(data)
            this.setState({
                records: this.state.records.concat(data.data.info),
                isLoaded: true
            })
        })
    }

    loadMoreData() {
        //console.log('加载更多')
        this.setState({
                page: this.state.page + 1
            }, () => {
                this.morePage()
            }
        )
    }

    //点击热门关键字回调函数
    changeSearch(value){
        this.setState({
            search: value,
            page: 1
        })
        this.setPage(value,1)
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
            <div className="search">
                <Scroll click={true} pullUpLoad={true} pullUpLoadMoreData={this.loadMoreData.bind(this)}>
                    <div className="top-goback">
                        <div className="goback" >
                            <Icon type="left" size='lg' color="#6e6e6e" onClick={this.back.bind(this)}/>
                        </div>
                        <span className="page-title">搜索</span>
                    </div>
                    {/*<div class="top-goback">
                        <p class="page-title">搜索</p>
                        <div class="goback" >
                            <Icon type="left" size='lg' color="#6e6e6e" onClick={this.back.bind(this)}/>
                        </div>
                    </div>*/}
                    <div>
                        <SearchBar placeholder="歌手/歌名/拼音" onChange={this.onChange}/>
                    </div>
                    {this.state.search?<List renderHeader={`共有${this.state.total}条结果`}>{data}</List>:<HotSearch onChangeSearch={this.changeSearch.bind(this)}/>}
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
)(Search)