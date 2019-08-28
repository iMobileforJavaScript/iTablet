import * as React from 'react'
import { StyleSheet, Platform } from 'react-native'
import Header from '../../../../components/Header'
import { View, TouchableOpacity, Text } from 'react-native'
import { scaleSize } from '../../../../utils'

export const HEADER_HEIGHT = scaleSize(88) + (Platform.OS === 'ios' ? 20 : 0)
export const HEADER_PADDINGTOP = Platform.OS === 'ios' ? 20 : 0

export default class IncrementRoadView extends React.Component {
  props: {
    headerProps: Object,
    leftClick: () => {},
    rightClick: () => {},
  }

  constructor(props) {
    super(props)
    this.state = {
      leftclick: false,
      rightclick: true,
    }
  }

  render() {
    let leftclickStyle = this.state.leftclick
      ? styles.clickleft
      : styles.nclickleft
    let rightlickStyle = this.state.rightclick
      ? styles.clickright
      : styles.nclickright
    return (
      <View
        style={{
          flex: 1,
          flexDirection: 'column',
          width: '100%',
          height: '100%',
        }}
      >
        <Header
          ref={ref => (this.containerHeader = ref)}
          {...this.props.headerProps}
        />
        <View style={styles.table}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              this.setState({ leftclick: true, rightclick: false })
              this.props.leftClick()
            }}
          >
            <Text style={leftclickStyle}>轨迹</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              this.setState({ leftclick: false, rightclick: true })
              this.props.rightClick()
            }}
          >
            <Text style={rightlickStyle}>手绘</Text>
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
  clickleft: {
    fontSize: scaleSize(25),
    color: '#4680df',
  },
  nclickleft: {
    fontSize: scaleSize(25),
    color: 'black',
  },
  clickright: {
    fontSize: scaleSize(25),
    color: '#4680df',
  },
  nclickright: {
    fontSize: scaleSize(25),
    color: 'black',
  },
})
