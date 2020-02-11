import * as React from 'react'
import {
  TextInput,
  Text,
  View,
  KeyboardAvoidingView,
  TouchableOpacity,
  Keyboard,
  Animated,
  Dimensions,
} from 'react-native'
import Container from '../../../../components/Container'
import { Toast } from '../../../../utils'
import NavigationService from '../../../NavigationService'
import { SIPortalService } from 'imobile_for_reactnative'
import UserType from '../../../../constants/UserType'
import { getLanguage } from '../../../../language/index'
import { setUser } from '../../../../models/user'
import { connect } from 'react-redux'
import styles from './Styles'
import ConstPath from '../../../../constants/ConstPath'
import { FileTools } from '../../../../native'

class IPortalLogin extends React.Component {
  props: {
    navigation: Object,
    language: String,
    user: Object,
    setUser: () => {},
  }

  constructor(props) {
    super(props)
    this.state = {
      behavior: 'padding',
      left: new Animated.Value(0),
    }
  }

  goNext = async () => {
    if (this.iportalAddress) {
      this.container.setLoading(
        true,
        getLanguage(global.language).Profile.CONNECTING,
      )
      let url = this.iportalAddress + '/login.rjson'
      if (this.iportalAddress.indexOf('http') !== 0) {
        url = 'http://' + url
      }
      let status = undefined
      try {
        let response = await Promise.race([
          fetch(url),
          new Promise((resolve, reject) => {
            setTimeout(() => {
              reject(new Error('request timeout'))
            }, 10000)
          }),
        ])
        status = response.status
      } catch (error) {
        // console.log(error)
      }
      if (status === 405) {
        setTimeout(() => {
          this.container.setLoading(false)
          Animated.timing(this.state.left, {
            toValue: -this.screenWidth,
            duration: 500,
          }).start()
        }, 1000)
      } else {
        setTimeout(() => {
          Toast.show(getLanguage(global.language).Profile.CONNECT_SERVER_FAIL)
          this.container.setLoading(false)
        }, 1000)
      }
    } else {
      Toast.show(getLanguage(this.props.language).Profile.ENTER_SERVER_ADDRESS)
    }
  }

  _login = async () => {
    let url = this.iportalAddress
    let userName = this.iportalUser
    let password = this.iportalPassword

    try {
      if (!url) {
        Toast.show(
          getLanguage(this.props.language).Profile.ENTER_SERVER_ADDRESS,
        )
        return
      }
      if (!userName) {
        Toast.show(getLanguage(this.props.language).Profile.ENTER_USERNAME2)
        return
      }
      if (!password) {
        Toast.show(getLanguage(this.props.language).Profile.ENTER_PASSWORD)
        return
      }

      this.container.setLoading(
        true,
        getLanguage(this.props.language).Prompt.LOG_IN,
      )

      let result = await SIPortalService.login(url, userName, password, true)
      if (typeof result === 'boolean' && result) {
        await this.initUserDirectories(userName)
        let info = await SIPortalService.getMyAccount()
        if (info) {
          let userInfo = JSON.parse(info)
          this.props.setUser({
            serverUrl: url,
            userName: userName,
            password: password,
            nickname: userInfo.nickname,
            email: userInfo.email,
            userType: UserType.IPORTAL_COMMON_USER,
          })
        }
        this.container.setLoading(false)
        NavigationService.popToTop()
      } else {
        this.container.setLoading(false)
        if (result === false) {
          Toast.show(
            getLanguage(this.props.language).Prompt.INCORRECT_IPORTAL_ADDRESS,
          )
        } else if (result === '登陆失败:请检查用户名和密码') {
          Toast.show(
            getLanguage(this.props.language).Prompt.INCORRECT_USER_INFO,
          )
        } else {
          Toast.show(result)
        }
      }
    } catch (e) {
      this.container.setLoading(false)
      Toast.show(getLanguage(this.props.language).Prompt.FAILED_TO_LOG)
    }
  }

