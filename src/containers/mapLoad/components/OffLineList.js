import * as React from 'react'
import { View, StyleSheet, Dimensions, Text, FlatList, TouchableOpacity, PixelRatio } from 'react-native'
import NavigationService from '../../../containers/NavigationService'   //导航模块
import { Utility } from 'imobile_for_javascript'

const width = Dimensions.get('window').width
const testData = [{ key: '打开' }]

class Item extends React.Component {

  props: {
    onPress: () => {},
    text: string,
  }

  action = () => {
    this.props.onPress && this.props.onPress()
  }

  render() {
    return (
      <View>
        <TouchableOpacity activeOpacity={0.8} style={styles.item} onPress={this.action} >
          <View style={styles.item}><Text style={{fontSize:18}}>{this.props.text ? this.props.text : 'item'}</Text></View>
        </TouchableOpacity>
        <View style={{ height: 2 / PixelRatio.get(), backgroundColor: '#bbbbbb'}} />
      </View>
    )
  }
}

export default class OffLineList extends React.Component {
  _btn_click=()=>{
    // NavigationService.navigate('LocalMap', {})
    // NavigationService.navigate('Directory', {})
    // let homePath = Utility.getHomeDirectory()
    // let list = Utility.getDirectoryContent(homePath)
  }

  _renderItem = ({ item }) => {
    let key = item.key
    return (
      <Item text={key} onPress={this._btn_click} />
    )
  }

  render() {
    return (
      <View style={styles.container}>
        <FlatList
          data={testData}
          renderItem={this._renderItem}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  item: {
    display: 'flex',
    justifyContent: 'center',
    height: 39,
    width: width,
    paddingLeft: 15,
  },
  container: {
    height: 40,
    width: width,
    backgroundColor: 'white',
    alignSelf: 'center',
  },
})