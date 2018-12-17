import * as React from 'react'
import {
  StyleSheet,
  // TouchableOpacity,
  TouchableHighlight,
  Text,
  View,
} from 'react-native'
import { scaleSize } from '../../utils'

export default class Color_Btn extends React.Component {
  props: {
    onPress: () => {},
    background: string,
  }

  constructor(props) {
    super(props)
  }

  action = e => {
    return this.props.onPress && this.props.onPress(e)
  }

  render() {
    return (
      <TouchableHighlight
        ref={ref => (this.mtBtn = ref)}
        accessible={true}
        style={styles.container}
        activeOpacity={0.5}
        // underlayColor="#4680DF"
        underlayColor={'rgba(128,128,128,0.9)'}
        onPress={this.action}
      >
        <View>
          {this.props.background && (
            <Text
              style={[
                { height: scaleSize(80) },
                { width: scaleSize(80) },
                { backgroundColor: this.props.background },
              ]}
            />
          )}
        </View>
      </TouchableHighlight>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    height: scaleSize(85),
    width: scaleSize(85),
  },
  inner: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'transparent',
    alignSelf: 'center',
  },
})
