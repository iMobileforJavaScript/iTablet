/**
 * Created by imobile-xzy on 2019/3/18.
 */

// eslint-disable-next-line
import { Platform } from 'react-native'
import RNFS from 'react-native-fs'
import { SOnlineService } from 'imobile_for_reactnative'
// import { Toast } from '../../../utils/index'
import { FileTools } from '../../../native'

function isJSON(str) {
  if (typeof str === 'string') {
    try {
      var obj = JSON.parse(str)
      if (typeof obj === 'object' && obj) {
        return true
      } else {
        return false
      }
    } catch (e) {
      return false
    }
  }
}
export default class FriendListFileHandle {
  static friends = undefined
  static refreshCallback = undefined
  static refreshMessageCallback = undefined
  static friendListFile = ''
  static friendListFile_ol = ''

  static async getContacts(path, file, resultCallBack) {
    FriendListFileHandle.friends = undefined
    let friendListFile = path + '/' + file
    let onlineList = path + '/ol_fl'

    FriendListFileHandle.friendListFile = friendListFile
    FriendListFileHandle.friendListFile_ol = onlineList

    if (await FileTools.fileIsExist(friendListFile)) {
      let value = await RNFS.readFile(friendListFile)
      if (isJSON(value) === true) {
        FriendListFileHandle.friends = JSON.parse(value)
      }
    }

    if (await FileTools.fileIsExist(onlineList)) {
      let onlineVersion = undefined
      let onlinevalue = await RNFS.readFile(onlineList)
      if (isJSON(onlinevalue) === true) {
        onlineVersion = JSON.parse(onlinevalue)
      }
      if (
        onlineVersion &&
        (!FriendListFileHandle.friends ||
          onlineVersion.rev > FriendListFileHandle.friends.rev)
      ) {
        FriendListFileHandle.friends = onlineVersion
        FileTools.fileIsExist(FriendListFileHandle.friendListFile).then(
          value => {
            if (value) {
              RNFS.unlink(FriendListFileHandle.friendListFile).then(() => {
                RNFS.writeFile(FriendListFileHandle.friendListFile, onlinevalue)
              })
            } else {
              RNFS.writeFile(FriendListFileHandle.friendListFile, onlinevalue)
            }
          },
        )
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
                  FriendListFileHandle.saveHelper(value)
                  //  RNFS.writeFile(FriendListFileHandle.friendListFile, value)
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
        {
          // eslint-disable-next-line
          onResult: value => {},
        },
      )
    })
  }

  static saveHelper(friendsStr, callback) {
    FileTools.fileIsExist(FriendListFileHandle.friendListFile).then(value => {
      if (value) {
        RNFS.unlink(FriendListFileHandle.friendListFile).then(() => {
          RNFS.writeFile(FriendListFileHandle.friendListFile, friendsStr).then(
            () => {
              FriendListFileHandle.upload()
              if (FriendListFileHandle.refreshCallback) {
                FriendListFileHandle.refreshCallback(true)
              }
              if (callback) {
                callback(true)
              }
            },
          )
        })
      } else {
        RNFS.writeFile(FriendListFileHandle.friendListFile, friendsStr).then(
          () => {
            FriendListFileHandle.upload()
            if (FriendListFileHandle.refreshCallback) {
              FriendListFileHandle.refreshCallback(true)
            }
            if (callback) {
              callback(true)
            }
          },
        )
      }
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
      FriendListFileHandle.saveHelper(friendsStr)
    }
  }

  static modifyFriendList(id, name) {
    for (let key in FriendListFileHandle.friends.userInfo) {
      let friend = FriendListFileHandle.friends.userInfo[key]
      if (id === friend.id) {
        if (name !== '') {
          friend.markName = name
        } else {
          friend.markName = friend.name
        }
        break
      }
    }

    FriendListFileHandle.friends['rev'] += 1

    let friendsStr = JSON.stringify(FriendListFileHandle.friends)
    FriendListFileHandle.saveHelper(
      friendsStr,
      FriendListFileHandle.refreshMessageCallback,
    )
  }

  // eslint-disable-next-line
  static delFromFriendList(id, callback) {
    for (let key in FriendListFileHandle.friends.userInfo) {
      let friend = FriendListFileHandle.friends.userInfo[key]
      if (id === friend.id) {
        FriendListFileHandle.friends.userInfo.splice(key, 1)
        break
      }
    }

    FriendListFileHandle.friends['rev'] += 1

    let friendsStr = JSON.stringify(FriendListFileHandle.friends)
    FriendListFileHandle.saveHelper(friendsStr)
  }

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

  //判断是否是好友，以后可能会改变判断逻辑
  static isFriend(id) {
    let isFriend = false
    if (this.findFromFriendList(id)) {
      isFriend = true
    }
    return isFriend
  }

  static getFriend(id) {
    if (FriendListFileHandle.friends) {
      for (let key in FriendListFileHandle.friends.userInfo) {
        if (FriendListFileHandle.friends.userInfo[key].id === id) {
          return FriendListFileHandle.friends.userInfo[key]
        }
      }
    }
    return undefined
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

  static getGroup(id) {
    if (FriendListFileHandle.friends) {
      for (let key in FriendListFileHandle.friends.groupInfo) {
        if (FriendListFileHandle.friends.groupInfo[key].id === id) {
          return FriendListFileHandle.friends.groupInfo[key]
        }
      }
    }
    return undefined
  }

  static getGroupMember(groupId, userId) {
    let group = FriendListFileHandle.getGroup(groupId)
    for (let key in group.members) {
      if (group.members[key].id === userId) {
        return group.members[key]
      }
    }
    return undefined
  }

  // 添加群
  static addToGroupList(obj) {
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
      FriendListFileHandle.saveHelper(friendsStr)
    }
  }
  // 删除群
  static delFromGroupList(id, callback) {
    for (let key in FriendListFileHandle.friends.groupInfo) {
      let friend = FriendListFileHandle.friends.groupInfo[key]
      if (id === friend.id) {
        FriendListFileHandle.friends.groupInfo.splice(key, 1)
        break
      }
    }

    FriendListFileHandle.friends['rev'] += 1

    let friendsStr = JSON.stringify(FriendListFileHandle.friends)
    FriendListFileHandle.saveHelper(friendsStr)

    callback && callback()
  }
  //更改群名
  static modifyGroupList(id, name) {
    for (let key in FriendListFileHandle.friends.groupInfo) {
      let friend = FriendListFileHandle.friends.groupInfo[key]
      if (id === friend.id) {
        if (name !== '') {
          friend.groupName = name
        }
        break
      }
    }

    FriendListFileHandle.friends['rev'] += 1

    let friendsStr = JSON.stringify(FriendListFileHandle.friends)
    FriendListFileHandle.saveHelper(
      friendsStr,
      FriendListFileHandle.refreshMessageCallback,
    )
  }

  static addGroupMember(groupId, user) {
    let group = FriendListFileHandle.getGroup(groupId)
    if (group) {
      group.members.push(user)
      let friendsStr = JSON.stringify(FriendListFileHandle.friends)
      FriendListFileHandle.saveHelper(friendsStr)
    }
  }

  static removeGroupMember(groupId, userId) {
    let group = FriendListFileHandle.getGroup(groupId)
    if (group) {
      for (let key in group.members) {
        if (group.members[key].id === userId) {
          group.members.splice(key, 1)
          let friendsStr = JSON.stringify(FriendListFileHandle.friends)
          FriendListFileHandle.saveHelper(friendsStr)
          break
        }
      }
    }
  }
}
