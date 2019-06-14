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
    this.state = {
      startValue: 10,
      endValue: 30,

      stepSizeStatus: CheckStatus.CHECKED,
      segmentsStatus: CheckStatus.UN_CHECK,
      stepSize: 3,
      segments: 3,

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

      let radiuses = []
      if (this.state.stepSizeStatus === CheckStatus.CHECKED) {
        let value = this.state.startValue
        while (value < this.state.endValue) {
          radiuses.push(value)
          value += this.state.stepSize
        }
        radiuses.push(this.state.endValue)
      } else {
        let value = this.state.endValue
        let segment =
          (this.state.endValue - this.state.startValue) /
          (this.state.segments - 1)
        while (radiuses.length < this.state.segments) {
          radiuses.unshift(value)
          value -= segment
        }
      }

      this.cb &&
        this.cb({
          radiuses,
          unit: 'Meter',
        })
      setTimeout(() => {
        this.canBenClick = true
      }, 1500)
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
    let startValue = parseFloat(this.state.startValue)
    let endValue = parseFloat(this.state.endValue)
    let stepSize = parseFloat(this.state.stepSize)
    let segments = parseInt(this.state.segments)
    if (
      isNaN(startValue) ||
      isNaN(endValue) ||
      isNaN(stepSize) ||
      isNaN(segments) ||
      startValue >= endValue ||
      (this.state.stepSizeStatus === CheckStatus.CHECKED && stepSize <= 0) ||
      (this.state.segmentsStatus === CheckStatus.CHECKED &&
        segments < 1 &&
        segments > 1000)
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
            this.setState({
              startValue: value,
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
