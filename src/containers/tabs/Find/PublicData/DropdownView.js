import React from 'react'
import { View, TouchableOpacity } from 'react-native'
import styles from './styles'

export default class DropdownView extends React.Component {
  props: {
    children: any,
    onBackgroudPress: () => {},
    backgrourdColor: any,
    visible: boolean,
  }

  constructor(props) {
    super(props)
    this.state = {
      visible: this.props.visible,
    }
  }

  render() {
    if (!this.props.visible) {
      return null
    }
    return (
      <View style={styles.backgroudViewStyle}>
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => {
            this.props.onBackgroudPress && this.props.onBackgroudPress()
          }}
          style={[
            styles.bagroudTouchViewStyle,
            this.props.backgrourdColor
              ? { backgroundColor: this.props.backgrourdColor }
              : null,
          ]}
        />
        {this.props.children}
      </View>
    )
  }
}
