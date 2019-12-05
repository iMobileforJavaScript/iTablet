import * as React from 'react'
import {
  View,
  Text,
  Animated,
  TouchableOpacity,
  FlatList,
  Image,
} from 'react-native'
import styles from './styles'
import PropTypes from 'prop-types'
import { SMap } from 'imobile_for_reactnative'
import { scaleSize } from '../../../../utils'
import { getLanguage } from '../../../../language'
// import { color } from '../../../../styles'

export default class NavigationPoiView extends React.Component {
  props: {
    navigationPoiView: boolean,
    setNavigationPoiView: () => {},
    setNavigationChangeAR: () => {},
  }

  static propTypes = {
    mapNavigation: PropTypes.object,
    setMapNavigation: PropTypes.func,
  }

  constructor(props) {
    super(props)
    this.state = {
      searchValue: {},
      searchData: [],
      analystData: [],
      bottom: new Animated.Value(-scaleSize(200)),
      height: new Animated.Value(scaleSize(200)),
      road: getLanguage(GLOBAL.language).Map_Main_Menu.ROAD_DETAILS,
      isroad: true,
    }
  }

  renderHeader = () => {
    return (
      <View>
        <Text style={styles.text1}>{this.props.mapNavigation.name}</Text>
      </View>
    )
  }

  renderItem = ({ item }) => {
    if (!item.roadName || item.roadName === 'null') {
      item.roadName = GLOBAL.language === 'CN' ? '无名路' : 'anonymous road'
    }
    return (
      <View>
        <TouchableOpacity style={styles.itemView1}>
          <Text style={styles.info}>
            {GLOBAL.language === 'CN'
              ? '途经路线：沿' + item.roadName + '直行' + item.roadLength + '米'
              : `Go straight along the ${item.roadName} for ${
                item.roadLength
              } meters`}
          </Text>
        </TouchableOpacity>
      </View>
    )
  }

  renderRoad = () => {
    return (
      <View>
        {!this.state.isroad && (
          <View
            style={{
              flexDirection: 'column',
              width: '100%',
              height: scaleSize(400),
            }}
          >
            <FlatList
              data={this.state.searchData}
              renderItem={this.renderItem}
            />
          </View>
        )}
      </View>
    )
  }

  renderMap = () => {
    return (
      <View style={{ flex: 1, width: '100%' }}>
        {this.state.searchValue.Length && (
          <Text style={styles.info}>
            {getLanguage(GLOBAL.language).Map_Main_Menu.DISTANCE +
              this.state.searchValue.Length +
              getLanguage(GLOBAL.language).Map_Main_Menu.METERS}
          </Text>
        )}
        {this.renderRoad()}
      </View>
    )
  }

  close = async () => {
    await SMap.clearTrackingLayer() //移除线，线在trackingLayer
    await SMap.removePOICallout() //移除点，点在DynamicView或者callout
    GLOBAL.PoiInfoContainer.setVisible(false)
    this.props.setMapNavigation({
      isShow: false,
      name: '',
    })
    this.props.setNavigationPoiView(false)
    this.props.setNavigationChangeAR(false)
  }

  changeHeight = () => {
    if (this.state.isroad) {
      this.setState(
        {
          road: getLanguage(GLOBAL.language).Map_Main_Menu.DISPLAY_MAP,
          isroad: false,
        },
        () => {
          Animated.timing(this.state.height, {
            toValue: scaleSize(650),
            duration: 300,
          }).start()
        },
      )
    } else {
      this.setState(
        {
          road: getLanguage(GLOBAL.language).Map_Main_Menu.ROAD_DETAILS,
          isroad: true,
        },
        () => {
          Animated.timing(this.state.height, {
            toValue: scaleSize(200),
            duration: 300,
          }).start()
        },
      )
    }
  }

  renderButton = () => {
    return (
      <View style={styles.view}>
        {/*<TouchableOpacity*/}
        {/*style={styles.itemView}*/}
        {/*onPress={() => {*/}
        {/*this.changeHeight()*/}
        {/*}}*/}
        {/*>*/}
        {/*<Text style={styles.text}>{this.state.road}</Text>*/}
        {/*</TouchableOpacity>*/}
        {/*<TouchableOpacity*/}
        {/*style={styles.itemView}*/}
        {/*// onPress={() => {*/}
        {/*// }}*/}
        {/*>*/}
        {/*<Text style={styles.text}>第一人称</Text>*/}
        {/*</TouchableOpacity>*/}
        {/*<TouchableOpacity*/}
        {/*style={styles.itemView}*/}
        {/*// onPress={() => {*/}
        {/*// }}*/}
        {/*>*/}
        {/*<Text style={styles.text}>第三人称</Text>*/}
        {/*</TouchableOpacity>*/}
        <TouchableOpacity
          activeOpacity={0.5}
          style={styles.search}
          onPress={() => {
            this.changeHeight()
          }}
        >
          <Text style={styles.searchTxt}>{this.state.road}</Text>
        </TouchableOpacity>
      </View>
    )
  }

  render() {
    if (!this.props.navigationPoiView) return null
    let closeIcon = require('../../../../assets/mapTools/icon_close_black.png')
    return (
      <Animated.View
        style={[
          styles.nameView,
          { bottom: this.state.bottom, height: this.state.height },
        ]}
      >
        {this.renderHeader()}
        <TouchableOpacity
          onPress={() => {
            this.close()
          }}
          style={styles.closeBox}
        >
          <Image
            source={closeIcon}
            style={styles.closeBtn}
            resizeMode={'contain'}
          />
        </TouchableOpacity>
        {this.renderMap()}
        {this.renderButton()}
      </Animated.View>
    )
  }
}
