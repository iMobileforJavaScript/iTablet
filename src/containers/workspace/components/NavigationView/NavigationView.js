import * as React from 'react'
import {
  View,
  Image,
  TextInput,
  FlatList,
  TouchableOpacity,
  Text,
} from 'react-native'
import { getLanguage } from '../../../../language/index'
import styles from './styles'
import PropTypes from 'prop-types'
import { SScene, SMap } from 'imobile_for_reactnative'

export default class NavigationView extends React.Component {
  static propTypes = {
    mapNavigation: PropTypes.object,
    setMapNavigation: PropTypes.func,
  }

  constructor(props) {
    super(props)
    this.PointType = null
    this.state = {
      searchValue: null,
      searchData: [],
      analystData: [],
      firstPoint: null,
      secondPoint: null,
    }
  }

  close = () => {
    this.props.setMapNavigation({ isPointShow: false, isShow: false, name: '' })
    SMap.clearTarckingLayer()
  }

  _renderSearchView = () => {
    return (
      <View>
        <View style={styles.pointAnalystView}>
          <TouchableOpacity
            onPress={() => {
              this.close()
            }}
          >
            <Image
              resizeMode={'contain'}
              source={require('../../../../assets/public/icon-back-black.png')}
              style={styles.analyst1}
            />
          </TouchableOpacity>
          <View style={{ flexDirection: 'column' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Image
                resizeMode={'contain'}
                source={require('../../../../assets/mapToolbar/icon_scene_tool_start.png')}
                style={styles.startPoint}
              />
              <TextInput
                onChangeText={text => {
                  if (text === null || text === '') {
                    this.setState({ firstPoint: text, analystData: [] })
                    return
                  }
                  SScene.pointSearch(text)
                  this.PointType = 'firstPoint'
                  this.setState({ firstPoint: text })
                }}
                value={this.state.firstPoint}
                style={styles.onInput}
                placeholder={
                  getLanguage(global.language).Prompt.CHOOSE_STARTING_POINT
                }
                //{'请输入起点'}
              />
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Image
                resizeMode={'contain'}
                source={require('../../../../assets/mapToolbar/icon_scene_tool_end.png')}
                style={styles.endPoint}
              />
              <TextInput
                onChangeText={text => {
                  if (text === null || text === '') {
                    this.setState({ secondPoint: text, analystData: [] })
                    return
                  }
                  SScene.pointSearch(text)
                  this.PointType = 'secondPoint'
                  this.setState({ secondPoint: text })
                }}
                value={this.state.secondPoint}
                style={styles.secondInput}
                placeholder={
                  getLanguage(global.language).Prompt.CHOOSE_DESTINATION
                }
                // {'请输入终点'}
              />
            </View>
          </View>
          {/*<Image*/}
          {/*resizeMode={'contain'}*/}
          {/*source={require('../../../../assets/mapToolbar/icon_scene_pointAnalyst.png')}*/}
          {/*style={styles.analyst}*/}
          {/*/>*/}
        </View>
        <View>
          <FlatList
            data={this.state.analystData}
            renderItem={this.renderItem}
          />
        </View>
      </View>
    )
  }

  renderItem = ({ item, index }) => {
    return (
      <View>
        <TouchableOpacity
          style={styles.itemView}
          onPress={() => {
            this.toLocationPoint(item.pointName, index)
          }}
        >
          <Image
            style={styles.pointImg}
            source={require('../../../../assets/mapToolbar/icon_scene_position.png')}
          />
          {item.pointName && (
            <Text style={styles.itemText}>{item.pointName}</Text>
          )}
        </TouchableOpacity>
        <View style={styles.itemSeparator} />
      </View>
    )
  }

  render() {
    return this._renderSearchView()
  }
}
