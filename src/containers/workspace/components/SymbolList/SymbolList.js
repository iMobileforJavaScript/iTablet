import * as React from 'react'
import { View, StyleSheet, Platform } from 'react-native'
import { color } from '../../../../styles'
import { scaleSize, dataUtil } from '../../../../utils'
import { SMSymbolTable, SMap, SCartography } from 'imobile_for_reactnative'

export default class SymbolList extends React.Component {
  props: {
    setCurrentSymbol?: () => {},
    layerData: Object,
  }

  constructor(props) {
    super(props)
    this.state = {
      data: [],
    }
  }

  _onSymbolClick = data => {
    if (this.props.layerData.type === 3) {
      SCartography.setLineSymbolID(data.id, this.props.layerData.name)
    }
    if (this.props.layerData.type === 1) {
      SCartography.setMakerSymbolID(data.id, this.props.layerData.name)
    }
    if (this.props.layerData.type === 5) {
      SCartography.setFillSymbolID(data.id, this.props.layerData.name)
    }
  }

  componentDidUpdate(prevProps) {
    if (
      JSON.stringify(prevProps.layerData.type) !==
      JSON.stringify(this.props.layerData.type)
    ) {
      this.renderLibrary()
    }
  }

  componentDidMount() {
    this.renderLibrary()
  }

  renderLibrary = () => {
    switch (this.props.layerData.type) {
      case 3:
        SMap.findSymbolsByGroups('line', '').then(result => {
          let symbols = []
          result.forEach(item => {
            symbols.push(item.id)
          })
          this.setState({ layerData: this.props.layerData, data: symbols })
        })
        break
      case 1:
        SMap.findSymbolsByGroups('point', '').then(result => {
          let symbols = []
          result.forEach(item => {
            symbols.push(item.id)
          })
          this.setState({ layerData: this.props.layerData, data: symbols })
        })
        break
      case 5:
        SMap.findSymbolsByGroups('fill', '').then(result => {
          let symbols = []
          result.forEach(item => {
            symbols.push(item.id)
          })
          this.setState({ layerData: this.props.layerData, data: symbols })
        })
        break
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={{ backgroundColor: '#rgba(0, 0, 0, 0)', height: 1 }} />
        <SMSymbolTable
          style={styles.table}
          data={this.state.data}
          tableStyle={{
            orientation: 1,
            imageSize: Platform.OS === 'ios' ? scaleSize(90) : scaleSize(150),
            count: 4,
            legendBackgroundColor: dataUtil.colorRgba(color.subTheme),
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
    backgroundColor: color.subTheme,
  },
  table: {
    flex: 1,
    paddingHorizontal: scaleSize(30),
    alignItems: 'center',
    backgroundColor: color.subTheme,
  },
})
