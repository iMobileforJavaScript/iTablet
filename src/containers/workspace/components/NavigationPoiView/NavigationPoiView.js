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
// import { color } from '../../../../styles'

export default class NavigationPoiView extends React.Component {
  props: {
    setNavigationPoiView: () => {},
    setNavigationChangeAR: () => {},
  }

  static propTypes = {
    mapNavigation: PropTypes.object,
    setMapNavigation: PropTypes.func,
  }

  constructor(props) {
    super(props)
    this.PointType = null
    this.state = {
      searchValue: {},
      searchData: [],
      analystData: [],
      firstPoint: null,
      secondPoint: null,
      height: new Animated.Value(scaleSize(200)),
      road: '路线详情',
      isroad: true,
    }
  }

  componentDidMount() {
    SMap.setOnlineNavigationListener({
      callback: result => {
        this.setState({ searchData: result })
      },
    })
    SMap.setOnlineNavigation2Listener({
      callback: result => {
        this.setState({ searchValue: result })
      },
    })
  }

  renderHeader = () => {
    return (
      <View>
        <Text style={styles.text1}>{this.props.mapNavigation.name}</Text>
      </View>
    )
  }

  renderItem = ({ item }) => {
    return (
      <View>
        <TouchableOpacity style={styles.itemView1}>
          {item.roadName && item.roadName !== 'null' && (
            <Text style={styles.info}>
              {'途经路线：' + item.roadName + '行驶' + item.roadLength + '米'}
            </Text>
          )}
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
            {'距离您:' + this.state.searchValue.Length + '米'}
          </Text>
        )}
        {this.renderRoad()}
      </View>
    )
  }

  close = () => {
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
          road: '显示地图',
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
          road: '路线详情',
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
    let closeIcon = require('../../../../assets/mapTools/icon_close_black.png')
    return (
      <Animated.View style={[styles.nameView, { height: this.state.height }]}>
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
