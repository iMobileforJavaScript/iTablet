import * as React from 'react'
import { View, Text, TouchableOpacity, Animated, FlatList } from 'react-native'
import { scaleSize, setSpText } from '../../../../utils'
import color from '../../../../styles/color'
import { SMap } from 'imobile_for_reactnative'

export default class NavigationStartButton extends React.Component {
  props: {}

  constructor(props) {
    super(props)
    this.state = {
      show: false,
      isroad: true,
      road: '路线详情',
      height: new Animated.Value(scaleSize(200)),
      length: '',
    }
  }

  setVisible = iShow => {
    this.setState({ show: iShow })
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

  renderItem = ({ item }) => {
    return (
      <View>
        <TouchableOpacity
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          {
            <Text
              style={{
                paddingTop: scaleSize(20),
                fontSize: setSpText(20),
              }}
            >
              {'行驶' + item.roadLength + '米'}
            </Text>
          }
        </TouchableOpacity>
      </View>
    )
  }

  renderMap = () => {
    return (
      <View style={{ flex: 1, width: '100%' }}>
        {
          <Text style={{ paddingTop: scaleSize(20), fontSize: setSpText(20) }}>
            {'距离:' + GLOBAL.PATHLENGTH.length + '米'}
          </Text>
        }
        {this.renderRoad()}
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
            <FlatList data={GLOBAL.PATH} renderItem={this.renderItem} />
          </View>
        )}
      </View>
    )
  }

  renderHeader = () => {
    return (
      <View>
        <Text style={{ fontSize: setSpText(24) }}>{GLOBAL.ENDPOINT}</Text>
      </View>
    )
  }

  render() {
    if (this.state.show) {
      return (
        <Animated.View
          style={[
            {
              position: 'absolute',
              left: 0,
              right: 0,
              bottom: 0,
              height: scaleSize(200),
              padding: scaleSize(20),
              backgroundColor: color.contentWhite,
            },
            { height: this.state.height },
          ]}
        >
          {this.renderHeader()}
          {this.renderMap()}
          <View
            style={{
              height: scaleSize(80),
              flexDirection: 'row',
              // marginTop: scaleSize(20),
            }}
          >
            <TouchableOpacity
              activeOpacity={0.5}
              style={{
                height: scaleSize(60),
                flex: 1,
                borderRadius: 5,
                backgroundColor: color.blue1,
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: scaleSize(20),
              }}
              onPress={() => {
                this.changeHeight()
              }}
            >
              <Text
                style={{
                  fontSize: setSpText(20),
                  color: color.white,
                }}
              >
                {this.state.road}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.5}
              style={{
                marginLeft: scaleSize(20),
                height: scaleSize(60),
                flex: 1,
                borderRadius: 5,
                backgroundColor: color.blue1,
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: scaleSize(20),
              }}
              onPress={() => {
                this.setVisible(false)
                GLOBAL.NAVIGATIONSTARTHEAD.setVisible(false)
                if (!GLOBAL.INDOORSTART && !GLOBAL.INDOOREND) {
                  SMap.outdoorNavigation(true)
                }
                if (GLOBAL.INDOORSTART && GLOBAL.INDOOREND) {
                  SMap.indoorNavigation(true)
                }
              }}
            >
              <Text
                style={{
                  fontSize: setSpText(20),
                  color: color.white,
                }}
              >
                第一人称
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.5}
              style={{
                marginLeft: scaleSize(20),
                height: scaleSize(60),
                flex: 1,
                borderRadius: 5,
                backgroundColor: color.blue1,
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: scaleSize(20),
              }}
              onPress={() => {
                this.setVisible(false)
                GLOBAL.NAVIGATIONSTARTHEAD.setVisible(false)
                if (!GLOBAL.INDOORSTART && !GLOBAL.INDOOREND) {
                  SMap.outdoorNavigation(false)
                }
                if (GLOBAL.INDOORSTART && GLOBAL.INDOOREND) {
                  SMap.indoorNavigation(false)
                }
              }}
            >
              <Text
                style={{
                  fontSize: setSpText(20),
                  color: color.white,
                }}
              >
                第三人称
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      )
    } else {
      return <View />
    }
  }
}
