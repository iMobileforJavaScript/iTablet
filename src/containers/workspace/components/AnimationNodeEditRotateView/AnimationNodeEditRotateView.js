import * as React from 'react'
import { View, StyleSheet, TextInput, Text, ScrollView } from 'react-native'
import { Container, TextBtn } from '../../../../components'
import { color, size } from '../../../../styles'
import { getLanguage } from '../../../../language'
import { scaleSize, setSpText } from '../../../../utils'
export default class AnimationNodeEditRotateView extends React.Component {
  props: {
    navigation: Object,
    data: Object,
    language: string,
  }

  constructor(props) {
    super(props)
    const { params } = this.props.navigation.state
    this.cb = params && params.cb
    this.backcb = params && params.backcb
    this.clickAble = true // 防止重复点击

    let index = params && params.index
    this.state = {
      index: index,
      data: params.data,

      btnTitle:
        params && params.btnTitle
          ? params.btnTitle
          : getLanguage(global.language).Prompt.CONFIRM, //'确定',
      headerTitle:
        params && params.headerTitle !== undefined ? params.headerTitle : '',
    }
  }

  confirm = async () => {
    // if (this.clickAble && this.state.isLegalName) {
    //   this.clickAble = false
    //   this.input && this.input.blur()
    //   this.cb && this.cb(this.state.value)
    //   setTimeout(() => {
    //     this.clickAble = true
    //   }, 1500)
    // }

    if (this.clickAble) {
      this.clickAble = false
      this.cb && this.cb(this.state.data)
      setTimeout(() => {
        this.clickAble = true
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

  modifyNubmer = (oldNum, offset) => {
    let tempNum = Number(oldNum) + offset
    if (tempNum < 0) {
      tempNum = 0
    }
    return tempNum
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
    }
    return value
  }

  //选择动画角度
  renderRotateView() {
    return (
      <View style={styles.subContainer}>
        <View style={styles.startTime}>
          <Text style={styles.startTimeText}>{'X'}</Text>
          <View style={styles.startTimeView}>
            <TextInput
              style={styles.inputTime}
              onChangeText={text => {
                // this.state.data.x = this.clearNoNum(text)
                let tempData = this.state.data
                tempData.x = this.clearNoNum(text)
                this.setState({
                  data: tempData,
                })
              }}
              keyboardType="numeric"
              value={this.state.data.x + ''}
            />
          </View>
        </View>
        <View style={styles.lineStyle} />
        {
          <View style={styles.startTime}>
            <Text style={styles.startTimeText}>{'Y'}</Text>

            <View style={styles.startTimeView}>
              <TextInput
                style={styles.inputTime}
                keyboardType="numeric"
                onChangeText={text => {
                  let tempData = this.state.data
                  tempData.y = this.clearNoNum(text)
                  this.setState({
                    data: tempData,
                  })
                }}
                value={this.state.data.y + ''}
              />
            </View>
          </View>
        }
      </View>
    )
  }

  // 路径、闪烁、属性、显隐、旋转、比例、生长
  renderContentView() {
    return <View style={styles.container}>{this.renderRotateView()}</View>
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
              textStyle={styles.headerBtnTitle}
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
    width: scaleSize(160),
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
})
