import React from 'react'
import { color, size } from '../../../../styles'
import { scaleSize, setSpText } from '../../../../utils'
import { getLanguage } from '../../../../language/index'
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
    selectList: Object,
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
    this.state = {
      selectList: props.selectList ? props.selectList : {},
      sections: props.sections,
      sectionSelected: true,
    }
  }

  componentDidUpdate(prevProps) {
    if (
      JSON.stringify(prevProps.sections) !== JSON.stringify(this.props.sections)
    ) {
      this.setState({
        sections: this.props.sections,
        selectList: this.props.selectList ? this.props.selectList : [],
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
    let title = this.state.sections[0].title
    for (let i = 0; i < sections.length; i++) {
      if (JSON.stringify(sections[i]) === JSON.stringify(section)) {
        sections[i].data[index].isSelected = !isSelected
        if (!isSelected) {
          if (!selectList[title]) selectList[title] = []
          let pushObj = {}
          let pushName =
            sections[i].data[index].title ||
            sections[i].data[index].name ||
            sections[i].data[index].expression ||
            sections[i].data[index].datasetName
          pushObj[pushName] = false
          // 判断是否被选中
          let exist = false
          for (let j = 0; j < selectList[title].length; j++) {
            if (selectList[title][j][pushName] !== undefined) {
              exist = true
            }
          }
          if (!exist && selectList[title][pushName] !== true) {
            selectList[title].push(pushObj)
          } else {
            for (let l = 0; l < selectList[title].length; l++)
              if (pushName in selectList[title][l]) {
                selectList[title][l][pushName] = false
                break
              }
          }
        } else {
          let pushName =
            sections[i].data[index].title ||
            sections[i].data[index].name ||
            sections[i].data[index].expression ||
            sections[i].data[index].datasetName
          for (let j = 0; j < selectList[title].length; j++) {
            //let pushName = section.data[index].datasetName
            if (pushName in selectList[title][j]) {
              selectList[title][j][pushName] = true
              break
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
    let title = this.state.sections[0].title
    let commitArr = []
    let copySelectList = JSON.parse(JSON.stringify(this.state.selectList))
    let list = copySelectList[title]
    for (let i = 0, l = list.length; i < l; i++) {
      for (let key in list[i]) {
        if (list[i][key] === false) {
          copySelectList[title][i][key] = true
          commitArr.push(key)
        }
      }
    }
    this.setState(
      {
        selectList: copySelectList,
      },
      () => {
        this.props.listSelectableAction &&
          this.props.listSelectableAction({ selectList: copySelectList })
      },
    )
    return commitArr
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
      ? require('../../../../assets/mapTools/icon_multi_selected.png')
      : require('../../../../assets/mapTools/icon_multi_unselected.png')
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
                {getLanguage(global.language).Map_Main_Menu.THEME_ALL_SELECTED}
                {/* 全部选中 */}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </TouchableHighlight>
    )
  }

  sectionAllPress = section => {
    if (section.allSelectType) {
      let sections = JSON.parse(JSON.stringify(this.state.sections))
      let selectList = JSON.parse(JSON.stringify(this.state.selectList))
      let title = section.title
      for (let i = 0; i < sections.length; i++) {
        if (JSON.stringify(sections[i]) === JSON.stringify(section)) {
          for (let k = 0; k < sections[i].data.length; k++) {
            if (sections[i].data[k].isSelected) continue

            sections[i].data[k].isSelected = true
            if (!selectList[title]) selectList[title] = []
            let pushObj = {}
            let pushName =
              sections[i].data[k].title ||
              sections[i].data[k].name ||
              sections[i].data[k].expression ||
              sections[i].data[k].datasetName
            pushObj[pushName] = false
            if (
              JSON.stringify(selectList[title]).indexOf(pushName) < 0 &&
              selectList[title][pushName] !== true
            ) {
              selectList[title].push(pushObj)
            } else {
              for (let l = 0; l < selectList[title].length; l++)
                if (pushName in selectList[title][l]) {
                  selectList[title][l][pushName] = false
                  break
                }
            }
            //
            // let pushName =
            //   sections[i].data[k].title ||
            //   sections[i].data[k].name ||
            //   sections[i].data[k].expression ||
            //   sections[i].data[k].datasetName
            // for (let j = 0; j < selectList[title].length; j++) {
            //   //let pushName = section.data[index].datasetName
            //   if (pushName in selectList[title][j]) {
            //     selectList[title][j][pushName] = true
            //     break
            //   }
            // }
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
          this.props.listSelectableAction &&
            this.props.listSelectableAction({ selectList })
        },
      )
    }
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
      ? require('../../../../assets/mapTools/icon_multi_selected_disable_black.png')
      : require('../../../../assets/mapTools/icon_multi_unselected_disable_black.png')
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
        {item.datasetType && item.datasetName && this.getDatasetImage(item)}
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
        img = require('../../../../assets/mapToolbar/list_type_map.png')
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
        img = require('../../../../assets/mapToolbar/dataset_type_point_black.png')
        break
      case 'LINE':
        // item.isSelected
        img = require('../../../../assets/mapToolbar/dataset_type_line_black.png')
        break
      case 'REGION':
        // item.isSelected
        img = require('../../../../assets/mapToolbar/dataset_type_region_black.png')
        break
      case 'TEXT':
        img = require('../../../../assets/mapToolbar/dataset_type_text_black.png')
        break
      case 'IMAGE':
        // item.isSelected
        img = require('../../../../assets/mapToolbar/dataset_type_image_black.png')
        break
      case 'CAD':
        // item.isSelected
        img = require('../../../../assets/mapToolbar/dataset_type_cad_black.png')
        break
      case 'GRID':
        // item.isSelected
        img = require('../../../../assets/mapToolbar/dataset_type_grid_black.png')
        break
      case 'NETWORK':
        // item.isSelected
        img = require('../../../../assets/mapToolbar/dataset_type_network_black.png')
        break
      default:
        img = require('../../../../assets/mapToolbar/list_type_map_black.png')
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
  item: {
    height: scaleSize(80),
    backgroundColor: color.content_white,
    alignItems: 'center',
    flexDirection: 'row',
  },
  itemTitle: {
    marginLeft: scaleSize(60),
    fontSize: size.fontSize.fontSizeMd,
    height: scaleSize(30),
    backgroundColor: 'transparent',
    color: color.font_color_white,
    textAlignVertical: 'center',
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
    // marginLeft: scaleSize(30),
    // marginRight: scaleSize(30),
    // alignItems: 'center',
    width: '100%',
    // width: scaleSize(620),
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
  imageItemTitle: {
    marginLeft: scaleSize(30),
    fontSize: size.fontSize.fontSizeMd,
    height: scaleSize(30),
    backgroundColor: 'transparent',
    color: color.font_color_white,
    textAlignVertical: 'center',
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
