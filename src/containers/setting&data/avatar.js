/*
  Copyright © SuperMap. All rights reserved.
  Author: Wang zihao
  E-mail: zihaowang5325@qq.com
*/

import * as React from 'react'
import { View, StyleSheet, TouchableHighlight, Text, Image } from 'react-native'
import * as Util from '../../utils/constUtil'

const WIDTH = Util.WIDTH
const HEIGHT = 120
const BGCOLOR = Util.USUAL_GREEN

export default class Avatar extends React.Component {
  props: {
    image: any,
    btnClick: () => {},
    name: string,
    email: string,
  }

  render() {
    const imagePath = this.props.image
      ? this.props.image
      : require('../assets/common/avatar.png')
    const btnClick = this.props.btnClick ? this.props.btnClick : () => {}
    const name = this.props.name ? this.props.name : '用户名'
    const email = this.props.email ? this.props.email : '绑定邮箱'
    return (
      <View style={styles.container}>
        <View style={styles.content}>
          <Image style={styles.avatarImage} source={imagePath} />
          <View
            style={{
              flex: 1,
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              paddingLeft: 10,
            }}
          >
            <View style={styles.textContainer}>
              <Text style={styles.text}>{name}</Text>
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.text}>{email}</Text>
            </View>
          </View>
        </View>
        <TouchableHighlight
          style={styles.btnImage}
          onPress={btnClick}
          underlayColor={Util.UNDERLAYCOLOR}
        >
          <Image
            style={styles.btnImage}
            source={require('../assets/common/arrow-right.png')}
          />
        </TouchableHighlight>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    width: WIDTH,
    height: HEIGHT,
    backgroundColor: BGCOLOR,
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 30,
    paddingRight: 30,
  },
  content: {
    margin: 5,
    height: HEIGHT - 5 * 4 + 2,
    width: WIDTH - 60 - 40,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  avatarImage: {
    height: HEIGHT - 5 * 4,
    width: HEIGHT - 5 * 4,
    borderColor: Util.USUAL_SEPARATORCOLOR,
    borderWidth: 1,
    borderRadius: 5,
  },
  textContainer: {
    height: 35,
    margin: 5,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 17,
  },
  btnImage: {
    height: 40,
    width: 40,
  },
})
