/**
 * Created by Administrator on 2018/5/31.
 */
import React, { Component } from 'react';
import './music_progress.css'

class Progress extends Component {

    changeProgress(e){
       let progressBar = this.refs.progressBar
        //e.clientX 点击的x轴的位置
        //progressBar.getBoundingClientRect().left 进度条开始的位置
        //e.clientX-progressBar.getBoundingClientRect().left 进度条当前的位置
        //progressBar.clientWidth进度条的宽度
        let progress = (e.clientX-progressBar.getBoundingClientRect().left) / progressBar.clientWidth
        //设用回调函数向父组件传递点击的进度
        this.props.onProgressChange(progress)
    }

    render() {
        return (
            <div className="music_progress" ref="progressBar"  onClick={this.changeProgress.bind(this)}>
                <div className="progress" style={{width: `${this.props.progress}%`,
                    backgroundColor:this.props.bgColor}}>
                </div>
                <div className="play-dot" style={{right: `${100-this.props.progress}%`,
                    width:`${this.props.playDot?'':'0px'}` ,height:`${this.props.playDot?'':'0px'}`}}></div>
            </div>
        );
    }
}

export default Progress;