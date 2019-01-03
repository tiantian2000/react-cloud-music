/**
 * Created by Administrator on 2018/6/7.
 */
import * as actionTypes from '../constants/song_list'

//更新当前播放列表
export function update(data){
    return {
        type: actionTypes.CURRENT_SONG_LIST_UPDATE,
        data
    }
}