  initUserDirectories = async userName => {
    try {
      let paths = Object.keys(ConstPath.RelativePath)
      let isCreate = true,
        absolutePath = ''
      for (let i = 0; i < paths.length; i++) {
        let path =
          ConstPath.UserPath + userName + '/' + ConstPath.RelativePath[paths[i]]
        absolutePath = await FileTools.appendingHomeDirectory(path)
        let exist = await FileTools.fileIsExistInHomeDirectory(path)
        let fileCreated =
          exist || (await FileTools.createDirectory(absolutePath))
        isCreate = fileCreated && isCreate
      }
      if (isCreate) {
        FileTools.initUserDefaultData(userName).then(result => {
          !result && Toast.show('初始化用户数据失败')
        })
      } else {
        Toast.show('创建用户目录失败')
      }
    } catch (e) {
      Toast.show('创建用户目录失败')
    }
  }

  _renderServer = () => {
    return (
      <View style={styles.sectionViewStyle}>
        <View style={styles.inpuViewStyle}>
          <TextInput
            clearButtonMode={'while-editing'}
            keyboardType={'default'}
            placeholder={
              getLanguage(this.props.language).Profile.ENTER_SERVER_ADDRESS
            }
            placeholderTextColor={'#A7A7A7'}
            multiline={false}
            defaultValue={this.iportalAddress || ''}
            style={styles.textInputStyle}
            onChangeText={text => {
              this.iportalAddress = text
            }}
          />
          <Text style={styles.textStyle}>
            {'Example: http://ip:port/iportal/web'}
          </Text>
        </View>
        <TouchableOpacity
          accessible={true}
          accessibilityLabel={'NEXT'}
          style={styles.loginStyle}
          onPress={() => {
            Keyboard.dismiss()
            this.goNext()
          }}
        >
          <Text style={[styles.titleContainerStyle]}>
            {getLanguage(global.language).Profile.NEXT}
          </Text>
        </TouchableOpacity>
      </View>
    )
  }

  _renderUser = () => {
    return (
      <View style={styles.sectionViewStyle}>
        <View style={styles.inpuViewStyle}>
          <TextInput
            clearButtonMode={'while-editing'}
            keyboardType={'default'}
            placeholder={
              getLanguage(this.props.language).Profile.ENTER_USERNAME2
            }
            placeholderTextColor={'#A7A7A7'}
            multiline={false}
            defaultValue={this.iportalUser || ''}
            style={styles.textInputStyle}
            onChangeText={text => {
              this.iportalUser = text
            }}
          />
          <TextInput
            clearButtonMode={'while-editing'}
            secureTextEntry={true}
            placeholder={
              getLanguage(this.props.language).Profile.ENTER_PASSWORD
            }
            placeholderTextColor={'#A7A7A7'}
            multiline={false}
            password={true}
            style={styles.textInputStyle}
            defaultValue={this.iportalPassword || ''}
            onChangeText={text => {
              this.iportalPassword = text
            }}
          />
        </View>
        <TouchableOpacity
          accessible={true}
          accessibilityLabel={getLanguage(this.props.language).Profile.LOGIN}
          style={styles.loginStyle}
          onPress={() => {
            Keyboard.dismiss()
            this._login()
          }}
        >
          <Text style={[styles.titleContainerStyle]}>
            {/* 登录 */}
            {getLanguage(this.props.language).Profile.LOGIN}
          </Text>
        </TouchableOpacity>
      </View>
    )
  }

  renderLoginSection = () => {
    let left = this.state.left
    return (
      <Animated.View
        style={[
          styles.loginSectionView,
          { left: left._value === 0 ? left : -this.screenWidth },
        ]}
      >
        {this._renderServer()}
        {this._renderUser()}
      </Animated.View>
    )
  }

  render() {
    this.screenWidth = Dimensions.get('window').width
    return (
      <Container
        ref={ref => (this.container = ref)}
        headerProps={{
          title: getLanguage(global.language).Profile.LOGIN + ' iPortal',
          navigation: this.props.navigation,
        }}
      >
        <KeyboardAvoidingView
          enabled={true}
          keyboardVerticalOffset={0}
          behavior={this.state.behavior}
        >
          {this.renderLoginSection()}
        </KeyboardAvoidingView>
      </Container>
    )
  }
}

const mapStateToProps = state => ({
  language: state.setting.toJS().language,
  user: state.user.toJS(),
})

const mapDispatchToProps = {
  setUser,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(IPortalLogin)
