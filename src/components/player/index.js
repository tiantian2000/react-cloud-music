/**
 * Created by Administrator on 2018/6/11.
 */
import React, { Component } from 'react';
import { Icon } from 'antd-mobile';
import Scroll from 'react-bscroll'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as songActions from '../redux/actions/song'
import * as songListActions from '../redux/actions/song_list'
import * as songListIndexActions from '../redux/actions/song_list_index'
import Progress from '../progress'
import 'react-bscroll/lib/react-scroll.css'
import './style.less'

class Player extends Component {

    constructor(props){
        super(props)
        this.state = {
            currentItem: {},  //当前播放歌曲
            progress: 0,     //进度
            //duration: 0,     //总时长
            isPlay: false,   //播放状态,
            leftTime: '',    //剩余时间
            type: 'cycle',  //播放类型(默认循环)
            currentLyric: [], //歌词
            lineNo: 0,       //高亮显示的行号
            currentTime: 0,    //当前播放时间
            lineNum: 0,        //当前滚动到的行数
            fullScreen: {display:"none"}, //全屏显示,默认不显示
            style: {display:"none"}, //默认不显示
            //currIndex: 0
        }


    }

    componentDidMount(){
       if(this.props.song.currentItem){
           this.setState({
               currentItem: this.props.song.currentItem,
               style: {display:"block"}, //显示
               lineNo: 0
           })

           this.currentPlay()
       }

    }

    componentWillReceiveProps(nextProps){
        if(this.props.song.currentItem){
            this.state.fullScreen.display==='block'?this.setState({
                style: {display:"none"}, //显示
            }):this.setState({
                style: {display:"block"}, //显示
            })
            this.setState({
                currentItem: this.props.song.currentItem,
                lineNo:0
            })

            this.currentPlay()
        }


    }

    //播放当前歌曲
    currentPlay(){
        console.log('当前播放索引')
        console.log(this.props.songIndex.currentIndex)
        //一般情况下，这样就可以自动播放了，但是一些奇葩iPhone机不可以
        let audio = this.refs.audioWrapper;
        audio.play();
        //微信必须加入Weixin JSAPI的WeixinJSBridgeReady才能生效
        document.addEventListener("WeixinJSBridgeReady", function () {
            audio.play();
        }, false);
        this.setState({
            isPlay: true,
        })
        this.handleLyric()
    }

    //点击播放
    play(e) {
        //阻止冒泡
        e.stopPropagation();
        e.preventDefault();

        //如果是播放的时候点击则暂停,反之则播放
        let audio = this.refs.audioWrapper;
        this.state.isPlay ? audio.pause():  audio.play()
        this.setState({
            //设置播放状态
            isPlay: !this.state.isPlay,
        })
    }


    //监听播放状态
    updateTime(){
        let audio = this.refs.audioWrapper;
        if(audio.ended){//播放结束
            this.setState({
                //设置播放状态
                isPlay: false,
            })
            //如果是循环播放则播放下一首
            this.state.type === 'cycle' ? this.changeNext() : ''

        }else{ //正在播放
            this.setState({
                currentTime: audio.currentTime,
                progress: (audio.currentTime / audio.duration) * 100
            })
            //console.log(this.state.progress)
            this.changeLineNo()
        }

    }

    //处理歌词
    handleLyric(){
        let medisArray = []
        let medises = this.props.song.currentItem.lyrics.split('\n')
        //console.log(medises)
        for(let item of medises){
            var t = item.substring(item.indexOf("[") + 1, item.indexOf("]"));
            medisArray.push({
                    //把原来的mm:ss的时间格式改为秒
                    t: (t.split(":")[0] * 60 + Number.parseFloat(t.split(":")[1])).toFixed(3),
                    c: item.substring(item.indexOf("]") + 1, item.length)
                }
            )
        }
        medisArray.pop()
        //console.log(medisArray)
        this.setState({
            currentLyric: medisArray
        })

    }

