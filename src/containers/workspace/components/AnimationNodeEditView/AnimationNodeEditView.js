import * as React from 'react'
import {
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
  Text,
  Switch,
  ScrollView,
} from 'react-native'
import { Container, TextBtn } from '../../../../components'
import { color, size } from '../../../../styles'
import { getLanguage } from '../../../../language'
import { scaleSize, setSpText } from '../../../../utils'
import { SMap } from 'imobile_for_reactnative'
import NavigationService from '../../../../containers/NavigationService'

export default class AnimationNodeEditView extends React.Component {
  props: {
    navigation: Object,
    // nav: Object,
    language: string,
  }

  constructor(props) {
    super(props)
    const { params } = this.props.navigation.state
    this.cb = params && params.cb
    this.backcb = params && params.backcb
    // let defaultValue = params && params.value !== undefined ? params.value : ''
    // this.state = {
    //   value: defaultValue,
    //   placeholder:
    //     params && params.placeholder !== undefined ? params.placeholder : '',
    //   headerTitle:
    //     params && params.headerTitle !== undefined ? params.headerTitle : '',
    //   btnTitle:
    //     params && params.btnTitle
    //       ? params.btnTitle
    //       : getLanguage(global.language).Prompt.CONFIRM, //'确定',
    //   keyboardType:
    //     params && params.keyboardType ? params.keyboardType : 'default',
    //   isLegalName: !!defaultValue,
    //   errorInfo: '',
    // }
    this.clickAble = true // 防止重复点击

    let index = params && params.index
    this.state = {
      index: index,
      animationType: -1,
      data: {},

      btnTitle:
        params && params.btnTitle
          ? params.btnTitle
          : getLanguage(global.language).Prompt.CONFIRM, //'确定',
      headerTitle:
        params && params.headerTitle !== undefined ? params.headerTitle : '',
    }
  }

  componentDidMount() {
    this.getAnimationGoInfo()
  }

  getAnimationGoInfo = async () => {
    let animationGoInfo = await SMap.getAnimationGoInfo(this.state.index)
    this.setState({
      data: animationGoInfo,
      animationType: animationGoInfo.animationType,
    })
  }

  confirm = async () => {
    await SMap.modifyAnimationNode(this.state.index, this.state.data)
    this.cb && this.cb()
  }

  back = () => {
    if (this.backcb) {
      this.backcb()
    } else {
      this.props.navigation.goBack()
    }
  }

  setBlinkStyle = blinkStyle => {
    let tempData = this.state.data
    tempData.blinkStyle = blinkStyle
    this.setState({
      data: tempData,
    })
  }

  setRotateDirection = rotateDirection => {
    let tempData = this.state.data
    tempData.rotateDirection = rotateDirection
    this.setState({
      data: tempData,
    })
  }

  modifyNubmer = (oldNum, offset) => {
    let tempNum = (Number(oldNum) * 1000 + offset * 1000) / 1000 //解决0.1+0.2!=0.3的问题
    if (tempNum < 0) {
      tempNum = 0
    }
    return tempNum + ''
  }

  modifyRotateStartAngle = () => {
    NavigationService.navigate('AnimationNodeEditRotateView', {
      headerTitle: getLanguage(global.language).Map_Plotting
        .ANIMATION_ROTATE_START_ANGLE,
      //'开始旋转角度',
      data: this.state.data.startAngle,
      cb: async data => {
        NavigationService.goBack()
        let tempData = this.state.data
        tempData.startAngle = data
        this.setState({
          data: tempData,
        })
      },
    })
  }

  modifyRotateEndAngle = () => {
    NavigationService.navigate('AnimationNodeEditRotateView', {
      headerTitle: getLanguage(global.language).Map_Plotting
        .ANIMATION_ROTATE_END_ANGLE,
      //'结束旋转角度',
      data: this.state.data.endAngle,
      cb: async data => {
        NavigationService.goBack()
        let tempData = this.state.data
        tempData.endAngle = data
        this.setState({
          data: tempData,
        })
      },
    })
  }

  clearNoNum = value => {
    value = value.replace(/[^\d.]/g, '') //清除“数字”和“.”以外的字符
    value = value.replace(/\.{2,}/g, '.') //只保留第一个. 清除多余的
    value = value
      .replace('.', '$#$')
      .replace(/\./g, '')
      .replace('$#$', '.')
    // value = value.replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3');//只能输入两个小数
    if (value.indexOf('.') < 0 && value != '') {
      //以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额
      value = parseFloat(value)
    } else if (value == '') {
      value = 0
    }
    return value + ''
  }

