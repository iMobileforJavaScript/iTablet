import React, { Component } from 'react'
import {
  WebView,
  View,
  Dimensions,
  Platform,
  UIManager,
  LayoutAnimation,
} from 'react-native'
import { Container } from '../../../../components'
import Toast from '../../../../utils/Toast'
export default class AboutITablet extends Component {
  props: {
    navigation: Object,
  }
  constructor(props) {
    super(props)
    this.state = {
      progressWidth: Dimensions.get('window').width * 0.4,
    }
    if (Platform.OS === 'android') {
      UIManager.setLayoutAnimationEnabledExperimental &&
        UIManager.setLayoutAnimationEnabledExperimental(true)
    }
  }
  _renderLoading = () => {
    return (
      <View style={{ flex: 1, backgroundColor: 'white' }}>
        <View
          ref={ref => (this.progressViewRef = ref)}
          style={{
            height: 2,
            width: this.state.progressWidth,
            backgroundColor: '#1c84c0',
          }}
        />
      </View>
    )
  }
  _onLoadStart = () => {
    LayoutAnimation.configureNext({
      duration: 150,
      create: {
        type: LayoutAnimation.Types.linear,
        property: LayoutAnimation.Properties.scaleX,
      },
      update: {
        type: LayoutAnimation.Types.linear,
      },
    })
    this.progressViewWidth = this.state.progressWidth
    let screenWidth = Dimensions.get('window').width
    this.objProgressWidth = setInterval(() => {
      if (this.progressViewRef) {
        let prevProgressWidth = this.progressViewWidth
        let currentPorWidth
        if (prevProgressWidth >= screenWidth - 250) {
          currentPorWidth = prevProgressWidth + 1
          if (currentPorWidth >= screenWidth - 50) {
            currentPorWidth = screenWidth - 50
            this.progressViewWidth = currentPorWidth
            return
          }
        } else {
          currentPorWidth = prevProgressWidth * 1.01
        }
        this.progressViewWidth = currentPorWidth
        this.progressViewRef.setNativeProps({
          style: {
            height: 2,
            width: currentPorWidth,
            backgroundColor: '#1c84c0',
            borderBottomRightRadius: 1,
            borderTopRightRadius: 1,
            borderBottomLeftRadius: 0,
            borderTopLeftRadius: 0,
          },
        })
      }
    }, 150)
  }
  // _onLoadStart = () => {
  //   this.progressViewWidth = this.state.progressWidth
  //   this.objProgressWidth = setInterval(() => {
  //
  //     LayoutAnimation.configureNext({
  //       duration:200,
  //       create:{
  //         type:LayoutAnimation.Types.spring,
  //         property:LayoutAnimation.Properties.scaleXY,
  //       },
  //       update:{
  //         type:LayoutAnimation.Types.spring,
  //       },
  //     })
  //     if (this.progressViewRef) {
  //       let currentPorWidth = this.progressViewWidth + 10
  //       this.progressViewWidth = currentPorWidth
  //       this.progressViewRef.setNativeProps({
  //         style: {
  //           height: 20,
  //           width: currentPorWidth,
  //           backgroundColor: '#1c84c0',
  //           borderBottomRightRadius: 1,
  //           borderTopRightRadius: 1,
  //           borderBottomLeftRadius: 0,
  //           borderTopLeftRadius: 0,
  //         },
  //       })
  //     }
  //   }, 200)
  // }
  // _onLoadStart = () => {
  //   this.progressViewWidth = this.state.progressWidth
  //   this.objProgressWidth = setInterval(() => {
  //     //  帧动画
  //     requestAnimationFrame(() => {
  //       if (this.progressViewRef) {
  //         let currentPorWidth = this.progressViewWidth + 20
  //         this.progressViewWidth = currentPorWidth
  //         this.progressViewRef.setNativeProps({
  //           style: {
  //             height: 20,
  //             width: currentPorWidth,
  //             backgroundColor: '#1c84c0',
  //             borderBottomRightRadius: 1,
  //             borderTopRightRadius: 1,
  //             borderBottomLeftRadius: 0,
  //             borderTopLeftRadius: 0,
  //           },
  //         })
  //       }
  //     })
  //   }, 200)
  // }
  render() {
    // return <View style={{flex:1}}>
    //   <View style={{width:'100%',height:20,backgroundColor:'red'}}/>
    //   <WebView
    //     style={{ flex: 1, paddingTop: 0 }}
    //     // source={{uri:'https://sso.supermap.com/agreement.html?service=http://www.supermapol.com'}}
    //     source={require('./LegalStatement.html')}
    //     automaticallyAdjustContentInsets={true}
    //     scalesPageToFit={true}
    //     startInLoadingState={true}
    //     renderLoading={this._renderLoading}
    //     /**ios*/
    //     contentInset={{ top: 0, left: 0, bottom: 0, right: 0 }}
    //     /**android*/
    //     javaScriptEnabled={true}
    //     domStorageEnabled={true}
    //     mixedContentMode={'always'}
    //     thirdPartyCookiesEnabled={true}
    //     allowFileAccess={true}
    //     allowUniversalAccessFromFileURLs={true}
    //     onError={() => {
    //       Toast.show('加载失败')
    //     }}
    //     onLoadStart={this._onLoadStart}
    //     onLoadEnd={() => {
    //       // this.setState({isLoadingEnd:true,headerType:''})
    //       if (this.objProgressWidth !== undefined) {
    //         clearInterval(this.objProgressWidth)
    //       }
    //     }}
    //   />
    // </View>

    return (
      <Container
        headerProps={{
          title: '关于iTablet',
          navigation: this.props.navigation,
        }}
      >
        <WebView
          style={{ flex: 1, paddingTop: 0 }}
          // source={{uri:'https://sso.supermap.com/agreement.html?service=http://www.supermapol.com'}}
          source={require('./LegalStatement.html')}
          automaticallyAdjustContentInsets={true}
          scalesPageToFit={true}
          startInLoadingState={true}
          renderLoading={this._renderLoading}
          /**ios*/
          contentInset={{ top: 0, left: 0, bottom: 0, right: 0 }}
          /**android*/
          javaScriptEnabled={true}
          domStorageEnabled={true}
          mixedContentMode={'always'}
          thirdPartyCookiesEnabled={true}
          allowFileAccess={true}
          allowUniversalAccessFromFileURLs={true}
          onError={() => {
            Toast.show('加载失败')
          }}
          onLoadStart={this._onLoadStart}
          onLoadEnd={() => {
            // this.setState({isLoadingEnd:true,headerType:''})
            if (this.objProgressWidth !== undefined) {
              clearInterval(this.objProgressWidth)
            }
          }}
        />
      </Container>
    )
  }
}