    //歌词高亮显示的监听
    changeLineNo() {
        //console.log(this.state.lineNo,this.state.currentLyric[this.state.lineNo],this.state.currentTime.toFixed(3))
        if(this.state.currentLyric[this.state.lineNo] === undefined){
            this.setState({
                lineNo: 0
            })
        }else if (this.state.lineNo === this.state.currentLyric.length - 1 &&
            this.state.currentTime.toFixed(3) >= parseFloat(this.state.currentLyric[this.state.lineNo].t)) {
            this.setState({
                lineNo: 0
            })
        }else if (parseFloat(this.state.currentLyric[this.state.lineNo].t) <= this.state.currentTime.toFixed(3) &&
            this.state.currentTime.toFixed(3) <= parseFloat(this.state.currentLyric[this.state.lineNo + 1].t)) {

            this.setState({
                lineNo: this.state.lineNo+1
            })
        }else if (parseFloat(this.state.currentLyric[this.state.lineNo].t) <= this.state.currentTime.toFixed(3) &&
            this.state.currentTime.toFixed(3) <= parseFloat(this.state.currentLyric[this.state.lineNo + 2].t)) {

            this.setState({
                lineNo: this.state.lineNo+2
            })

        }
        this.handleLyricScroll()
    }

    handleLyricScroll(){
        this.setState({
            lineNum: this.state.lineNum + 1
        },()=>{
            if(this.state.lineNum === 6){ //行号每跳到7则滚动
                let lyricElS =  this.refs.lyricLine
                lyricElS = lyricElS.getElementsByTagName('li');
                let lyricEl
                this.state.lineNo === 0?lyricEl= lyricElS[this.state.lineNo]: lyricEl= lyricElS[this.state.lineNo-1]
                let scrollObj = this.refs.scroll.getScrollObj()
                scrollObj.scrollToElement(lyricEl,4000)
                this.setState({
                    lineNum: 0
                })
            }
        })
    }
    //关闭播放器
    close(e){
        //阻止冒泡
        e.stopPropagation();
        e.preventDefault();
        let audio = this.refs.audioWrapper;
        audio.pause();
        this.setState({
            //设置播放状态
            isPlay: false,
            style: {display:"none"} //不显示
        })
    }

    //切换到全屏模式
    fullScreen(){
        this.setState({
            style: {display:"none"}, //不显示
            fullScreen: {display:"block"} //显示
        })
    }

    //切换到小屏模式
    mini(){
        this.setState({
            style: {display:"block"}, //不显示
            fullScreen: {display:"none"} //显示
        })
    }

    //上一首
    changePre(){
        console.log('上一首')
        console.log(this.props.songIndex.currentIndex)
        console.log(this.props.songList.length)
        let currentIndex
        //如果是第一首则到最后一首
        if(this.props.songIndex.currentIndex === 0){
            currentIndex = this.props.songList.length-1
            this.props.songListIndexActions.update({
                currentIndex
            })
        } else{
            currentIndex = this.props.songIndex.currentIndex-1
            this.props.songListIndexActions.update({
                currentIndex
            })
        }
        this.setState({
            currentItem: this.props.songList[currentIndex].currentItem,
            lineNo:0
        })
        let song = this.props.song
        //修改song的当前播放歌曲
        song.currentItem = this.props.songList[currentIndex].currentItem
        //song.currentItem.duration = duration
        //修改redux
        this.props.songActions.update(song)

        this.currentPlay()
    }

    //下一首
    changeNext(){
        console.log(`当前播放的是${this.props.songIndex.currentIndex}`)
        let currentIndex;
        //console.log(this.props.songList.length)
        //如果是最后一首,则回到第一首
        if(this.props.songIndex.currentIndex === this.props.songList.length-1){
            currentIndex = 0
            this.props.songListIndexActions.update({
                currentIndex
            })
        } else{
            currentIndex = this.props.songIndex.currentIndex+1
            this.props.songListIndexActions.update({
                currentIndex
            })
        }
        this.setState({
            currentItem: this.props.songList[currentIndex].currentItem,
            lineNo:0
        })
                let song = this.props.song
                //修改song的当前播放歌曲
                song.currentItem = this.props.songList[currentIndex].currentItem
                //song.currentItem.duration = duration
                //修改redux
                this.props.songActions.update(song)

                this.currentPlay()

    }

    //切换播放模式
    changeType(){
        this.state.type==='cycle'?this.setState({
            type: 'once'
        }):this.setState({
            type: 'cycle'
        })
    }

    //设置播放进度
    changeProgressHandler(progress){
        let audio = this.refs.audioWrapper;
        //如果是播放的时候点击则暂停,反之则播放
        audio.currentTime = this.state.currentItem.duration * progress;
        this.setState({
            currentTime: this.state.currentItem.duration * progress
        },()=>this.queryLineNo())

    }

