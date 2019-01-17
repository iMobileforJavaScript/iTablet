import React, { Component } from 'react'
import { WebView, View, Dimensions } from 'react-native'
import { Container } from '../../../../components'
import Toast from '../../../../utils/Toast'
export default class AboutITablet extends Component {
  props: {
    navigation: Object,
  }
  constructor(props) {
    super(props)
    this.state = {
      progressWidth: 100,
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
    this.progressViewWidth = this.state.progressWidth
    this.objProgressWidth = setInterval(() => {
      //  帧动画
      requestAnimationFrame(() => {
        let screenWidth = Dimensions.get('window').width
        if (this.progressViewRef) {
          let prevProgressWidth = this.progressViewWidth
          let currentPorWidth
          if (prevProgressWidth >= screenWidth - 300) {
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
      })
    }, 100)
  }
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
          // /**ios*/
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
        />
      </Container>
    )
  }
}
