// import * as React from 'react'
// import { View, Text } from 'react-native'

// export default class AnimationNodeEditView extends React.Component {
//   props: {
//     navigation: Object,
//     nav: Object,
//     language: string,
//   }

//   constructor(props) {
//     super(props)
//   }

//   render() {
//     return (
//       <View></View>
//     )
//   }
// }

import * as React from 'react'
// import { View, Text,StyleSheet, View,
//     TouchableOpacity,
//     TextInput,
//     Image,} from 'react-native'
import {
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
  Text,
} from 'react-native'
import { Container, TextBtn } from '../../../../components'
import { color, size } from '../../../../styles'
import { getLanguage } from '../../../../language'
import { scaleSize, setSpText } from '../../../../utils'

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
    let defaultValue = params && params.value !== undefined ? params.value : ''
    this.state = {
      value: defaultValue,
      placeholder:
        params && params.placeholder !== undefined ? params.placeholder : '',
      headerTitle:
        params && params.headerTitle !== undefined ? params.headerTitle : '',
      btnTitle:
        params && params.btnTitle
          ? params.btnTitle
          : getLanguage(global.language).Prompt.CONFIRM, //'确定',
      keyboardType:
        params && params.keyboardType ? params.keyboardType : 'default',
      isLegalName: !!defaultValue,
      errorInfo: '',
    }
    this.clickAble = true // 防止重复点击
  }

  confirm = () => {
    if (this.clickAble && this.state.isLegalName) {
      this.clickAble = false
      this.input && this.input.blur()
      this.cb && this.cb(this.state.value)
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

  renderBlinkView() {
    return (
      <View style={styles.container}>
        <View style={styles.titleView}>
          <Text style={styles.textTitle}>
            {getLanguage(global.language).Map_Plotting.ANIMATION_ATTRIBUTE}
          </Text>
        </View>
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
              // onPress={this.subStartTime}
            >
              <Image
                source={require('../../../../assets/publicTheme/plot/plot_reduce.png')}
                style={styles.tableItemImg}
              />
            </TouchableOpacity>
            <TextInput
              style={styles.inputTime}
              // onChangeText={text => {
              // this.setState({
              //     startTime: Number(text.replace(/[^0-9.]*/g, '')),
              // })
              // }}
              keyboardType="numeric"
              value={this.state.startTime + ''}
            />
            <TouchableOpacity
              style={styles.modifyTime}
              // onPress={this.addStartTime}
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
                // onPress={this.subDurationTime}
              >
                <Image
                  source={require('../../../../assets/publicTheme/plot/plot_reduce.png')}
                  style={styles.tableItemImg}
                />
              </TouchableOpacity>
              <TextInput
                style={styles.inputTime}
                keyboardType="numeric"
                // onChangeText={text => {
                //   // this.setState({
                //   //     durationTime: Number(text.replace(/[^0-9.]*/g, '')),
                //   // })
                // }}
                value={this.state.durationTime + ''}
              />
              <TouchableOpacity
                style={styles.modifyTime}
                // onPress={this.addDurationTime}
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

  //   renderContentView() {
  //     return (
  //       <View style={styles.container}>
  //         <View style={styles.titleView}>
  //           <Text style={styles.textTitle}>
  //             {getLanguage(global.language).Map_Plotting.ANIMATION_ATTRIBUTE}
  //           </Text>
  //         </View>
  //         <View style={styles.startTime}>
  //           <Text style={styles.startTimeText}>
  //             {
  //               getLanguage(global.language).Map_Plotting
  //                 .PLOTTING_ANIMATION_START_TIME
  //             }
  //           </Text>
  //           <View style={styles.startTimeView}>
  //             <TouchableOpacity
  //               style={styles.modifyTime}
  //               // onPress={this.subStartTime}
  //             >
  //               <Image
  //                 source={require('../../../../assets/publicTheme/plot/plot_reduce.png')}
  //                 style={styles.tableItemImg}
  //               />
  //             </TouchableOpacity>
  //             <TextInput
  //               style={styles.inputTime}
  //               // onChangeText={text => {
  //               // this.setState({
  //               //     startTime: Number(text.replace(/[^0-9.]*/g, '')),
  //               // })
  //               // }}
  //               keyboardType="numeric"
  //               value={this.state.startTime + ''}
  //             />
  //             <TouchableOpacity
  //               style={styles.modifyTime}
  //               // onPress={this.addStartTime}
  //             >
  //               <Image
  //                 source={require('../../../../assets/publicTheme/plot/plot_add.png')}
  //                 style={styles.tableItemImg}
  //               />
  //             </TouchableOpacity>
  //           </View>
  //         </View>
  //         <View style={styles.lineStyle} />
  //         {
  //           <View style={styles.startTime}>
  //             <Text style={styles.startTimeText}>
  //               {
  //                 getLanguage(global.language).Map_Plotting
  //                   .PLOTTING_ANIMATION_DURATION
  //               }
  //             </Text>

  //             <View style={styles.startTimeView}>
  //               <TouchableOpacity
  //                 style={styles.modifyTime}
  //                 // onPress={this.subDurationTime}
  //               >
  //                 <Image
  //                   source={require('../../../../assets/publicTheme/plot/plot_reduce.png')}
  //                   style={styles.tableItemImg}
  //                 />
  //               </TouchableOpacity>
  //               <TextInput
  //                 style={styles.inputTime}
  //                 keyboardType="numeric"
  //                 // onChangeText={text => {
  //                 //   // this.setState({
  //                 //   //     durationTime: Number(text.replace(/[^0-9.]*/g, '')),
  //                 //   // })
  //                 // }}
  //                 value={this.state.durationTime + ''}
  //               />
  //               <TouchableOpacity
  //                 style={styles.modifyTime}
  //                 // onPress={this.addDurationTime}
  //               >
  //                 <Image
  //                   source={require('../../../../assets/publicTheme/plot/plot_add.png')}
  //                   style={styles.tableItemImg}
  //                 />
  //               </TouchableOpacity>
  //             </View>
  //           </View>
  //         }
  //       </View>
  //     )
  //   }

  renderContentView() {
    return (
      <View style={styles.container}>
        <View style={styles.titleView}>
          <Text style={styles.textTitle}>
            {getLanguage(global.language).Map_Plotting.ANIMATION_ATTRIBUTE}
          </Text>
        </View>
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
              // onPress={this.subStartTime}
            >
              <Image
                source={require('../../../../assets/publicTheme/plot/plot_reduce.png')}
                style={styles.tableItemImg}
              />
            </TouchableOpacity>
            <TextInput
              style={styles.inputTime}
              // onChangeText={text => {
              // this.setState({
              //     startTime: Number(text.replace(/[^0-9.]*/g, '')),
              // })
              // }}
              keyboardType="numeric"
              value={this.state.startTime + ''}
            />
            <TouchableOpacity
              style={styles.modifyTime}
              // onPress={this.addStartTime}
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
                // onPress={this.subDurationTime}
              >
                <Image
                  source={require('../../../../assets/publicTheme/plot/plot_reduce.png')}
                  style={styles.tableItemImg}
                />
              </TouchableOpacity>
              <TextInput
                style={styles.inputTime}
                keyboardType="numeric"
                // onChangeText={text => {
                //   // this.setState({
                //   //     durationTime: Number(text.replace(/[^0-9.]*/g, '')),
                //   // })
                // }}
                value={this.state.durationTime + ''}
              />
              <TouchableOpacity
                style={styles.modifyTime}
                // onPress={this.addDurationTime}
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
                this.state.isLegalName
                  ? styles.headerBtnTitle
                  : styles.headerBtnTitleDisable
              }
              btnClick={this.confirm}
            />
          ),
        }}
      >
        {this.renderContentView()}

        {/* <View style={styles.subContainer}>
          <Input
            ref={ref => (this.input = ref)}
            accessible={true}
            accessibilityLabel={'输入框'}
            inputStyle={styles.input}
            placeholder={this.state.placeholder}
            placeholderTextColor={color.themePlaceHolder}
            value={this.state.value + ''}
            onChangeText={text => {
              if (this.state.keyboardType === 'numeric') {
                this.setState({
                  value: text,
                  isLegalName:
                    text !== '' && !isNaN(text) && text !== undefined,
                })
              } else {
                let { result, error } = dataUtil.isLegalName(
                  text,
                  this.props.language,
                )
                this.setState({
                  isLegalName: result,
                  errorInfo: error,
                  value: text,
                })
              }
            }}
            onClear={() => {
              let { result, error } = dataUtil.isLegalName(
                '',
                this.props.language,
              )
              this.setState({
                isLegalName: result,
                errorInfo: error,
                value: '',
              })
            }}
            returnKeyType={'done'}
            keyboardType={this.state.keyboardType}
            showClear
          />
          {!this.state.isLegalName && !!this.state.errorInfo && (
            <View style={styles.errorView}>
              <Text style={styles.errorInfo}>{this.state.errorInfo}</Text>
            </View>
          )}
        </View> */}
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
    flex: 1,
    marginTop: scaleSize(45),
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
})
