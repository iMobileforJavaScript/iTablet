import React from 'react'
import { scaleSize, screen } from '../../../../utils'
import { color, zIndexLevel } from '../../../../styles'
import { MTBtn } from '../../../../components'
import { ConstToolType } from '../../../../constants'
import { View, StyleSheet } from 'react-native'
import { SMap } from 'imobile_for_reactnative'
import constants from '../../constants'
// 地图按钮栏默认高度
const BUTTON_HEIGHT = scaleSize(80)

export default class EditControlBar extends React.Component {
  props: {
    type?: string,
  }

  constructor(props) {
    super(props)
    this.state = {
      type: props.type, // 当前传入的类型
    }
  }

  undo = () => {
    // SCollector.undo()
    SMap.undo()
  }

  redo = () => {
    // SCollector.redo()
    SMap.redo()
  }

  cancel = () => {
    // SCollector.cancel()
    SMap.cancel()
  }

  submit = () => {
    // SCollector.submit()
    SMap.submit()
  }

  render() {
    let containerStyle = this.state.isFullScreen
      ? styles.fullContainer
      : styles.wrapContainer
    return (
      <View style={[containerStyle, { bottom: this.state.bottom }]}>
        <MTBtn
          style={[
            styles.cell,
            { width: screen.deviceWidth / this.state.column },
          ]}
          key={constants.UNDO}
          title={constants.UNDO}
          textColor={'white'}
          size={MTBtn.Size.NORMAL}
          image={require('../../../../assets/mapTools/icon_undo.png')}
          onPress={this.undo}
        />
        <MTBtn
          style={[
            styles.cell,
            { width: screen.deviceWidth / this.state.column },
          ]}
          key={constants.REDO}
          title={constants.REDO}
          textColor={'white'}
          size={MTBtn.Size.NORMAL}
          image={require('../../../../assets/mapTools/icon_redo.png')}
          onPress={this.redo}
        />
        <MTBtn
          style={[
            styles.cell,
            { width: screen.deviceWidth / this.state.column },
          ]}
          key={constants.CANCEL}
          title={constants.CANCEL}
          textColor={'white'}
          size={MTBtn.Size.NORMAL}
          image={require('../../../../assets/mapTools/icon_cancel.png')}
          onPress={this.cancel}
        />
        <MTBtn
          style={[
            styles.cell,
            { width: screen.deviceWidth / this.state.column },
          ]}
          key={constants.SUBMIT}
          title={constants.SUBMIT}
          textColor={'white'}
          size={MTBtn.Size.NORMAL}
          image={require('../../../../assets/mapTools/icon_submit.png')}
          onPress={this.submit}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  fullContainer: {
    flexDirection: 'column',
    position: 'absolute',
    left: 0,
    right: 0,
    height: screen.deviceHeight,
    backgroundColor: '#rgba(0, 0, 0, 0)',
    zIndex: zIndexLevel.FOUR,
  },
  wrapContainer: {
    flexDirection: 'column',
    position: 'absolute',
    left: 0,
    right: 0,
    backgroundColor: '#rgba(0, 0, 0, 0)',
    zIndex: zIndexLevel.FOUR,
  },
  overlay: {
    flex: 1,
    backgroundColor: '#rgba(0, 0, 0, 0)',
    // zIndex: zIndexLevel.FOUR,
  },
  containers: {
    flexDirection: 'column',
    width: '100%',
    maxHeight: ConstToolType.HEIGHT[3] + BUTTON_HEIGHT,
    minHeight: BUTTON_HEIGHT,
    backgroundColor: color.theme,
    // zIndex: zIndexLevel.FOUR,
  },
  buttonz: {
    flexDirection: 'row',
    height: BUTTON_HEIGHT,
    paddingHorizontal: scaleSize(20),
    backgroundColor: color.theme,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  button: {
    flex: 1,
    height: scaleSize(60),
    // width: scaleSize(60),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: color.theme,
  },
  img: {
    height: scaleSize(40),
    width: scaleSize(40),
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionHeader: {
    fontSize: 23,
    fontWeight: 'bold',
    backgroundColor: color.theme,
    color: 'white',
  },
  item: {
    padding: 10,
    fontSize: 18,
    paddingLeft: 20,
    height: 44,
    backgroundColor: color.theme,
    color: 'white',
  },
  cell: {
    // flex: 1,
  },
  tabsView: {
    height: ConstToolType.HEIGHT[3] - BUTTON_HEIGHT,
  },
  table: {
    flex: 1,
    paddingHorizontal: scaleSize(30),
    alignItems: 'center',
    backgroundColor: color.subTheme,
  },
})
