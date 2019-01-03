/**
 * Created by Administrator on 2018/2/27.
 * 总的reducer处理文件,融合各个reducer
 */
import {combineReducers} from 'redux'
import song from './song'
import songList from './song_list'
import songListIndex from './song_list_index'

export default combineReducers({
    song,
    songList,
    songListIndex
})