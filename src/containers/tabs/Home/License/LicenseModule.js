import React, { Component } from 'react'
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  AsyncStorage,
  Platform,
} from 'react-native'
import { Container, Button } from '../../../../components'
import { color } from '../../../../styles'
import { getLanguage } from '../../../../language/index'
import { SMap } from 'imobile_for_reactnative'
import constants from '../../../../../src/containers/workspace/constants'
import { scaleSize, Toast } from '../../../../utils'

var LICENSE_MODULE_REGISTER = 'LICENSE_MODULE_REGISTER'

export default class LicenseModule extends Component {
  props: {
    navigation: Object,
  }

  constructor(props) {
    super(props)
    const { params } = this.props.navigation.state
    this.user = params && params.user
    this.state = {
      modules: [],
      modulesNumber: 0,
      allModules: [],
      allAPPModules: [],
      licenseModuleRegisterNumber: 0,
    }
    AsyncStorage.getItem(LICENSE_MODULE_REGISTER)
      .then(value => {
        if (value !== null) {
          let licenseModuleRegisterNumber = value
          this.setState({
            licenseModuleRegisterNumber: licenseModuleRegisterNumber,
          })
        }
      })
      .catch(() => {})
    AsyncStorage.getItem(constants.LICENSE_OFFICIAL_STORAGE_KEY)
      .then(value => {
        if (value !== null) {
          this.getModules(value)
        }
      })
      .catch(() => {})
  }

  componentDidMount() {
    this.initItabletAllModules()
  }

  getModules = async serialNumber => {
    GLOBAL.Loading.setLoading(true, getLanguage(global.language).Prompt.LOADING)
    let modules = await SMap.licenseContainModule(serialNumber)
    let size = modules.length
    let number = 0
    for (let i = 0; i < size; i++) {
      if (!modules[i] || modules[i] === '') {
        continue
      }
      let modultCode = Number(modules[i])
      number = number + modultCode
      modules[i] = modultCode
    }
    let allAPPModules = this.initAllAPPModules()
    let allModules = this.initItabletAllModules()
    GLOBAL.Loading.setLoading(false)
    this.setState({
      modules: modules,
      modulesNumber: number,
      allModules: allModules,
      allAPPModules: allAPPModules,
    })
    GLOBAL.Loading.setLoading(false)
  }

  initAllModules = () => {
    let allModules = []
    allModules.push(getLanguage(global.language).Profile.Core_Dev)
    allModules.push(getLanguage(global.language).Profile.Core_Runtime)
    allModules.push(getLanguage(global.language).Profile.Navigation_Dev)
    allModules.push(getLanguage(global.language).Profile.Navigation_Runtime)
    allModules.push(getLanguage(global.language).Profile.Realspace_Dev)
    allModules.push(getLanguage(global.language).Profile.Realspace_Runtime)
    allModules.push(getLanguage(global.language).Profile.Plot_Dev)
    allModules.push(getLanguage(global.language).Profile.Plot_Runtime)
    allModules.push(
      getLanguage(global.language).Profile.Industry_Navigation_Dev,
    )
    allModules.push(
      getLanguage(global.language).Profile.Industry_Navigation_Runtime,
    )
    allModules.push(getLanguage(global.language).Profile.Indoor_Navigation_Dev)
    allModules.push(
      getLanguage(global.language).Profile.Indoor_Navigation_Runtime,
    )
    allModules.push(getLanguage(global.language).Profile.Plot3D_Dev)
    allModules.push(getLanguage(global.language).Profile.Plot3D_Runtime)
    allModules.push(getLanguage(global.language).Profile.Realspace_Analyst_Dev)
    allModules.push(
      getLanguage(global.language).Profile.Realspace_Analyst_Runtime,
    )
    allModules.push(getLanguage(global.language).Profile.Realspace_Effect_Dev)
    allModules.push(
      getLanguage(global.language).Profile.Realspace_Effect_Runtime,
    )
    return allModules
  }

  initItabletAllModules = () => {
    let allModules = []
    allModules.push(
      getLanguage(global.language).Profile.LICENSE_EDITION_STANDARD,
    )
    allModules.push(
      getLanguage(global.language).Profile.LICENSE_EDITION_PROFESSIONAL,
    )
    allModules.push(
      getLanguage(global.language).Profile.LICENSE_EDITION_ADVANCED,
    )
    allModules.push(getLanguage(global.language).Profile.ITABLET_ARMAP)
    allModules.push(getLanguage(global.language).Profile.ITABLET_NAVIGATIONMAP)
    allModules.push(getLanguage(global.language).Profile.ITABLET_DATAANALYSIS)
    allModules.push(getLanguage(global.language).Profile.ITABLET_PLOTTING)
    return allModules
  }

  initAllAPPModules = () => {
    let allAPPModules = []
    allAPPModules.push([18001, 19001])
    allAPPModules.push([18002, 19002])
    allAPPModules.push([18003, 19003])
    allAPPModules.push([18004, 19004])
    allAPPModules.push([18005, 19005])
    allAPPModules.push([18006, 19006])
    allAPPModules.push([18007, 19007])

    return allAPPModules
  }

  //购买登记
  registerModule = async moduleCode => {
    let userName = this.user.currentUser.userName
    if (userName === 'Customer') {
      Toast.show('请先登录后再登记购买')
      return
    }
    let result = await SMap.licenseBuyRegister(moduleCode, userName)
    if (result) {
      Toast.show(
        getLanguage(global.language).Profile.LICENSE_MODULE_REGISTER_SUCCESS,
      )
      let licenseModuleRegisterNumber = this.state.licenseModuleRegisterNumber
      let offset = 1 << moduleCode % 100
      licenseModuleRegisterNumber = licenseModuleRegisterNumber | offset
      AsyncStorage.setItem(
        LICENSE_MODULE_REGISTER,
        licenseModuleRegisterNumber + '',
      )
      this.setState({
        licenseModuleRegisterNumber: licenseModuleRegisterNumber,
      })
    } else {
      Toast.show(
        getLanguage(global.language).Profile.LICENSE_MODULE_REGISTER_FAIL,
      )
    }
  }

