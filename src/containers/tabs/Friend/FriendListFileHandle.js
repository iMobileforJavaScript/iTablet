/**
 * Created by imobile-xzy on 2019/3/18.
 */

// eslint-disable-next-line
import React, { Component } from 'react'
import RNFS from 'react-native-fs'
import { SOnlineService } from 'imobile_for_reactnative'
import { Toast } from '../../../utils/index'
import { FileTools } from '../../../native'

export default class FriendListFileHandle {
  static friends = {}
  static group = {}
  static friendListFile = ''

  static readLocalFriendList(friendListFile, resultCallBack) {
    RNFS.read(friendListFile)
      .then(value => {
        FriendListFileHandle.friends = JSON.parse(value)
        resultCallBack(FriendListFileHandle.friends)
      })
      // eslint-disable-next-line
      .catch(err => {
        Toast.show('读取好友列表失败!')
        resultCallBack(false)
      })
  }
  static getContacts(path, filePath, resultCallBack) {
    FriendListFileHandle.friendListFile = path + filePath
    let friendListFile = path + filePath

    //优先加载在线的
    friendListFile = path + 'tmp'
    SOnlineService.downloadFileWithCallBack(friendListFile, filePath, {
      onResult: value => {
        if (value === true) {
          RNFS.read(friendListFile)
            .then(value => {
              let onlineVersion = JSON.parse(value)
              //在线版本比本地新，更新下来

              if (
                !FriendListFileHandle.friends.hasOwnProperty('rev') ||
                onlineVersion[0].rev > FriendListFileHandle.friends[0].rev
              ) {
                FriendListFileHandle.friends = JSON.parse(value)
                RNFS.moveFile(friendListFile, path + 'friend.list')
                resultCallBack(FriendListFileHandle.friends)
              } else {
                RNFS.moveFile(friendListFile, path + '')
              }
            })
            // eslint-disable-next-line
            .catch(err => {
              Toast.show('读取好友列表失败!')
              resultCallBack(false)
            })
        } else {
          FileTools.fileIsExist(friendListFile)
            .then(value => {
              if (value) {
                FriendListFileHandle.readLocalFriendList(
                  friendListFile,
                  resultCallBack,
                )
              }
            })
            .catch()
        }
      },
    })
  }

  static addToFriendList(obj) {
    let bFound = FriendListFileHandle.findFromFriendList(obj)

    // for(let key in FriendListFileHandle.friends){
    //   let friend = FriendListFileHandle.friends[key];
    //   if(key === '0') {
    //     rev = obj;
    //     continue;
    //   }
    //   if(obj.id === friend.id){
    //     bFound = true;
    //     break;
    //   }
    // }

    if (!bFound) {
      FriendListFileHandle.friends['0'].rev += 1
      FriendListFileHandle.friends.push(obj)
    }
    let friendsStr = JSON.stringify(FriendListFileHandle.friends)
    RNFS.write(friendsStr, FriendListFileHandle.friendListFile).then(() => {
      SOnlineService.deleteData('friend.list').then(() => {
        SOnlineService.uploadFile(
          FriendListFileHandle.friendListFile,
          'friend.list',
        )
      })
    })
  }
  // eslint-disable-next-line
  static delFromFriendList(obj) {
    for (let key in FriendListFileHandle.friends) {
      let friend = FriendListFileHandle.friends[key]
      if (key === '0') {
        continue
      }
      if (obj.id === friend.id) {
        FriendListFileHandle.friends.splice(key, 1)
        break
      }
    }

    FriendListFileHandle.friends['0'].rev += 1
  }
  // eslint-disable-next-line
  static findFromFriendList(obj) {
    let bFound = false
    for (let key in FriendListFileHandle.friends) {
      let friend = FriendListFileHandle.friends[key]
      if (key === '0') {
        continue
      }
      if (obj.id === friend.id) {
        bFound = true
        break
      }
    }
    return bFound
  }
  // eslint-disable-next-line
  static addToGroupList(obj) {}
  // eslint-disable-next-line
  static delFromGroupList(obj) {}
  // eslint-disable-next-line
  static findFromGroupList(obj) {}
}
