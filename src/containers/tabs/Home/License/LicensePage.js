import React, { Component } from 'react'
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Text,
  AsyncStorage,
  Platform,
} from 'react-native'
import Container from '../../../../components/Container'
import { color } from '../../../../styles'
import { getLanguage } from '../../../../language/index'
import { SMap } from 'imobile_for_reactnative'
import { scaleSize, Toast } from '../../../../utils'
import { FileTools } from '../../../../native'
import RNFS from 'react-native-fs'
import NavigationService from '../../../NavigationService'
import constants from '../../../../../src/containers/workspace/constants'
import FetchUtils from '../../../../../src/utils/FetchUtils'
import { Dialog } from '../../../../components'

export default class LicensePage extends Component {
  props: {
    navigation: Object,
  }

  constructor(props) {
    super(props)
    const { params } = this.props.navigation.state
    this.user = params && params.user
    this.state = {
      status: {},
      licenseCount: 0,
    }
  }

  componentDidMount() {
    this.getLicense()
    GLOBAL.getLicense = this.getLicense
  }

  getLicense = async () => {
    let status = await SMap.getEnvironmentStatus()
    this.setState({
      status: status,
    })
    if (status.isTrailLicense) {
      GLOBAL.modulesNumber = null
    }
    if (!status.isLicenseValid) {
      GLOBAL.LicenseValidDialog.setDialogVisible(true)
      GLOBAL.LicenseValidDialog.callback = () => {
        this.getLicense()
      }
    } else {
      GLOBAL.LicenseValidDialog.callback = null
    }
  }

  renderLicenseDialogChildren = remindStr => {
    return (
      <View style={styles.dialogHeaderView}>
        <Text style={styles.promptTtile}>
          {getLanguage(global.language).Profile.LICENSE_OFFICIAL_CLEAN}
          {/* 清除正式许可 */}
        </Text>
        <View
          style={{
            marginTop: scaleSize(30),
            width: '100%',
            height: 1,
            backgroundColor: color.item_separate_white,
          }}
        />
        <View style={styles.btnStyle}>
          <Text
            style={{
              fontSize: scaleSize(20),
              marginLeft: scaleSize(30),
              marginRight: scaleSize(30),
            }}
          >
            {remindStr}
          </Text>
        </View>
      </View>
    )
  }
  //清除正式许可时提醒许可数量
  renderDialog = () => {
    let remindStr =
      getLanguage(global.language).Profile.LICENSE_CLEAN_ALERT +
      this.state.licenseCount
    return (
      <Dialog
        ref={ref => (this.cleanDialog = ref)}
        type={'modal'}
        confirmAction={async () => {
          this.cleanDialog.setDialogVisible(false)
          await SMap.clearLocalLicense()
          this.getLicense()
        }}
        confirmBtnTitle={
          getLanguage(global.language).Profile.LICENSE_CLEAN_CONTINUE
        }
        //{'申请试用许可'}
        cancelBtnTitle={
          getLanguage(global.language).Profile.LICENSE_CLEAN_CANCLE
        }
        //{'取消清除'}
        // backgroundStyle={styles.dialogBackground}
        opacity={1}
        opacityStyle={[styles.opacityView, { height: scaleSize(340) }]}
        style={[styles.dialogBackground, { height: scaleSize(340) }]}
        cancelAction={() => {
          this.cleanDialog.setDialogVisible(false)
        }}
      >
        {this.renderLicenseDialogChildren(remindStr)}
      </Dialog>
    )
  }
  //获取许可数量
  getLicenseCount = async serialNumber => {
    GLOBAL.Loading.setLoading(true)
    let licenseCount = await SMap.getLicenseCount(serialNumber)
    this.cleanDialog.setDialogVisible(true)
    this.setState({
      licenseCount: licenseCount,
    })
    GLOBAL.Loading.setLoading(false)
  }
  //获取序列号
  getLicenseSerialNumber(cb) {
    AsyncStorage.getItem(constants.LICENSE_OFFICIAL_STORAGE_KEY)
      .then(async serialNumber => {
        if (serialNumber !== null) {
          cb(serialNumber)
        } else {
          await SMap.clearLocalLicense()
          this.getLicense()
        }
      })
      .catch(() => {})
  }

