/**
 * Created by Administrator on 2018/6/7.
 */
import * as actionTypes from '../constants/song'

//更新当前播放歌曲
export function update(data){
    return {
        type: actionTypes.CURRENT_SONG_UPDATE,
        data
    }
}