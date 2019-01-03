/**
 * Created by Administrator on 2017/11/14.
 */
import storage from 'good-storage'

const PLAYLIST_KEY = '__playlist'
const PLAYLIST_MAX_LENGTH = 100


export function savePlayList(query){
  //从storage中取数据,如果没有返回空数据
  let list = storage.get(PLAYLIST_KEY,[])
  //console.log(list)

  let index = list.findIndex((value,index,arr)=>{
      console.log(query)
      console.log(value)
      return value.currentItem.hash===query.currentItem.hash
  })
  console.log(index);

  if(index !== 0){ //如果找到的元素不是在第一个
    if(index > 0){ //查找到的数据不是在第一个
      //从把找到的元素从数组中删除
        list.splice(index,1)
    }
    //把查询的值保存到数组的第一个
      list.unshift(query)
    if(list.length>PLAYLIST_MAX_LENGTH){//如果超过了保存的最大数,则把数组的最后一个元素删除
        list.pop()
    }
  }

  console.log(list)
  //把最新的查询历史保存到storage中
  storage.set(PLAYLIST_KEY,list)
  return list
}

//从本地storage获取搜索历史
export function loadPlayList(){
  return storage.get(PLAYLIST_KEY,[])
}

//从本地storage中删除给定的搜索项
export function delItemPlayListHistory(query){
  //从storage中取数据,如果没有返回空数据
  let list = storage.get(PLAYLIST_KEY,[])
  let index = list.findIndex((value,index,arr)=>{
    return value.currentItem.hash===query.currentItem.hash
  })
  console.log(index)
  if(index>=0) list.splice(index,1)
  storage.set(PLAYLIST_KEY,list)
  return list
}

//从本地storage删除所有搜索项
export function delAllItemPlayListHistory(){
  storage.set(PLAYLIST_KEY,[])
  return []
}