  //所含模块
  containModule = () => {
    NavigationService.navigate('LicenseModule', {
      user: this.user,
    })
  }
  //接入正式许可
  inputOfficialLicense = async () => {
    if (Platform.OS === 'ios') {
      GLOBAL.Loading.setLoading(
        true,
        global.language === 'CN' ? '许可申请中...' : 'Applying',
      )
      let activateResult = await SMap.activateNativeLicense()
      if (activateResult === -1) {
        //没有本地许可文件
        GLOBAL.noNativeLicenseDialog.setDialogVisible(true)
      } else if (activateResult === -2) {
        //本地许可文件序列号无效
        Toast.show(getLanguage(global.language).Profile.LICENSE_NATIVE_EXPIRE)
      } else {
        AsyncStorage.setItem(
          constants.LICENSE_OFFICIAL_STORAGE_KEY,
          activateResult,
        )
        let modules = await SMap.licenseContainModule(activateResult)
        let size = modules.length
        let number = 0
        for (let i = 0; i < size; i++) {
          let modultCode = Number(modules[i])
          number = number + modultCode
        }
        GLOBAL.modulesNumber = number

        this.getLicense()
        Toast.show(
          getLanguage(global.language).Profile
            .LICENSE_SERIAL_NUMBER_ACTIVATION_SUCCESS,
        )
      }
      GLOBAL.Loading.setLoading(
        false,
        global.language === 'CN' ? '许可申请中...' : 'Applying...',
      )
      return
    }

    NavigationService.navigate('LicenseJoin', {
      cb: async () => {
        NavigationService.goBack()
        this.getLicense()
        Toast.show(
          getLanguage(global.language).Profile
            .LICENSE_SERIAL_NUMBER_ACTIVATION_SUCCESS,
        )
      },
      backAction: () => {
        NavigationService.goBack()
      },
    })
  }
  //申请试用许可
  applyTrialLicense = async () => {
    GLOBAL.Loading.setLoading(
      true,
      global.language === 'CN' ? '许可申请中...' : 'Applying',
    )
    try {
      let fileCachePath = await FileTools.appendingHomeDirectory(
        '/iTablet/license/Trial_License.slm',
      )
      let bRes = await RNFS.exists(fileCachePath)
      if (bRes) {
        await RNFS.unlink(fileCachePath)
      }
      let dataUrl = undefined
      setTimeout(() => {
        if (dataUrl === undefined) {
          GLOBAL.Loading.setLoading(
            false,
            global.language === 'CN' ? '许可申请中...' : 'Applying...',
          )
          Toast.show(
            global.language === 'CN'
              ? '许可申请失败,请检查网络连接'
              : 'License application failed.Please check the network connection',
          )
        }
      }, 10000)
      dataUrl = await FetchUtils.getFindUserDataUrl(
        'xiezhiyan123',
        'Trial_License',
        '.geojson',
      )
      let downloadOptions = {
        fromUrl: dataUrl,
        toFile: fileCachePath,
        background: true,
        fileName: 'Trial_License.slm',
        progressDivider: 1,
      }

      const ret = RNFS.downloadFile(downloadOptions)

      ret.promise.then(async () => {
        GLOBAL.Loading.setLoading(
          false,
          global.language === 'CN' ? '许可申请中...' : 'Applying',
        )
        this.getLicense()
        Toast.show(global.language === 'CN' ? '试用成功' : 'Successful trial')
      })
    } catch (e) {
      GLOBAL.Loading.setLoading(
        false,
        global.language === 'CN' ? '许可申请中...' : 'Applying',
      )
      Toast.show(
        global.language === 'CN'
          ? '许可申请失败,请检查网络连接'
          : 'License application failed.Please check the network connection',
      )
    }
  }

