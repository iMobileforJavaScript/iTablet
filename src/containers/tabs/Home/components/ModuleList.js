import React, { Component } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  FlatList,
  // Dimensions,
  StyleSheet,
  ScrollView,
  // Dimensions,
} from 'react-native'
import { ConstModule } from '../../../../constants'
import { scaleSize } from '../../../../utils'
// const SCREEN_WIDTH = Dimensions.get('window').width
export default class ModuleList extends Component {
  props: {
    currentUser: Object,
    device: Object,
  }

  constructor(props) {
    super(props)
  }

  itemAction = item => {
    item.action && item.action(this.props.currentUser)
  }
  _renderItem = ({ item }) => {
    return (
      <View style={styles.moduleView}>
        <TouchableOpacity
          onPress={() => this.itemAction(item)}
          style={styles.module}
        >
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
  _renderScrollView = () => {
    return (
      <ScrollView
        style={styles.scrollView}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
      >
        <FlatList
          data={ConstModule}
          renderItem={this._renderItem}
          horizontal={false}
          numColumns={2}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps={'always'}
        />
      </ScrollView>
    )
  }
  render() {
    return (
      <View style={styles.container}>
        {this.props.device.orientation === 'LANDSCAPE' ? (
          this._renderScrollView()
        ) : (
          <FlatList
            style={styles.flatList}
            data={ConstModule}
            renderItem={this._renderItem}
            horizontal={false}
            numColumns={2}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps={'always'}
          />
        )}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    marginTop: scaleSize(40),
    alignItems: 'center',
  },
  flatList: {
    marginTop: scaleSize(150),
  },
  baseImage: {
    position: 'absolute',
    width: scaleSize(260),
    height: scaleSize(145),
  },
  module: {
    width: scaleSize(270),
    height: scaleSize(145),
    justifyContent: 'center',
  },
  moduleImage: {
    width: scaleSize(100),
    height: scaleSize(80),
  },
  moduleView: {
    width: scaleSize(270),
    height: scaleSize(155),
    paddingHorizontal: scaleSize(5),
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
  scrollView: {
    // position:"absolute",
    // width: '72%',
    // height:"100%",
    flex: 1,
    flexDirection: 'column',
    // alignItems:"center",
    // justifyContent: 'space-around',
    // marginTop: scaleSize(80),
  },
})
