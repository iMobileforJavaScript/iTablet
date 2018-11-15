import * as React from 'react'
import { StyleSheet } from 'react-native'
import { color } from '../../../../styles'
import { TreeList } from '../../../../components'
import { scaleSize, Toast } from '../../../../utils'
import { SMap } from 'imobile_for_reactnative'

export default class GroupTab extends React.Component {
  props: {
    data?: Array,
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

  _onPress = ({ data, index }) => {
    Toast.show(index + '---' + data.path)
    SMap.findSymbolsByGroups(data.type, data.path).then(result => {
      Toast.show(JSON.stringify(result))
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
    backgroundColor: color.blackBg,
  },
})
