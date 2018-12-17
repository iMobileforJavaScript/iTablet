import React from 'react'
import { color, size } from '../../../../styles'
import { scaleSize } from '../../../../utils'
import {
  StyleSheet,
  TouchableOpacity,
  Text,
  SectionList,
  Image,
} from 'react-native'

export default class ToolBarSectionList extends React.Component {
  props: {
    style?: Object,
    sectionStyle?: Object,
    itemStyle?: Object,
    listSelectable?: boolean,
    sections: Array,
    renderItem: () => {},
    renderSectionHeader: () => {},
    keyExtractor: () => {},
    itemAction?: () => {},
    headerAction?: () => {},
  }

  static defaultProps = {
    sections: [],
    listSelectable: false,
  }

  constructor(props) {
    super(props)
    this.state = {
      selectList: [],
      sections: props.sections,
    }
  }

  componentDidUpdate(prevProps) {
    if (
      JSON.stringify(prevProps.sections) !== JSON.stringify(this.props.sections)
    ) {
      this.setState({
        sections: this.props.sections,
        selectList: [],
      })
    }
  }

  headerAction = ({ section }) => {
    this.props.headerAction && this.props.headerAction({ section })
  }

  itemAction = ({ item, index, section }) => {
    if (this.props.listSelectable) {
      this.select(section, index, item.isSelected)
      return
    }
    this.props.itemAction && this.props.itemAction({ item, index, section })
  }

  select = (section, index, isSelected) => {
    let sections = JSON.parse(JSON.stringify(this.state.sections))
    let selectList = JSON.parse(JSON.stringify(this.state.selectList))
    for (let i = 0; i < sections.length; i++) {
      if (JSON.stringify(sections[i]) === JSON.stringify(section)) {
        sections[i].data[index].isSelected = !isSelected
        if (!isSelected) {
          selectList.push(
            sections[i].data[index].title || sections[i].data[index].name,
          )
        } else {
          for (let j = 0; j < selectList.length; j++) {
            if (
              selectList[j].title === sections[i].data[index].title ||
              selectList[j].name === sections[i].data[index].name
            ) {
              selectList.splice(j, 1)
            }
          }
        }
        break
      }
    }
    this.setState({
      sections,
      selectList,
    })
  }

  getSelectList = () => {
    return this.state.selectList
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

  renderItem = ({ item, index, section }) => {
    if (this.props.renderItem) {
      return this.props.renderItem({ item, index, section })
    }
    let selectImg = item.isSelected
      ? require('../../../../assets/map/icon-arrow-up.png')
      : require('../../../../assets/map/icon-arrow-down.png')
    return (
      <TouchableOpacity
        style={[
          styles.item,
          this.props.itemStyle,
          item.backgroundColor && { backgroundColor: item.backgroundColor },
        ]}
        onPress={() => this.itemAction({ item, index, section })}
      >
        {this.props.listSelectable && (
          <TouchableOpacity
            style={styles.selectImgView}
            onPress={() => this.select(section, index, item.isSelected)}
          >
            <Image
              source={selectImg}
              resizeMode={'contain'}
              style={styles.selectImg}
            />
          </TouchableOpacity>
        )}
        {(item.title || item.name) && (
          <Text style={styles.itemTitle}>{item.title || item.name}</Text>
        )}
      </TouchableOpacity>
    )
  }

  render() {
    return (
      <SectionList
        style={[this.props.style]}
        sections={this.state.sections}
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
    alignItems: 'center',
    flexDirection: 'row',
  },
  itemTitle: {
    marginLeft: scaleSize(60),
    fontSize: size.fontSize.fontSizeMd,
    height: scaleSize(30),
    backgroundColor: 'transparent',
    color: color.themeText,
  },
  selectImgView: {
    width: scaleSize(80),
    height: scaleSize(80),
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectImg: {
    width: scaleSize(40),
    height: scaleSize(40),
  },
})
