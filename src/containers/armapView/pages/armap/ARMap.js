import React, { Component } from 'react'
import { Container, MTBtn } from '../../../../components'
import { MapToolbar } from '../../../workspace/components'
import constants from '../../../workspace/constants'
import styles from './styles'
import analystData from './ARMapData'
import { getLanguage } from '../../../../language'
// eslint-disable-next-line
// import { SMDynamicArrowView } from 'imobile_for_reactnative'
import { SMAIDetectView } from 'imobile_for_reactnative'
import { SAIDetectView } from 'imobile_for_reactnative'
// import { RNCamera } from 'react-native-camera'
import { getPublicAssets } from '../../../../assets'
import { scaleSize } from '../../../../utils'

export default class ARMap extends Component {
  props: {
    navigation: Object,
    data: Array,
    setSettingData: () => {},
    settingData: any,
    device: Object,
    language: String,
  }

  constructor(props) {
    super(props)
    this.state = {
      data: analystData.getData(this.props.language),
    }
  }

  componentDidMount() {
    SAIDetectView.startDetect()
  }

  componentDidUpdate(prevProps) {
    if (prevProps.language !== this.props.language) {
      this.setState({
        data: analystData.getData(this.props.language),
      })
    }
  }

  goToMapView = () => {
    this.props.navigation && this.props.navigation.navigate('ARMap')
  }

  onPressLearnMore = () => {
    SAIDetectView.startDetect()
  }

  renderToolBar = () => {
    return (
      <MapToolbar navigation={this.props.navigation} type={constants.MAP_AR} />
    )
  }

  /** 功能工具栏（右侧） **/
  // renderFunctionToolbar = () => {
  //   return (
  //     <FunctionToolbar
  //       language={this.props.language}
  //       ref={ref => (this.functionToolbar = ref)}
  //       style={styles.functionToolbar}
  //       type={this.type}
  //       device={this.props.device}
  //     />
  //   )
  // }

  render() {
    return (
      <Container
        ref={ref => (this.container = ref)}
        headerProps={{
          title: getLanguage(this.props.language).Map_Module.MAP_AR,
          navigation: this.props.navigation,
          // headerRight: this.renderHeaderBtns(),
          backAction: this.back,
          type: 'fix',
          headerRight: !this.isExample
            ? [
              <MTBtn
                key={'undo'}
                image={getPublicAssets().common.icon_search}
                imageStyle={[
                  styles.headerBtn,
                  { marginRight: scaleSize(15) },
                ]}
                onPress={this.onPressLearnMore}
              />,
            ]
            : null,
        }}
        bottomBar={!this.isExample && this.renderToolBar()}
        bottomProps={{ type: 'fix' }}
      >
        {/* <RNCamera
          style={styles.preview}
          type={RNCamera.Constants.Type.back}
          flashMode={RNCamera.Constants.FlashMode.on}
          androidCameraPermissionOptions={{
            title: 'Permission to use camera',
            message: 'We need your permission to use your camera',
            buttonPositive: 'Ok',
            buttonNegative: 'Cancel',
          }}
          androidRecordAudioPermissionOptions={{
            title: 'Permission to use audio recording',
            message: 'We need your permission to use your audio',
            buttonPositive: 'Ok',
            buttonNegative: 'Cancel',
          }}
        >
          {({ camera, status }) => {
            // recordAudioPermissionStatus
            if (status === 'READY') this.camera = camera
          }}
        </RNCamera>*/}
        {/* {<SMDynamicArrowView ref={ref => (GLOBAL.DynamicArrowView = ref)} />}*/}
        {<SMAIDetectView ref={ref => (GLOBAL.SMAIDetectView = ref)} />}
        {/*{!this.isExample && this.renderFunctionToolbar()}*/}
      </Container>
    )
  }
}
