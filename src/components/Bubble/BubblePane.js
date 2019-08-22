import React from 'react'
import { StyleSheet, View, Platform } from 'react-native'
import { scaleSize } from '../../utils'
import Bubble from './Bubble'

const DEFAULT_POSITION = {
  left: 20,
  top: scaleSize((Platform.OS === 'ios' ? 20 : 0) + 108),
}

export default class BubblePane extends React.Component {
  props: {
    maxSize?: number,
  }

  static defaultProps = {
    maxSize: 3,
  }

  constructor(props) {
    super(props)
    this.state = {
      bubbles: [],
      position: DEFAULT_POSITION,
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (
      JSON.stringify(this.props) !== JSON.stringify(nextProps) ||
      JSON.stringify(this.state) !== JSON.stringify(nextState)
    )
  }

  renderBubbles = () => {
    let bubbles = []
    this.state.bubbles.forEach((item, index) => {
      bubbles.push(
        <Bubble
          key={item.title + index}
          title={item.title}
          type={item.type}
          style={index !== 0 && { marginTop: 5 }}
          onPress={() => {
            let bubbles = this.state.bubbles.concat()
            bubbles.splice(index, 1)
            this.setState({
              bubbles,
            })
          }}
        />,
      )
    })
    return bubbles
  }

  /**
   *
   * @param bubble 气泡数据
   *  { title, type }
   * @param position Pane位置
   */
  addBubble = (bubble = {}, position) => {
    if (!bubble.title) {
      return
    }
    let newState = {}
    let bubbles = this.state.bubbles.concat()
    bubbles.push(bubble)
    if (bubbles.length > this.props.maxSize) {
      bubbles.splice(0, bubbles.length - this.props.maxSize)
    }
    newState.bubbles = bubbles
    if (position) {
      let _position = {}
      if (position.top !== undefined) _position.top = position.top
      if (position.bottom !== undefined) _position.bottom = position.bottom
      if (position.left !== undefined) _position.left = position.left
      if (position.right !== undefined) _position.right = position.right
      newState.position = _position
    }
    this.setState(newState)
  }

  clear = () => {
    if (this.state.bubbles.length === 0) return
    this.setState({
      bubbles: [],
    })
  }

  reset = () => {
    if (
      this.state.bubbles.length === 0 &&
      JSON.stringify(this.state.position) === JSON.stringify(DEFAULT_POSITION)
    )
      return
    this.setState({
      bubbles: [],
      position: DEFAULT_POSITION,
    })
  }

  render() {
    return (
      <View style={[styles.pane, this.state.position]}>
        {this.renderBubbles()}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  pane: {
    position: 'absolute',
    // left: 20,
    // top: 120,
    flexDirection: 'column',
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'flex-start',
    // maxWidth: scaleSize(120),
  },
})
