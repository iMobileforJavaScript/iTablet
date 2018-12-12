import React from 'react'
import { color, size } from '../../../../styles'
import { scaleSize } from '../../../../utils'
import { StyleSheet, TouchableOpacity, Text, SectionList } from 'react-native'

export default class ToolBarSectionList extends React.Component {
  props: {
    style?: Object,
    sectionStyle?: Object,
    itemStyle?: Object,
    sections: Array,
    renderItem: () => {},
    renderSectionHeader: () => {},
    keyExtractor: () => {},
    itemAction?: () => {},
    headerAction?: () => {},
  }

  static defaultProps = {
    sections: [],
  }

  headerAction = ({ section }) => {
    this.props.headerAction && this.props.headerAction({ section })
  }

  itemAction = ({ item, index }) => {
    this.props.itemAction && this.props.itemAction({ item, index })
  }

  renderSection = ({ section }) => {
    if (this.props.renderSectionHeader) {
      return this.props.renderSectionHeader({ section })
    }
    return (
      <TouchableOpacity
        activeOpacity={1}
        style={[styles.sectionHeader, this.props.sectionStyle]}
        onPress={() => this.headerAction({ section })}
      >
        <Text style={styles.sectionTitle}>{section.title}</Text>
      </TouchableOpacity>
    )
  }

  renderItem = ({ item, index }) => {
    if (this.props.renderItem) {
      return this.props.renderItem({ item, index })
    }
    return (
      <TouchableOpacity
        style={[styles.item, this.props.itemStyle,item.backgroundColor&&{backgroundColor:item.backgroundColor}]}
        onPress={() => this.itemAction({ item, index })}
      >
        {item.title&&<Text style={styles.itemTitle}>{item.title}</Text>}
      </TouchableOpacity>
    )
  }

  render() {
    return (
      <SectionList
        style={[this.props.style]}
        sections={this.props.sections}
        renderItem={this.renderItem}
        renderSectionHeader={this.renderSection}
        keyExtractor={(item, index) => index}
      />
    )
  }
}

const styles = StyleSheet.create({
  sectionHeader: {
    backgroundColor: color.subTheme,
    height: scaleSize(80),
    justifyContent: 'center',
  },
  sectionTitle: {
    marginLeft: scaleSize(30),
    fontSize: size.fontSize.fontSizeLg,
    fontWeight: 'bold',
    color: color.themeText,
  },
  item: {
    height: scaleSize(80),
    backgroundColor: color.theme,
    justifyContent: 'center',
  },
  itemTitle: {
    marginLeft: scaleSize(60),
    fontSize: size.fontSize.fontSizeMd,
    backgroundColor: color.theme,
    color: color.themeText,
  },
})
