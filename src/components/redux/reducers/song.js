/**
 * Created by Administrator on 2018/6/7.
 */
/**
 * Created by Administrator on 2018/2/27.
 * Reducers 指定了应用状态的变化如何响应 actions 并发送到 store 的，
 * 记住 actions 只是描述了有事情发生了这一事实，并没有描述应用如何更新 state。
 */
import * as actionTypes from '../constants/song'

const initialState = {}

export default function song(state=initialState,action){
    switch(action.type){
        case actionTypes.CURRENT_SONG_UPDATE: //如果是更新用户信息,则返回action中的data
            return Object.assign({},state,action.data)
            //return action.data
        default:
            return state
    }
}