    //查询进度条设置后对应歌词的行号
    queryLineNo(){
        let index = 0
        this.state.currentLyric.filter((item)=>{
            if(parseFloat(item.t) <= this.state.currentTime.toFixed(3)){
                //console.log(item.t,this.state.currentTime.toFixed(3))
                index++
                return item
            }
            return false
        })
        //console.log(index)
        this.setState({
            lineNo: index
        })

    }

    //格式化时间
    formatTime(time){
        time = Math.floor(time)
        let miniutes = Math.floor(time / 60)
        let seconds = Math.floor(time % 60)

        seconds = seconds<10? `0${seconds}`:seconds
        return `${miniutes}:${seconds}`
    }

    render(){
        let authors = []
        if(this.props.song.currentItem){
            for(let i=0;i<this.props.song.currentItem.authors.length;i++){
                authors.push(this.props.song.currentItem.authors[i].author_name);
            }
        }

        return(
            /**/
            <div className="player">
                <div className="normal" style={this.state.fullScreen}>
                    <div className="background">
                        <img src={this.props.song.currentItem?this.props.song.currentItem.img:''} width="100%" height="100%" alt="图片"/>
                    </div>
                    <div className="top">
                        <div className="back">
                            <Icon type="left" size='lg' onClick={this.mini.bind(this)}/>
                        </div>
                        <p className="title">{this.props.song.currentItem?this.props.song.currentItem.song_name:''}</p>
                    </div>
                    <div className="header">
                        <div className="cover">
                            <img onClick={this.play.bind(this)} className={this.state.isPlay?'play':'pause'}
                                 src={this.props.song.currentItem?this.props.song.currentItem.img:''}
                                 alt="歌曲图片"/>
                        </div>
                    </div>
                    <div className="clric">
                        <Scroll ref="scroll">
                            <ul ref="lyricLine" className="list-group">
                                {this.state.currentLyric.map((item,index)=>{
                                    return <li  key={index}
                                                className="list-group-item">
                                        <span className= {this.state.lineNo===index?'active':''}>{item.c}</span></li>
                                })
                                }
                            </ul>
                        </Scroll>
                    </div>
                    <div className="control">
                        <div className="play-progress">
                            <span className="start-time">{this.formatTime(this.state.currentTime)}</span><Progress progress={this.state.progress} bgColor="#3195fd"
                                                                                                                   onProgressChange={this.changeProgressHandler.bind(this)}
                                                                                                                   playDot={true}
                        /><span className="end-time">{this.formatTime(this.state.currentItem.duration)}</span>
                        </div>
                        <ul className="play-controller">
                            <li onClick={this.changePre.bind(this)}> <i className="icon prev" ></i></li>
                            <li onClick={this.play.bind(this)}><i className={`ml-4 icon ${this.state.isPlay?'pause':'play-state'}`} ></i></li>
                            <li onClick={this.changeNext.bind(this)}><i className="ml-4 icon next" ></i></li>
                            <li onClick={this.changeType.bind(this)}><i className={`icon repeat-${this.state.type}`}
                            ></i></li>
                        </ul>

                    </div>
                </div>
               <div className="mini-player" style={this.state.style} onClick={this.fullScreen.bind(this)}>
                    <div className="song">
                        <div className="icon-song">
                            <img src={this.props.song.currentItem?this.props.song.currentItem.img:''} className={this.state.isPlay?'play':'pause'} alt="图片"/>
                        </div>
                        <div className="song_detail">
                            <p className="name">{this.props.song.currentItem?this.props.song.currentItem.song_name:''}</p>
                            <p className="desc">{authors.join('、')}</p>
                        </div>
                        <div className="control">
                            <span className="time">{this.formatTime(this.state.currentTime)}/{this.formatTime(this.state.currentItem.duration)}</span>
                            <i onClick={this.play.bind(this)} className={this.state.isPlay?'control_pause':'control_play'} ></i>
                        </div>
                        <div>
                            <Icon type="cross" size='md' onClick={this.close.bind(this)}/>
                        </div>
                    </div>
                </div>
                <audio ref="audioWrapper" src={this.props.song.currentItem?this.props.song.currentItem.play_url:''}
                       autoPlay={true} preload="auto" onTimeUpdate={this.updateTime.bind(this)}>
                </audio>
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
)(Player)
