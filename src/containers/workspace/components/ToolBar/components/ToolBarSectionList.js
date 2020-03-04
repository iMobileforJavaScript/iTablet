import React from 'react'
import { color, size } from '../../../../../styles'
import { scaleSize, setSpText } from '../../../../../utils'
import { getLanguage } from '../../../../../language'
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
    layerManager?: boolean,
    initialNumToRender?: number,
    // selectList: Object,
    listSelectableAction?: () => {}, //多选刷新列表时调用
  }

  static defaultProps = {
    sections: [],
    listSelectable: false,
    activeOpacity: 1,
    initialNumToRender: 15,
  }

  constructor(props) {
    super(props)
    let { selectList, allSelected } = this.dealSelectList(props.sections)
    this.state = {
      selectList,
      sections: props.sections,
      sectionSelected: true,
      allSelected, // 判断是 全部选中 还是 全部取消，只在section.allSelectType = true时生效
    }
  }

  componentDidUpdate(prevProps) {
    if (
      JSON.stringify(prevProps.sections) !== JSON.stringify(this.props.sections)
    ) {
      let { selectList, allSelected } = this.dealSelectList(this.props.sections)
      this.setState({
        sections: this.props.sections,
        selectList,
        allSelected,
      })
    }
  }

  dealSelectList = sections => {
    let selectList = {},
      allSelected = false
    for (let i = 0; i < sections.length; i++) {
      let section = sections[i]
      if (!selectList[section.title]) selectList[section.title] = []
      for (let j = 0; j < section.data.length; j++) {
        let item = section.data[j]
        let pushName =
          item.title || item.name || item.expression || item.datasetName
        if (
          item.isSelected &&
          selectList[section.title].indexOf(pushName) < 0
        ) {
          selectList[section.title].push(pushName)
        }
      }

      if (
        selectList &&
        selectList[section.title] &&
        section &&
        section.data &&
        selectList[section.title].length === section.data.length
      ) {
        allSelected = true
      } else {
        allSelected = false
      }
    }
    return { selectList, allSelected }
  }

  headerAction = ({ section }) => {
    this.props.headerAction && this.props.headerAction({ section })
  }

  itemAction = ({ item, index, section }) => {
    if (this.props.listSelectable) {
      this.select(section, index, item.isSelected, selectList => {
        this.props.itemAction &&
          this.props.itemAction({ item, index, section, selectList })
      })
      return
    }
    this.props.itemAction && this.props.itemAction({ item, index, section })
  }

  select = (section, index, isSelected, cb = () => {}) => {
    let sections = JSON.parse(JSON.stringify(this.state.sections))
    let selectList = this.state.selectList
    let title = this.state.sections[0].title
    for (let i = 0; i < sections.length; i++) {
      if (JSON.stringify(sections[i]) === JSON.stringify(section)) {
        if (!selectList[title]) selectList[title] = []
        let item = sections[i].data[index]
        item.isSelected = !isSelected

        let pushName =
          item.title || item.name || item.expression || item.datasetName
        let _index = selectList[title].indexOf(pushName)
        if (_index >= 0 && isSelected) {
          // 取消选中并删除selectList中记录
          selectList[title].splice(_index, 1)
        } else {
          selectList[title].push(pushName)
        }
      }
      break
    }
    this.setState(
      {
        sections,
        selectList,
      },
      () => {
        cb && cb(selectList)
        // this.props.listSelectableAction &&
        //   this.props.listSelectableAction({ selectList })
      },
    )
  }

  sectionAllPress = section => {
    if (!section.allSelectType) return
    let sections = JSON.parse(JSON.stringify(this.state.sections))
    // let selectList = JSON.parse(JSON.stringify(this.state.selectList))
    let selectList = this.state.selectList
    let title = section.title
    let allSelected = this.state.allSelected
    for (let i = 0; i < sections.length; i++) {
      if (JSON.stringify(sections[i]) === JSON.stringify(section)) {
        if (
          selectList &&
          selectList[title] &&
          section &&
          section.data &&
          section.title === title &&
          selectList[title].length === section.data.length
        ) {
          allSelected = true
        } else {
          allSelected = false
        }
        for (let k = 0; k < sections[i].data.length; k++) {
          // if (!sections[i].data[k].isSelected)
          sections[i].data[k].isSelected = !allSelected

          if (!selectList[title]) selectList[title] = []
          let pushName =
            sections[i].data[k].title ||
            sections[i].data[k].name ||
            sections[i].data[k].expression ||
            sections[i].data[k].datasetName

          if (allSelected) {
            // 全部取消
            selectList[title] && delete selectList[title]
          } else {
            if (selectList[title].indexOf(pushName) < 0) {
              selectList[title].push(pushName)
            }
          }
        }
      }
      break
    }
    this.setState(
      {
        sections,
        selectList,
        allSelected: !allSelected,
      },
      () => {
        this.props.listSelectableAction &&
          this.props.listSelectableAction({ selectList })
      },
    )
  }

  sectionSelect = section => {
    if (section.expressionType) {
      let selected = !this.state.sectionSelected
      this.setState({
        sectionSelected: selected,
      })
    }
  }

  getSelectList = () => {
    return this.state.selectList
  }

  getItemByTitle = (sectionTitle, itemTitle) => {
    let item = null
    for (let i = 0; i < this.state.sections.length; i++) {
      if (this.state.sections[i].title === sectionTitle) {
        for (let j = 0; j < this.state.sections[i].data.length; j++) {
          if (
            this.state.sections[i].data[j].colorSchemeName === itemTitle ||
            this.state.sections[i].data[j].expression === itemTitle ||
            this.state.sections[i].data[j].datasetName === itemTitle ||
            this.state.sections[i].data[j].name === itemTitle ||
            this.state.sections[i].data[j].title === itemTitle
          ) {
            item = this.state.sections[i].data[j]
            break
          }
        }
        break
      }
    }

    return item
  }

  scrollToLocation = params => {
    this.sectionList.scrollToLocation(params)
  }

  renderSection = ({ section }) => {
    if (this.props.renderSectionHeader) {
      return this.props.renderSectionHeader({ section })
    }
    let selectImg = this.state.sectionSelected
      ? require('../../../../../assets/mapTools/icon_multi_selected.png')
      : require('../../../../../assets/mapTools/icon_multi_unselected.png')
    return (
      <TouchableHighlight
        activeOpacity={this.props.activeOpacity}
        underlayColor={this.props.underlayColor}
        style={[styles.sectionHeader, this.props.sectionStyle]}
        onPress={() => this.headerAction({ section })}
      >
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          {section.datasetType && (
            <Image
              source={this.getSectionDatasetTypeImg(section)}
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
          {section.expressionType && (
            <TouchableOpacity
              style={
                (styles.selectImgView,
                {
                  flexDirection: 'row',
                  alignItems: 'center',
                  position: 'absolute',
                  right: scaleSize(30),
                  height: scaleSize(80),
                })
              }
              onPress={() => this.sectionSelect(section)}
            >
              <Image
                source={selectImg}
                resizeMode={'contain'}
                style={styles.selectImg}
              />
              <Text style={[styles.sectionSelectedTitle]}>
                {
                  getLanguage(global.language).Map_Main_Menu
                    .THEME_HIDE_SYSTEM_FIELDS
                }
                {/* 隐藏系统字段 */}
              </Text>
            </TouchableOpacity>
          )}
          {section.allSelectType && (
            <TouchableOpacity
              style={
                (styles.selectImgView,
                {
                  flexDirection: 'row',
                  alignItems: 'center',
                  position: 'absolute',
                  right: scaleSize(30),
                  height: scaleSize(80),
                })
              }
              onPress={() => this.sectionAllPress(section)}
            >
              <Text style={[styles.sectionSelectedTitle]}>
                {this.state.allSelected
                  ? getLanguage(global.language).Map_Main_Menu.THEME_ALL_CANCEL
                  : getLanguage(global.language).Map_Main_Menu
                    .THEME_ALL_SELECTED}
                {/* 全部选中 */}
              </Text>
            </TouchableOpacity>
          )}
          {section.buttons && section.buttons.length > 0 && (
            <View style={styles.sectionButtons}>{section.buttons}</View>
          )}
        </View>
      </TouchableHighlight>
    )
  }

  renderItem = ({ item, index, section }) => {
    if (this.props.renderItem) {
      return this.props.renderItem({ item, index, section })
    }
    if (item.isSystemField && this.state.sectionSelected) {
      //隐藏系统字段
      return null
    }
    let selectImg = item.isSelected
      ? require('../../../../../assets/mapTools/icon_multi_selected_disable_black.png')
      : require('../../../../../assets/mapTools/icon_multi_unselected_disable_black.png')
    let selectedTextStyle = item.isSelected ? { color: 'white' } : {}
    return (
      <TouchableOpacity
        style={[
          styles.item,
          this.props.itemStyle,
          item.backgroundColor && { backgroundColor: item.backgroundColor },
          item.isSelected && !this.props.listSelectable
            ? styles.itemSelected
            : styles.item,
        ]}
        activeOpacity={0.2}
        onPress={() => this.itemAction({ item, index, section })}
      >
        {this.props.listSelectable && (
          <TouchableOpacity
            style={styles.selectImgView}
            // onPress={() => this.select(section, index, item.isSelected)}
            onPress={() => this.itemAction({ item, index, section })}
          >
            <Image
              source={selectImg}
              resizeMode={'contain'}
              style={styles.selectImg}
            />
          </TouchableOpacity>
        )}
        {item.image && this.getImg(item)}
        {item.datasetType && item.datasetName && this.getDatasetImage(item)}
        <View
          style={{
            flex: 1,
            flexDirection: 'column',
            justifyContent: 'center',
          }}
        >
          {(item.name || item.title) && (
            <View style={styles.itemTitleView}>
              <Text
                style={[
                  item.image ? styles.imageItemTitle : styles.itemTitle,
                  selectedTextStyle,
                ]}
              >
                {item.name || item.title}
              </Text>
              {item.subTitle && (
                <Text style={styles.subTitle}>
                  {getLanguage(global.language).Prompt.LATEST}
                  {item.subTitle}
                </Text>
              )}
            </View>
          )}
          {item.datasetType && item.datasetName && this.getDatasetItem(item)}
          {item.expression && this.getExpressionItem(item)}
          {item.colorSchemeName &&
            item.colorScheme &&
            this.getColorSchemeItem(item)}
          {item.info && this.getInfo(item)}
        </View>
        {item.rightView}
      </TouchableOpacity>
    )
  }

  getImg = item => {
    return (
      <Image
        source={item.image}
        resizeMode={'contain'}
        style={[
          styles.headerImg,
          this.props.listSelectable
            ? { marginLeft: scaleSize(10) }
            : { marginLeft: scaleSize(50) },
        ]}
      />
    )
  }

  getInfo = item => {
    // let lastModifiedDate = DateUtil.formatDate(item.StatResult.mtime.getTime(), "yyyy-MM-dd hh:mm:ss")
    // type 根据类型返回信息
    // item.info = {
    //   infoType: 'mtime',
    //   lastModifiedDate: item.mtime,
    // }
    //  item.info = {
    //    infoType: 'fieldType',
    //    fieldType: item.fieldType,
    //  }
    // item.info = {
    //   infoType: 'dataset',
    //   geoCoordSysType: item.geoCoordSysType,
    //   prjCoordSysType: item.prjCoordSysType,
    // }
    let info
    if (item.info.infoType === 'mtime') {
      info = getLanguage(global.language).Prompt.LATEST
      if (global.language === 'CN') info = info + item.info.lastModifiedDate
      else if (global.language === 'EN') {
        let day = item.info.lastModifiedDate
          .replace(/年|月|日/g, '/')
          .split('  ')[0]
          .split('/')
        info =
          info +
          day[2] +
          '/' +
          day[1] +
          '/' +
          day[0] +
          '  ' +
          item.info.lastModifiedDate.split('  ')[1]
      }
    } else if (item.info.infoType === 'fieldType') {
      info =
        getLanguage(global.language).Prompt.FIELD_TYPE + item.info.fieldType
    } else if (item.info.infoType === 'dataset') {
      let geoCoordSysType = item.info.geoCoordSysType
      let prjCoordSysType = item.info.prjCoordSysType
      info =
        getLanguage(global.language).Prompt.GEOGRAPHIC_COORDINATE_SYSTEM +
        geoCoordSysType +
        ', ' +
        getLanguage(global.language).Prompt.PROJECTED_COORDINATE_SYSTEM +
        prjCoordSysType
    } else {
      return
    }
    let style
    if (item.image || item.datasetType) {
      style = styles.imgItemInfo
    } else if (item.expression && this.props.listSelectable) {
      style = styles.itemInfo_expression_listSelectable
    } else {
      style = styles.itemInfo
    }
    return (
      <Text
        style={[
          style,
          item.isSelected && !item.datasetType && !this.props.listSelectable
            ? { color: color.item_text_selected }
            : { color: color.item_separate_white },
        ]}
        ellipsizeMode="tail"
        numberOfLines={1}
      >
        {info}
      </Text>
    )
  }

  /**颜色方案Item */
  getColorSchemeItem = item => {
    //用户自定义单独处理
    if (item.key === 'USER_DEFINE') {
      return (
        <View style={styles.item}>
          <Text style={styles.colorSchemeName}>{item.colorSchemeName}</Text>
          <View style={styles.colorImgView}>
            <Image
              source={item.colorScheme}
              resizeMode={'contain'}
              style={styles.userDefineImage}
            />
          </View>
        </View>
      )
    }
    return (
      <View style={styles.item}>
        <Text style={styles.colorSchemeName}>{item.colorSchemeName}</Text>
        <View>
          <Image
            source={item.colorScheme}
            resizeMode={'stretch'} //stretch: 拉伸图片且不维持宽高比,直到宽高都刚好填满容器
            style={[
              styles.colorScheme,
              {
                width: this.props.device.width - scaleSize(220) - scaleSize(90),
              },
            ]}
          />
        </View>
      </View>
    )
  }

  /**字段表达式Item */
  getExpressionItem = item => {
    let style
    if (item.expression && this.props.listSelectable) {
      style = styles.listSelectable_selected_itemTitle
    } else if (item.isSelected && !this.props.listSelectable) {
      style = styles.selected_itemTitle
    } else {
      style = styles.itemTitle
    }
    return <Text style={style}>{item.expression}</Text>
  }

  /**数据集类型字段Item */
  getDatasetItem = item => {
    let dataset_title
    // if (item.isSelected) {
    //   dataset_title = styles.dataset_title_selected
    // } else {
    //   dataset_title = styles.dataset_title
    // }
    dataset_title = styles.dataset_title
    return <Text style={dataset_title}>{item.datasetName}</Text>
  }

  /**数据集类型Image */
  getDatasetImage = item => {
    return (
      <Image
        source={this.getDatasetTypeImg(item)}
        resizeMode={'contain'}
        style={[
          styles.dataset_type_img,
          this.props.listSelectable
            ? { marginLeft: scaleSize(10) }
            : { marginLeft: scaleSize(50) },
        ]}
      />
    )
  }

  getSectionDatasetTypeImg = item => {
    let img
    switch (item.datasetType.toUpperCase()) {
      case 'POINT':
        img = require('../../../../../assets/mapToolbar/dataset_type_point.png')
        break
      case 'LINE':
        img = require('../../../../../assets/mapToolbar/dataset_type_line.png')
        break
      case 'REGION':
        img = require('../../../../../assets/mapToolbar/dataset_type_region.png')
        break
      case 'TEXT':
        img = require('../../../../../assets/mapToolbar/dataset_type_text.png')
        break
      case 'IMAGE':
        img = require('../../../../../assets/mapToolbar/dataset_type_image.png')
        break
      case 'CAD':
        img = require('../../../../../assets/mapToolbar/dataset_type_cad.png')
        break
      case 'GRID':
        img = require('../../../../../assets/mapToolbar/dataset_type_grid.png')
        break
      case 'NETWORK':
        img = require('../../../../../assets/mapToolbar/dataset_type_network.png')
        break
      default:
        img = require('../../../../../assets/mapToolbar/list_type_map.png')
        break
    }
    return img
  }

  getDatasetTypeImg = item => {
    let img
    switch (item.datasetType.toUpperCase()) {
      // case 'POINT':
      //   item.isSelected
      //     ? (img = require('../../../../assets/mapToolbar/dataset_type_point.png'))
      //     : (img = require('../../../../assets/mapToolbar/dataset_type_point_black.png'))
      //   break
      // case 'LINE':
      //   item.isSelected
      //     ? (img = require('../../../../assets/mapToolbar/dataset_type_line.png'))
      //     : (img = require('../../../../assets/mapToolbar/dataset_type_line_black.png'))
      //   break
      // case 'REGION':
      //   item.isSelected
      //     ? (img = require('../../../../assets/mapToolbar/dataset_type_region.png'))
      //     : (img = require('../../../../assets/mapToolbar/dataset_type_region_black.png'))
      //   break
      // case 'TEXT':
      //   item.isSelected
      //     ? (img = require('../../../../assets/mapToolbar/dataset_type_text.png'))
      //     : (img = require('../../../../assets/mapToolbar/dataset_type_text_black.png'))
      //   break
      // case 'IMAGE':
      //   item.isSelected
      //     ? (img = require('../../../../assets/mapToolbar/dataset_type_image.png'))
      //     : (img = require('../../../../assets/mapToolbar/dataset_type_image_black.png'))
      //   break
      // case 'CAD':
      //   item.isSelected
      //     ? (img = require('../../../../assets/mapToolbar/dataset_type_cad.png'))
      //     : (img = require('../../../../assets/mapToolbar/dataset_type_cad_black.png'))
      //   break
      // case 'GRID':
      //   item.isSelected
      //     ? (img = require('../../../../assets/mapToolbar/dataset_type_grid.png'))
      //     : (img = require('../../../../assets/mapToolbar/dataset_type_grid_black.png'))
      //   break
      // case 'NETWORK':
      //   item.isSelected
      //     ? (img = require('../../../../assets/mapToolbar/dataset_type_network.png'))
      //     : (img = require('../../../../assets/mapToolbar/dataset_type_network_black.png'))
      //   break
      // default:
      //   item.isSelected
      //     ? (img = require('../../../../assets/mapToolbar/list_type_map.png'))
      //     : (img = require('../../../../assets/mapToolbar/list_type_map_black.png'))
      //   break
      case 'POINT':
        img = require('../../../../../assets/mapToolbar/dataset_type_point_black.png')
        break
      case 'LINE':
        // item.isSelected
        img = require('../../../../../assets/mapToolbar/dataset_type_line_black.png')
        break
      case 'REGION':
        // item.isSelected
        img = require('../../../../../assets/mapToolbar/dataset_type_region_black.png')
        break
      case 'TEXT':
        img = require('../../../../../assets/mapToolbar/dataset_type_text_black.png')
        break
      case 'IMAGE':
        // item.isSelected
        img = require('../../../../../assets/mapToolbar/dataset_type_image_black.png')
        break
      case 'CAD':
        // item.isSelected
        img = require('../../../../../assets/mapToolbar/dataset_type_cad_black.png')
        break
      case 'GRID':
        // item.isSelected
        img = require('../../../../../assets/mapToolbar/dataset_type_grid_black.png')
        break
      case 'NETWORK':
        // item.isSelected
        img = require('../../../../../assets/mapToolbar/dataset_type_network_black.png')
        break
      default:
        img = require('../../../../../assets/mapToolbar/list_type_map_black.png')
        break
    }
    return img
  }

  getItemLayout = (data, index) => {
    return {
      length: scaleSize(80),
      offset: (scaleSize(80) + 1) * index,
      index,
    }
  }

  /**行与行之间的分隔线组件 */
  renderSeparator = ({ leadingItem, section }) => {
    if (
      section.expressionType &&
      leadingItem.isSystemField &&
      this.state.sectionSelected
    )
      return null
    return <View style={styles.separateViewStyle} />
  }

  /**Section之间的分隔线组件 */
  renderSectionFooter = () => {
    if (this.props.layerManager) {
      return null
    }
    return <View style={styles.sectionSeparateViewStyle} />
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
        ItemSeparatorComponent={this.renderSeparator}
        renderSectionFooter={this.renderSectionFooter}
        initialNumToRender={this.props.initialNumToRender}
        stickySectionHeadersEnabled={true}
      />
    )
  }
}

