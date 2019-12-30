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
    currentFloorID: String,
    changeFloorID: () => {},
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
      bottom:
        (props.device.height -
          (props.device.orientation === 'LANDSCAPE'
            ? scaleSize(240)
            : scaleSize(360))) /
        2,
      currentFloorID: props.currentFloorID,
    }
  }
  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.currentFloorID !== prevState.currentFloorID) {
      return {
        currentFloorID: nextProps.currentFloorID,
      }
    }
    return null
  }
  async componentDidUpdate(prevProps, prevState) {
    if (this.props.device.orientation !== prevProps.device.orientation) {
      let height = prevState.height
      if (this.props.device.orientation === 'LANDSCAPE') {
        height = scaleSize(240)
      } else {
        height = scaleSize(360)
      }
      let bottom = (this.props.device.height - height) / 2
      this.setState(
        {
          height,
          bottom,
        },
        () => {
          if (height < prevState.height) {
            this.list &&
              this.list.scrollToIndex({
                viewPosition: 0.5,
                index: this.curIndex,
              })
          }
        },
      )
    } else if (
      this.props.mapLoaded &&
      this.props.mapLoaded !== prevProps.mapLoaded
    ) {
      let datas = await SMap.getFloorData()
      if (datas.data && datas.data.length > 0) {
        let { data, datasource, currentFloorID } = datas
        this.setState({
          data,
          datasource,
          currentFloorID,
        })
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
    this.props.changeFloorID && this.props.changeFloorID(item.id)
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
      bottom: this.state.bottom,
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
          renderItem={this._renderItem}
          showsVerticalScrollIndicator={false}
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
    backgroundColor: color.white,
    borderRadius: scaleSize(4),
    borderWidth: 1,
    borderColor: 'rgba(48,48,48,0.2)',
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
