import * as React from 'react'
import { Text, View, TouchableOpacity, StyleSheet, Image } from 'react-native'
import { color, size } from '../../../../styles'
import { TableList } from '../../../../components'
import { scaleSize, Toast } from '../../../../utils'
import { ToolbarType } from '../../../../constants'
import { plotModule } from '../ToolBar/modules'
import { SMCollectorType } from 'imobile_for_reactnative'
import { getLanguage } from '../../../../language/index'
export default class PlotTab extends React.Component {
  props: {
    data: Array,
    user: Object,
    layers: Object,
    setCurrentPlotInfo: () => {},
    showToolbar: () => {},
    device: Object,
  }

  constructor(props) {
    super(props)
    this.state = {
      data: props.data,
    }
  }

  action = ({ item }) => {
    Toast.show(
      //'当前选择为:'
      getLanguage(global.language).Prompt.THE_CURRENT_SELECTION +
        item.code +
        ' ' +
        item.name,
    )

    let tempSymbol = Object.assign({}, item)
    this.props.setCurrentPlotInfo(tempSymbol)
    let symbolCode = parseInt(item.name)
    let libId = item.code

    plotModule().actions.showCollection(
      libId,
      symbolCode,
      SMCollectorType.POINT_HAND,
    )
  }

  _renderItem = ({ item, rowIndex, cellIndex }) => {
    return (
      <TouchableOpacity
        style={styles.listItem}
        key={item.code}
        onPress={() => this.action({ item, rowIndex, cellIndex })}
      >
        <Image
          source={{ uri: 'file://' + item.path }}
          style={styles.listItemImg}
        />
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
      <TableList
        style={styles.container}
        data={this.props.data}
        // data={this.state.data}
        type={ToolbarType.scrollTable}
        numColumns={3}
        renderCell={this._renderItem}
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
    // width: 100,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: color.bgW,
    paddingHorizontal: scaleSize(30),
    flexDirection: 'row',
  },
  listItemImg: {
    height: scaleSize(64),
    width: scaleSize(64),
  },
  listItemContent: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-around',
  },
  listItemName: {
    minHeight: scaleSize(32),
    width: scaleSize(160),
    color: color.font_color_white,
    fontSize: size.fontSize.fontSizeSm,
  },
  listItemSubTitle: {
    height: scaleSize(32),
    width: scaleSize(160),
    color: color.themeText2,
    fontSize: size.fontSize.fontSizeSm,
  },
})
