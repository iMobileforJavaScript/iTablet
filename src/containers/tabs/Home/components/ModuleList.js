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
      <View style={styles.moduleView}>
        <TouchableOpacity onPress={item.action} style={styles.module}>
          <Image source={item.baseImage} style={styles.baseImage} />
          <View style={styles.moduleItem}>
            <Image
              resizeMode={'contain'}
              source={item.moduleImage}
              style={styles.moduleImage}
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
          data={ConstModule}
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
    flexDirection: 'column',
    marginTop: scaleSize(80),
    alignItems: 'center',
  },
  baseImage: {
    position: 'absolute',
    width: SCREEN_WIDTH * 0.361,
    height: SCREEN_WIDTH * 0.202,
  },
  module: {
    width: SCREEN_WIDTH * 0.361,
    height: SCREEN_WIDTH * 0.202,
    justifyContent: 'center',
  },
  moduleImage: {
    width: scaleSize(100),
    height: scaleSize(80),
  },
  moduleView: {
    width: SCREEN_WIDTH * 0.382,
    height: SCREEN_WIDTH * 0.202,
    paddingHorizontal: SCREEN_WIDTH * 0.01,
    marginTop: scaleSize(25),
  },
  moduleItem: {
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