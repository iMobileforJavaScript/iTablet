/**
 * Created by imobile-xzy on 2019/3/26.
 */

import React, { Component } from 'react'
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SectionList,
  FlatList,
  Image,
} from 'react-native'

import Container from '../../../../components/Container'
import NavigationService from '../../../NavigationService'
import { Toast } from '../../../../utils/index'
import { scaleSize } from '../../../../utils/screen'
import { getPinYinFirstCharacter } from '../../../../utils/pinyin'
import FriendListFileHandle from '../FriendListFileHandle'
import { getLanguage } from '../../../../language/index'
// import ConstPath from '../../../../constants/ConstPath'
// import { FileTools } from '../../../../native'

class CreateGroupChat extends Component {
  props: {
    navigation: Object,
    user: Object,
    friend: Object,
  }

  constructor(props) {
    super(props)

    this.state = {
      sections: [], //section数组
      listData: [], //源数组
      letterArr: [], //首字母数组
      seletctArr: [],
    }

    this._renderSectionHeader = this._renderSectionHeader.bind(this)
    this.language = this.props.navigation.getParam('language')
    this.groupID = this.props.navigation.getParam('groupID')
    this.refreshListCallBack = this.props.navigation.getParam('cb')
  }

  refresh = () => {
    this.getContacts()
  }
  componentDidMount() {
    this.friend = this.props.navigation.getParam('friend')
    this.user = this.props.navigation.getParam('user')
    this.getContacts()
  }

  shouldComponentUpdate(prevProps, prevState) {
    if (
      JSON.stringify(prevProps.user) !== JSON.stringify(this.props.user) ||
      JSON.stringify(prevState) !== JSON.stringify(this.state)
    ) {
      return true
    }
    return false
  }

  componentDidUpdate(prevProps) {
    if (JSON.stringify(prevProps.user) !== JSON.stringify(this.props.user)) {
      this.getContacts()
    }
  }

  // componentWillReceiveProps(nextProps) {
  //   this.getContacts()
  // }

  getContacts = () => {
    let results = FriendListFileHandle.getFriendList()
    if (results && results.userInfo.length !== 0) {
      let result = results.userInfo
      try {
        // let data =  API.app.contactlist();     //获取联系人列表
        // const {list} = data;

        let srcFriendData = []
        for (let key = 0; key < result.length; key++) {
          if (result[key].id && result[key].name) {
            let frend = {}
            frend['id'] = result[key].id
            frend['markName'] = result[key].markName
            frend['name'] = result[key].name
            frend['info'] = result[key].info
            if (frend['info'].isFriend !== 2) {
              srcFriendData.push(frend)
            }
          }
        }
        let sections = [],
          letterArr = []

        for (let i = 0; i < srcFriendData.length; i++) {
          let person = srcFriendData[i]
          let name = person['markName']
          let firstChar = getPinYinFirstCharacter(name, '-', true)
          let ch = firstChar[0]
          if (letterArr.indexOf(ch) === -1) {
            letterArr.push(ch)
          }
        }

        letterArr.sort()

        // eslint-disable-next-line
        letterArr.map((item, index) => {
          const module = srcFriendData.filter(it => {
            //遍历获取每一个首字母对应联系人
            let firstChar = getPinYinFirstCharacter(it['markName'], '-', true)
            let ch = firstChar[0]
            return ch === item
          })

          sections.push({ key: item, title: item, data: module })
        })

        this.setState({
          letterArr,
          sections,
        })
        // eslint-disable-next-line
      } catch (err) {
        //console.log('err', err)
        Toast.show(err.message)
      }
    }
  }

  _onFriendSelect = key => {
    // let friend = {
    //   id: key.id,
    //   users: [key.markName],
    //   message: [],
    //   title: key.markName,
    // }

    let seletctArr = [...this.state.seletctArr]
    let n = -1
    for (let i = 0; i < seletctArr.length; i++) {
      if (key.id === seletctArr[i].id) {
        n = i
        break
      }
    }
    if (n !== -1) {
      seletctArr.splice(n, 1)
    } else {
      seletctArr.push({ id: key.id, name: key.name })
    }

    this.setState({ seletctArr })
    // let chatObj = {}
    // if (this.props.friend.props.chat.hasOwnProperty(this.props.user.userId)) {
    //   let chats = this.props.friend.props.chat[this.props.user.userId]
    //   if (chats.hasOwnProperty(key.id)) {
    //     chatObj = chats[key.id]
    //     friend = {
    //       id: key.id,
    //       users: [key.markName],
    //       message: chatObj,
    //       title: key.markName,
    //     }
    //   }
    // }

    // NavigationService.navigate('Chat', {
    //   target: friend,
    //   curUser: this.props.user,
    //   friend: this.props.friend,
    // })
  }
  _onSectionselect = key => {
    //滚动到指定的偏移的位置
    this.SectionList.scrollToLocation({
      animated: true,
      itemIndex: 0,
      sectionIndex: key,
      viewOffset: scaleSize(35),
    })
    // this.refs._sectionList.scrollToOffset({animated: true, offset: offset});
  }

