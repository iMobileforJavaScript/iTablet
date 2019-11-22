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
  }

  constructor(props) {
    super(props)
    this.state = {
      column: props.device.orientation === 'LANDSCAPE' ? 8 : 4,
      data: [],
      height:
        props.device.orientation === 'LANDSCAPE'
          ? scaleSize(160)
          : scaleSize(240),
      left: new Animated.Value(scaleSize(20)),
      bottom:
        props.device.orientation === 'LANDSCAPE'
          ? scaleSize(370)
          : scaleSize(460),
      currentFloorID: '',
    }
    this.listener = null
  }

  async componentDidUpdate(prevProps, prevState) {
    if (this.props.device.orientation !== prevProps.device.orientation) {
      let height = prevState.height
      let bottom = prevState.bottom
      if (this.props.device.orientation === 'LANDSCAPE') {
        height = scaleSize(160)
        bottom = scaleSize(370)
      } else {
        height = scaleSize(240)
        bottom = scaleSize(460)
      }
      this.setState({
        height,
        bottom,
      })
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
        if (!this.listener) {
          this.listener = SMap.addFloorHiddenListener(result => {
            if (result.currentFloorID !== this.state.currentFloorID)
              this.setState({
                isHidden: result.currentFloorID,
              })
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

  _renderItem = ({ item }) => {
    let textStyle = {}
    let backgroundStyle = {}

    if (item.id === this.state.currentFloorID) {
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
          style={styles.floorList}
          keyExtractor={(item, index) => item.toString + index}
          data={this.state.data}
          extraData={this.state.currentFloorID}
          renderItem={this._renderItem}
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
