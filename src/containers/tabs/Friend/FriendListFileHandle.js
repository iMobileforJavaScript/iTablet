/**
 * Created by imobile-xzy on 2019/3/18.
 */

// eslint-disable-next-line
import React, { Component } from 'react'
import { Platform } from 'react-native'
import RNFS from 'react-native-fs'
import { SOnlineService } from 'imobile_for_reactnative'
// import { Toast } from '../../../utils/index'
import { FileTools } from '../../../native'

export default class FriendListFileHandle {
  static friends = []
  static group = []
  static friendListFile = ''

  static async getContacts(path, file, resultCallBack) {
    let friendListFile = path + '/' + file
    let onlineList = path + '/ol_fl'

    FriendListFileHandle.friendListFile = friendListFile

    if (await FileTools.fileIsExist(friendListFile)) {
      let value = await RNFS.readFile(friendListFile)

      FriendListFileHandle.friends = JSON.parse(value)
    }

    if (await FileTools.fileIsExist(onlineList)) {
      let value = await RNFS.readFile(onlineList)

      let onlineVersion = JSON.parse(value)
      if (
        FriendListFileHandle.friends.length === 0 ||
        !FriendListFileHandle.friends[0].rev ||
        onlineVersion[0].rev > FriendListFileHandle.friends[0].rev
      ) {
        FriendListFileHandle.friends = onlineVersion
        RNFS.writeFile(friendListFile, value)
        //  RNFS.moveFile(friendListFile, path + 'friend.list')
      }
    }

    resultCallBack(FriendListFileHandle.friends)
  }

  static addToFriendList(obj) {
    let bFound = FriendListFileHandle.findFromFriendList(obj.id)

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
      if (FriendListFileHandle.friends.length === 0) {
        FriendListFileHandle.friends.push({ rev: 1 })
      } else {
        FriendListFileHandle.friends['0'].rev += 1
      }
      FriendListFileHandle.friends.push(obj)
      let friendsStr = JSON.stringify(FriendListFileHandle.friends)
      //写如本地
      RNFS.write(FriendListFileHandle.friendListFile, friendsStr, 0).then(
        () => {
          //上传
          SOnlineService.deleteData('friend.list').then(() => {
            let UploadFileName = 'friend.list.zip'
            if (Platform.OS === 'android') {
              UploadFileName = 'friend.list'
            }
            SOnlineService.uploadFile(
              FriendListFileHandle.friendListFile,
              UploadFileName,
              // eslint-disable-next-line
              { onResult: value => {} },
            )
          })
        },
      )
    }
  }
  // eslint-disable-next-line
  static delFromFriendList(id) {
    for (let key in FriendListFileHandle.friends) {
      let friend = FriendListFileHandle.friends[key]
      if (key === '0') {
        continue
      }
      if (id === friend.id) {
        FriendListFileHandle.friends.splice(key, 1)
        break
      }
    }

    FriendListFileHandle.friends['0'].rev += 1
  }
  // eslint-disable-next-line
  static findFromFriendList(id) {
    let bFound
    for (let key in FriendListFileHandle.friends) {
      let friend = FriendListFileHandle.friends[key]
      if (key === '0') {
        continue
      }
      if (id === friend.id) {
        bFound = friend
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
