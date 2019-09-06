/**
 * Created by imobile-xzy on 2019/3/18.
 */

// eslint-disable-next-line
import { Platform } from 'react-native'
import RNFS from 'react-native-fs'
import { SOnlineService } from 'imobile_for_reactnative'
import { FileTools } from '../../../native'
import ConstPath from '../../../constants/ConstPath'

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
  static user = undefined
  static friends = undefined
  static refreshCallback = undefined
  static refreshMessageCallback = undefined
  static friendListFile = ''
  static friendListFile_ol = ''

  /**
   * 初始化friendlist路径及读取本刷新列表
   * @param {*} user currentUser
   */
  static async init(user) {
    FriendListFileHandle.user = undefined
    FriendListFileHandle.friends = undefined

    if (user.userId === undefined) {
      return
    }
    FriendListFileHandle.user = user

    let userPath = await FileTools.appendingHomeDirectory(
      ConstPath.UserPath + user.userName + '/Data/Temp',
    )

    let friendListFile = userPath + '/friend.list'
    let onlineList = userPath + '/ol_fl'

    FriendListFileHandle.friendListFile = friendListFile
    FriendListFileHandle.friendListFile_ol = onlineList
    //读取本地文件并刷新
    await FriendListFileHandle.getLocalFriendList()
    //同步online文件并刷新
    await FriendListFileHandle.syncOnlineFriendList()
  }

  /**
   * 读取本地列表，删除online列表
   */
  static async getLocalFriendList() {
    if (await FileTools.fileIsExist(FriendListFileHandle.friendListFile)) {
      let value = await RNFS.readFile(FriendListFileHandle.friendListFile)
      if (isJSON(value) === true) {
        FriendListFileHandle.friends = JSON.parse(value)
      }
    }

    if (await FileTools.fileIsExist(FriendListFileHandle.friendListFile_ol)) {
      await RNFS.unlink(FriendListFileHandle.friendListFile_ol)
    }

    FriendListFileHandle.checkFriendList()
    FriendListFileHandle.refreshCallback()
    return FriendListFileHandle.friends
  }

  /**
   * 保持本地和online的文件一致
   */
  static async syncOnlineFriendList() {
    SOnlineService.downloadFileWithCallBack(
      FriendListFileHandle.friendListFile_ol,
      'friend.list',
      {
        onResult: async value => {
          if (value === true) {
            let value = await RNFS.readFile(
              FriendListFileHandle.friendListFile_ol,
            )
            let onlineVersion = JSON.parse(value)
            if (
              !FriendListFileHandle.friends ||
              onlineVersion.rev > FriendListFileHandle.friends.rev
            ) {
              //没有本地friendlist或online的版本较新，更新本地文件
              FriendListFileHandle.friends = onlineVersion
              await RNFS.writeFile(FriendListFileHandle.friendListFile, value)
              FriendListFileHandle.refreshCallback()
            } else if (onlineVersion.rev < FriendListFileHandle.friends.rev) {
              //本地版本较新，将本地文件更新到online
              await FriendListFileHandle.upload()
            }
            await RNFS.unlink(FriendListFileHandle.friendListFile_ol)
          } else if (FriendListFileHandle.friends !== undefined) {
            //没有获取到online文件，尝试更新本地到online
            await FriendListFileHandle.upload()
          }
        },
      },
    )
  }

  /**
   * 直接获取friendlist,friendlist更新完成后调用
   */
  static getFriendList() {
    return FriendListFileHandle.friends
  }

  static checkFriendList() {
    let fl = FriendListFileHandle.friends
    if (!fl) {
      return
    }

    if (fl.rev === undefined || typeof fl.rev !== 'number') {
      fl.rev = 0
    }

    if (fl.userInfo === undefined) {
      fl.userInfo = []
    }

    if (fl.userInfo.length !== 0) {
      for (let user = fl.userInfo.length - 1; user > -1; user--) {
        if (
          fl.userInfo[user].markName === undefined ||
          fl.userInfo[user].markName === ''
        ) {
          fl.userInfo.splice(user, 1)
          continue
        }
        if (
          fl.userInfo[user].name === undefined ||
          fl.userInfo[user].name === ''
        ) {
          fl.userInfo.splice(user, 1)
          continue
        }
        if (fl.userInfo[user].id === undefined || fl.userInfo[user].id === '') {
          fl.userInfo.splice(user, 1)
          continue
        }
        if (
          fl.userInfo[user].info === undefined ||
          fl.userInfo[user].info.isFriend === undefined
        ) {
          fl.userInfo.splice(user, 1)
          continue
        }
      }
    }

    if (fl.groupInfo === undefined) {
      fl.groupInfo = []
    }

    if (fl.groupInfo.length !== 0) {
      for (let group = fl.groupInfo.length - 1; group > -1; group--) {
        if (
          fl.groupInfo[group].id === undefined ||
          fl.groupInfo[group].id === ''
        ) {
          fl.groupInfo.splice(group, 1)
          continue
        }
        if (
          fl.groupInfo[group].groupName === undefined ||
          fl.groupInfo[group].groupName === ''
        ) {
          fl.groupInfo.splice(group, 1)
          continue
        }
        if (
          fl.groupInfo[group].masterID === undefined ||
          fl.groupInfo[group].masterID === ''
        ) {
          fl.groupInfo.splice(group, 1)
          continue
        }
        if (fl.groupInfo[group].members === undefined) {
          fl.groupInfo.splice(group, 1)
          continue
        } else {
          let userErr = false
          for (let user in fl.groupInfo[group].members) {
            if (
              fl.groupInfo[group].members[user].id === undefined ||
              fl.groupInfo[group].members[user].id === ''
            ) {
              userErr = true
              break
            }
            if (
              fl.groupInfo[group].members[user].name === undefined ||
              fl.groupInfo[group].members[user].name === ''
            ) {
              userErr = true
              break
            }
          }
          if (userErr) {
            fl.groupInfo.splice(group, 1)
            continue
          }
        }
      }
    }
  }

  static async upload() {
    //上传
    await SOnlineService.deleteData('friend.list')
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

  //管理关系
  static modifyIsFriend(id, isFriend) {
    for (let key in FriendListFileHandle.friends.userInfo) {
      let friend = FriendListFileHandle.friends.userInfo[key]
      if (id === friend.id) {
        friend.info.isFriend = isFriend

        FriendListFileHandle.friends['rev'] += 1
        let friendsStr = JSON.stringify(FriendListFileHandle.friends)
        FriendListFileHandle.saveHelper(
          friendsStr,
          FriendListFileHandle.refreshMessageCallback,
        )
        break
      }
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
    let isFriend = FriendListFileHandle.getIsFriend(id)
    if (isFriend === 1) {
      return true
    }
    return false
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

  /**
   * @param {*} id
   * @return:
   * undefiend: 没在好友列表
   * 0：被对方删除好友关系
   * 1：互相是好友关系
   * 2: 已添加好友，等待对方同意
   */
  static getIsFriend(id) {
    if (FriendListFileHandle.friends) {
      for (let key in FriendListFileHandle.friends.userInfo) {
        if (FriendListFileHandle.friends.userInfo[key].id === id) {
          return FriendListFileHandle.friends.userInfo[key].info.isFriend
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

  static readGroupMemberList(groupId) {
    let members = JSON.stringify(FriendListFileHandle.getGroup(groupId).members)
    return JSON.parse(members)
  }

  static isInGroup(groupId, userId) {
    let group = FriendListFileHandle.getGroup(groupId)
    if (group) {
      for (let key in group.members) {
        if (group.members[key].id === userId) {
          return true
        }
      }
    }
    return false
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

  static addGroupMember(groupId, members) {
    let group = FriendListFileHandle.getGroup(groupId)
    if (group) {
      for (let key in members) {
        if (!FriendListFileHandle.isInGroup(groupId, members[key].id)) {
          group.members.push(members[key])
        }
      }
      FriendListFileHandle.friends['rev'] += 1
      let friendsStr = JSON.stringify(FriendListFileHandle.friends)
      FriendListFileHandle.saveHelper(friendsStr)
    }
  }

  static removeGroupMember(groupId, members) {
    let group = FriendListFileHandle.getGroup(groupId)
    if (group) {
      for (let member in members) {
        for (let key in group.members) {
          if (group.members[key].id === members[member].id) {
            group.members.splice(key, 1)
            break
          }
        }
      }
      FriendListFileHandle.friends['rev'] += 1
      let friendsStr = JSON.stringify(FriendListFileHandle.friends)
      FriendListFileHandle.saveHelper(friendsStr)
    }
  }
}
