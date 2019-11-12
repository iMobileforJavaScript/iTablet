/*
 Copyright © SuperMap. All rights reserved.
 Author: Yangshanglong
 E-mail: yangshanglong@supermap.com
 */
import * as React from 'react'
import { View } from 'react-native'
import { Container, TextBtn } from '../../../../components'
import { CheckStatus } from '../../../../constants'
import { getLanguage } from '../../../../language'
import { AnalystItem } from '../../components'
import styles from './styles'

export default class AnalystRadiusSetting extends React.Component {
  props: {
    navigation: Object,
    nav: Object,
    language: String,
  }

  constructor(props) {
    super(props)
    const { params } = this.props.navigation.state
    this.cb = params && params.cb
    this.backcb = params && params.backcb
    let bufferRadiuses = params && params.bufferRadiuses
    let startValue =
      bufferRadiuses && bufferRadiuses.length > 1 ? bufferRadiuses[0] : 10
    let endValue =
      bufferRadiuses && bufferRadiuses.length > 1
        ? bufferRadiuses[bufferRadiuses.length - 1]
        : 10
    let stepSize = params && params.stepSize > -1 ? params.stepSize : 3
    let segments = params && params.segments > -1 ? params.segments : 3
    let stepSizeStatus =
      params &&
      (params.stepSize > -1 ||
        (params.stepSize === -1 && params.segments === -1))
    this.state = {
      startValue,
      endValue,

      stepSizeStatus: stepSizeStatus
        ? CheckStatus.CHECKED
        : CheckStatus.UN_CHECK,
      segmentsStatus: !stepSizeStatus
        ? CheckStatus.CHECKED
        : CheckStatus.UN_CHECK,
      stepSize,
      segments,

      clickAble: true,
    }
    this.canBenClick = true // 防止重复点击
  }

  componentDidMount() {
    let clickAble = this.checkValidation()
    if (clickAble !== this.state.clickAble) {
      this.setState({
        clickAble,
      })
    }
  }

  componentDidUpdate(prevState) {
    if (
      prevState.startValue !== this.state.startValue ||
      prevState.endValue !== this.state.endValue ||
      prevState.stepSizeStatus !== this.state.stepSizeStatus ||
      prevState.segmentsStatus !== this.state.segmentsStatus ||
      prevState.stepSize !== this.state.stepSize ||
      prevState.segments !== this.state.segments
    ) {
      let clickAble = this.checkValidation()
      if (clickAble !== this.state.clickAble) {
        this.setState({
          clickAble,
        })
      }
    }
  }

  confirm = () => {
    try {
      if (
        this.state.clickAble &&
        this.canBenClick &&
        this.cb &&
        typeof this.cb === 'function'
      ) {
        this.canBenClick = false
        this.startItem && this.startItem._blur()
        this.endItem && this.endItem._blur()
        this.stepSizeItem && this.stepSizeItem._blur()
        this.segmentsItem && this.segmentsItem._blur()

        let data = {}
        let radiuses = []
        let startValue = parseFloat(this.state.startValue + '')
        let endValue = parseFloat(this.state.endValue + '')
        let stepSize = parseFloat(this.state.stepSize + '')
        let segments = parseFloat(this.state.segments + '')
        if (this.state.stepSizeStatus === CheckStatus.CHECKED) {
          let value = startValue
          while (value < endValue) {
            radiuses.push(value)
            value += stepSize
          }
          radiuses.push(endValue)
          data.stepSize = stepSize
        } else {
          let value = endValue
          let segment = (endValue - startValue) / (segments - 1)
          while (radiuses.length < segments) {
            radiuses.unshift(value)
            value -= segment
          }
          data.segments = segments
        }
        data.radiuses = radiuses
        data.unit = 'Meter'

        this.cb && this.cb(data)
        setTimeout(() => {
          this.canBenClick = true
        }, 1500)
      }
    } catch (e) {
      this.canBenClick = true
    }
  }

  back = () => {
    if (this.backcb) {
      this.backcb()
    } else {
      this.props.navigation.goBack()
    }
  }

  changeBufferType = title => {
    let stepSizeStatus
    let segmentsStatus
    switch (title) {
      case getLanguage(this.props.language).Analyst_Labels.STEP:
        stepSizeStatus = CheckStatus.CHECKED
        segmentsStatus = CheckStatus.UN_CHECK
        break
      case getLanguage(this.props.language).Analyst_Labels.RANGE_COUNT:
        stepSizeStatus = CheckStatus.UN_CHECK
        segmentsStatus = CheckStatus.CHECKED
        break
    }
    this.setState({
      stepSizeStatus,
      segmentsStatus,
    })
  }

