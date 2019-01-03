import * as React from 'react'
import { StyleSheet } from 'react-native'
import { color } from '../../../../styles'
import { TreeList } from '../../../../components'
import { scaleSize } from '../../../../utils'
import { SMap } from 'imobile_for_reactnative'

export default class GroupTab extends React.Component {
  props: {
    data?: Array,
    goToPage?: () => {},
    setCurrentSymbols?: () => {},
  }

  static defaultProps = {
    data: [],
  }

  constructor(props) {
    super(props)
    this.state = {
      data: props.data,
    }
  }

  componentDidMount() {
    SMap.getSymbolGroups().then(result => {
      this.setState({
        data: result,
      })
    })
  }

  _onPress = ({ data }) => {
    SMap.findSymbolsByGroups(data.type, data.path).then(result => {
      let symbols = []
      result.forEach(item => {
        symbols.push(item)
      })
      this.props.setCurrentSymbols && this.props.setCurrentSymbols(symbols)
      if (symbols.length > 0) {
        this.props.goToPage && this.props.goToPage(1)
      } else {
        // Toast.show(ConstInfo.SYMBOL_LIB_EMPTY)
      }
    })
  }

  render() {
    return (
      <TreeList
        style={styles.container}
        data={this.state.data}
        onPress={this._onPress}
      />
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: scaleSize(30),
    backgroundColor: color.theme,
  },
})
