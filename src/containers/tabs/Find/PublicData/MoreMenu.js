import React from 'react'
import { View, Image, Text, TouchableOpacity, FlatList } from 'react-native'
import { getThemeAssets } from '../../../../assets'
import { getLanguage } from '../../../../language'
import DropdownView from './DropdownView'
import styles from './styles'

export default class MoreMenu extends React.Component {
  props: {
    onPress: () => {},
  }

  constructor(props) {
    super(props)
    this.state = {
      data: this.getData(),
      visible: false,
    }
  }

  getData = () => [
    {
      key: getLanguage(global.language).Find.SORT_BY_NAME,
      value: 'sortByName',
      image: getThemeAssets().find.sort_name,
    },
    {
      key: getLanguage(global.language).Find.SORT_BY_TIME,
      value: 'sortByTime',
      image: getThemeAssets().find.sort_time,
    },
    {
      key: getLanguage(global.language).Find.SELECT_DATATYPES,
      value: 'selectDataTypes',
      image: getThemeAssets().find.list,
    },
  ]

  setVisible = visible => {
    if (this.state.visible !== visible) {
      this.setState({ visible: visible })
    }
  }

  renderItem = ({ index, item }) => {
    return (
      <View style={styles.MenuItemContainerStyle}>
        <TouchableOpacity
          style={styles.ListItemViewStyle}
          onPress={() => {
            this.props.onPress(item)
          }}
        >
          <Image source={item.image} style={styles.MenuImageStyle} />
          <Text style={styles.textStyle}>{item.key}</Text>
        </TouchableOpacity>
        {this.state.data.length !== index + 1 && (
          <View style={styles.menuSeperator} />
        )}
      </View>
    )
  }

  renderList = () => {
    return (
      <View style={styles.MoreMenuContainer}>
        <FlatList
          data={this.state.data}
          renderItem={this.renderItem}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
    )
  }

  render() {
    return (
      <DropdownView
        visible={this.state.visible}
        onBackgroudPress={() => {
          this.setVisible(false)
        }}
      >
        {this.renderList()}
      </DropdownView>
    )
  }
}
