import React, { PureComponent } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Switch,
  StyleSheet,
  TextInput,
  Platform,
} from 'react-native'
import { color, size } from '../../../styles'
import { scaleSize, screen } from '../../../utils'
import { getThemeAssets, getPublicAssets } from '../../../assets'
import { CheckStatus } from '../../../constants'
import { NumberCounter } from '../../../components'

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: scaleSize(30),
    paddingLeft: scaleSize(10),
    paddingRight: scaleSize(5),
    borderBottomWidth: 1,
    borderBottomColor: color.fontColorGray,
    height: scaleSize(80),
  },

  titleView: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  title: {
    fontSize: size.fontSize.fontSizeMd,
    color: color.fontColorBlack,
    backgroundColor: 'transparent',
  },

  rightView: {
    flex: 1,
    // minWidth: scaleSize(120),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  contentText: {
    fontSize: size.fontSize.fontSizeMd,
    color: color.fontColorGray,
    textAlign: 'right',
    backgroundColor: 'transparent',
  },
  arrowImg: {
    marginLeft: scaleSize(10),
    width: scaleSize(40),
    height: scaleSize(40),
  },

  radioView: {
    alignItems: 'center',
    justifyContent: 'center',
    width: scaleSize(40),
    height: scaleSize(40),
    marginRight: scaleSize(20),
  },
  radioImg: {
    width: scaleSize(40),
    height: scaleSize(40),
  },

  input: {
    // flex: 1,
    width: scaleSize(120),
    height: scaleSize(60),
    ...Platform.select({
      android: {
        padding: 0,
      },
    }),
    backgroundColor: 'transparent',
    textAlign: 'right',
    fontSize: size.fontSize.fontSizeSm,
  },

  btnOverlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    backgroundColor: 'transparent',
  },
})

export default class AnalystItem extends PureComponent {
  props: {
    title: string,
    value: any,
    defaultValue?: any,
    rightStyle?: any,
    inputStyle?: any,
    rightType?: string,
    rightProps?: Object,
    keyboardType?: string,
    returnKeyLabel?: string,
    returnKeyType?: string,
    autoCheckNumber?: boolean, // 自动检查输入数字是否合法。只有自定义onChangeText方法，该值才生效
    numberRange?: string, // 数字范围 [0, 100]: 0 <= a <= 100 | (0, 100]: 0 < a <= 100 | [0, ]: 0 <= a, 只支持[], (), (], [)
    disable?: boolean, // 是否可以操作
    style?: Object,
    onChange?: () => {},
    onPress?: () => {},
    radioStatus?: number,
    onRadioPress?: () => {},
    onSubmitEditing?: () => {},
    onChangeText?: () => {},
    onBlur?: () => {},
  }

  static defaultProps = {
    rightType: 'text', // text || input || number_counter
    keyboardType: 'default', // TextInput keyboardType
    returnKeyLabel: '完成', // TextInput returnKeyLabel
    returnKeyType: 'done', // TextInput returnKeyType
    autoCheckNumber: false,
    rightProps: {},
    disable: false,
    numberRange: '',
  }

  constructor(props) {
    super(props)
    this.defaultValue =
      props.value !== undefined ? props.value : props.defaultValue
    this.state = {
      inputValue: this.defaultValue,
    }
  }

  componentDidUpdate(prevProps) {
    if (
      this.props.rightType === 'input' &&
      prevProps.value !== this.props.value
    ) {
      this.setState({
        inputValue: this.props.value,
      })
      // this.inputValue = this.props.value
    }
  }

  onSubmitEditing = () => {
    let text = this.checkNumberRange(this.state.inputValue)
    if (
      this.props.onSubmitEditing &&
      typeof this.props.onSubmitEditing === 'function'
    ) {
      this.props.onSubmitEditing(text)
      // this.props.onSubmitEditing(this.inputValue)
    }
  }

  onBlur = () => {
    let text = this.checkNumberRange(this.state.inputValue)
    if (this.props.onBlur && typeof this.props.onBlur === 'function') {
      this.props.onBlur(text)
    }
  }

  _blur = () => {
    this.input && this.input.blur()
  }

  checkNumberRange = text => {
    if (this.props.numberRange === '') {
      if (
        this.props.keyboardType !== 'number-pad' &&
        this.props.keyboardType !== 'decimal-pad' &&
        this.props.keyboardType !== 'numeric'
      ) {
        return text
      } else {
        return isNaN(text) ? '' : text
      }
    }
    let temp = this.props.numberRange
      .replace('[', '')
      .replace(']', '')
      .replace('(', '')
      .replace(')', '')
    let tempArr = temp.split(',')
    tempArr = tempArr.map(value => value.trim())

    if (tempArr[0] === '' && tempArr[1] === '') {
      return isNaN(text) ? '' : text
    }
    if (isNaN(text)) {
      text = tempArr[0] === '' ? tempArr[1] : tempArr[0]
    }

    if (tempArr[0] !== '' && parseFloat(text) <= parseFloat(tempArr[0])) {
      if (this.props.numberRange.indexOf('[') >= 0) {
        text = tempArr[0]
      } else if (this.props.numberRange.indexOf('(') >= 0) {
        text = this.defaultValue
      }
    } else if (
      tempArr[1] !== '' &&
      parseFloat(text) >= parseFloat(tempArr[1])
    ) {
      if (this.props.numberRange.indexOf(']') >= 0) {
        text = tempArr[1]
      } else if (this.props.numberRange.indexOf(')') >= 0) {
        text = this.defaultValue
      }
    }
    return isNaN(text) ? '' : text
  }

