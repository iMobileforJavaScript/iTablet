import * as React from 'react'
import { StyleSheet, Animated, FlatList } from 'react-native'
import { color, size } from '../../../../styles'
import { Const } from '../../../../constants'
import { scaleSize } from '../../../../utils'
import AnalystMapRecommendItem from './AnalystMapRecommendItem'

// let data = []
// let analystType = -1
// let analystLanguage = -1
// let selected = -1

const HEIGHT = scaleSize(100)
const WIDTH = scaleSize(500)

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: scaleSize(0),
    right: scaleSize(0),
    backgroundColor: color.bgW,
  },
  container2: {
    position: 'absolute',
    top: scaleSize(0),
    bottom: scaleSize(0),
    backgroundColor: color.bgW,
  },
  title: {
    color: color.content,
    fontSize: size.fontSize.fontSizeMd,
    backgroundColor: 'transparent',
    textAlign: 'center',
  },
  titleSelected: {
    color: color.blue2,
    fontSize: size.fontSize.fontSizeMd,
    backgroundColor: 'transparent',
    textAlign: 'center',
  },
  titleView: {
    flex: 1,
    // position: 'absolute',
    // left: scaleSize(30),
    // top: scaleSize(20),
    justifyContent: 'center',
    alignItems: 'center',
    height: HEIGHT,
    borderRadius: scaleSize(8),
    backgroundColor: color.white,
    width: scaleSize(160),
    borderWidth: 1,
    borderColor: color.content,
  },
  titleViewSelected: {
    flex: 1,
    // position: 'absolute',
    // left: scaleSize(30),
    // top: scaleSize(20),
    justifyContent: 'center',
    alignItems: 'center',
    height: HEIGHT,
    borderRadius: scaleSize(8),
    backgroundColor: color.white,
    width: scaleSize(160),
    borderWidth: 1,
    borderColor: color.blue2,
  },
})

export default class AnalystMapRecommend extends React.Component {
  props: {
    data: Array,
    language: Object,
    orientation: string,
  }

  state = {
    data: [],
    bottom: new Animated.Value(-HEIGHT * 3),
    right: new Animated.Value(-WIDTH),
  }

  visible = false

  shouldComponentUpdate(nextProps, nextState) {
    return (
      JSON.stringify(this.props) !== JSON.stringify(nextProps) ||
      JSON.stringify(this.state.data) !== JSON.stringify(nextState.data)
    )
  }

  componentDidUpdate(prevProps) {
    if (this.props.orientation !== prevProps.orientation) {
      this.setVisible(this.visible)
    }
  }

  btnAction = () => {}

  setVisible = visible => {
    this.visible = visible
    if (this.props.orientation === 'LANDSCAPE') {
      Animated.timing(this.state.right, {
        toValue: visible ? 0 : -WIDTH,
        duration: Const.ANIMATED_DURATION,
      }).start()
    } else {
      Animated.timing(this.state.bottom, {
        toValue: visible ? 0 : -HEIGHT * 3,
        duration: Const.ANIMATED_DURATION,
      }).start()
    }
  }

  renderItem = ({ item }) => {
    return (
      <AnalystMapRecommendItem
        data={item}
        btnTitle="设置起点"
        btnAction={this.btnAction}
      />
    )
  }

  render() {
    let height = Math.max(this.props.data.length, 3) * HEIGHT
    let containerStyle =
      this.props.orientation === 'LANDSCAPE'
        ? styles.container2
        : styles.container
    let moveStyle =
      this.props.orientation === 'LANDSCAPE'
        ? { right: this.state.right, width: WIDTH }
        : { bottom: this.state.bottom, height }
    return (
      <Animated.View style={[containerStyle, moveStyle]}>
        <FlatList
          renderItem={this.renderItem}
          data={this.props.data}
          // extraData={this.state.selected}
          keyExtractor={(item, index) => item + index}
        />
      </Animated.View>
    )
  }
}