  renderItemView(label, isText, action) {
    return (
      <View style={{ width: '100%', backgroundColor: color.content_white }}>
        <View
          style={{
            width: '100%',
            height: scaleSize(80),
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Text style={{ fontSize: scaleSize(20), marginLeft: 30 }}>
            {label}
          </Text>
          {isText ? (
            <Text
              style={{
                fontSize: scaleSize(20),
                marginRight: 15,
                color: color.gray2,
              }}
            >
              {action}
            </Text>
          ) : (
            <TouchableOpacity
              style={{ marginRight: 15, alignItems: 'center' }}
              onPress={action}
            >
              <Image
                source={require('../../../../assets/Mine/mine_my_arrow.png')}
                style={{ height: scaleSize(28), width: scaleSize(28) }}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>
    )
  }
  renderTouchableItemView(label, action) {
    return (
      <TouchableOpacity
        style={{ width: '100%', backgroundColor: color.content_white }}
        onPress={action}
      >
        <View
          style={{
            width: '100%',
            height: scaleSize(80),
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Text style={{ fontSize: scaleSize(20), marginLeft: 30 }}>
            {label}
          </Text>
          <View style={{ marginRight: 15, alignItems: 'center' }}>
            <Image
              source={require('../../../../assets/Mine/mine_my_arrow.png')}
              style={{ height: scaleSize(28), width: scaleSize(28) }}
            />
          </View>
        </View>
      </TouchableOpacity>
    )
  }

  renderContent() {
    let licenseType = this.state.status.isTrailLicense
      ? getLanguage(global.language).Profile.LICENSE_TRIAL
      : getLanguage(global.language).Profile.LICENSE_OFFICIAL

    let days = 0
    if (this.state.status.expireDate) {
      let timeStr = ''
      timeStr = this.state.status.expireDate
      let tempTimeStr =
        timeStr.slice(0, 4) + '-' + timeStr.slice(4, 6) + '-' + timeStr.slice(6)
      let date1 = new Date()
      let date2 = new Date(tempTimeStr)
      days = parseInt(
        (date2.getTime() - date1.getTime()) / (1000 * 60 * 60 * 24),
      )
    }
    let daysStr =
      getLanguage(global.language).Profile.LICENSE_SURPLUS +
      days +
      getLanguage(global.language).Profile.LICENSE_DAY
    return (
      <View style={{ flex: 1, backgroundColor: color.background }}>
        {/* <Text>
          {JSON.stringify(this.state.status)}
        </Text> */}
        <View style={{ height: 20 }} />

        <View style={styles.item}>
          <Text style={styles.title}>
            {getLanguage(global.language).Profile.LICENSE_CURRENT}
          </Text>
        </View>
        <View style={styles.separateLine} />

        {this.renderItemView(
          getLanguage(global.language).Profile.LICENSE_TYPE,
          true,
          licenseType,
        )}
        {this.renderItemView(
          getLanguage(global.language).Profile.LICENSE_STATE,
          true,
          daysStr,
        )}
        {this.state.status.isTrailLicense ? (
          <View />
        ) : (
          this.renderTouchableItemView(
            getLanguage(global.language).Profile.LICENSE_CONTAIN_MODULE,
            this.containModule,
          )
        )}
        <View style={{ height: 10 }} />
        {this.state.status.isTrailLicense ? (
          this.renderTouchableItemView(
            getLanguage(global.language).Profile.LICENSE_OFFICIAL_INPUT,
            this.inputOfficialLicense,
          )
        ) : (
          <View />
        )}
        {this.state.status.isTrailLicense ? (
          <View style={styles.separateLine} />
        ) : (
          <View />
        )}
        {this.state.status.isTrailLicense ? (
          this.renderTouchableItemView(
            getLanguage(global.language).Profile.LICENSE_TRIAL_APPLY,
            this.applyTrialLicense,
          )
        ) : (
          <View />
        )}
        <View style={{ height: 10 }} />

        {this.state.status.isTrailLicense ? (
          <View />
        ) : (
          <TouchableOpacity
            style={{
              width: '100%',
              height: scaleSize(80),
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: color.content_white,
            }}
            onPress={() => this.getLicenseSerialNumber(this.getLicenseCount)}
          >
            <Text style={{ fontSize: scaleSize(24), color: color.red }}>
              {getLanguage(global.language).Profile.LICENSE_OFFICIAL_CLEAN}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    )
  }
  render() {
    return (
      <View style={{ flex: 1 }}>
        <Container
          headerProps={{
            title: getLanguage(global.language).Profile.SETTING_LICENSE,
            //'许可',
            navigation: this.props.navigation,
          }}
        >
          {this.renderContent()}
          {this.renderDialog()}
        </Container>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //   flexDirection: 'column',
    backgroundColor: color.bgW,
  },

  item: {
    width: '100%',
    height: scaleSize(80),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: color.content_white,
  },
  title: {
    fontSize: scaleSize(24),
    marginLeft: 15,
  },
  subTitle: {
    fontSize: scaleSize(20),
    marginLeft: 15,
  },
  separateLine: {
    width: '100%',
    height: scaleSize(1),
    backgroundColor: color.item_separate_white,
  },
  dialogHeaderView: {
    paddingTop: scaleSize(30),
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
  },
  promptTtile: {
    fontSize: scaleSize(24),
    color: color.theme_white,
    marginTop: scaleSize(5),
    marginLeft: scaleSize(10),
    marginRight: scaleSize(10),
    textAlign: 'center',
  },
  btnStyle: {
    height: scaleSize(100),
    flexDirection: 'column',
    justifyContent: 'center',
    flex: 1,
    alignItems: 'center',
  },
})