  checkNumber = text => {
    if (
      this.props.keyboardType === 'number-pad' ||
      this.props.keyboardType === 'decimal-pad' ||
      this.props.keyboardType === 'numeric'
    ) {
      if (isNaN(text) && text !== '' && text !== '-') {
        text = this.state.inputValue
      }
    }
    return text
  }

  renderRight = () => {
    let rightView = null
    if (this.props.rightType === 'number_counter') {
      return (
        <View style={[styles.rightView, this.props.rightStyle]}>
          <NumberCounter
            value={this.props.value}
            getValue={value => {
              if (
                this.props.onChange &&
                typeof this.props.onChange === 'function'
              ) {
                this.props.onChange(value)
              }
            }}
            {...this.props.rightProps}
          />
        </View>
      )
    }
    switch (typeof this.props.value) {
      case 'boolean':
        rightView = (
          <View style={[styles.rightView, this.props.rightStyle]}>
            <Switch
              disable={this.props.disable}
              style={styles.switch}
              trackColor={{ false: color.bgG, true: color.switch }}
              thumbColor={this.props.value ? color.bgW : color.bgW}
              ios_backgroundColor={this.props.value ? color.switch : color.bgG}
              value={this.props.value}
              onValueChange={value => {
                if (this.props.disable) return
                if (
                  this.props.onChange &&
                  typeof this.props.onChange === 'function'
                ) {
                  this.props.onChange(value)
                }
              }}
            />
            {this.props.disable && <View style={styles.btnOverlay} />}
          </View>
        )
        break
      case 'string':
      case 'number':
      default:
        if (
          !this.props.disable &&
          this.props.rightType === 'input' &&
          (this.props.radioStatus === CheckStatus.CHECKED ||
            this.props.radioStatus === undefined ||
            this.props.radioStatus < 0 ||
            this.props.radioStatus > 3)
        ) {
          rightView = (
            <View style={[styles.rightView, this.props.rightStyle]}>
              <TextInput
                ref={ref => (this.input = ref)}
                underlineColorAndroid={'transparent'}
                style={[styles.input, this.props.inputStyle]}
                keyboardType={this.props.keyboardType}
                defaultValue={this.props.defaultValue + ''}
                value={(this.state.inputValue || '') + ''}
                returnKeyLabel={this.props.returnKeyLabel}
                returnKeyType={this.props.returnKeyType}
                onChangeText={text => {
                  if (
                    this.props.onChangeText &&
                    typeof this.props.onChangeText === 'function'
                  ) {
                    if (this.props.autoCheckNumber)
                      text = this.checkNumber(text)
                    this.props.onChangeText(text)
                  } else {
                    text = this.checkNumber(text)
                    this.setState({ inputValue: text })
                  }
                }}
                onSubmitEditing={this.onSubmitEditing}
                onBlur={this.onBlur}
              />
            </View>
          )
        } else {
          rightView = (
            <TouchableOpacity
              style={styles.rightView}
              onPress={() => {
                if (
                  this.props.onPress &&
                  typeof this.props.onPress === 'function'
                ) {
                  this.props.onPress()
                }
              }}
            >
              <Text
                style={[
                  styles.contentText,
                  { maxWidth: screen.getScreenWidth() / 3 },
                ]}
              >
                {this.props.value}
              </Text>
              {this.props.rightType !== 'input' && (
                <Image
                  resizeMode={'contain'}
                  style={styles.radioImg}
                  source={getThemeAssets().publicAssets.icon_arrow_right}
                />
              )}
            </TouchableOpacity>
          )
        }
    }
    return rightView
  }

  renderRadio = () => {
    if (
      this.props.radioStatus === undefined ||
      this.props.radioStatus < 0 ||
      this.props.radioStatus > 3
    )
      return null
    let icon
    switch (this.props.radioStatus) {
      case CheckStatus.CHECKED:
        icon = this.props.disable
          ? getPublicAssets().common.icon_radio_selected_disable
          : getPublicAssets().common.icon_radio_selected
        break
      case CheckStatus.UN_CHECK:
        icon = this.props.disable
          ? getPublicAssets().common.icon_radio_unselected_disable
          : getPublicAssets().common.icon_radio_unselected
        break
      case CheckStatus.CHECKED_DISABLE:
        icon = getPublicAssets().common.icon_radio_selected_disable
        break
      case CheckStatus.UN_CHECK_DISABLE:
        icon = getPublicAssets().common.icon_radio_unselected_disable
        break
    }
    return (
      <TouchableOpacity
        style={styles.radioView}
        onPress={() => {
          if (
            this.props.onRadioPress &&
            typeof this.props.onRadioPress === 'function' &&
            this.props.radioStatus !== CheckStatus.UN_CHECK_DISABLE &&
            this.props.radioStatus !== CheckStatus.CHECKED_DISABLE
          ) {
            this.props.onRadioPress()
          }
        }}
      >
        <Image resizeMode={'contain'} style={styles.arrowImg} source={icon} />
      </TouchableOpacity>
    )
  }

  render() {
    return (
      <View style={[styles.itemContainer, this.props.style]}>
        {this.renderRadio()}
        <View style={styles.titleView}>
          <Text style={styles.title}>{this.props.title}</Text>
        </View>
        {this.renderRight()}
      </View>
    )
  }
}
