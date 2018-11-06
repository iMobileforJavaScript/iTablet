/*
  Copyright © SuperMap. All rights reserved.
  Author: Wang zihao
  E-mail: zihaowang5325@qq.com
*/

import * as React from 'react'
import { View, StyleSheet } from 'react-native'
import * as Util from '../../utils/constUtil'

import ListBtn from './ListBtn'
import Avatar from './avatar'

const BGCOLOR = Util.USUAL_GREEN

export default class Setting extends React.Component {
  _testClick = () => {}

  render() {
    let data = [
      { key: '账户与安全', onClick: this._testClick },
      { key: '隐私', onClick: this._testClick },
      { key: '通用', onClick: this._testClick },
      { key: '通知', onClick: this._testClick },
      { key: '缓存清理', onClick: this._testClick },
      { key: '功能反馈', onClick: this._testClick },
      { key: '关于', onClick: this._testClick },
    ]
    return (
      <View style={styles.container}>
        <Avatar name="Zihao Wang" email="zihao12345@qq.com" />
        <ListBtn data={data} />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BGCOLOR,
  },
})
