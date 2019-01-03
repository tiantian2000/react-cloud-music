/**
 * Created by Administrator on 2018/6/9.
 */
import React,{Component} from 'react'
import ReactSwipe from 'react-swipe';

class Slide extends Component{

    constructor(props) {
        super(props);
        this.state = {
            datalist:[],
            imgHeight: 154.28,
        };
    }

    componentDidMount(){

    }


    render() {
        var opt = {
            auto:4000, //多少时间滚动一次
            callback: (index)=>{ //每次滚动的回调方法
                this.setState({
                    index: index
                })
            }
        }
        return (
            <div>
                <ReactSwipe className="carousel" swipeOptions={opt} key={this.props.banner.length}>
                    {
                        this.props.banner.map((item,index)=>
                            <div key={index}>
                                <img src={item.imgurl} style={{width:'100%',height:this.state.imgHeight}}
                                alt="logo"/>
                            </div>
                        )
                    }
                </ReactSwipe>
            </div>
        )
    }
}

export default Slide