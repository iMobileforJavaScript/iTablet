import React, { Component } from 'react'
import {
  View,
  FlatList,
  Image,
  TouchableOpacity,
  Text,
  StyleSheet,
} from 'react-native'
import { getPublicAssets } from '../../../../../../../../assets'
import { scaleSize, setSpText } from '../../../../../../../../utils'
import color from '../../../../../../../../styles/color'
import { getLanguage } from '../../../../../../../../language'

export default class SelectList extends Component {
  props: {
    data: Array,
    onSelect: () => {},
  }
  constructor(props) {
    super(props)
    this.state = {
      data: props.data || [],
    }
  }

  _onSelect = (item, index) => {
    let data = JSON.parse(JSON.stringify(this.state.data))
    data[index].selected = !data[index].selected
    this.setState(
      {
        data,
      },
      () => {
        this.props.onSelect && this.props.onSelect(data)
      },
    )
  }

  _renderItem = ({ item, index }) => {
    let image = item.selected
      ? getPublicAssets().common.icon_check
      : getPublicAssets().common.icon_uncheck
    return (
      <View style={styles.row}>
        <TouchableOpacity
          style={styles.innerRow}
          onPress={() => {
            this._onSelect(item, index)
          }}
        >
          <View style={styles.clickItem}>
            <Image style={styles.image} source={image} resizeMode={'contain'} />
          </View>
          <View style={styles.textWrap}>
            <Text style={styles.text}>{item.name}</Text>
          </View>
        </TouchableOpacity>
        {this._renderLine()}
      </View>
    )
  }

  _renderLine = () => {
    return <View style={styles.separator} />
  }
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>
          {getLanguage(GLOBAL.language).Map_Main_Menu.CLIP_LAYER}
        </Text>
        {this._renderLine()}
        <FlatList
          data={this.state.data}
          renderItem={this._renderItem}
          keyExtractor={(item, index) => item.toString() + index}
          // getItemLayout={(data, index) => {
          //   return {
          //     length: scaleSize(80),
          //     offset: scaleSize(81) * index,
          //     index,
          //   }
          // }}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: scaleSize(80),
  },
  title: {
    fontSize: setSpText(20),
    paddingLeft: scaleSize(20),
    paddingVertical: scaleSize(20),
  },
  row: {
    height: scaleSize(81),
    paddingHorizontal: scaleSize(20),
  },
  innerRow: {
    flexDirection: 'row',
    height: scaleSize(80),
    flex: 1,
  },
  clickItem: {
    width: scaleSize(80),
    height: scaleSize(80),
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: scaleSize(40),
    height: scaleSize(40),
  },
  textWrap: {
    flex: 1,
    justifyContent: 'center',
  },
  text: {
    fontSize: setSpText(20),
  },
  separator: {
    width: '100%',
    height: 1,
    backgroundColor: color.separateColorGray,
  },
})
