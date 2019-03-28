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
  static friends = undefined
  // static group = []
  static friendListFile = ''
  static friendListFile_ol = ''

  static async getContacts(path, file, resultCallBack) {
    let friendListFile = path + '/' + file
    let onlineList = path + '/ol_fl'

    FriendListFileHandle.friendListFile = friendListFile
    FriendListFileHandle.friendListFile_ol = onlineList

    if (await FileTools.fileIsExist(friendListFile)) {
      let value = await RNFS.readFile(friendListFile)

      FriendListFileHandle.friends = JSON.parse(value)
    }

    if (await FileTools.fileIsExist(onlineList)) {
      let value = await RNFS.readFile(onlineList)

      let onlineVersion = JSON.parse(value)
      if (
        !FriendListFileHandle.friends ||
        onlineVersion.rev > FriendListFileHandle.friends.rev
      ) {
        FriendListFileHandle.friends = onlineVersion
        RNFS.writeFile(friendListFile, value)
        //  RNFS.moveFile(friendListFile, path + 'friend.list')
      }
    }

    resultCallBack(FriendListFileHandle.friends)
  }
  static getContactsLocal() {
    return FriendListFileHandle.friends
  }

  static download() {
    SOnlineService.downloadFileWithCallBack(
      FriendListFileHandle.friendListFile_ol,
      'friend.list',
      {
        onResult: value => {
          // console.warn("-------------")
          if (value === true) {
            RNFS.readFile(FriendListFileHandle.friendListFile_ol).then(
              value => {
                let onlineVersion = JSON.parse(value)
                if (
                  !FriendListFileHandle.friends ||
                  onlineVersion.rev > FriendListFileHandle.friends.rev
                ) {
                  FriendListFileHandle.friends = onlineVersion
                  RNFS.writeFile(FriendListFileHandle.friendListFile, value)
                  //  RNFS.moveFile(friendListFile, path + 'friend.list')
                }
              },
            )
          }
        },
      },
    )
  }
  static upload() {
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
  }
  static addToFriendList(obj) {
    let bFound = FriendListFileHandle.findFromFriendList(obj.id)

    if (!bFound) {
      if (!FriendListFileHandle.friends) {
        FriendListFileHandle.friends = {}
        FriendListFileHandle.friends['rev'] = 1
        FriendListFileHandle.friends['userInfo'] = []
        FriendListFileHandle.friends['groupInfo'] = []
      } else {
        FriendListFileHandle.friends['rev'] += 1
      }
      FriendListFileHandle.friends.userInfo.push(obj)
      let friendsStr = JSON.stringify(FriendListFileHandle.friends)
      //写如本地
      RNFS.write(FriendListFileHandle.friendListFile, friendsStr, 0).then(
        () => {
          FriendListFileHandle.upload()
        },
      )
    }
  }
  // eslint-disable-next-line
  static delFromFriendList(id) {
    for (let key in FriendListFileHandle.friends.userInfo) {
      let friend = FriendListFileHandle.friends.userInfo[key]
      if (id === friend.id) {
        FriendListFileHandle.friends.userInfo.splice(key, 1)
        break
      }
    }

    FriendListFileHandle.friends['rev'] += 1
  }
  // eslint-disable-next-line
  static findFromFriendList(id) {
    let bFound
    if (FriendListFileHandle.friends) {
      for (let key in FriendListFileHandle.friends.userInfo) {
        let friend = FriendListFileHandle.friends.userInfo[key]
        if (id === friend.id) {
          bFound = friend
          break
        }
      }
    }

    return bFound
  }

  static findFromGroupList(id) {
    let bFound
    if (FriendListFileHandle.friends) {
      for (let key in FriendListFileHandle.friends.groupInfo) {
        let friend = FriendListFileHandle.friends.groupInfo[key]
        if (id === friend.id) {
          bFound = friend
          break
        }
      }
    }
    return bFound
  }

  // eslint-disable-next-line
  static addToGroupList(obj, callback) {
    let bFound = FriendListFileHandle.findFromGroupList(obj.id)

    if (!bFound) {
      if (!FriendListFileHandle.friends) {
        FriendListFileHandle.friends = {}
        FriendListFileHandle.friends['rev'] = 1
        FriendListFileHandle.friends['userInfo'] = []
        FriendListFileHandle.friends['groupInfo'] = []
      } else {
        FriendListFileHandle.friends['rev'] += 1
      }
      FriendListFileHandle.friends.groupInfo.push(obj)
      let friendsStr = JSON.stringify(FriendListFileHandle.friends)
      //写如本地
      RNFS.write(FriendListFileHandle.friendListFile, friendsStr, 0).then(
        () => {
          //上传
          FriendListFileHandle.upload()
          callback(true)
        },
      )
    }
  }
  // eslint-disable-next-line
  static delFromGroupList(id) {
    for (let key in FriendListFileHandle.friends.groupInfo) {
      let friend = FriendListFileHandle.friends.groupInfo[key]
      if (id === friend.id) {
        FriendListFileHandle.friends.groupInfo.splice(key, 1)
        break
      }
    }

    FriendListFileHandle.friends['rev'] += 1
  }
}
