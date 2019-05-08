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
import { scaleSize } from '../../../utils'
import { getThemeAssets, getPublicAssets } from '../../../assets'
import { CheckStatus } from '../../../constants'

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
    minWidth: scaleSize(120),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  switchTitle: {
    fontSize: size.fontSize.fontSizeMd,
    color: color.fontColorGray,
    textAlign: 'center',
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
})

export default class AnalystItem extends PureComponent {
  props: {
    title: string,
    value: any,
    rightType?: string,
    keyboardType?: string,
    returnKeyLabel?: string,
    returnKeyType?: string,
    style?: Object,
    onChange?: () => {},
    onPress?: () => {},
    radioStatus?: number,
    onRadioPress?: () => {},
    onSubmitEditing?: () => {},
    onChangeText?: () => {},
  }

  static defaultProps = {
    rightType: 'text', // text || input
    keyboardType: 'default', // TextInput keyboardType
    returnKeyLabel: '完成', // TextInput returnKeyLabel
    returnKeyType: 'done', // TextInput returnKeyType
  }

  constructor(props) {
    super(props)
    this.state = {
      inputValue: props.value,
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.value !== this.props.value) {
      this.setState({
        inputValue: this.props.value,
      })
      // this.inputValue = this.props.value
    }
  }

  onSubmitEditing = () => {
    if (
      this.props.onSubmitEditing &&
      typeof this.props.onSubmitEditing === 'function'
    ) {
      this.props.onSubmitEditing(this.state.inputValue)
      // this.props.onSubmitEditing(this.inputValue)
    }
  }

  _blur = () => {
    this.input && this.input.blur()
  }

  renderRight = () => {
    let rightView = null
    switch (typeof this.props.value) {
      case 'boolean':
        rightView = (
          <View style={styles.rightView}>
            <Switch
              style={styles.switch}
              trackColor={{ false: color.bgG, true: color.switch }}
              thumbColor={this.props.value ? color.bgW : color.bgW}
              ios_backgroundColor={this.props.value ? color.switch : color.bgG}
              value={this.props.value}
              onValueChange={value => {
                if (
                  this.props.onChange &&
                  typeof this.props.onChange === 'function'
                ) {
                  this.props.onChange(value)
                }
              }}
            />
          </View>
        )
        break
      case 'string':
      case 'number':
        if (
          this.props.rightType === 'input' &&
          (this.props.radioStatus === CheckStatus.CHECKED ||
            this.props.radioStatus === undefined ||
            this.props.radioStatus < 0 ||
            this.props.radioStatus > 3)
        ) {
          rightView = (
            <View style={styles.rightView}>
              <TextInput
                ref={ref => (this.input = ref)}
                underlineColorAndroid={'transparent'}
                style={styles.input}
                keyboardType={this.props.keyboardType}
                // defaultValue={this.props.value + ''}
                value={this.state.inputValue + ''}
                returnKeyLabel={this.props.returnKeyLabel}
                returnKeyType={this.props.returnKeyType}
                onChangeText={text => {
                  if (
                    this.props.onChangeText &&
                    typeof this.props.onChangeText === 'function'
                  ) {
                    this.props.onChangeText(text)
                  } else {
                    if (
                      this.props.keyboardType === 'number-pad' ||
                      this.props.keyboardType === 'decimal-pad' ||
                      this.props.keyboardType === 'numeric'
                    ) {
                      if (isNaN(text) && text !== '' && text !== '-') {
                        text = this.state.inputValue
                        // text = this.inputValue
                      }
                    }
                    this.setState({ inputValue: text })
                    // this.inputValue = text
                  }
                }}
                onSubmitEditing={this.onSubmitEditing}
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
              <Text style={styles.switchTitle}>{this.props.value}</Text>
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
        icon = getPublicAssets().common.icon_radio_selected
        break
      case CheckStatus.UN_CHECK:
        icon = getPublicAssets().common.icon_radio_unselected
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
