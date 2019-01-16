import React from 'react'
import { color, size } from '../../../../styles'
import { scaleSize } from '../../../../utils'
import {
  StyleSheet,
  TouchableOpacity,
  TouchableHighlight,
  Text,
  SectionList,
  Image,
  View,
} from 'react-native'

export default class ToolBarSectionList extends React.Component {
  props: {
    style?: Object,
    sectionStyle?: Object,
    itemStyle?: Object,
    listSelectable?: boolean,
    sectionTitleStyle?: Object,
    activeOpacity?: Object,
    underlayColor?: Object,
    sections: Array,
    renderItem?: () => {},
    renderSectionHeader?: () => {},
    keyExtractor: () => {},
    itemAction?: () => {},
    headerAction?: () => {},
    device: Object,
  }

  static defaultProps = {
    sections: [],
    listSelectable: false,
    activeOpacity: 1,
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

  scrollToLocation = params => {
    this.sectionList.scrollToLocation(params)
  }

  renderSection = ({ section }) => {
    if (this.props.renderSectionHeader) {
      return this.props.renderSectionHeader({ section })
    }
    return (
      <TouchableHighlight
        activeOpacity={this.props.activeOpacity}
        underlayColor={this.props.underlayColor}
        style={[styles.sectionHeader, this.props.sectionStyle]}
        onPress={() => this.headerAction({ section })}
      >
        <View style={{ flexDirection: 'row' }}>
          {section.datasetType && (
            <Image
              source={this.getDatasetTypeImg(section)}
              resizeMode={'contain'}
              style={styles.section_dataset_type}
            />
          )}
          {section.image && (
            <Image
              source={section.image}
              resizeMode={'contain'}
              style={styles.section_dataset_type}
            />
          )}
          <Text style={[styles.sectionTitle, this.props.sectionTitleStyle]}>
            {section.title}
          </Text>
        </View>
      </TouchableHighlight>
    )
  }

  renderItem = ({ item, index, section }) => {
    if (this.props.renderItem) {
      return this.props.renderItem({ item, index, section })
    }
    let selectImg = item.isSelected
      ? require('../../../../assets/mapTools/icon_multi_selected.png')
      : require('../../../../assets/mapTools/icon_multi_unselected.png')
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
        {item.image && this.getImg(item)}
        <View
          style={{
            flexDirection: 'column',
            justifyContent: 'center',
          }}
        >
          {(item.name || item.title) && (
            <Text style={item.image ? styles.imageItemTitle : styles.itemTitle}>
              {item.name || item.title}
            </Text>
          )}
          {item.datasetType && item.datasetName && this.getDatasetItem(item)}
          {item.expression && this.getExpressionItem(item)}
          {item.colorSchemeName &&
            item.colorScheme &&
            this.getColorSchemeItem(item)}
          {item.info && this.getInfo(item)}
        </View>
      </TouchableOpacity>
    )
  }

  getImg = item => {
    return (
      <Image
        source={item.image}
        resizeMode={'contain'}
        style={styles.headerImg}
      />
    )
  }

  getInfo = item => {
    // let lastModifiedDate = DateUtil.formatDate(item.StatResult.mtime.getTime(), "yyyy-MM-dd hh:mm:ss")
    // type 根据类型返回固定的信息
    // item.info = {
    //   infoType: 'mtime',
    //   lastModifiedDate: item.mtime,
    // }
    let info
    if (item.info.infoType === 'mtime') {
      info = '最后修改时间：' + item.info.lastModifiedDate
    } else {
      return
    }
    return <Text style={styles.itemInfo}>{info}</Text>
  }

  /**颜色方案Item */
  getColorSchemeItem = item => {
    let itemstyle
    if (this.props.device.orientation === 'LANDSCAPE') {
      itemstyle = styles.colorScheme_Landscape
    } else {
      itemstyle = styles.colorScheme
    }
    return (
      <View style={styles.item}>
        <Text style={styles.colorSchemeName}>{item.colorSchemeName}</Text>
        <Image
          source={item.colorScheme}
          resizeMode={'stretch'} //stretch: 拉伸图片且不维持宽高比,直到宽高都刚好填满容器
          style={itemstyle}
        />
      </View>
    )
  }

  /**字段表达式Item */
  getExpressionItem = item => {
    const itemSelectedStyle = {
      width: this.props.device.width,
      paddingLeft: scaleSize(60),
      // textAlign: 'center',
      // alignItems: 'center',
      // justifyContent: 'center',
      textAlignVertical: 'center',
      fontSize: size.fontSize.fontSizeMd,
      height: scaleSize(80),
      backgroundColor: color.gray,
      color: color.white,
    }
    return (
      <Text style={item.isSelected ? itemSelectedStyle : styles.itemTitle}>
        {item.expression}
      </Text>
    )
  }

