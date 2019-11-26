import * as React from 'react'
import {
  StyleSheet,
  Text,
  FlatList,
  TouchableHighlight,
  Animated,
} from 'react-native'

import { scaleSize, setSpText } from '../../../../utils'
import { color } from '../../../../styles'
import { SMap } from 'imobile_for_reactnative'
import { Const } from '../../../../constants'

export default class RNFloorListView extends React.Component {
  props: {
    device: Object,
    mapLoaded: Boolean,
    getMapController: () => {},
  }

  constructor(props) {
    super(props)
    this.state = {
      column: props.device.orientation === 'LANDSCAPE' ? 8 : 4,
      data: [],
      height:
        props.device.orientation === 'LANDSCAPE'
          ? scaleSize(240)
          : scaleSize(360),
      left: new Animated.Value(scaleSize(20)),
      currentFloorID: '',
    }
    this.mapContorller = null
    this.listener = null
  }

  async componentDidUpdate(prevProps, prevState) {
    if (this.props.device.orientation !== prevProps.device.orientation) {
      let height = prevState.height
      let bottom = prevState.bottom
      if (this.props.device.orientation === 'LANDSCAPE') {
        height = scaleSize(240)
      } else {
        height = scaleSize(360)
      }
      this.setState(
        {
          height,
          bottom,
        },
        () => {
          if (height < prevState.height) {
            this.list.scrollToIndex({ viewPosition: 0.5, index: this.curIndex })
          }
        },
      )
    } else if (
      this.props.mapLoaded &&
      this.props.mapLoaded !== prevProps.mapLoaded
    ) {
      let datas = await SMap.getFloorData()
      if (datas.data && datas.data.length > 0) {
        if (!this.mapContorller) {
          this.mapContorller = this.props.getMapController()
        }
        let { data, datasource, currentFloorID } = datas
        this.mapContorller.setState(
          {
            isIndoor: !!currentFloorID,
          },
          () => {
            this.setState({
              data,
              datasource,
              currentFloorID,
            })
          },
        )
        if (!this.listener) {
          this.listener = SMap.addFloorHiddenListener(result => {
            if (result.currentFloorID !== this.state.currentFloorID) {
              this.mapContorller.setState(
                {
                  isIndoor: !!currentFloorID,
                },
                () => {
                  this.setState({
                    currentFloorID,
                  })
                },
              )
            }
          })
        }
      }
    }
  }

  setVisible = (visible, immediately = false) => {
    if (visible) {
      Animated.timing(this.state.left, {
        toValue: scaleSize(20),
        duration: immediately ? 0 : Const.ANIMATED_DURATION,
      }).start()
    } else {
      Animated.timing(this.state.left, {
        toValue: scaleSize(-200),
        duration: immediately ? 0 : Const.ANIMATED_DURATION,
      }).start()
    }
  }

  _onFloorPress = async item => {
    //change floor
    await SMap.setCurrentFloorID(item.id)
    this.setState({
      currentFloorID: item.id,
    })
  }

  _renderItem = ({ item, index }) => {
    let textStyle = {}
    let backgroundStyle = {}

    if (item.id === this.state.currentFloorID) {
      this.curIndex = index
      textStyle = {
        color: color.white,
      }
      backgroundStyle = {
        backgroundColor: color.item_selected_bg,
      }
    }

    return (
      <TouchableHighlight
        underlayColor={color.UNDERLAYCOLOR}
        style={[styles.item, backgroundStyle]}
        onPress={() => {
          this._onFloorPress(item)
        }}
      >
        <Text style={[styles.floorID, textStyle]}>{item.name}</Text>
      </TouchableHighlight>
    )
  }

  render() {
    if (this.state.data.length === 0 || !this.state.currentFloorID) return null
    let floorListStyle = {
      maxHeight: this.state.height,
      left: this.state.left,
    }
    return (
      <Animated.View style={[styles.floorListView, floorListStyle]}>
        <FlatList
          ref={ref => {
            this.list = ref
          }}
          style={styles.floorList}
          keyExtractor={(item, index) => item.toString + index}
          data={this.state.data}
          extraData={this.state.currentFloorID}
          renderItem={this._renderItem}
          getItemLayout={(param, index) => ({
            length: scaleSize(60),
            offset: scaleSize(60) * index,
            index,
          })}
        />
      </Animated.View>
    )
  }
}

const styles = StyleSheet.create({
  floorListView: {
    position: 'absolute',
    width: scaleSize(60),
    bottom: scaleSize(150),
    backgroundColor: color.white,
    borderRadius: scaleSize(4),
    elevation: 20,
    shadowOffset: { width: 0, height: 0 },
    shadowColor: 'black',
    shadowOpacity: 1,
    shadowRadius: 2,
  },
  floorList: {
    flex: 1,
  },
  item: {
    width: scaleSize(60),
    height: scaleSize(60),
    justifyContent: 'center',
    alignItems: 'center',
  },
  floorID: {
    fontSize: setSpText(16),
  },
})
