import * as React from 'react'
import { View, Text, Animated, TouchableOpacity, FlatList } from 'react-native'
import styles from './styles'
import PropTypes from 'prop-types'
import { SMap } from 'imobile_for_reactnative'
import { scaleSize } from '../../../../utils'
import { color } from '../../../../styles'

export default class NavigationPoiView extends React.Component {
  static propTypes = {
    mapNavigation: PropTypes.object,
    setMapNavigation: PropTypes.func,
    mapNavigationShow: PropTypes.bool,
    setMapNavigationShow: PropTypes.func,
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
      <View style={styles.view}>
        <Text style={styles.text1}>{this.props.mapNavigation.name}</Text>
      </View>
    )
  }

  renderItem = ({ item }) => {
    return (
      <View>
        <TouchableOpacity style={styles.itemView1}>
          {item.roadName && item.roadName !== 'null' && (
            <Text style={styles.text1}>
              {'途经路线：' + item.roadName + '行驶' + item.roadLength + '米'}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    )
  }

  renderRoad = () => {
    return (
      <View style={{ height: scaleSize(400) }}>
        {!this.state.isroad && (
          <View
            style={{
              flexDirection: 'column',
              width: '100%',
              height: scaleSize(500),
              backgroundColor: color.switch,
            }}
          />
        ) && (
          <FlatList
            data={this.state.searchData}
            renderItem={this.renderItem}
          />
        )}
      </View>
    )
  }

  renderMap = () => {
    return (
      <View style={{ flex: 1, width: '100%' }}>
        {this.state.searchValue.Length && (
          <Text style={styles.text1}>
            {'距离您:' + this.state.searchValue.Length + '米'}
          </Text>
        )}
        {this.renderRoad()}
      </View>
    )
  }

  Navigation = () => {}

  changeHeight = () => {
    if (this.state.isroad) {
      this.props.setMapNavigation({
        isPointShow: false,
        isShow: true,
        name: this.props.mapNavigation.name,
      })
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
      this.props.setMapNavigation({
        isPointShow: true,
        isShow: true,
        name: this.props.mapNavigation.name,
      })
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
        <TouchableOpacity
          style={styles.itemView}
          onPress={() => {
            this.changeHeight()
          }}
        >
          <Text style={styles.text}>{this.state.road}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.itemView}
          // onPress={() => {
          // }}
        >
          <Text style={styles.text}>第一人称</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.itemView}
          onPress={() => {
            this.Navigation()
          }}
        >
          <Text style={styles.text}>第三人称</Text>
        </TouchableOpacity>
      </View>
    )
  }

  render() {
    return (
      <Animated.View style={[styles.nameView, { height: this.state.height }]}>
        {this.renderHeader()}
        {this.renderMap()}
        {this.renderButton()}
      </Animated.View>
    )
  }
}
