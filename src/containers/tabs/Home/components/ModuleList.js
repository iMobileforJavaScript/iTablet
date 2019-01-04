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
    // marginTop: scaleSize(100),
    alignItems: 'center',
    justifyContent: 'center',
  },
  flatList: {
    marginTop: '40%',
    // marginLeft: scaleSize(40),
  },
  baseImage: {
    position: 'absolute',
    width: scaleSize(280),
    height: scaleSize(210),
    resizeMode: 'center',
  },
  module: {
    width: scaleSize(280),
    height: scaleSize(160),
    justifyContent: 'center',
  },
  moduleImage: {
    width: scaleSize(100),
    height: scaleSize(80),
  },
  moduleView: {
    width: scaleSize(280),
    height: scaleSize(160),
    // paddingHorizontal: scaleSize(10),
    // marginTop: scaleSize(5),
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
    marginTop: '10%',
  },
})
