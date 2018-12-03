import * as React from 'react'
import { View, StyleSheet } from 'react-native'
import { color } from '../../../../styles'
import { scaleSize, dataUtil } from '../../../../utils'
import { SMSymbolTable, SMap, SCartography } from 'imobile_for_reactnative'

export default class SymbolList extends React.Component {
  props: {
    setCurrentSymbol?: () => {},
  }

  constructor(props) {
    super(props)
    this.state = {
      data: [],
    }
  }

  _onSymbolClick = data => {
    SCartography.setLineSymbolIDByIndex(data.id, 1)
    SCartography.setLineSymbolIDByIndex(data.id, 2)
    SCartography.setLineSymbolIDByIndex(data.id, 3)
  }

  componentDidMount() {
    SMap.findSymbolsByGroups('line', '').then(result => {
      let symbols = []
      result.forEach(item => {
        symbols.push(item.id)
      })
      this.setState({ data: symbols })
    })
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
