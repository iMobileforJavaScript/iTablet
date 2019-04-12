/*
 Copyright © SuperMap. All rights reserved.
 Author: Yang Shanglong
 E-mail: yangshanglong@supermap.com
 */
import React, { PureComponent } from 'react'
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native'
import { ImageButton } from '../../../components'
import { scaleSize } from '../../../utils'
import { CheckStatus } from '../../../constants'
import {
  getPublicAssets,
  getThemeIconByType,
  getLayerIconByType,
} from '../../../assets'
import styles from '../styles'

export default class CutListItem extends PureComponent {
  props: {
    isEdit: boolean, // 是否是编辑状态
    selected: number, // 是否被选中
    inRangeStatus: number, // 是否区域内裁剪
    eraseStatus: number, // 是否擦除
    exactCutStatus: number, // 是否精确裁剪
    datasourceName: string,
    caption?: string, // 优先于data中的caption显示
    data: Object,
    onSelect?: () => {},
    changeRangeCut?: () => {},
    changeErase?: () => {},
    changeExactCut?: () => {},
    showDatasource?: () => {},
    changeCaption?: () => {},
  }

  static defaultProps = {
    selected: true,
  }

  constructor(props) {
    super(props)
    this.state = {
      // inputValue: props.datasourceName,
    }
    this.caption = ''
  }

  onSelect = () => {
    if (this.props.onSelect && typeof this.props.onSelect === 'function') {
      this.props.onSelect()
    }
  }

  changeRangeCut = () => {
    if (
      this.props.changeRangeCut &&
      typeof this.props.changeRangeCut === 'function'
    ) {
      this.props.changeRangeCut()
    }
  }

  changeErase = () => {
    if (
      this.props.changeErase &&
      typeof this.props.changeErase === 'function'
    ) {
      this.props.changeErase()
    }
  }

  changeExactCut = () => {
    if (
      this.props.changeExactCut &&
      typeof this.props.changeExactCut === 'function'
    ) {
      this.props.changeExactCut()
    }
  }

  showDatasource = () => {
    if (
      this.props.showDatasource &&
      typeof this.props.showDatasource === 'function'
    ) {
      this.props.showDatasource()
    }
  }

  changeCaption = () => {
    if (
      this.props.changeCaption &&
      typeof this.props.changeCaption === 'function' &&
      this.caption !== ''
    ) {
      this.props.changeCaption(this.caption)
    }
  }

  renderCheckButton = ({ status = 0, action = () => {}, data }) => {
    let icon = this.state.sectionSelected
      ? getPublicAssets().common.icon_check
      : getPublicAssets().common.icon_uncheck
    switch (status) {
      case CheckStatus.UN_CHECK:
        icon = getPublicAssets().common.icon_uncheck
        break
      case CheckStatus.CHECKED:
        icon = getPublicAssets().common.icon_check
        break
      case CheckStatus.UN_CHECK_DISABLE:
        icon = getPublicAssets().common.icon_uncheck_disable
        break
      case CheckStatus.CHECKED_DISABLE:
        icon = getPublicAssets().common.icon_check_disable
        break
    }
    return (
      <ImageButton
        containerStyle={styles.selectContainer}
        iconBtnStyle={styles.selectImgView}
        iconStyle={styles.selectImg}
        icon={icon}
        onPress={() => {
          this.setState(
            {
              isSelectAll: !this.state.isSelectAll,
            },
            () => {
              action && action(data)
            },
          )
        }}
      />
    )
  }

  render() {
    if (this.props.isEdit) {
      return (
        <View style={[styles.topView, { width: '100%' }]}>
          <View style={styles.topLeftView}>
            {this.renderCheckButton({
              status: this.props.selected
                ? CheckStatus.CHECKED
                : CheckStatus.UN_CHECK,
              action: this.onSelect,
            })}
            <TextInput
              ref={ref => (this.input = ref)}
              underlineColorAndroid={'transparent'}
              style={styles.dsItemInput}
              placeholder={'请输入图层名字'}
              defaultValue={this.props.caption || this.props.data.caption + ''}
              // value={this.state.inputValue + ''}
              returnKeyLabel={'完成'}
              returnKeyType={'done'}
              onChangeText={text => {
                this.caption = text
                // this.setState({ inputValue: text })
              }}
              onSubmitEditing={this.changeCaption}
            />
            {/*<Text style={styles.content}>{this.props.caption || this.props.data.caption}</Text>*/}
          </View>
          <TouchableOpacity
            onPress={this.showDatasource}
            activeOpacity={0.8}
            style={[
              styles.topRightView,
              { paddingRight: scaleSize(30), width: scaleSize(360) },
            ]}
          >
            <Text
              style={[
                styles.content,
                { width: scaleSize(140), textAlign: 'center' },
              ]}
            >
              {this.props.datasourceName}
            </Text>
            <Image
              resizeMode="contain"
              style={styles.downImg}
              source={require('../../../assets/public/icon_arrow_down.png')}
            />
          </TouchableOpacity>
        </View>
      )
    } else {
      let icon =
        this.props.data.themeType > 0
          ? getThemeIconByType(this.props.data.themeType)
          : getLayerIconByType(this.props.data.type)
      return (
        <View style={[styles.topView, { width: '100%' }]}>
          <View style={styles.topLeftView}>
            <View style={styles.selectImgView}>
              <Image
                resizeMode="contain"
                style={styles.selectImg}
                source={icon}
              />
            </View>
            <Text
              numberOfLines={2}
              style={[
                styles.content,
                { width: Dimensions.get('window').width - scaleSize(500) },
              ]}
            >
              {this.props.caption || this.props.data.caption}
            </Text>
          </View>
          <View style={[styles.topRightView2, { width: scaleSize(360) }]}>
            <View style={styles.select}>
              {this.renderCheckButton({
                status: this.props.inRangeStatus,
                action: this.changeRangeCut,
              })}
            </View>
            <View style={styles.select}>
              {this.renderCheckButton({
                status: this.props.eraseStatus,
                action: this.changeErase,
              })}
            </View>
            <View style={styles.select}>
              {this.renderCheckButton({
                status: this.props.exactCutStatus,
                action: this.changeExactCut,
              })}
            </View>
          </View>
        </View>
      )
    }
  }
}
