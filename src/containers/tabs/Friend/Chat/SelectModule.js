import React, { Component } from 'react'
import { ScrollView, FlatList } from 'react-native'
import { Container } from '../../../../components'
import TouchableItemView from '../TouchableItemView'
import ConstModule from '../../../../constants/ConstModule'
import { getLanguage } from '../../../../language/index'
import { connect } from 'react-redux'
import { SMap } from 'imobile_for_reactnative'

class SelectModule extends Component {
  props: {
    latestMap: Object,
    navigation: Object,
  }

  constructor(props) {
    super(props)
    this.callBack = this.props.navigation.getParam('callBack')
  }

  navigateToModule = async module => {
    let licenseStatus = await SMap.getEnvironmentStatus()
    global.isLicenseValid = licenseStatus.isLicenseValid
    if (!global.isLicenseValid) {
      global.SimpleDialog.set({
        text: getLanguage(global.language).Prompt.APPLY_LICENSE_FIRST,
      })
      global.SimpleDialog.setVisible(true)
      return
    }
    let tmpCurrentUser = global.getFriend().props.user.currentUser
    let currentUserName = tmpCurrentUser.userName
      ? tmpCurrentUser.userName
      : 'Customer'

    let latestMap
    if (
      this.props.latestMap[currentUserName] &&
      this.props.latestMap[currentUserName][module.key] &&
      this.props.latestMap[currentUserName][module.key].length > 0
    ) {
      latestMap = this.props.latestMap[currentUserName][module.key][0]
    }
    global.getFriend().setCurMod(module)
    module.action(tmpCurrentUser, latestMap)
    global.getFriend().curChat.setCoworkMode(true)
    global.coworkMode = true
  }

  render() {
    return (
      <Container
        ref={ref => (this.container = ref)}
        headerProps={{
          title: getLanguage(global.language).Friends.SELECT_MODULE,
          withoutBack: false,
          navigation: this.props.navigation,
        }}
      >
        <ScrollView>
          <FlatList
            data={ConstModule(global.language)}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => {
              if (
                item.title === getLanguage(global.language).Map_Module.MAP_3D
              ) {
                return null
              }
              return (
                <TouchableItemView
                  image={item.moduleImage}
                  text={item.title}
                  onPress={() => {
                    if (this.callBack) {
                      this.callBack(item)
                    } else {
                      this.navigateToModule(item)
                    }
                  }}
                />
              )
            }}
          />
        </ScrollView>
      </Container>
    )
  }
}

const mapStateToProps = state => ({
  latestMap: state.map.toJS().latestMap,
})
const mapDispatchToProps = {}
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SelectModule)