  //属性动画
  renderAttributeView() {
    return (
      <View style={styles.subContainer}>
        <View style={styles.titleView}>
          <Text style={styles.textTitle}>
            {getLanguage(global.language).Map_Plotting.ANIMATION_ATTRIBUTE}
          </Text>
        </View>

        <View style={styles.startTime}>
          <Text style={styles.startTimeText}>
            {
              getLanguage(global.language).Map_Plotting
                .ANIMATION_ATTRIBUTE_LINE_WIDTH
            }
          </Text>
          <View style={styles.startTimeView}>
            <Switch
              trackColor={{ false: color.bgG, true: color.switch }}
              thumbColor={color.bgW}
              ios_backgroundColor={color.bgG}
              value={this.state.data.lineWidthAttr}
              onValueChange={value => {
                let tempData = this.state.data
                tempData.lineWidthAttr = value
                this.setState({
                  data: tempData,
                })
              }}
            />
          </View>
        </View>
        {!this.state.data.lineWidthAttr ? (
          <View />
        ) : (
          <View style={styles.container}>
            <View style={styles.startTime}>
              <View style={{ marginLeft: scaleSize(50) }} />
              <Text style={styles.startTimeText}>
                {
                  getLanguage(global.language).Map_Plotting
                    .ANIMATION_ATTRIBUTE_LINE_WIDTH_START
                }
              </Text>
              <View style={styles.startTimeView}>
                <TouchableOpacity
                  style={styles.modifyTime}
                  onPress={() => {
                    let tempData = this.state.data
                    tempData.startLineWidth = this.modifyNubmer(
                      this.state.data.startLineWidth,
                      -1,
                    )
                    this.setState({
                      data: tempData,
                    })
                  }}
                >
                  <Image
                    source={require('../../../../assets/publicTheme/plot/plot_reduce.png')}
                    style={styles.tableItemImg}
                  />
                </TouchableOpacity>
                <TextInput
                  style={styles.inputTime}
                  onChangeText={text => {
                    let tempData = this.state.data
                    tempData.startLineWidth = this.clearNoNum(text)
                    this.setState({
                      data: tempData,
                    })
                  }}
                  keyboardType="numeric"
                  value={this.state.data.startLineWidth + ''}
                />
                <TouchableOpacity
                  style={styles.modifyTime}
                  onPress={() => {
                    let tempData = this.state.data
                    tempData.startLineWidth = this.modifyNubmer(
                      this.state.data.startLineWidth,
                      1,
                    )
                    this.setState({
                      data: tempData,
                    })
                  }}
                >
                  <Image
                    source={require('../../../../assets/publicTheme/plot/plot_add.png')}
                    style={styles.tableItemImg}
                  />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.startTime}>
              <View style={{ marginLeft: scaleSize(50) }} />
              <Text style={styles.startTimeText}>
                {
                  getLanguage(global.language).Map_Plotting
                    .ANIMATION_ATTRIBUTE_LINE_WIDTH_END
                }
              </Text>

              <View style={styles.startTimeView}>
                <TouchableOpacity
                  style={styles.modifyTime}
                  onPress={() => {
                    let tempData = this.state.data
                    tempData.endLineWidth = this.modifyNubmer(
                      this.state.data.endLineWidth,
                      -1,
                    )
                    this.setState({
                      data: tempData,
                    })
                  }}
                >
                  <Image
                    source={require('../../../../assets/publicTheme/plot/plot_reduce.png')}
                    style={styles.tableItemImg}
                  />
                </TouchableOpacity>
                <TextInput
                  style={styles.inputTime}
                  onChangeText={text => {
                    let tempData = this.state.data
                    tempData.endLineWidth = this.clearNoNum(text)
                    this.setState({
                      data: tempData,
                    })
                  }}
                  keyboardType="numeric"
                  value={this.state.data.endLineWidth + ''}
                />
                <TouchableOpacity
                  style={styles.modifyTime}
                  onPress={() => {
                    let tempData = this.state.data
                    tempData.endLineWidth = this.modifyNubmer(
                      this.state.data.endLineWidth,
                      1,
                    )
                    this.setState({
                      data: tempData,
                    })
                  }}
                >
                  <Image
                    source={require('../../../../assets/publicTheme/plot/plot_add.png')}
                    style={styles.tableItemImg}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
        <View style={styles.lineStyle} />
        <View style={styles.startTime}>
          <Text style={styles.startTimeText}>
            {
              getLanguage(global.language).Map_Plotting
                .ANIMATION_ATTRIBUTE_LINE_COLOR
            }
          </Text>
          <View style={styles.startTimeView}>
            <Switch
              trackColor={{ false: color.bgG, true: color.switch }}
              thumbColor={color.bgW}
              ios_backgroundColor={color.bgG}
              value={this.state.data.lineColorAttr}
              onValueChange={value => {
                let tempData = this.state.data
                tempData.lineColorAttr = value
                this.setState({
                  data: tempData,
                })
              }}
            />
          </View>
        </View>
        {this.state.data.lineColorAttr ? (
          <View style={styles.container}>
            <View style={styles.startTime}>
              <View style={styles.itemView}>
                <View style={styles.marginLiftMax} />
                <Text style={styles.startTimeText}>
                  {
                    getLanguage(global.language).Map_Plotting
                      .ANIMATION_BLINK_START_COLOR
                  }
                </Text>
              </View>

              <TouchableOpacity
                style={styles.startTimeView}
                onPress={() => {
                  // let color='#'+this.state.data.blinkAnimationStartColor.toString(16).slice(1)
                  NavigationService.navigate('ColorPickerPage', {
                    defaultColor: this.rgbToHex(this.state.data.startLineColor),
                    colorViewType: 'ColorWheel',
                    cb: color => {
                      let startLineColor = this.hexToRgb(color)
                      let tempData = this.state.data
                      tempData.startLineColor = startLineColor
                      this.setState({
                        data: tempData,
                      })
                    },
                  })
                }}
              >
                <Text
                  style={{
                    fontSize: setSpText(20),
                    height: scaleSize(30),
                    width: scaleSize(60),
                    color: color.themePlaceHolder,
                    textAlign: 'center',
                    padding: scaleSize(3),
                    backgroundColor: this.rgbToHex(
                      this.state.data.startLineColor,
                    ),
                  }}
                />
                <Image
                  source={require('../../../../assets/Mine/mine_my_arrow.png')}
                  style={styles.rotateAngleImg}
                />
              </TouchableOpacity>
            </View>

            <View style={styles.startTime}>
              <View style={styles.itemView}>
                <View style={styles.marginLiftMax} />
                <Text style={styles.startTimeText}>
                  {
                    getLanguage(global.language).Map_Plotting
                      .ANIMATION_ATTRIBUTE_LINE_COLOR_END
                  }
                </Text>
              </View>

              <TouchableOpacity
                style={styles.startTimeView}
                onPress={() => {
                  NavigationService.navigate('ColorPickerPage', {
                    defaultColor: this.rgbToHex(this.state.data.endLineColor),
                    colorViewType: 'ColorWheel',
                    cb: color => {
                      let endLineColor = this.hexToRgb(color)
                      let tempData = this.state.data
                      tempData.endLineColor = endLineColor
                      this.setState({
                        data: tempData,
                      })
                    },
                  })
                }}
              >
                <Text
                  style={{
                    fontSize: setSpText(20),
                    height: scaleSize(30),
                    width: scaleSize(60),
                    color: color.themePlaceHolder,
                    textAlign: 'center',
                    padding: scaleSize(3),
                    backgroundColor: this.rgbToHex(
                      this.state.data.endLineColor,
                    ),
                  }}
                />
                <Image
                  source={require('../../../../assets/Mine/mine_my_arrow.png')}
                  style={styles.rotateAngleImg}
                />
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View />
        )}

        <View style={styles.lineStyle} />
        {
          <View style={styles.startTime}>
            <Text style={styles.startTimeText}>
              {
                getLanguage(global.language).Map_Plotting
                  .ANIMATION_ATTRIBUTE_SURROUND_LINE_WIDTH
              }
            </Text>

            <View style={styles.startTimeView}>
              <Switch
                trackColor={{ false: color.bgG, true: color.switch }}
                thumbColor={color.bgW}
                ios_backgroundColor={color.bgG}
                value={this.state.data.surroundLineWidthAttr}
                onValueChange={value => {
                  let tempData = this.state.data
                  tempData.surroundLineWidthAttr = value
                  this.setState({
                    data: tempData,
                  })
                }}
              />
            </View>
          </View>
        }
        {!this.state.data.surroundLineWidthAttr ? (
          <View />
        ) : (
          <View style={styles.container}>
            <View style={styles.startTime}>
              <View style={{ marginLeft: scaleSize(50) }} />
              <Text style={styles.startTimeText}>
                {
                  getLanguage(global.language).Map_Plotting
                    .ANIMATION_ATTRIBUTE_SURROUND_LINE_WIDTH_START
                }
              </Text>

              <View style={styles.startTimeView}>
                <TouchableOpacity
                  style={styles.modifyTime}
                  onPress={() => {
                    let tempData = this.state.data
                    tempData.startSurroundLineWidth = this.modifyNubmer(
                      this.state.data.startSurroundLineWidth,
                      -1,
                    )
                    this.setState({
                      data: tempData,
                    })
                  }}
                >
                  <Image
                    source={require('../../../../assets/publicTheme/plot/plot_reduce.png')}
                    style={styles.tableItemImg}
                  />
                </TouchableOpacity>
                <TextInput
                  style={styles.inputTime}
                  onChangeText={text => {
                    let tempData = this.state.data
                    tempData.startSurroundLineWidth = this.clearNoNum(text)
                    this.setState({
                      data: tempData,
                    })
                  }}
                  keyboardType="numeric"
                  value={this.state.data.startSurroundLineWidth + ''}
                />
                <TouchableOpacity
                  style={styles.modifyTime}
                  onPress={() => {
                    let tempData = this.state.data
                    tempData.startSurroundLineWidth = this.modifyNubmer(
                      this.state.data.startSurroundLineWidth,
                      1,
                    )
                    this.setState({
                      data: tempData,
                    })
                  }}
                >
                  <Image
                    source={require('../../../../assets/publicTheme/plot/plot_add.png')}
                    style={styles.tableItemImg}
                  />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.startTime}>
              <View style={{ marginLeft: scaleSize(50) }} />
              <Text style={styles.startTimeText}>
                {
                  getLanguage(global.language).Map_Plotting
                    .ANIMATION_ATTRIBUTE_SURROUND_LINE_WIDTH_END
                }
              </Text>

              <View style={styles.startTimeView}>
                <TouchableOpacity
                  style={styles.modifyTime}
                  onPress={() => {
                    let tempData = this.state.data
                    tempData.endSurroundLineWidth = this.modifyNubmer(
                      this.state.data.endSurroundLineWidth,
                      -1,
                    )
                    this.setState({
                      data: tempData,
                    })
                  }}
                >
                  <Image
                    source={require('../../../../assets/publicTheme/plot/plot_reduce.png')}
                    style={styles.tableItemImg}
                  />
                </TouchableOpacity>
                <TextInput
                  style={styles.inputTime}
                  onChangeText={text => {
                    let tempData = this.state.data
                    tempData.endSurroundLineWidth = this.clearNoNum(text)
                    this.setState({
                      data: tempData,
                    })
                  }}
                  keyboardType="numeric"
                  value={this.state.data.endSurroundLineWidth + ''}
                />
                <TouchableOpacity
                  style={styles.modifyTime}
                  onPress={() => {
                    let tempData = this.state.data
                    tempData.endSurroundLineWidth = this.modifyNubmer(
                      this.state.data.endSurroundLineWidth,
                      1,
                    )
                    this.setState({
                      data: tempData,
                    })
                  }}
                >
                  <Image
                    source={require('../../../../assets/publicTheme/plot/plot_add.png')}
                    style={styles.tableItemImg}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
        <View style={styles.lineStyle} />
        <View style={styles.startTime}>
          <Text style={styles.startTimeText}>
            {
              getLanguage(global.language).Map_Plotting
                .ANIMATION_ATTRIBUTE_SURROUND_LINE_COLOR
            }
          </Text>
          <View style={styles.startTimeView}>
            <Switch
              trackColor={{ false: color.bgG, true: color.switch }}
              thumbColor={color.bgW}
              ios_backgroundColor={color.bgG}
              value={this.state.data.surroundLineColorAttr}
              onValueChange={value => {
                let tempData = this.state.data
                tempData.surroundLineColorAttr = value
                this.setState({
                  data: tempData,
                })
              }}
            />
          </View>
        </View>
        {this.state.data.surroundLineColorAttr ? (
          <View style={styles.container}>
            <View style={styles.startTime}>
              <View style={styles.itemView}>
                <View style={styles.marginLiftMax} />
                <Text style={styles.startTimeText}>
                  {
                    getLanguage(global.language).Map_Plotting
                      .ANIMATION_ATTRIBUTE_SURROUND_LINE_COLOR_START
                  }
                </Text>
              </View>

              <TouchableOpacity
                style={styles.startTimeView}
                onPress={() => {
                  // let color='#'+this.state.data.blinkAnimationStartColor.toString(16).slice(1)
                  NavigationService.navigate('ColorPickerPage', {
                    defaultColor: this.rgbToHex(
                      this.state.data.startSurroundLineColor,
                    ),
                    colorViewType: 'ColorWheel',
                    cb: color => {
                      let startSurroundLineColor = this.hexToRgb(color)
                      let tempData = this.state.data
                      tempData.startSurroundLineColor = startSurroundLineColor
                      this.setState({
                        data: tempData,
                      })
                    },
                  })
                }}
              >
                <Text
                  style={{
                    fontSize: setSpText(20),
                    height: scaleSize(30),
                    width: scaleSize(60),
                    color: color.themePlaceHolder,
                    textAlign: 'center',
                    padding: scaleSize(3),
                    backgroundColor: this.rgbToHex(
                      this.state.data.startSurroundLineColor,
                    ),
                  }}
                />
                <Image
                  source={require('../../../../assets/Mine/mine_my_arrow.png')}
                  style={styles.rotateAngleImg}
                />
              </TouchableOpacity>
            </View>

            <View style={styles.startTime}>
              <View style={styles.itemView}>
                <View style={styles.marginLiftMax} />
                <Text style={styles.startTimeText}>
                  {
                    getLanguage(global.language).Map_Plotting
                      .ANIMATION_ATTRIBUTE_SURROUND_LINE_COLOR_END
                  }
                </Text>
              </View>

              <TouchableOpacity
                style={styles.startTimeView}
                onPress={() => {
                  NavigationService.navigate('ColorPickerPage', {
                    defaultColor: this.rgbToHex(
                      this.state.data.endSurroundLineColor,
                    ),
                    colorViewType: 'ColorWheel',
                    cb: color => {
                      let endSurroundLineColor = this.hexToRgb(color)
                      let tempData = this.state.data
                      tempData.endSurroundLineColor = endSurroundLineColor
                      this.setState({
                        data: tempData,
                      })
                    },
                  })
                }}
              >
                <Text
                  style={{
                    fontSize: setSpText(20),
                    height: scaleSize(30),
                    width: scaleSize(60),
                    color: color.themePlaceHolder,
                    textAlign: 'center',
                    padding: scaleSize(3),
                    backgroundColor: this.rgbToHex(
                      this.state.data.endSurroundLineColor,
                    ),
                  }}
                />
                <Image
                  source={require('../../../../assets/Mine/mine_my_arrow.png')}
                  style={styles.rotateAngleImg}
                />
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View />
        )}
      </View>
    )
  }

  //旋转动画
  renderRotateView() {
    return (
      <View style={styles.subContainer}>
        <View style={styles.titleView}>
          <Text style={styles.textTitle}>
            {getLanguage(global.language).Map_Plotting.ANIMATION_ROTATE}
          </Text>
        </View>
        <View style={styles.startTime}>
          <View style={styles.itemView}>
            <Text style={styles.startTimeText}>
              {
                getLanguage(global.language).Map_Plotting
                  .ANIMATION_ROTATE_DIRECTION
              }
            </Text>
          </View>
          <View style={styles.startTimeView}>
            <TouchableOpacity
              style={styles.subImg}
              onPress={() => this.setRotateDirection(0)}
            >
              <Image
                source={
                  this.state.data.rotateDirection == 0
                    ? require('../../../../assets/public/radio_select.png')
                    : require('../../../../assets/public/radio_select_no.png')
                }
                style={styles.subImg}
              />
            </TouchableOpacity>
            <View style={{ marginLeft: scaleSize(5) }} />
            <Text style={styles.startTimeText}>
              {
                getLanguage(global.language).Map_Plotting
                  .ANIMATION_ROTATE_CLOCKWISE
              }
            </Text>
            <View style={{ marginLeft: scaleSize(30) }} />
            <TouchableOpacity
              style={styles.subImg}
              onPress={() => this.setRotateDirection(1)}
            >
              <Image
                source={
                  this.state.data.rotateDirection == 1
                    ? require('../../../../assets/public/radio_select.png')
                    : require('../../../../assets/public/radio_select_no.png')
                }
                style={styles.subImg}
              />
            </TouchableOpacity>
            <View style={{ marginLeft: scaleSize(5) }} />
            <Text style={styles.startTimeText}>
              {
                getLanguage(global.language).Map_Plotting
                  .ANIMATION_ROTATE_ANTICLOCKWISE
              }
            </Text>
          </View>
        </View>
        <View style={styles.lineStyle} />

        <View style={styles.startTime}>
          <View style={styles.itemView}>
            <Text style={styles.startTimeText}>
              {
                getLanguage(global.language).Map_Plotting
                  .ANIMATION_ROTATE_START_ANGLE
              }
            </Text>
          </View>

          <TouchableOpacity
            style={styles.startTimeView}
            onPress={() => {
              this.modifyRotateStartAngle()
            }}
          >
            <Text style={styles.rotateAngleText}>
              {this.state.data.startAngle.x +
                '.' +
                this.state.data.startAngle.y}
            </Text>
            <Image
              source={require('../../../../assets/Mine/mine_my_arrow.png')}
              style={styles.rotateAngleImg}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.lineStyle} />
        <View style={styles.startTime}>
          <View style={styles.itemView}>
            <Text style={styles.startTimeText}>
              {
                getLanguage(global.language).Map_Plotting
                  .ANIMATION_ROTATE_END_ANGLE
              }
            </Text>
          </View>

          <TouchableOpacity
            style={styles.startTimeView}
            onPress={() => {
              this.modifyRotateEndAngle()
            }}
          >
            <Text style={styles.rotateAngleText}>
              {this.state.data.endAngle.x + '.' + this.state.data.endAngle.y}
            </Text>
            <Image
              source={require('../../../../assets/Mine/mine_my_arrow.png')}
              style={styles.rotateAngleImg}
            />
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  //闪烁动画
  renderBlinkView() {
    return (
      <View style={styles.subContainer}>
        <View style={styles.titleView}>
          <Text style={styles.textTitle}>
            {getLanguage(global.language).Map_Plotting.ANIMATION_BLINK}
          </Text>
        </View>
        <View style={styles.startTime}>
          <View style={styles.itemView}>
            <TouchableOpacity
              style={styles.subImg}
              onPress={() => this.setBlinkStyle(0)}
            >
              <Image
                source={
                  this.state.data.blinkStyle == 0
                    ? require('../../../../assets/public/radio_select.png')
                    : require('../../../../assets/public/radio_select_no.png')
                }
                style={styles.subImg}
              />
            </TouchableOpacity>
            <View style={{ marginLeft: scaleSize(15) }} />
            <Text style={styles.startTimeText}>
              {
                getLanguage(global.language).Map_Plotting
                  .ANIMATION_BLINK_INTERVAL
              }
            </Text>
          </View>
          <View style={styles.startTimeView}>
            <TouchableOpacity
              style={styles.modifyTime}
              onPress={() => {
                let blinkinterval = this.modifyNubmer(
                  this.state.data.blinkinterval,
                  -1,
                )
                let tempData = this.state.data
                tempData.blinkinterval = blinkinterval
                this.setState({
                  data: tempData,
                })
              }}
            >
              <Image
                source={require('../../../../assets/publicTheme/plot/plot_reduce.png')}
                style={styles.tableItemImg}
              />
            </TouchableOpacity>
            <TextInput
              style={styles.inputTime}
              onChangeText={text => {
                let blinkinterval = this.clearNoNum(text)
                let tempData = this.state.data
                tempData.blinkinterval = blinkinterval
                this.setState({
                  data: tempData,
                })
              }}
              keyboardType="numeric"
              value={this.state.data.blinkinterval + ''}
            />
            <TouchableOpacity
              style={styles.modifyTime}
              onPress={() => {
                let blinkinterval = this.modifyNubmer(
                  this.state.data.blinkinterval,
                  1,
                )
                let tempData = this.state.data
                tempData.blinkinterval = blinkinterval
                this.setState({
                  data: tempData,
                })
              }}
            >
              <Image
                source={require('../../../../assets/publicTheme/plot/plot_add.png')}
                style={styles.tableItemImg}
              />
            </TouchableOpacity>
          </View>
        </View>
        {/* <View style={styles.lineStyle} /> */}
        {
          <View style={styles.startTime}>
            {/* <Text style={styles.startTimeText}>
              {
                getLanguage(global.language).Map_Plotting
                  .ANIMATION_BLINK_NUMBER
              }
            </Text> */}

            <View style={styles.itemView}>
              <TouchableOpacity
                style={styles.subImg}
                onPress={() => this.setBlinkStyle(1)}
              >
                <Image
                  source={
                    this.state.data.blinkStyle == 1
                      ? require('../../../../assets/public/radio_select.png')
                      : require('../../../../assets/public/radio_select_no.png')
                  }
                  style={styles.subImg}
                />
              </TouchableOpacity>
              <View style={{ marginLeft: scaleSize(15) }} />
              <Text style={styles.startTimeText}>
                {
                  getLanguage(global.language).Map_Plotting
                    .ANIMATION_BLINK_NUMBER
                }
              </Text>
            </View>

            <View style={styles.startTimeView}>
              <TouchableOpacity
                style={styles.modifyTime}
                onPress={() => {
                  let blinkNumber = this.modifyNubmer(
                    this.state.data.blinkNumber,
                    -1,
                  )
                  let tempData = this.state.data
                  tempData.blinkNumber = blinkNumber
                  this.setState({
                    data: tempData,
                  })
                }}
              >
                <Image
                  source={require('../../../../assets/publicTheme/plot/plot_reduce.png')}
                  style={styles.tableItemImg}
                />
              </TouchableOpacity>
              <TextInput
                style={styles.inputTime}
                keyboardType="numeric"
                onChangeText={text => {
                  let blinkNumber = Number(text.replace(/[^0-9]*/g, '')) + ''
                  let tempData = this.state.data
                  tempData.blinkNumber = blinkNumber

                  this.setState({
                    data: tempData,
                  })
                }}
                value={this.state.data.blinkNumber + ''}
              />
              <TouchableOpacity
                style={styles.modifyTime}
                onPress={() => {
                  let blinkNumber = this.modifyNubmer(
                    this.state.data.blinkNumber,
                    1,
                  )
                  let tempData = this.state.data
                  tempData.blinkNumber = blinkNumber
                  this.setState({
                    data: tempData,
                  })
                }}
              >
                <Image
                  source={require('../../../../assets/publicTheme/plot/plot_add.png')}
                  style={styles.tableItemImg}
                />
              </TouchableOpacity>
            </View>
          </View>
        }

        <View style={styles.lineStyle} />
        <View style={styles.startTime}>
          <Text style={styles.startTimeText}>
            {getLanguage(global.language).Map_Plotting.ANIMATION_BLINK_REPLACE}
          </Text>
          <View style={styles.startTimeView}>
            <Switch
              trackColor={{ false: color.bgG, true: color.switch }}
              thumbColor={color.bgW}
              ios_backgroundColor={color.bgG}
              value={this.state.data.blinkAnimationReplaceStyle ? true : false}
              onValueChange={value => {
                let tempData = this.state.data
                tempData.blinkAnimationReplaceStyle = value
                this.setState({
                  data: tempData,
                })
              }}
            />
          </View>
        </View>
        {this.state.data.blinkAnimationReplaceStyle ? (
          <View style={styles.container}>
            <View style={styles.startTime}>
              <View style={styles.itemView}>
                <View style={styles.marginLiftMax} />
                <Text style={styles.startTimeText}>
                  {
                    getLanguage(global.language).Map_Plotting
                      .ANIMATION_BLINK_START_COLOR
                  }
                </Text>
              </View>

              <TouchableOpacity
                style={styles.startTimeView}
                onPress={() => {
                  NavigationService.navigate('ColorPickerPage', {
                    defaultColor: this.rgbToHex(
                      this.state.data.blinkAnimationStartColor,
                    ),
                    colorViewType: 'ColorWheel',
                    cb: color => {
                      let blinkAnimationStartColor = this.hexToRgb(color)
                      let tempData = this.state.data
                      tempData.blinkAnimationStartColor = blinkAnimationStartColor
                      this.setState({
                        data: tempData,
                      })
                    },
                  })
                }}
              >
                <Text
                  style={{
                    fontSize: setSpText(20),
                    height: scaleSize(30),
                    width: scaleSize(60),
                    color: color.themePlaceHolder,
                    textAlign: 'center',
                    padding: scaleSize(3),
                    backgroundColor: this.rgbToHex(
                      this.state.data.blinkAnimationStartColor,
                    ),
                  }}
                >
                  {/* {this.rgbToHex(this.state.data.blinkAnimationStartColor)} */}
                </Text>
                <Image
                  source={require('../../../../assets/Mine/mine_my_arrow.png')}
                  style={styles.rotateAngleImg}
                />
              </TouchableOpacity>
            </View>

            <View style={styles.startTime}>
              <View style={styles.itemView}>
                <View style={styles.marginLiftMax} />
                <Text style={styles.startTimeText}>
                  {
                    getLanguage(global.language).Map_Plotting
                      .ANIMATION_BLINK_REPLACE_COLOR
                  }
                </Text>
              </View>

              <TouchableOpacity
                style={styles.startTimeView}
                onPress={() => {
                  // let color='#'+this.state.data.blinkAnimationStartColor.toString(16).slice(1)
                  NavigationService.navigate('ColorPickerPage', {
                    defaultColor: this.rgbToHex(
                      this.state.data.blinkAnimationReplaceColor,
                    ),
                    colorViewType: 'ColorWheel',
                    cb: color => {
                      let blinkAnimationReplaceColor = this.hexToRgb(color)
                      let tempData = this.state.data
                      tempData.blinkAnimationReplaceColor = blinkAnimationReplaceColor
                      this.setState({
                        data: tempData,
                      })
                    },
                  })
                }}
              >
                <Text
                  style={{
                    fontSize: setSpText(20),
                    height: scaleSize(30),
                    width: scaleSize(60),
                    color: color.themePlaceHolder,
                    textAlign: 'center',
                    padding: scaleSize(3),
                    backgroundColor: this.rgbToHex(
                      this.state.data.blinkAnimationReplaceColor,
                    ),
                  }}
                >
                  {/* {this.rgbToHex(this.state.data.blinkAnimationReplaceColor)} */}
                </Text>
                <Image
                  source={require('../../../../assets/Mine/mine_my_arrow.png')}
                  style={styles.rotateAngleImg}
                />
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View />
        )}
      </View>
    )
  }

  rgbToHex = rgb => {
    if (rgb < 0) {
      rgb =
        ((rgb >> 16) & 0xff) * 65536 + ((rgb >> 8) & 0xff) * 256 + (rgb & 0xff)
    }
    let str = rgb.toString(16) + ''
    if (str.length < 6) {
      for (let i = str.length; i < 6; i++) {
        str = '0' + str
      }
    }
    return '#' + str
  }

  hexToRgb = hex => {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return (
      parseInt(result[1], 16) * 65536 +
      parseInt(result[2], 16) * 256 +
      parseInt(result[3], 16)
    )
  }

  //比例动画
  renderScaleView() {
    return (
      <View style={styles.subContainer}>
        <View style={styles.titleView}>
          <Text style={styles.textTitle}>
            {getLanguage(global.language).Map_Plotting.ANIMATION_SCALE}
          </Text>
        </View>
        <View style={styles.startTime}>
          <Text style={styles.startTimeText}>
            {
              getLanguage(global.language).Map_Plotting
                .ANIMATION_SCALE_START_SCALE
            }
          </Text>
          <View style={styles.startTimeView}>
            <TouchableOpacity
              style={styles.modifyTime}
              onPress={() => {
                let tempData = this.state.data
                tempData.startScale = this.modifyNubmer(
                  this.state.data.startScale,
                  -1,
                )
                this.setState({
                  data: tempData,
                })
              }}
            >
              <Image
                source={require('../../../../assets/publicTheme/plot/plot_reduce.png')}
                style={styles.tableItemImg}
              />
            </TouchableOpacity>
            <TextInput
              style={styles.inputTime}
              onChangeText={text => {
                let tempData = this.state.data
                tempData.startScale = this.clearNoNum(text)
                this.setState({
                  data: tempData,
                })
              }}
              keyboardType="numeric"
              value={this.state.data.startScale + ''}
            />
            <TouchableOpacity
              style={styles.modifyTime}
              onPress={() => {
                let tempData = this.state.data
                tempData.startScale = this.modifyNubmer(
                  this.state.data.startScale,
                  1,
                )
                this.setState({
                  data: tempData,
                })
              }}
            >
              <Image
                source={require('../../../../assets/publicTheme/plot/plot_add.png')}
                style={styles.tableItemImg}
              />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.lineStyle} />
        {
          <View style={styles.startTime}>
            <Text style={styles.startTimeText}>
              {
                getLanguage(global.language).Map_Plotting
                  .ANIMATION_SCALE_END_SCALE
              }
            </Text>

            <View style={styles.startTimeView}>
              <TouchableOpacity
                style={styles.modifyTime}
                onPress={() => {
                  let tempData = this.state.data
                  tempData.endScale = this.modifyNubmer(
                    this.state.data.endScale,
                    -1,
                  )
                  this.setState({
                    data: tempData,
                  })
                }}
              >
                <Image
                  source={require('../../../../assets/publicTheme/plot/plot_reduce.png')}
                  style={styles.tableItemImg}
                />
              </TouchableOpacity>
              <TextInput
                style={styles.inputTime}
                keyboardType="numeric"
                onChangeText={text => {
                  let tempData = this.state.data
                  tempData.endScale = this.clearNoNum(text)
                  this.setState({
                    data: tempData,
                  })
                }}
                value={this.state.data.endScale + ''}
              />
              <TouchableOpacity
                style={styles.modifyTime}
                onPress={() => {
                  let tempData = this.state.data
                  tempData.endScale = this.modifyNubmer(
                    this.state.data.endScale,
                    1,
                  )
                  this.setState({
                    data: tempData,
                  })
                }}
              >
                <Image
                  source={require('../../../../assets/publicTheme/plot/plot_add.png')}
                  style={styles.tableItemImg}
                />
              </TouchableOpacity>
            </View>
          </View>
        }
      </View>
    )
  }

  //生长动画
  renderGrowView() {
    return (
      <View style={styles.subContainer}>
        <View style={styles.titleView}>
          <Text style={styles.textTitle}>
            {getLanguage(global.language).Map_Plotting.ANIMATION_GROW}
          </Text>
        </View>
        <View style={styles.startTime}>
          <Text style={styles.startTimeText}>
            {
              getLanguage(global.language).Map_Plotting
                .ANIMATION_SCALE_START_SCALE
            }
          </Text>
          <View style={styles.startTimeView}>
            <TouchableOpacity
              style={styles.modifyTime}
              onPress={() => {
                let tempData = this.state.data
                tempData.startLocation = this.modifyNubmer(
                  this.state.data.startLocation,
                  -0.1,
                )
                this.setState({
                  data: tempData,
                })
              }}
            >
              <Image
                source={require('../../../../assets/publicTheme/plot/plot_reduce.png')}
                style={styles.tableItemImg}
              />
            </TouchableOpacity>
            <TextInput
              style={styles.inputTime}
              onChangeText={text => {
                let tempData = this.state.data
                tempData.startLocation = this.clearNoNum(text)
                if (!isNaN(tempData.startLocation)) {
                  let number = Number(tempData.startLocation)
                  if (number > 1) {
                    tempData.startLocation = 1 + ''
                  }
                }
                this.setState({
                  data: tempData,
                })
              }}
              keyboardType="numeric"
              value={this.state.data.startLocation + ''}
            />
            <TouchableOpacity
              style={styles.modifyTime}
              onPress={() => {
                let tempData = this.state.data
                tempData.startLocation = this.modifyNubmer(
                  this.state.data.startLocation,
                  0.1,
                )
                if (tempData.startLocation > 1) {
                  tempData.startLocation = 1 + ''
                }
                this.setState({
                  data: tempData,
                })
              }}
            >
              <Image
                source={require('../../../../assets/publicTheme/plot/plot_add.png')}
                style={styles.tableItemImg}
              />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.lineStyle} />
        {
          <View style={styles.startTime}>
            <Text style={styles.startTimeText}>
              {
                getLanguage(global.language).Map_Plotting
                  .ANIMATION_SCALE_END_SCALE
              }
            </Text>

            <View style={styles.startTimeView}>
              <TouchableOpacity
                style={styles.modifyTime}
                onPress={() => {
                  let tempData = this.state.data
                  tempData.endLocation = this.modifyNubmer(
                    this.state.data.endLocation,
                    -0.1,
                  )
                  this.setState({
                    data: tempData,
                  })
                }}
              >
                <Image
                  source={require('../../../../assets/publicTheme/plot/plot_reduce.png')}
                  style={styles.tableItemImg}
                />
              </TouchableOpacity>
              <TextInput
                style={styles.inputTime}
                keyboardType="numeric"
                onChangeText={text => {
                  let tempData = this.state.data
                  tempData.endLocation = this.clearNoNum(text)
                  if (!isNaN(tempData.endLocation)) {
                    let number = Number(tempData.endLocation)
                    if (number > 1) {
                      tempData.endLocation = 1 + ''
                    }
                  }
                  this.setState({
                    data: tempData,
                  })
                }}
                value={this.state.data.endLocation + ''}
              />
              <TouchableOpacity
                style={styles.modifyTime}
                onPress={() => {
                  let tempData = this.state.data
                  tempData.endLocation = this.modifyNubmer(
                    this.state.data.endLocation,
                    0.1,
                  )
                  if (tempData.endLocation > 1) {
                    tempData.endLocation = 1 + ''
                  }
                  this.setState({
                    data: tempData,
                  })
                }}
              >
                <Image
                  source={require('../../../../assets/publicTheme/plot/plot_add.png')}
                  style={styles.tableItemImg}
                />
              </TouchableOpacity>
            </View>
          </View>
        }
      </View>
    )
  }

  //显隐动画
  renderShowView() {
    return (
      <View style={styles.subContainer}>
        <View style={styles.titleView}>
          <Text style={styles.textTitle}>
            {getLanguage(global.language).Map_Plotting.ANIMATION_SHOW}
          </Text>
        </View>
        <View style={styles.startTime}>
          <Text style={styles.startTimeText}>
            {getLanguage(global.language).Map_Plotting.ANIMATION_SHOW_STATE}
          </Text>
          <View style={styles.startTimeView}>
            <Switch
              // style={styles.switch}
              trackColor={{ false: color.bgG, true: color.switch }}
              // thumbColor={item.value ? color.bgW : color.bgW}
              thumbColor={color.bgW}
              // ios_backgroundColor={item.value ? color.switch : color.bgG}
              ios_backgroundColor={color.bgG}
              value={this.state.data.showState}
              onValueChange={value => {
                let tempData = this.state.data
                tempData.showState = value
                this.setState({
                  data: tempData,
                })
              }}
            />
          </View>
        </View>
        <View style={styles.lineStyle} />
        {
          <View style={styles.startTime}>
            <Text style={styles.startTimeText}>
              {getLanguage(global.language).Map_Plotting.ANIMATION_SHOW_EFFECT}
            </Text>

            <View style={styles.startTimeView}>
              <Switch
                // style={styles.switch}
                trackColor={{ false: color.bgG, true: color.switch }}
                // thumbColor={item.value ? color.bgW : color.bgW}
                thumbColor={color.bgW}
                // ios_backgroundColor={item.value ? color.switch : color.bgG}
                ios_backgroundColor={color.bgG}
                value={this.state.data.showEffect}
                onValueChange={value => {
                  let tempData = this.state.data
                  tempData.showEffect = value
                  this.setState({
                    data: tempData,
                  })
                }}
              />
            </View>
          </View>
        }
      </View>
    )
  }

  renderCommonView() {
    return (
      <View style={styles.subContainer}>
        <View style={styles.titleView}>
          <Text style={styles.textTitle}>
            {getLanguage(global.language).Map_Plotting.ANIMATION_ATTRIBUTE_STR}
          </Text>
        </View>
        <View style={styles.startTime}>
          <Text style={styles.startTimeText}>
            {getLanguage(global.language).Map_Main_Menu.ANIMATION_NODE_NAME}
          </Text>
          <View style={styles.startTimeView}>
            <TextInput
              style={styles.inputName}
              onChangeText={text => {
                let tempData = this.state.data
                tempData.name = text
                this.setState({
                  data: tempData,
                })
              }}
              value={this.state.data.name + ''}
            />
          </View>
        </View>
        <View style={styles.lineStyle} />
        <View style={styles.startTime}>
          <Text style={styles.startTimeText}>
            {
              getLanguage(global.language).Map_Plotting
                .PLOTTING_ANIMATION_START_TIME
            }
          </Text>
          <View style={styles.startTimeView}>
            <TouchableOpacity
              style={styles.modifyTime}
              onPress={() => {
                let tempData = this.state.data
                let startTime = this.modifyNubmer(this.state.data.startTime, -1)
                tempData.startTime = startTime
                this.setState({
                  data: tempData,
                })
              }}
            >
              <Image
                source={require('../../../../assets/publicTheme/plot/plot_reduce.png')}
                style={styles.tableItemImg}
              />
            </TouchableOpacity>
            <TextInput
              style={styles.inputTime}
              onChangeText={text => {
                // this.state.data.startTime=Number(text.replace(/[^0-9.]*/g, ''))+''
                let tempData = this.state.data
                tempData.startTime = this.clearNoNum(text)
                this.setState({
                  data: tempData,
                })
              }}
              keyboardType="numeric"
              value={this.state.data.startTime + ''}
            />
            <TouchableOpacity
              style={styles.modifyTime}
              onPress={() => {
                let tempData = this.state.data
                let startTime = this.modifyNubmer(this.state.data.startTime, 1)
                tempData.startTime = startTime
                this.setState({
                  data: tempData,
                })
              }}
            >
              <Image
                source={require('../../../../assets/publicTheme/plot/plot_add.png')}
                style={styles.tableItemImg}
              />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.lineStyle} />
        {
          <View style={styles.startTime}>
            <Text style={styles.startTimeText}>
              {
                getLanguage(global.language).Map_Plotting
                  .PLOTTING_ANIMATION_DURATION
              }
            </Text>

            <View style={styles.startTimeView}>
              <TouchableOpacity
                style={styles.modifyTime}
                onPress={() => {
                  let tempData = this.state.data
                  tempData.durationTime = this.modifyNubmer(
                    this.state.data.durationTime,
                    -1,
                  )
                  this.setState({
                    data: tempData,
                  })
                }}
              >
                <Image
                  source={require('../../../../assets/publicTheme/plot/plot_reduce.png')}
                  style={styles.tableItemImg}
                />
              </TouchableOpacity>
              <TextInput
                style={styles.inputTime}
                keyboardType="numeric"
                onChangeText={text => {
                  // this.state.data.durationTime=Number(text.replace(/[^0-9.]*/g, ''))+''
                  let tempData = this.state.data
                  tempData.durationTime = this.clearNoNum(text)
                  this.setState({
                    data: tempData,
                  })
                }}
                value={this.state.data.durationTime + ''}
              />
              <TouchableOpacity
                style={styles.modifyTime}
                onPress={() => {
                  let tempData = this.state.data
                  tempData.durationTime = this.modifyNubmer(
                    this.state.data.durationTime,
                    1,
                  )
                  this.setState({
                    data: tempData,
                  })
                }}
              >
                <Image
                  source={require('../../../../assets/publicTheme/plot/plot_add.png')}
                  style={styles.tableItemImg}
                />
              </TouchableOpacity>
            </View>
          </View>
        }
      </View>
    )
  }