  checkValidation = () => {
    let startValue = parseFloat(this.state.startValue || 0)
    let endValue = parseFloat(this.state.endValue || 0)
    let stepSize = parseFloat(this.state.stepSize || 0)
    let segments = parseInt(this.state.segments || 0)
    if (
      isNaN(startValue) ||
      isNaN(endValue) ||
      isNaN(stepSize) ||
      isNaN(segments) ||
      startValue >= endValue ||
      (this.state.stepSizeStatus === CheckStatus.CHECKED && stepSize <= 0) ||
      (this.state.segmentsStatus === CheckStatus.CHECKED &&
        (segments < 1 || segments > 1000))
    ) {
      return false
    }
    return true
  }

  renderTextInput = () => {
    return (
      <View style={styles.subContainer}>
        <AnalystItem
          ref={ref => (this.startItem = ref)}
          rightType={'input'}
          title={getLanguage(this.props.language).Analyst_Labels.START_VALUE}
          value={this.state.startValue}
          keyboardType={'numeric'}
          onSubmitEditing={value => {
            if (isNaN(value) && value !== '') {
              value = this.state.startValue
            }
            this.setState({
              startValue: value,
            })
          }}
          onBlur={value => {
            this.setState({
              startValue: value,
            })
          }}
        />
        <AnalystItem
          ref={ref => (this.endItem = ref)}
          style={{ borderBottomWidth: 0 }}
          rightType={'input'}
          title={getLanguage(this.props.language).Analyst_Labels.END_VALUE}
          value={this.state.endValue}
          keyboardType={'numeric'}
          onSubmitEditing={value => {
            if (isNaN(value) && value !== '') {
              value = this.state.endValue
            }
            this.setState({
              endValue: value,
            })
          }}
          onBlur={value => {
            this.setState({
              endValue: value,
            })
          }}
        />
      </View>
    )
  }

  renderRadiusInput = () => {
    return (
      <View style={styles.subContainer}>
        <AnalystItem
          ref={ref => (this.stepSizeItem = ref)}
          radioStatus={this.state.stepSizeStatus}
          rightType={'input'}
          title={getLanguage(this.props.language).Analyst_Labels.STEP}
          value={this.state.stepSize}
          keyboardType={'numeric'}
          onRadioPress={() =>
            this.changeBufferType(
              getLanguage(this.props.language).Analyst_Labels.STEP,
            )
          }
          onSubmitEditing={value => {
            let _value = parseFloat(value)
            if (_value <= 0)
              this.setState({
                stepSize: _value <= 0 ? this.state.stepSize : _value,
              })
          }}
          onBlur={value => {
            if (isNaN(value) && value !== '') {
              value = this.state.stepSize
            }
            this.setState({
              stepSize: value,
            })
          }}
          onChangeText={text => {
            if (text === '') {
              this.setState({
                stepSize: '',
              })
            } else {
              if (isNaN(text) && text !== '') {
                text = this.state.stepSize
              }
              this.setState({
                stepSize: text,
              })
            }
          }}
        />
        <AnalystItem
          ref={ref => (this.segmentsItem = ref)}
          radioStatus={this.state.segmentsStatus}
          style={{ borderBottomWidth: 0 }}
          rightType={'input'}
          title={getLanguage(this.props.language).Analyst_Labels.RANGE_COUNT}
          value={this.state.segments}
          keyboardType={'numeric'}
          onRadioPress={() =>
            this.changeBufferType(
              getLanguage(this.props.language).Analyst_Labels.RANGE_COUNT,
            )
          }
          onBlur={value => {
            if (isNaN(value) && value !== '') {
              value = this.state.segments
            }
            this.setState({
              segments: value,
            })
          }}
          onRadiusPress={text => {
            if (text === '') {
              this.setState({
                segments: '',
              })
            } else {
              if (isNaN(text) && text !== '') {
                text = this.state.segments
              }
              this.setState({
                segments: text,
              })
            }
          }}
        />
      </View>
    )
  }

  render() {
    return (
      <Container
        ref={ref => (this.container = ref)}
        style={styles.container}
        headerProps={{
          title: getLanguage(this.props.language).Analyst_Labels.BATCH_ADD,
          backAction: this.back,
          navigation: this.props.navigation,
          headerRight: (
            <TextBtn
              btnText={getLanguage(this.props.language).Analyst_Labels.CONFIRM}
              textStyle={
                this.state.clickAble
                  ? styles.headerBtnTitle
                  : styles.headerBtnTitleDisable
              }
              btnClick={this.confirm}
            />
          ),
        }}
      >
        {this.renderTextInput()}
        {this.renderRadiusInput()}
      </Container>
    )
  }
}
