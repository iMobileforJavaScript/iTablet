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
      if (global.language === 'EN') {
        for (let i = 0; i < result.length; i++) {
          if (result[i].name === '点符号库') {
            result[i].name = 'Marker Library'
          } else if (result[i].name === '线型符号库') {
            result[i].name = 'Line Library'
          } else if (result[i].name === '填充符号库') {
            result[i].name = 'Fill Library'
          }
        }
      }
      this.setState({
        data: result,
      })
    })
  }

  _onPress = ({ data }) => {
    SMap.findSymbolsByGroups(data.type, data.path).then(result => {
      let symbols = result
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
        itemTextColor={color.themeText2}
        itemTextSize={color.themeText2}
        separator={true}
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
    backgroundColor: color.bgW,
  },
  separatorStyle: {
    height: 1,
    width: '100%',
    backgroundColor: color.bgG,
  },
})