  // 路径、闪烁、属性、显隐、旋转、比例、生长
  renderContentView() {
    // let view=[]
    // view.push(this.renderBlinkView())
    return this.state.animationType == -1 ? (
      <View />
    ) : (
      <View style={styles.container}>
        {this.renderCommonView()}
        {// this.state.animationType==0?this.renderBlinkView():
          this.state.animationType == 1 ? (
            this.renderBlinkView()
          ) : this.state.animationType == 2 ? (
            this.renderAttributeView()
          ) : this.state.animationType == 3 ? (
            this.renderShowView()
          ) : this.state.animationType == 4 ? (
            this.renderRotateView()
          ) : this.state.animationType == 5 ? (
            this.renderScaleView()
          ) : this.state.animationType == 6 ? (
            this.renderGrowView()
          ) : (
            <View />
          )}
      </View>
    )
  }

  render() {
    return (
      <Container
        ref={ref => (this.container = ref)}
        style={styles.container}
        headerProps={{
          title: this.state.headerTitle,
          backAction: this.back,
          navigation: this.props.navigation,
          headerRight: (
            <TextBtn
              btnText={this.state.btnTitle}
              textStyle={
                // this.state.isLegalName
                //   ? styles.headerBtnTitle
                //   : styles.headerBtnTitleDisable
                styles.headerBtnTitle
              }
              btnClick={this.confirm}
            />
          ),
        }}
      >
        <ScrollView
          style={styles.container}
          ref={ref => (this.scrollView = ref)}
        >
          {this.renderContentView()}
        </ScrollView>
      </Container>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //   justifyContent: 'center',
    backgroundColor: color.contentColorWhite,
  },
  subContainer: {
    // flex: 1,
    // marginTop: scaleSize(45),
    backgroundColor: color.contentColorWhite,
  },
  headerBtnTitle: {
    color: 'white',
    // width: scaleSize(150),
    // textAlign: 'right',
    fontSize: size.fontSize.fontSizeXXl,
  },
  headerBtnTitleDisable: {
    color: color.fontColorGray,
    fontSize: size.fontSize.fontSizeXXl,
  },
  input: {},
  errorView: {
    height: scaleSize(40),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: scaleSize(30),
  },
  errorInfo: {
    fontSize: size.fontSize.fontSizeSm,
    color: color.red,
    textAlign: 'left',
  },

  titleView: {
    alignContent: 'center',
    justifyContent: 'center',
    paddingLeft: scaleSize(20),
    height: scaleSize(60),
    backgroundColor: color.gray3,
  },
  textTitle: {
    // padding: scaleSize(5),
    fontSize: setSpText(24),
    // paddingLeft: scaleSize(80),
    // height: scaleSize(80),
    textAlign: 'auto',
    // backgroundColor: color.bgG,
    color: color.themeText2,
  },

  startTimeView: {
    flexDirection: 'row',
    flex: 1,
    marginRight: scaleSize(20),
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  lineStyle: {
    // flex: 1,
    backgroundColor: color.bgG,
    height: scaleSize(1.5),
    marginLeft: scaleSize(40),
    marginRight: scaleSize(40),
  },
  startTime: {
    flexDirection: 'row',
    height: scaleSize(80),
    padding: scaleSize(40),
    alignItems: 'center',
    alignSelf: 'center',
  },
  startTimeText: {
    fontSize: setSpText(20),
    height: scaleSize(30),
    color: color.themeText2,
    textAlign: 'center',
    padding: scaleSize(3),
  },
  modifyTime: {
    height: scaleSize(60),
    width: scaleSize(60),
  },
  inputTime: {
    height: scaleSize(80),
    width: scaleSize(60),
    fontSize: setSpText(20),
    textAlign: 'center',
  },
  tableItemImg: {
    height: scaleSize(60),
    width: scaleSize(60),
  },
  subImg: {
    height: scaleSize(40),
    width: scaleSize(40),
  },
  itemView: {
    flexDirection: 'row',
    height: scaleSize(80),
    // padding: scaleSize(40),
    alignItems: 'center',
    alignSelf: 'center',
  },
  rotateAngleText: {
    fontSize: setSpText(20),
    height: scaleSize(30),
    color: color.themePlaceHolder,
    textAlign: 'center',
    padding: scaleSize(3),
  },
  rotateAngleImg: {
    height: scaleSize(30),
    width: scaleSize(30),
  },
  inputName: {
    height: scaleSize(80),
    width: scaleSize(160),
    fontSize: setSpText(20),
    textAlign: 'right',
  },
  marginLiftMax: {
    marginLeft: scaleSize(50),
  },
})
