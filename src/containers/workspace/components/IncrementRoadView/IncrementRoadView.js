import * as React from 'react'
import {
  StyleSheet,
  Platform,
  View,
  TouchableOpacity,
  Text,
} from 'react-native'
import Header from '../../../../components/Header'

import { scaleSize } from '../../../../utils'

export const HEADER_HEIGHT = scaleSize(88) + (Platform.OS === 'ios' ? 20 : 0)
export const HEADER_PADDINGTOP = Platform.OS === 'ios' ? 20 : 0

export default class IncrementRoadView extends React.Component {
  props: {
    headerProps: Object,
    isRight: Boolean,
    onClick: () => {},
  }

  constructor(props) {
    super(props)
  }

  render() {
    let right
    let left
    if (this.props.isRight) {
      right = styles.focus
      left = styles.normal
    } else {
      left = styles.focus
      right = styles.normal
    }
    return (
      <View
        style={{
          flex: 1,
          flexDirection: 'column',
          width: '100%',
          height: '100%',
        }}
      >
        <Header {...this.props.headerProps} />
        <View style={styles.table}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              this.props.onClick(false)
            }}
          >
            <Text style={left}>轨迹</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              this.props.onClick(true)
            }}
          >
            <Text style={right}>手绘</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  button: {
    flex: 1,
    backgroundColor: 'transparent',
    alignSelf: 'center',
    borderStyle: 'solid',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  table: {
    position: 'absolute',
    marginTop: HEADER_PADDINGTOP + HEADER_HEIGHT,
    width: '100%',
    height: scaleSize(50),
    backgroundColor: '#EEEEEE',
    alignSelf: 'center',
    borderStyle: 'solid',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  focus: {
    fontSize: scaleSize(25),
    color: '#4680df',
  },
  mormal: {
    fontSize: scaleSize(25),
    color: 'black',
  },
})
