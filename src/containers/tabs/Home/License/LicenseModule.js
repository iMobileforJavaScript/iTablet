import React, { Component } from 'react'
import { View, StyleSheet, ScrollView, Text, AsyncStorage } from 'react-native'
import { Container, Button } from '../../../../components'
import { color } from '../../../../styles'
import { getLanguage } from '../../../../language/index'
import { SMap } from 'imobile_for_reactnative'
import { Toast } from '../../../../utils'
import constants from '../../../../../src/containers/workspace/constants'

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
    this.initAllModules()
  }

  getModules = async serialNumber => {
    GLOBAL.Loading.setLoading(true)
    let modules = await SMap.licenseContainModule(serialNumber)
    let size = modules.length
    let number = 0
    for (let i = 0; i < size; i++) {
      let modultCode = Number(modules[i])
      number = number + modultCode
    }
    let allModules = this.initAllModules()
    this.setState({
      modules: modules,
      modulesNumber: number,
      allModules: allModules,
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
      let offset = 1 << moduleCode
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
            height: 60,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Text style={{ fontSize: 15, marginLeft: 30 }}>{label}</Text>
          {havaRegister ? (
            <Button
              title={getLanguage(global.language).Profile.LICENSE_HAVE_REGISTER}
              style={{
                width: 80,
                height: 40,
                fontSize: 15,
                marginRight: 30,
                alignItems: 'center',
              }}
              titleStyle={{
                width: 80,
                fontSize: 15,
              }}
              type={Button.Type.GRAY}
            />
          ) : (
            <Button
              title={getLanguage(global.language).Profile.LICENSE_REGISTER_BUY}
              style={{
                width: 80,
                height: 40,
                fontSize: 15,
                marginRight: 15,
                alignItems: 'center',
              }}
              titleStyle={{
                width: 80,
                fontSize: 15,
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
            height: 60,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Text style={{ fontSize: 15, marginLeft: 30 }}>{label}</Text>
        </View>
        <View style={styles.separateLine} />
      </View>
    )
  }
  renderContainModule() {
    let rows = []
    for (let i = 0; i < this.state.allModules.length; i++) {
      if ((this.state.modulesNumber >> i) & (1 == 1)) {
        rows.push(this.renderContainModuleItemView(i))
      }
    }

    return (
      <View style={{ backgroundColor: color.background }}>
        <View style={styles.item}>
          <Text style={styles.title}>
            {getLanguage(global.language).Profile.LICENSE_CONTAIN_MODULE}
          </Text>
        </View>
        <View style={styles.separateLine} />
        {rows}
      </View>
    )
  }

  renderNotContainModule() {
    let rows = []
    for (let i = 0; i < this.state.allModules.length; i++) {
      if ((this.state.modulesNumber >> i) & (1 == 1)) {
        continue
      }
      rows.push(this.renderNotContainModuleItemView(i))
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
    height: 60,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: color.content_white,
  },
  title: {
    fontSize: 18,
    marginLeft: 15,
  },
  subTitle: {
    fontSize: 15,
    marginLeft: 15,
  },
  separateLine: {
    width: '100%',
    height: 1,
    backgroundColor: color.item_separate_white,
  },
})
