import * as React from 'react'
import { View, StyleSheet } from 'react-native'
import { color } from '../../../../styles'
import { scaleSize, dataUtil } from '../../../../utils'
import { ConstToolType } from '../../../../constants'
import { SMSymbolTable } from 'imobile_for_reactnative'

export default class SymbolTab extends React.Component {
  props: {
    data?: Array,
    setCurrentSymbol?: () => {},
    showToolbar?: () => {},
  }

  static defaultProps = {
    data: [],
  }

  _onSymbolClick = data => {
    // Toast.show(JSON.stringify(data))
    this.props.setCurrentSymbol && this.props.setCurrentSymbol(data)
    this.showToolbar(data)
  }

  showToolbar = data => {
    if (!this.props.showToolbar) return
    let type = ''
    switch (data.type) {
      case 'marker':
        type = ConstToolType.MAP_COLLECTION_POINT
        break
      case 'line':
        type = ConstToolType.MAP_COLLECTION_LINE
        break
      case 'fill':
        type = ConstToolType.MAP_COLLECTION_REGION
        break
    }
    this.props.showToolbar(true, type, {
      isFullScreen: false,
      // height: ConstToolType.HEIGHT[0],
    })
  }

  render() {
    return (
      <View style={styles.container}>
        <SMSymbolTable
          style={styles.table}
          data={this.props.data}
          tableStyle={{
            orientation: 1,
            // height: 1024,
            // width: 600,
            imageSize: 50,
            count: 5,
            legendBackgroundColor: dataUtil.colorRgba(color.blackBg),
            textColor: dataUtil.colorRgba(color.themeText),
          }}
          onSymbolClick={this._onSymbolClick}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: color.blackBg,
  },
  table: {
    flex: 1,
    paddingHorizontal: scaleSize(30),
    alignItems: 'center',
    backgroundColor: color.blackBg,
  },
})
