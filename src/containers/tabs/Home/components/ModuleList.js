import React, { Component } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  FlatList,
  Dimensions,
  StyleSheet,
} from 'react-native'
import { ConstModule } from '../../../../constains'
import { scaleSize } from '../../../../utils'
const SCREEN_WIDTH = Dimensions.get('window').width
export default class ModuleList extends Component {
  props: {}

  _renderItem({ item }) {
    return (
      <View style={styles.moduleview}>
        <TouchableOpacity style={styles.module}>
          <Image source={item.baseimage} style={styles.baseimage} />
          <View style={styles.moduleitem}>
            <Image
              resizeMode={'contain'}
              source={item.moduleimage}
              style={styles.moduleimage}
            />
            <Text style={styles.title}>{item.title}</Text>
          </View>
        </TouchableOpacity>
      </View>
    )
  }

  render() {
    return (
      <View style={styles.container}>
        <FlatList
          data={ConstModule.Module.data}
          renderItem={this._renderItem}
          horizontal={false}
          numColumns={2}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps={'always'}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // paddingHorizontal: scaleSize(60),
    flexDirection: 'column',
    // backgroundColor:'blue',
    marginTop: scaleSize(80),
    alignItems: 'center',
  },
  baseimage: {
    position: 'absolute',
    width: SCREEN_WIDTH * 0.361,
    height: SCREEN_WIDTH * 0.202,
  },
  module: {
    width: SCREEN_WIDTH * 0.361,
    height: SCREEN_WIDTH * 0.202,
    // flexDirection: 'column',
    // alignItems: 'center',
    justifyContent: 'center',
    // alignSelf: 'center',
  },
  moduleimage: {
    width: scaleSize(100),
    height: scaleSize(80),
  },
  moduleview: {
    width: SCREEN_WIDTH * 0.382,
    height: SCREEN_WIDTH * 0.202,
    paddingHorizontal: SCREEN_WIDTH * 0.01,
    marginTop: scaleSize(25),
  },
  moduleitem: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    width: scaleSize(150),
    height: scaleSize(40),
    fontSize: scaleSize(25),
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: scaleSize(10),
  },
})
