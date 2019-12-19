/**
 * Created by imobile-xzy on 2019/3/4.
 */

import React, { Component } from 'react'
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SectionList,
  FlatList,
  RefreshControl,
} from 'react-native'

import NavigationService from '../../../NavigationService'
import { Toast } from '../../../../utils/index'
import { scaleSize } from '../../../../utils/screen'
import { getPinYinFirstCharacter } from '../../../../utils/pinyin'
import FriendListFileHandle from '../FriendListFileHandle'
// eslint-disable-next-line
import { ActionPopover } from 'teaset'
import { getLanguage } from '../../../../language/index'

class FriendList extends Component {
  props: {
    language: String,
    navigation: Object,
    user: Object,
    friend: Object,
    callBack: () => {},
  }

  constructor(props) {
    super(props)
    this.state = {
      sections: [], //section数组
      listData: [], //源数组
      letterArr: [], //首字母数组
      isRefresh: false,
      inputText: '',
    }

    this._renderSectionHeader = this._renderSectionHeader.bind(this)
  }

  componentDidMount() {
    this.getContacts()
  }

  refresh = () => {
    this.getContacts()
    this.setState({ isRefresh: false })
  }

  download = () => {
    FriendListFileHandle.initFriendList(this.props.user)
    this.setState({ isRefresh: false })
  }

  getContacts = async () => {
    let results = FriendListFileHandle.getFriendList()
    if (results) {
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
    } else {
      this.setState({
        letterArr: [],
        sections: [],
      })
    }
  }

  _onFriendSelect = key => {
    if (this.props.callBack !== undefined) {
      this.props.callBack(key.id)
    } else {
      NavigationService.navigate('Chat', {
        targetId: key.id,
      })
    }
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

    return (
      <View
        style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-start' }}
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
          // ListEmptyComponent={() => (
          //   <View
          //     style={{
          //       justifyContent: 'center',
          //       alignItems: 'center',
          //       marginTop: scaleSize(50),
          //     }}
          //   >
          //     <Text style={{ fontSize: scaleSize(30), textAlign: 'center' }}>
          //       {/* 您还未添加好友哦 */}
          //       {getLanguage(this.props.language).Friends.NO_FRIEND}
          //     </Text>
          //   </View>
          // )} // 数据为空时调用
          refreshControl={
            <RefreshControl
              refreshing={this.state.isRefresh}
              onRefresh={this.download}
              colors={['orange', 'red']}
              tintColor={'orange'}
              titleColor={'orange'}
              title={getLanguage(this.props.language).Friends.LOADING}
              enabled={true}
            />
          }
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
    return (
      <TouchableOpacity
        style={[styles.ItemViewStyle]}
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

export default FriendList
