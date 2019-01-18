import * as React from 'react'
import { View, StyleSheet } from 'react-native'
import { color } from '../../../../styles'
import { scaleSize, dataUtil, screen } from '../../../../utils'
// import { ConstToolType } from '../../../../constants'
import { SMSymbolTable, SMCollectorType } from 'imobile_for_reactnative'
import CollectionData from '../../../../containers/workspace/components/ToolBar/CollectionData'

export default class SymbolTab extends React.Component {
  props: {
    data?: Array,
    setCurrentSymbol?: () => {},
    showToolbar?: () => {},
  }

  static defaultProps = {
    data: [],
  }

  constructor(props) {
    super(props)
    this.screenWidth = screen.getScreenWidth()
    let screenHeight = screen.getScreenHeight()
    this.state = {
      column: this.screenWidth > screenHeight ? 8 : 5,
    }
  }

  componentDidUpdate() {
    if (this.screenWidth > screen.getScreenWidth()) {
      this.setState({
        column: 5,
      })
      this.screenWidth = screen.getScreenWidth()
    } else if (this.screenWidth < screen.getScreenWidth()) {
      this.setState({
        column: 8,
      })
      this.screenWidth = screen.getScreenWidth()
    }
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
        // type = ConstToolType.MAP_COLLECTION_POINT
        type = SMCollectorType.POINT_HAND
        break
      case 'line':
        // type = ConstToolType.MAP_COLLECTION_LINE
        type = SMCollectorType.LINE_HAND_POINT
        break
      case 'fill':
        // type = ConstToolType.MAP_COLLECTION_REGION
        type = SMCollectorType.REGION_HAND_POINT
        break
    }
    CollectionData.showCollection(type)
    // this.props.showToolbar(true, type, {
    //   isFullScreen: false,
    //   height: ConstToolType.HEIGHT[0],
    // })
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
            textSize: 15,
            lineSpacing: 10,
            imageSize: 40,
            count: this.state.column,
            legendBackgroundColor: dataUtil.colorRgba(color.bgW),
            textColor: dataUtil.colorRgba(color.font_color_white),
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
    backgroundColor: color.bgW,
  },
  table: {
    flex: 1,
    paddingHorizontal: scaleSize(30),
    alignItems: 'center',
    backgroundColor: color.bgW,
  },
})
