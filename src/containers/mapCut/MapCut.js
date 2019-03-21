/*
 Copyright © SuperMap. All rights reserved.
 Author: Yang Shanglong
 E-mail: yangshanglong@supermap.com
 */
import * as React from 'react'
import {
  View,
  Text,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native'
import { Container, TextBtn, ImageButton, Button } from '../../components'
import { scaleSize } from '../../utils'
import { color } from '../../styles'
import { getPublicAssets, getThemeAssets } from '../../assets'
import styles from './styles'

const COMPLETE = '完成'
const EDIT = '编辑'

const CHECK_STATUS = {
  UN_CHECK: 0,
  CHECKED: 1,
  CHECKED_DISABLE: 2,
}

export default class MapCut extends React.Component {
  props: {
    navigation: Object,
    nav: Object,
  }

  constructor(props) {
    super(props)
    // const { params } = this.props.navigation.state
    this.state = {
      headerBtnTitle: EDIT,
      selected: (new Map(): Map<string, boolean>),
      isSelectAll: true,
      isSaveAs: false,
      saveAsName: '',
    }
  }

  componentDidMount() {}

  headerBtnAction = () => {
    this.setState({
      headerBtnTitle: this.state.headerBtnTitle === EDIT ? COMPLETE : EDIT,
    })
  }

  cut = () => {}

  selectAll = () => {}

  _onChangeText = text => {
    this.setState({
      saveAsName: text,
    })
  }

  saveAs = () => {
    this.setState({
      isSaveAs: !this.state.isSaveAs,
    })
  }

  isEdit = () => {
    return this.state.headerBtnTitle !== EDIT
  }

  renderCheckButton = ({ status = 0, action = () => {}, data }) => {
    let icon = this.state.sectionSelected
      ? getPublicAssets().common.icon_check
      : getPublicAssets().common.icon_uncheck
    switch (status) {
      case CHECK_STATUS.UN_CHECK:
        icon = getPublicAssets().common.icon_uncheck
        break
      case CHECK_STATUS.CHECKED:
        icon = getPublicAssets().common.icon_check
        break
      case CHECK_STATUS.CHECKED_DISABLE:
        icon = getPublicAssets().common.icon_check_disable
        break
    }
    return (
      <ImageButton
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

  renderBottomButton = ({ icon, action }) => {
    return (
      <ImageButton
        iconBtnStyle={styles.bottomBtnView}
        iconStyle={styles.selectImg}
        icon={icon}
        onPress={() => {
          this.setState(
            {
              isSelectAll: !this.state.isSelectAll,
            },
            () => {
              action && action()
            },
          )
        }}
      />
    )
  }

  renderTop = () => {
    if (this.isEdit()) {
      return (
        <View style={styles.topView}>
          <View style={styles.topLeftView}>
            {this.renderCheckButton({
              status: this.state.isSelectAll
                ? CHECK_STATUS.CHECKED
                : CHECK_STATUS.UN_CHECK,
            })}
            <Text style={styles.topText}>图层</Text>
          </View>
          <View style={[styles.topRightView, { flex: 1 }]}>
            <Text style={[styles.topText, { width: scaleSize(140) }]}>
              目标数据源
            </Text>
          </View>
        </View>
      )
    } else {
      return (
        <View style={styles.topView}>
          <View style={styles.topLeftView}>
            <View style={styles.selectImgView} />
            <Text style={styles.topText}>图层</Text>
          </View>
          <View style={styles.topRightView}>
            <Text style={[styles.topText, { width: scaleSize(140) }]}>
              区域内裁剪
            </Text>
            <Text style={[styles.topText, { width: scaleSize(140) }]}>
              擦除
            </Text>
            <Text style={[styles.topText, { width: scaleSize(140) }]}>
              精确裁剪
            </Text>
          </View>
        </View>
      )
    }
  }

  renderBottom = () => {
    if (this.isEdit()) {
      return (
        <View style={[styles.bottomView, { width: '100%' }]}>
          {this.renderBottomButton({
            icon: getThemeAssets().attribute.rightbar_tool_select_layerlist,
          })}
          {this.renderBottomButton({
            icon: require('../../assets/mapTools/icon_delete.png'),
          })}
          {this.renderBottomButton({
            icon: require('../../assets/mapTools/icon_setting.png'),
          })}
        </View>
      )
    } else {
      return (
        <KeyboardAvoidingView
          style={[styles.bottomView, { width: '100%' }]}
          behavior={Platform.OS === 'ios' && 'position'}
        >
          <View style={[styles.bottomView, { width: '100%' }]}>
            <View style={styles.bottomLeftView}>
              {this.renderCheckButton({
                status: this.state.isSaveAs
                  ? CHECK_STATUS.CHECKED
                  : CHECK_STATUS.UN_CHECK,
                action: this.saveAs,
              })}
              {this.state.isSaveAs ? (
                <TextInput
                  value={this.state.text}
                  style={styles.input}
                  placeholder={'请输入地图名字'}
                  underlineColorAndroid="transparent"
                  onChangeText={text => this._onChangeText(text)}
                  placeholderTextColor={color.borderColor}
                />
              ) : (
                <Text style={styles.topText}>另存地图</Text>
              )}
            </View>
            <View style={styles.bottomRightView}>
              <Button
                style={styles.cutButton}
                titleStyle={styles.cutTitle}
                title="裁剪"
                onPress={this.cut}
              />
            </View>
          </View>
        </KeyboardAvoidingView>
      )
    }
  }

  render() {
    return (
      <Container
        ref={ref => (this.container = ref)}
        style={styles.container}
        headerProps={{
          title: '地图裁剪',
          navigation: this.props.navigation,
          headerRight: (
            <TextBtn
              btnText={this.state.headerBtnTitle}
              textStyle={styles.headerBtnTitle}
              btnClick={this.headerBtnAction}
            />
          ),
        }}
      >
        {this.renderTop()}
        <View style={{ flex: 1 }} />
        {this.renderBottom()}
      </Container>
    )
  }
}
