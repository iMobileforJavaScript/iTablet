/*
  Copyright © SuperMap. All rights reserved.
  Author: Wang zihao
  E-mail: zihaowang5325@qq.com
*/

import * as React from 'react'
import {
  View,
  StyleSheet,
  TouchableHighlight,
  Text,
  FlatList,
} from 'react-native'
import * as Util from '../../utils/constUtil'

const WIDTH = Util.WIDTH
const ITEMHEIGHT = 40
const bgColor = 'white'

export default class ListBtn extends React.Component {
  props: {
    data: any,
  }

  _renderItem = ({ item }) => (
    <TouchableHighlight
      style={styles.btn}
      onPress={item.onClick}
      underlayColor={Util.UNDERLAYCOLOR}
    >
      <View style={styles.containerView}>
        <Text>{item.key}</Text>
      </View>
    </TouchableHighlight>
  )

  render() {
    const data = this.props.data
      ? this.props.data
      : (() => {
        throw new Error('ListBtn: please input data!')
      })()
    const itemsNum = data.length
    return (
      <View style={[styles.container, { height: 41 * itemsNum + 1 }]}>
        <FlatList
          style={styles.list}
          data={data}
          renderItem={this._renderItem}
          ItemSeparatorComponent={Util.SEPARATOR}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    width: WIDTH,
    height: 165,
    borderStyle: 'solid',
    borderColor: Util.USUAL_SEPARATORCOLOR,
    borderWidth: 1,
    backgroundColor: bgColor,
  },
  list: {
    flex: 1,
  },
  btn: {
    height: ITEMHEIGHT,
    width: WIDTH,
    backgroundColor: bgColor,
  },
  containerView: {
    flex: 1,
    justifyContent: 'center',
    paddingLeft: 10,
  },
})
