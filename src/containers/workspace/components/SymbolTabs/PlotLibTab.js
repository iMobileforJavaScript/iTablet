import * as React from 'react'
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from 'react-native'
import { color, size } from '../../../../styles'
import { scaleSize, Toast } from '../../../../utils'
import { getLanguage } from '../../../../language/index'
import { FileTools } from '../../../../native'
export default class PlotLibTab extends React.Component {
  props: {
    data: Array,
    user: Object,
    layers: Object,
    template: Object,
    setCurrentPlotInfo: () => {},
    getSymbolPlots: () => {},
    setCurrentPlotList: () => {},
    showToolbar: () => {},
    device: Object,
    goToPage: () => {},
  }

  constructor(props) {
    super(props)
    this.state = {
      data: props.data,
    }
  }

  action = async ({ item }) => {
    Toast.show(
      //'当前选择为:'
      getLanguage(global.language).Prompt.THE_CURRENT_SELECTION + item.name,
    )

    let plotPath = await FileTools.appendingHomeDirectory(item.path)
    await this.props.getSymbolPlots({
      path: plotPath,
      isFirst: false,
    })
    this.props.goToPage && this.props.goToPage(2)

    let data = []
    if (
      this.props.template.template.symbols &&
      this.props.template.template.symbols.length > 0
    ) {
      let dealData = function(list) {
        let mList = []
        for (let i = 0; i < list.length; i++) {
          if (list[i].feature && list[i].feature.length > 0) {
            list[i].id = list[i].code
            list[i].childGroups = []
            list[i].childGroups = dealData(list[i].feature)
            mList.push(list[i])
          }
        }
        return mList
      }
      data = dealData(this.props.template.template.symbols)
    }
    let subdata = data[0]
    this.props.setCurrentPlotList(subdata)
    let tempSymbol = Object.assign({}, subdata.$)
    this.props.setCurrentPlotInfo(tempSymbol, () => {})
  }

  _renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        style={styles.listItem}
        key={item.title}
        onPress={() => this.action({ item })}
      >
        <View style={styles.listItemContent}>
          <Text
            style={styles.listItemName}
            numberOfLines={2}
            ellipsizeMode={'tail'}
          >
            {item.name}
          </Text>
        </View>
      </TouchableOpacity>
    )
  }

  _keyExtractor = (item, index) => index + '-' + item.title

  render() {
    return (
      <FlatList
        style={styles.container}
        data={this.props.data}
        renderItem={this._renderItem}
        keyExtractor={this._keyExtractor}
        device={this.props.device}
      />
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.bgW,
  },
  listItem: {
    height: scaleSize(64),
    justifyContent: 'flex-start',
    backgroundColor: color.bgW,
    flexDirection: 'row',
  },
  listItemContent: {
    flexDirection: 'column',
    justifyContent: 'space-around',
  },
  listItemName: {
    marginLeft: scaleSize(30),
    minHeight: scaleSize(32),
    width: scaleSize(160),
    color: color.font_color_white,
    fontSize: size.fontSize.fontSizeSm,
  },
})
