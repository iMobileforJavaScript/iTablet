/*
 Copyright © SuperMap. All rights reserved.
 Author: Yangshanglong
 E-mail: yangshanglong@supermap.com
 */

import * as React from 'react'
import { View, Text, ScrollView } from 'react-native'
import { Button, RadioGroup, TextBtn } from '../../../../components'
// import { Toast } from '../../../../utils'
import { getLanguage } from '../../../../language'

import styles from './styles'

export default class LocationView extends React.Component {
  props: {
    currentIndex: number,
    style?: any,
    backHide?: boolean,
    locateToTop?: () => {},
    locateToBottom?: () => {},
    locateToPosition?: () => {},
  }

  static defaultProps = {
    data: [],
    backHide: true,
  }

  constructor(props) {
    super(props)
    this.currentData = {}
    let options = [
      {
        title: getLanguage(global.language).Map_Attribute.ATTRIBUTE_RELATIVE,
        //'相对位置',
        value: 'relative',
        hasInput: true,
        keyboardType: 'numeric',
      },
      {
        title: getLanguage(global.language).Map_Attribute.ATTRIBUTE_ABSOLUTE,
        //'绝对位置',
        value: 'absolute',
        hasInput: true,
        keyboardType: 'numeric',
        inputValue: props.currentIndex >= 0 ? props.currentIndex + 1 : '',
      },
    ]
    this.state = {
      isShow: false,
      options,
      canBeLocated: this.checkLocated(options),
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.currentIndex !== this.props.currentIndex) {
      let state = {}
      state.options = JSON.parse(JSON.stringify(this.state.options))
      state.options[1].inputValue =
        this.props.currentIndex >= 0 ? this.props.currentIndex + 1 : ''
      this.currentData = state.options[1]
      state.canBeLocated = this.checkLocated(state.options)
      this.setState(state)
    }
  }

  checkLocated = (options = this.state.options) => {
    for (let i = 0; i < options.length; i++) {
      if (
        options[i].title === this.currentData.title &&
        this.currentData.inputValue !== '' &&
        this.currentData.inputValue !== undefined
      ) {
        return true
      }
    }
    return false
  }

  isShow = () => this.state.isShow

  show = isShow => {
    if (isShow !== undefined && this.state.isShow !== isShow) {
      this.setState({
        isShow: isShow,
      })
    } else if (isShow === undefined) {
      this.setState(prevState => ({
        isShow: !prevState.isShow,
      }))
    }
  }

  locateToTop = () => {
    if (
      this.props.locateToTop &&
      typeof this.props.locateToTop === 'function'
    ) {
      this.props.locateToTop({
        type: 'top',
        index: 0,
      })
    }
  }

  locateToBottom = () => {
    if (
      this.props.locateToBottom &&
      typeof this.props.locateToBottom === 'function'
    ) {
      this.props.locateToBottom({
        type: 'top',
        index: 0,
      })
    }
  }

  locateToPosition = () => {
    if (!this.state.canBeLocated) return
    if (
      this.props.locateToPosition &&
      typeof this.props.locateToPosition === 'function'
    ) {
      if (
        this.currentData &&
        this.currentData.value &&
        this.currentData.inputValue
      ) {
        this.props.locateToPosition({
          type: this.currentData.value,
          index: parseInt(this.currentData.inputValue),
        })
      } else {
        // Toast.show(
        //   getLanguage(global.language).Prompt
        //     .PLEASE_SELECT_LICATION_INFORMATION,
        // )
      }
    }
    this.show(false)
  }

  renderTop = () => {
    return (
      <View style={styles.topView}>
        <Text style={styles.text}>
          {getLanguage(global.language).Map_Attribute.ATTRIBUTE_CURRENT +
            ': ' +
            //'当前位置 '
            (this.props.currentIndex + 1 || '')}
        </Text>
      </View>
    )
  }

  renderButtons = () => {
    return (
      <View style={styles.buttons}>
        <Button
          style={styles.button}
          titleStyle={styles.buttonTitle}
          title={
            getLanguage(global.language).Map_Attribute.ATTRIBUTE_FIRST_RECORD
          }
          //"定位到首位"
          onPress={this.locateToTop}
        />
        <Button
          style={styles.button}
          titleStyle={styles.buttonTitle}
          title={
            getLanguage(global.language).Map_Attribute.ATTRIBUTE_LAST_RECORD
          }
          //"定位到末行"
          onPress={this.locateToBottom}
        />
      </View>
    )
  }

  renderOptions = () => {
    return (
      <View style={styles.options}>
        <RadioGroup
          data={this.state.options}
          column={1}
          defaultValue={this.state.options[1].value}
          onSubmitEditing={data => {
            this.currentData = data
            let canBeLocated = this.checkLocated()
            if (canBeLocated !== this.state.canBeLocated) {
              this.setState({
                canBeLocated,
              })
            }
          }}
          onFocus={data => {
            this.currentData = data
            let canBeLocated = this.checkLocated()
            if (canBeLocated !== this.state.canBeLocated) {
              this.setState({
                canBeLocated,
              })
            }
          }}
          onBlur={data => {
            this.currentData = data
            let canBeLocated = this.checkLocated()
            if (canBeLocated !== this.state.canBeLocated) {
              this.setState({
                canBeLocated,
              })
            }
          }}
        />
      </View>
    )
  }

  renderBottom = () => {
    return (
      <View style={styles.bottomButtons}>
        <TextBtn
          textStyle={styles.bottomBtnTxt}
          btnText={getLanguage(global.language).Prompt.CANCEL}
          //"取消"
          btnClick={() => this.show(false)}
        />
        <TextBtn
          textStyle={
            this.state.canBeLocated
              ? styles.bottomBtnTxt
              : styles.bottomBtnTxtDisable
          }
          btnText={
            getLanguage(global.language).Map_Attribute.ATTRIBUTE_LOCATION
          }
          //"定位"
          btnClick={this.locateToPosition}
        />
      </View>
    )
  }

  render() {
    if (!this.state.isShow) return null
    return (
      <View style={[styles.container, this.props.style]}>
        <ScrollView style={{ flex: 1 }}>
          {this.renderTop()}
          {this.renderButtons()}
          {this.renderOptions()}
        </ScrollView>
        {this.renderBottom()}
      </View>
    )
  }
}
