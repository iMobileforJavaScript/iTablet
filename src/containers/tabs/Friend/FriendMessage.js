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
} from 'react-native'

import NavigationService from '../../NavigationService'
import { scaleSize } from '../../../utils/screen'

class FriendMessage extends Component {
  props: {
    navigation: Object,
    user: Object,
  }

  constructor(props) {
    super(props)
    this.screenWidth = Dimensions.get('window').width
    this.state = {
      data: [],
    }
  }

  componentDidMount() {
    this.getContacts()
  }

  getContacts() {
    let srcData = [
      { users: ['白小白'], message: '你好', time: '11:03', messageType: 1 },
      {
        users: ['阿凡达'],
        message: 'nice to meet U ',
        time: '11:20',
        messageType: 1,
      },
      {
        users: ['白小白', '黄二', 'alice', '文胖'],
        message: '黄二:来群聊',
        time: '11:05',
        messageType: 2,
      },
      {
        users: ['白小白'],
        message: '你好,请求添加您为好友',
        time: '11:08',
        messageType: 3,
      },
      {
        users: ['黄二'],
        message: '你好,请求添加您为好友',
        time: '11:09',
        messageType: 3,
      },
    ]
    let noteArr = [],
      arr = []
    for (var i in srcData) {
      let item = srcData[i]
      let title = ''
      if (item['messageType'] === 2) {
        for (var j in item['users']) {
          if (j > 3) break
          if (j < 3) title += item['users'][j] + '、'
          else title += item['users'][j]
        }
      } else {
        title = item['users'][0]
      }
      item['title'] = title
      if (item['messageType'] === 3) {
        noteArr.push(item)
      } else {
        arr.push(item)
      }
    }
    noteArr.sort(function(a, b) {
      if (a['time'] < b['time']) {
        return 1
      }
      if (a['time'] > b['time']) {
        return -1
      }
      return 0
    })

    arr.sort(function(a, b) {
      if (a['time'] < b['time']) {
        return 1
      }
      if (a['time'] > b['time']) {
        return -1
      }
      return 0
    })

    let data = noteArr.concat(arr)
    this.setState({
      data,
    })
  }

  _renderItemHeadView(item) {
    if (item['messageType'] === 2) {
      let texts = []
      for (var i in item['users']) {
        if (i > 4) break
        texts.push(
          <Text
            style={{ fontSize: scaleSize(18), color: 'white', top: 2, left: 1 }}
          >
            {item['users'][i][0].toUpperCase() + ' '}
          </Text>,
        )
      }
      return texts
    } else {
      return <Text style={styles.ITemHeadTextStyle}>{item['users'][0][0]}</Text>
    }
  }
  _renderItemTitleView(item) {
    {
      /*let title = ''*/
    }
    {
      /*if (item['messageType'] === 2) {*/
    }
    {
      /*for (var i in item['users']) {*/
    }
    {
      /*if (i > 3) break*/
    }
    {
      /*if (i < 3) title += item['users'][i] + '、'*/
    }
    {
      /*else title += item['users'][i]*/
    }
    //   }
    // } else {
    //   title = item['users'][0]
    // }
    return <Text style={styles.ITemTextStyle}>{item['title']}</Text>
  }

  _onSectionselect = item => {
    NavigationService.navigate('Chat', { messageInfo: item })
  }

  _renderItem(item, index) {
    return (
      <TouchableOpacity
        style={styles.ItemViewStyle}
        activeOpacity={0.75}
        onPress={() => {
          this._onSectionselect(item, index)
        }}
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
          {this._renderItemTitleView(item)}
          <Text
            style={{
              fontSize: scaleSize(20),
              color: 'grey',
              top: scaleSize(10),
            }}
          >
            {item['message']}
          </Text>
        </View>
        <View
          style={{
            marginRight: scaleSize(20),
            flexDirection: 'column',
            justifyContent: 'flex-end',
            flexGrow: 1,
          }}
        >
          <Text
            style={{
              fontSize: scaleSize(20),
              color: 'grey',
              textAlign: 'right',
            }}
          >
            {item['time']}
          </Text>
        </View>
      </TouchableOpacity>
    )
  }
  _
  render() {
    //console.log(params.user);
    return (
      <View
        style={{
          flex: 1,
          flexDirection: 'row',
          justifyContent: 'flex-start',
          backgroundColor: 'white',
        }}
      >
        <FlatList
          ItemSeparatorComponent={() => {
            return <View style={styles.SectionSeparaLineStyle} />
          }}
          data={this.state.data}
          renderItem={({ item, index }) => this._renderItem(item, index)}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
    )
  }
}
const styles = StyleSheet.create({
  ItemViewStyle: {
    paddingLeft: scaleSize(20),
    paddingRight: scaleSize(20),
    height: scaleSize(120),
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
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  ITemHeadTextStyle: {
    fontSize: scaleSize(30),
    color: 'white',
  },

  ITemTextViewStyle: {
    marginLeft: scaleSize(20),
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  ITemTextStyle: {
    fontSize: scaleSize(30),
    color: 'black',
  },
  SectionSeparaLineStyle: {
    height: scaleSize(1),
    backgroundColor: 'rgba(160,160,160,1.0)',
    marginLeft: scaleSize(120),
  },
})

export default FriendMessage
