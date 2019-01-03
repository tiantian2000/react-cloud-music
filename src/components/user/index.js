/**
 * Created by Administrator on 2018/7/22.
 */
import React,{Component} from 'react'
import './style.less'
import { List,Icon} from 'antd-mobile';
import Scroll from 'react-bscroll'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import {savePlayList,loadPlayList,delAllItemPlayListHistory,delItemPlayListHistory} from '../common/js/cache'
import * as songActions from '../redux/actions/song'
import * as songListIndexActions from '../redux/actions/song_list_index'
import * as songListActions from '../redux/actions/song_list'
import 'react-bscroll/lib/react-scroll.css'
import './style.less'
const Item = List.Item;

class User extends Component {

    constructor(){
        super()
        this.state = {
            records: loadPlayList(),
            data: []
        }
    }

    componentDidMount(){
        //loadPlayList()
        this.props.songListActions.update(loadPlayList())
        //console.log(this.state.records);
    }

    play(index){
        //console.log(index)
        //let hash = this.state.records[index].hash
        //let duration = this.state.records[index].duration
        //let path = `/dproxy/yy/index.php?r=play/getdata&hash=${hash}`
        //axios.get(path).then(res=>{
            //let data = res.data
            //从redux中取song
            console.log(this.state.records[index])
            let song = this.props.song
            //修改song的当前播放歌曲
            song.currentItem = this.state.records[index].currentItem
            //song.currentItem.duration = duration
            //修改redux
            this.props.songActions.update(song)
            //this.props.history.push('/player')
            //savePlayList(song)
            let currIndex = {
                currentIndex: index
            };
            this.props.songListIndexActions.update(currIndex)
            console.log(`当前播放的是${index}`)
        //})
    }

    delAll(){
        delAllItemPlayListHistory();
        this.setState({
            records: loadPlayList()
        })
        this.props.songListActions.update(loadPlayList())
    }

    delSong(index,event){
        event.stopPropagation();
        event.preventDefault();
        delItemPlayListHistory(this.state.records[index])
        this.setState({
            records: loadPlayList()
        })
        this.props.songListActions.update(loadPlayList())
    }

    back(){
        this.props.history.goBack()
    }

    render(){
        const {records} = this.state
        let data = records.map((item,index)=>{
            return (<Item key={index}
                          onClick={this.play.bind(this,index)}>
                 {item.currentItem.audio_name}<Icon className="cross" type="cross" size='sm'
                                                    onClick={this.delSong.bind(this,index)}/>
            </Item>)
        })
        return(
            <div className="user">
                <Scroll click={true}>
                     <div className="search-history">
                         <Icon className="back" type="left" size='lg' onClick={this.back.bind(this)}/>
                         <h1 className="title">
                        <span className="text">播放列表</span>
                        <span  className="clear">
                       {/* <i className="icon-clear" onClick={this.delAll.bind(this)}></i>*/}
                            <Icon type="cross-circle" size="md"  onClick={this.delAll.bind(this)}></Icon>
                        </span>
                    </h1>

                       <List className="list">
                            {data}
                        </List>

                </div>
                </Scroll>
            </div>
        );
    }
}

//redux react绑定
function mapStateToProps(state) {
    return {
        //把reducer中的userinfo返回的值绑定到userinfo json中,可以通过this.props.userinfo来访问
        song: state.song,
        songIndex: state.songListIndex
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
)(User)