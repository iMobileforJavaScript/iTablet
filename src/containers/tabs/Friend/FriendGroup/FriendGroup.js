/**
 * Created by imobile-xzy on 2019/3/4.
 */

import React, { Component } from 'react'
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  FlatList,
  RefreshControl,
} from 'react-native'

import NavigationService from '../../../NavigationService'
import { Toast } from '../../../../utils/index'
import { scaleSize } from '../../../../utils/screen'
// import { getPinYinFirstCharacter } from '../../../../utils/pinyin'
import FriendListFileHandle from '../FriendListFileHandle'
// eslint-disable-next-line
import { ActionPopover } from 'teaset'
// import { styles } from './../Styles'
import { getLanguage } from '../../../../language/index'

class FriendGroup extends Component {
  props: {
    language: String,
    friend: Object,
    user: Object,
    chat: Array,
  }

  constructor(props) {
    super(props)
    this.screenWidth = Dimensions.get('window').width
    this.inFormData = []

    this.state = {
      data: [],
      isRefresh: false,
      hasInformMsg: 0,
      inputText: '',
    }
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
      let result = results.groupInfo
      try {
        // let data =  API.app.contactlist();     //获取联系人列表
        // const {list} = data;

        let srcFriendData = []
        for (let key = 0; key < result.length; key++) {
          if (result[key].id && result[key].groupName) {
            let frend = {}
            frend['id'] = result[key].id
            frend['groupName'] = result[key].groupName
            frend['members'] = result[key].members
            frend['masterID'] = result[key].masterID
            srcFriendData.push(frend)
          }
        }

        this.setState({
          data: srcFriendData,
        })
        // eslint-disable-next-line
      } catch (err) {
        //console.log('err', err)
        Toast.show(err.message)
      }
    } else {
      this.setState({
        data: [],
      })
    }
  }

  _onSectionselect = key => {
    NavigationService.navigate('Chat', {
      targetId: key.id,
    })
  }

  render() {
    //console.log(params.user);
    return (
      <View
        style={{
          flex: 1,
          flexDirection: 'column',
          justifyContent: 'flex-start',
          backgroundColor: 'white',
          marginTop: scaleSize(20),
        }}
      >
        <FlatList
          ItemSeparatorComponent={() => {
            return <View style={styles.SectionSeparaLineStyle} />
          }}
          data={this.state.data}
          renderItem={({ item, index }) => this._renderItem(item, index)}
          keyExtractor={(item, index) => index.toString()}
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
      </View>
    )
  }

  _renderItem(item) {
    return (
      <TouchableOpacity
        style={[styles.ItemViewStyle]}
        activeOpacity={0.75}
        onPress={() => this._onSectionselect(item)}
      >
        <View style={styles.ITemHeadTextViewStyle}>
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'row',
              flexWrap: 'wrap',
            }}
          >
            {this._renderItemHeadView(item)}
          </View>
        </View>
        <View style={styles.ITemTextViewStyle}>
          <Text style={styles.ITemTextStyle}>{item.groupName}</Text>
        </View>
      </TouchableOpacity>
    )
  }

  _renderItemHeadView(item) {
    if (item.members.length > 1) {
      let texts = []
      for (let i = 0; i < item.members.length; i++) {
        if (i > 4) break
        texts.push(
          <Text
            key={i}
            style={{ fontSize: scaleSize(18), color: 'white', top: 2, left: 1 }}
          >
            {item['members'][i].name[0].toUpperCase() + ' '}
          </Text>,
        )
      }
      return texts
    } else {
      return (
        <Text style={styles.ITemHeadTextStyle}>
          {item['members'][0].name[0]}
        </Text>
      )
    }
  }

  _renderItemTitleView(item) {
    return <Text style={styles.ITemTextStyle}>{item['title']}</Text>
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
    height: scaleSize(90),
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  ITemHeadTextViewStyle: {
    marginLeft: scaleSize(20),
    height: scaleSize(60),
    width: scaleSize(60),
    borderRadius: scaleSize(20),
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
export default FriendGroup