  /**数据集类型字段Item */
  getDatasetItem = item => {
    return (
      <View style={styles.item}>
        <Image
          source={this.getDatasetTypeImg(item)}
          resizeMode={'contain'}
          style={styles.dataset_type_img}
        />
        <Text style={styles.dataset_title}>{item.datasetName}</Text>
      </View>
    )
  }

  getDatasetTypeImg = item => {
    let img
    switch (item.datasetType) {
      case 'POINT':
        img = require('../../../../assets/mapToolbar/dataset_type_point.png')
        break
      case 'LINE':
        img = require('../../../../assets/mapToolbar/dataset_type_line.png')
        break
      case 'REGION':
        img = require('../../../../assets/mapToolbar/dataset_type_region.png')
        break
      case 'TEXT':
        img = require('../../../../assets/mapToolbar/dataset_type_text.png')
        break
      case 'IMAGE':
        img = require('../../../../assets/mapToolbar/dataset_type_image.png')
        break
      case 'CAD':
        img = require('../../../../assets/mapToolbar/dataset_type_cad.png')
        break
      case 'GRID':
        img = require('../../../../assets/mapToolbar/dataset_type_grid.png')
        break
      case 'NETWORK':
        img = require('../../../../assets/mapToolbar/dataset_type_network.png')
        break
      default:
        img = require('../../../../assets/mapToolbar/dataset_type_else.png')
        break
    }
    return img
  }

  getItemLayout = (data, index) => {
    return {
      length: scaleSize(80),
      offset: scaleSize(80 + 1) * index,
      index,
    }
  }

  /**行与行之间的分隔线组件 */
  renderItemSeparator = () => {
    return <View style={styles.separateViewStyle} />
  }

  render() {
    return (
      <SectionList
        ref={ref => (this.sectionList = ref)}
        style={[this.props.style]}
        sections={this.state.sections}
        renderItem={this.renderItem}
        renderSectionHeader={this.renderSection}
        keyExtractor={(item, index) => index}
        getItemLayout={this.getItemLayout}
        ItemSeparatorComponent={this.renderItemSeparator}
      />
    )
  }
}

const styles = StyleSheet.create({
  sectionHeader: {
    backgroundColor: color.subTheme,
    height: scaleSize(80),
    alignItems: 'center',
    flexDirection: 'row',
  },
  sectionTitle: {
    marginLeft: scaleSize(30),
    fontSize: size.fontSize.fontSizeLg,
    fontWeight: 'bold',
    color: color.themeText,
    textAlign: 'center',
    textAlignVertical: 'center',
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
    textAlignVertical: 'center',
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
  section_dataset_type: {
    width: scaleSize(50),
    height: scaleSize(50),
    marginLeft: scaleSize(30),
  },
  dataset_type_img: {
    width: scaleSize(50),
    height: scaleSize(50),
    marginLeft: scaleSize(50),
  },
  dataset_title: {
    marginLeft: scaleSize(30),
    fontSize: size.fontSize.fontSizeMd,
    height: scaleSize(30),
    backgroundColor: 'transparent',
    color: color.themeText,
  },
  colorScheme: {
    width: scaleSize(420),
    height: scaleSize(40),
    marginLeft: scaleSize(20),
  },
  colorScheme_Landscape: {
    width: scaleSize(700),
    height: scaleSize(40),
    marginLeft: scaleSize(20),
  },
  colorSchemeName: {
    width: scaleSize(220),
    marginLeft: scaleSize(40),
    fontSize: size.fontSize.fontSizeMd,
    height: scaleSize(30),
    backgroundColor: 'transparent',
    color: color.themeText,
  },
  separateViewStyle: {
    flexDirection: 'column',
    width: '100%',
    height: scaleSize(1),
    backgroundColor: color.subTheme,
  },
  itemInfo: {
    marginLeft: scaleSize(30),
    marginTop: scaleSize(4),
    fontSize: scaleSize(15),
    height: scaleSize(30),
    backgroundColor: 'transparent',
    textAlignVertical: 'center',
    color: color.gray,
  },
  headerImg: {
    marginLeft: scaleSize(50),
    width: scaleSize(40),
    height: scaleSize(40),
  },
  imageItemTitle: {
    marginLeft: scaleSize(30),
    fontSize: size.fontSize.fontSizeMd,
    height: scaleSize(30),
    backgroundColor: 'transparent',
    color: color.themeText,
    textAlignVertical: 'center',
  },
})
