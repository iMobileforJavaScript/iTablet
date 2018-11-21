import * as React from 'react'
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  SectionList,
} from 'react-native'
import { color, size } from '../../../../styles'
import { ListSeparator } from '../../../../components'
import { scaleSize, Toast } from '../../../../utils'

export default class TemplateTab extends React.Component {
  props: {
    data?: Array,
  }

  static defaultProps = {
    data: [
      {
        index: 0,
        title: '',
        data: [
          {
            title: '地理国情普查',
            action: () => {},
          },
          {
            title: '国土三调',
            action: () => {},
          },
          {
            title: '水利',
            action: () => {},
          },
        ],
      },
      {
        index: 1,
        title: '',
        data: [
          {
            title: '导入模板',
            action: () => {},
          },
        ],
      },
    ],
  }

  constructor(props) {
    super(props)
    this.state = {
      data: props.data,
    }
  }

  componentDidMount() {}

  _onPress = ({ item, index }) => {
    Toast.show(index + '---' + item.title)
  }

  _renderSection = ({ section }) => {
    let sectionView = section.title ? (
      <View style={styles.sectionHeader}>
        <Text style={styles.listItemTitle}>{section.title}</Text>
      </View>
    ) : (
      <View />
    )
    return sectionView
  }

  _renderItem = ({ item, index }) => {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        style={styles.listItem}
        accessible={true}
        accessibilityLabel={item.key}
        onPress={() => this._onPress({ item, index })}
      >
        <Text style={styles.listItemTitle}>{item.title}</Text>
      </TouchableOpacity>
    )
  }

  _renderItemSeparatorComponent = () => {
    return <ListSeparator height={scaleSize(1)} color={color.theme} />
  }

  _renderSectionSeparatorComponent = ({ section }) => {
    return section.index !== 0 ? (
      <ListSeparator height={scaleSize(20)} color={color.theme} />
    ) : null
  }

  _keyExtractor = (item, index) => index + '-' + item.title

  render() {
    return (
      <SectionList
        renderSectionHeader={this._renderSection}
        renderItem={this._renderItem}
        keyExtractor={this._keyExtractor}
        sections={this.state.data}
        ItemSeparatorComponent={this._renderItemSeparatorComponent}
        SectionSeparatorComponent={this._renderSectionSeparatorComponent}
      />
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.theme,
  },
  sectionHeader: {
    height: scaleSize(60),
    justifyContent: 'center',
    backgroundColor: color.blackBg,
    paddingHorizontal: scaleSize(30),
  },
  listItem: {
    height: scaleSize(60),
    justifyContent: 'center',
    backgroundColor: color.blackBg,
    paddingHorizontal: scaleSize(30),
  },
  listItemTitle: {
    fontSize: size.fontSize.fontSizeXs,
    color: color.themeText,
  },
})