  renderNotContainModuleItemView(index) {
    let label = this.state.allModules[index]
    let havaRegister =
      ((this.state.licenseModuleRegisterNumber >> index) & 1) === 1
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
          {havaRegister ? (
            <Button
              title={getLanguage(global.language).Profile.LICENSE_HAVE_REGISTER}
              style={{
                width: scaleSize(100),
                height: scaleSize(40),
                fontSize: scaleSize(17),
                marginRight: 15,
                alignItems: 'center',
              }}
              titleStyle={{
                width: scaleSize(100),
                fontSize: scaleSize(17),
              }}
              type={Button.Type.GRAY}
            />
          ) : (
            <Button
              title={getLanguage(global.language).Profile.LICENSE_REGISTER_BUY}
              style={{
                width: scaleSize(100),
                height: scaleSize(40),
                fontSize: scaleSize(17),
                marginRight: 15,
                alignItems: 'center',
              }}
              titleStyle={{
                width: scaleSize(100),
                fontSize: scaleSize(17),
              }}
              onPress={() => {
                this.registerModule(index)
              }}
            />
          )}
        </View>
        <View style={styles.separateLine} />
      </View>
    )
  }

  renderContainModuleItemView(index) {
    let label = this.state.allModules[index]
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
        </View>
        <View style={styles.separateLine} />
      </View>
    )
  }

  renderLicenseEditionItemView(moduleCode, index) {
    let position = Platform.OS === 'ios' ? 0 : 1
    let label = this.state.allModules[index]
    let currentEdition =
      moduleCode === this.state.allAPPModules[index][position]
        ? getLanguage(global.language).Profile.LICENSE_EDITION_CURRENT
        : null
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
          {currentEdition ? (
            <Text style={{ fontSize: scaleSize(20), marginRight: 15 }}>
              {currentEdition}
            </Text>
          ) : null}
        </View>
        <View style={styles.separateLine} />
      </View>
    )
  }

  renderLicenseEdition() {
    let position = Platform.OS === 'ios' ? 0 : 1
    let rows = []
    for (let index = 0; index < this.state.modules.length; index++) {
      let moduleCode = this.state.modules[index]
      if (
        moduleCode >= this.state.allAPPModules[0][position] &&
        moduleCode <= this.state.allAPPModules[2][position]
      ) {
        for (let i = 0; i < 3; i++) {
          rows.push(this.renderLicenseEditionItemView(moduleCode, i))
        }
        break
      }
    }

    return (
      <View style={{ backgroundColor: color.background }}>
        <View style={styles.item}>
          <Text style={styles.title}>
            {getLanguage(global.language).Profile.LICENSE_EDITION}
          </Text>
        </View>
        <View style={styles.separateLine} />
        {rows}
      </View>
    )
  }

  renderContainModule() {
    let position = Platform.OS === 'ios' ? 0 : 1
    let rows = []
    for (let i = 0; i < this.state.modules.length; i++) {
      let moduleCode = this.state.modules[i]
      if (moduleCode <= this.state.allAPPModules[2][position]) {
        continue
      }
      for (let j = 3; j < this.state.allAPPModules.length; j++) {
        if (moduleCode === this.state.allAPPModules[j][position]) {
          rows.push(this.renderContainModuleItemView(j))
          break
        }
      }
    }

    return (
      <View style={{ backgroundColor: color.background }}>
        <View style={styles.item}>
          <Text style={styles.title}>
            {getLanguage(global.language).Profile.LICENSE_CONTAIN_EXPAND_MODULE}
          </Text>
        </View>
        <View style={styles.separateLine} />
        {rows}
      </View>
    )
  }

  renderNotContainModule() {
    let position = Platform.OS === 'ios' ? 0 : 1
    let rows = []
    for (let i = 3; i < this.state.allAPPModules.length; i++) {
      let index = -1
      for (let j = 0; j < this.state.modules.length; j++) {
        if (this.state.modules[j] === this.state.allAPPModules[i][position]) {
          index = i
        }
      }
      if (index === -1) {
        rows.push(this.renderNotContainModuleItemView(i))
      }
    }

    return (
      <View style={{ backgroundColor: color.background }}>
        <View style={styles.item}>
          <Text style={styles.title}>
            {getLanguage(global.language).Profile.LICENSE_NOT_CONTAIN_MODULE}
          </Text>
        </View>
        <View style={styles.separateLine} />
        {rows}
      </View>
    )
  }

  renderContent() {
    return (
      <ScrollView style={{ flex: 1, backgroundColor: color.background }}>
        <View style={{ flex: 1, backgroundColor: color.background }}>
          <View style={{ height: 10 }} />
          {this.renderLicenseEdition()}
          <View style={{ height: 10 }} />
          {this.renderContainModule()}
          <View style={{ height: 10 }} />
          {this.renderNotContainModule()}
        </View>
      </ScrollView>
    )
  }

  render() {
    return (
      <Container
        headerProps={{
          title: getLanguage(global.language).Profile.LICENSE_CONTAIN_MODULE,
          //'所含模块',
          navigation: this.props.navigation,
        }}
      >
        {this.renderContent()}
      </Container>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.bgW,
  },

  item: {
    width: '100%',
    height: scaleSize(60),
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
})