const styles = StyleSheet.create({
  sectionHeader: {
    backgroundColor: color.section_bg,
    height: scaleSize(80),
    alignItems: 'center',
    flexDirection: 'row',
  },
  sectionTitle: {
    marginLeft: scaleSize(30),
    fontSize: size.fontSize.fontSizeLg,
    fontWeight: 'bold',
    color: color.section_text,
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  sectionButtons: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    flexDirection: 'row',
    paddingRight: scaleSize(15),
  },
  item: {
    height: scaleSize(80),
    backgroundColor: color.content_white,
    alignItems: 'center',
    flexDirection: 'row',
  },
  itemTitleView: {
    flex: 1,
    height: scaleSize(80),
    flexDirection: 'column',
    justifyContent: 'center',
  },
  itemTitle: {
    marginLeft: scaleSize(60),
    fontSize: size.fontSize.fontSizeMd,
    height: scaleSize(30),
    backgroundColor: 'transparent',
    color: color.font_color_white,
    textAlignVertical: 'center',
  },
  imageItemTitle: {
    marginLeft: scaleSize(30),
    fontSize: size.fontSize.fontSizeMd,
    height: scaleSize(30),
    backgroundColor: 'transparent',
    color: color.font_color_white,
    textAlignVertical: 'center',
  },
  subTitle: {
    height: scaleSize(30),
    color: '#A3A3A3',
    marginLeft: scaleSize(30),
    fontSize: setSpText(16),
    justifyContent: 'center',
  },
  selected_itemTitle: {
    marginLeft: scaleSize(60),
    fontSize: size.fontSize.fontSizeMd,
    height: scaleSize(30),
    backgroundColor: 'transparent',
    color: color.item_text_selected,
    textAlignVertical: 'center',
  },
  listSelectable_selected_itemTitle: {
    marginLeft: scaleSize(20),
    fontSize: size.fontSize.fontSizeMd,
    height: scaleSize(30),
    backgroundColor: 'transparent',
    color: color.font_color_white,
    textAlignVertical: 'center',
  },
  selectImgView: {
    width: scaleSize(60),
    height: scaleSize(60),
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
    color: color.font_color_white,
  },
  dataset_title_selected: {
    marginLeft: scaleSize(30),
    fontSize: size.fontSize.fontSizeMd,
    height: scaleSize(30),
    backgroundColor: 'transparent',
    color: color.content_white,
  },
  colorImgView: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  userDefineImage: {
    height: scaleSize(40),
    width: scaleSize(410),
    marginRight: scaleSize(30),
  },
  colorScheme: {
    height: scaleSize(40),
    marginLeft: scaleSize(20),
    marginRight: scaleSize(30),
  },
  colorSchemeName: {
    width: scaleSize(220),
    marginLeft: scaleSize(40),
    fontSize: size.fontSize.fontSizeMd,
    height: scaleSize(30),
    backgroundColor: 'transparent',
    color: color.font_color_white,
  },
  sectionSeparateViewStyle: {
    height: 1,
    marginHorizontal: 0,
    backgroundColor: color.separateColorGray,
  },
  separateViewStyle: {
    flex: 1,
    flexDirection: 'row',
    width: '100%',
    height: 1,
    backgroundColor: color.separateColorGray,
  },
  imgItemInfo: {
    width: scaleSize(520),
    marginLeft: scaleSize(30),
    marginTop: scaleSize(4),
    fontSize: setSpText(16),
    height: scaleSize(30),
    backgroundColor: 'transparent',
    textAlignVertical: 'center',
    color: color.item_separate_white,
  },
  itemInfo: {
    width: scaleSize(520),
    marginLeft: scaleSize(60),
    marginTop: scaleSize(4),
    fontSize: setSpText(16),
    height: scaleSize(30),
    backgroundColor: 'transparent',
    textAlignVertical: 'center',
    color: color.item_separate_white,
  },
  itemInfo_expression_listSelectable: {
    width: scaleSize(520),
    marginLeft: scaleSize(20),
    marginTop: scaleSize(4),
    fontSize: setSpText(16),
    height: scaleSize(30),
    backgroundColor: 'transparent',
    textAlignVertical: 'center',
    color: color.item_separate_white,
  },
  headerImg: {
    marginLeft: scaleSize(50),
    width: scaleSize(40),
    height: scaleSize(40),
  },
  itemSelected: {
    height: scaleSize(80),
    backgroundColor: color.item_selected_bg,
    alignItems: 'center',
    flexDirection: 'row',
  },
  sectionSelectedTitle: {
    marginLeft: scaleSize(10),
    fontSize: size.fontSize.fontSizeLg,
    fontWeight: 'bold',
    color: color.section_text,
    textAlign: 'center',
    textAlignVertical: 'center',
  },
})