  render() {
    const { letterArr, sections } = this.state
    //偏移量 = （设备高度 - 字母索引高度 - 底部导航栏 - 顶部标题栏 - 24）/ 2
    // const top_offset = (Dimensions.get('window').height - letterArr.length*scaleSize(35) - 24) / 2;

    let nSelect =
      getLanguage(this.language).Friends.CONFIRM2 +
      '(' +
      this.state.seletctArr.length +
      ')'
    return (
      <Container
        ref={ref => (this.container = ref)}
        headerProps={{
          title: getLanguage(this.language).Friends.TITLE_CHOOSE_FRIEND,
          // '选择好友',
          withoutBack: false,
          navigation: this.props.navigation,
          headerRight: (
            <TouchableOpacity
              onPress={() => {
                {
                  if (this.state.seletctArr.length === 0) return
                  if (!this.groupID && this.state.seletctArr.length < 2) {
                    Toast.show(
                      getLanguage(this.language).Friends.TOAST_CHOOSE_2,
                    )
                    return
                  }
                  let newMembers = []
                  if (this.groupID) {
                    for (
                      let member = 0;
                      member < this.state.seletctArr.length;
                      member++
                    ) {
                      if (
                        !FriendListFileHandle.isInGroup(
                          this.groupID,
                          this.state.seletctArr[member].id,
                        )
                      ) {
                        newMembers.push(this.state.seletctArr[member])
                      }
                    }
                    if (newMembers.length === 0) {
                      Toast.show(
                        getLanguage(this.language).Friends
                          .SYS_FRIEND_ALREADY_IN_GROUP,
                      )
                      return
                    }
                    NavigationService.goBack()
                    this.friend.addGroupMember(this.groupID, newMembers)
                    this.refreshListCallBack && this.refreshListCallBack()
                  } else {
                    NavigationService.goBack()
                    this.friend.createGroupTalk(this.state.seletctArr)
                  }
                }
              }}
              style={styles.searchView}
            >
              <Text
                style={{
                  color: 'white',
                  fontSize: scaleSize(25),
                  textAlign: 'center',
                }}
              >
                {nSelect}
              </Text>
            </TouchableOpacity>
          ),
        }}
      >
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'flex-start',
            marginTop: scaleSize(10),
          }}
        >
          <SectionList
            ref={ref => (this.SectionList = ref)}
            renderSectionHeader={this._renderSectionHeader}
            ItemSeparatorComponent={() => {
              return <View style={styles.SectionSeparaLineStyle} />
            }}
            sections={sections}
            keyExtractor={(item, index) => index}
            numColumns={1}
            renderItem={({ item, index }) => this._renderItem(item, index)}
            ListEmptyComponent={() => (
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginTop: scaleSize(50),
                }}
              >
                <Text style={{ fontSize: scaleSize(30), textAlign: 'center' }}>
                  {getLanguage(this.language).Friends.NO_FRIEND}
                </Text>
              </View>
            )} // 数据为空时调用
          />
          <View style={styles.FlatListViewStyle}>
            <FlatList
              data={letterArr}
              keyExtractor={(item, index) => index.toString()} //不重复的key
              renderItem={({ item, index }) => (
                <TouchableOpacity
                  style={styles.FlatListItemViewStyle}
                  onPress={() => {
                    this._onSectionselect(index)
                  }}
                >
                  <Text style={{ fontSize: scaleSize(25) }}>
                    {item.toUpperCase()}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Container>
    )
  }

  _renderSectionHeader(sectionItem) {
    const { section } = sectionItem
    return (
      <View style={styles.HeadViewStyle}>
        <Text style={styles.HeadTextStyle}>{section.title.toUpperCase()}</Text>
      </View>
    )
  }

  _renderItem(item) {
    let bShowImage = false
    for (let i = 0; i < this.state.seletctArr.length; i++) {
      if (item.id === this.state.seletctArr[i].id) {
        bShowImage = true
        break
      }
    }

    return (
      <TouchableOpacity
        style={styles.ItemViewStyle}
        activeOpacity={0.75}
        onPress={() => this._onFriendSelect(item)}
      >
        <View style={styles.ITemHeadTextViewStyle}>
          <Text style={styles.ITemHeadTextStyle}>
            {item['markName'][0].toUpperCase()}
          </Text>
        </View>
        <View style={styles.ITemTextViewStyle}>
          <Text style={styles.ITemTextStyle}>{item['markName']}</Text>
        </View>
        {bShowImage ? (
          <View
            style={{
              marginRight: scaleSize(20),
              flexDirection: 'row',
              justifyContent: 'flex-end',
              flexGrow: 1,
            }}
          >
            <Image
              source={require('../../../../assets/lightTheme/friend/app-group-submit.png')}
              style={{ width: scaleSize(30), height: scaleSize(30) }}
            />
          </View>
        ) : null}
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  HeadViewStyle: {
    height: scaleSize(35),
    backgroundColor: 'rgba(160,160,160,1.0)',
    paddingHorizontal: scaleSize(10),
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: scaleSize(10),
    marginRight: scaleSize(10),
  },
  HeadTextStyle: {
    fontSize: scaleSize(22),
    color: 'white',
    marginLeft: scaleSize(20),
  },
  ItemViewStyle: {
    paddingLeft: scaleSize(20),
    paddingRight: scaleSize(30),
    height: scaleSize(70),
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  ITemHeadTextViewStyle: {
    marginLeft: scaleSize(20),
    height: scaleSize(60),
    width: scaleSize(60),
    borderRadius: scaleSize(60),
    backgroundColor: 'green',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ITemHeadTextStyle: {
    fontSize: scaleSize(30),
    color: 'white',
  },

  ITemTextViewStyle: {
    marginLeft: scaleSize(20),
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexGrow: 1,
  },
  ITemTextStyle: {
    fontSize: scaleSize(30),
    color: 'black',
  },
  SectionSeparaLineStyle: {
    height: scaleSize(1),
    backgroundColor: 'rgba(160,160,160,1.0)',
    marginHorizontal: scaleSize(10),
    marginLeft: scaleSize(120),
  },
  FlatListViewStyle: {
    position: 'absolute',
    width: scaleSize(26),
    right: scaleSize(15),
    top: scaleSize(35),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  FlatListItemViewStyle: {
    marginVertical: 2,
    height: scaleSize(30),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
})

export default CreateGroupChat
