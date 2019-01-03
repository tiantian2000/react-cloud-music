/**
 * Created by Administrator on 2018/6/12.
 */
/**
 * Created by Administrator on 2018/6/9.
 */
import React,{Component} from 'react'
import { Carousel } from 'antd-mobile';

class Slide extends Component{

    constructor() {
        super();
        this.state = {
            data: ['1', '2', '3','4'],
            imgHeight: 154.28,
        };
    }

    componentDidMount(){

    }

    componentWillReceiveProps(nextProps){
        this.setState({
            data: nextProps.banner
        })
    }


    render() {

        return (
            <div>
                <Carousel
                    autoplay
                    infinite
                    selectedIndex={0}
                    autoplayInterval={3000}

                >
                    {this.state.data.map((item,index) => (
                        <a
                            key={index}
                            href="/"
                            style={{ display: 'inline-block', width: '100%', height: this.state.imgHeight }}
                        >
                            <img
                                src={item.imgurl}
                                alt=""
                                style={{ width: '100%', verticalAlign: 'top' }}
                                onLoad={() => {
                                    // fire window resize event to change height
                                    window.dispatchEvent(new Event('resize'));
                                    this.setState({ imgHeight: 'auto' });
                                }}
                            />
                        </a>
                    ))}
                </Carousel>
            </div>
        )
    }
}

export default Slide