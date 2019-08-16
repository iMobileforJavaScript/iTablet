import * as React from 'react'
import {
  TextInput,
  Text,
  View,
  KeyboardAvoidingView,
  TouchableOpacity,
  Keyboard,
} from 'react-native'
import Container from '../../../../components/Container'
import { Toast, scaleSize } from '../../../../utils'
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

  _renderIPortal = () => {
    return (
      <View style={{ width: '70%' }}>
        <TextInput
          clearButtonMode={'while-editing'}
          keyboardType={'default'}
          placeholder={
            getLanguage(this.props.language).Profile.ENTER_SERVER_ADDRESS
          }
          multiline={false}
          defaultValue={this.iportalAddress || ''}
          style={styles.textInputStyle}
          onChangeText={text => {
            this.iportalAddress = text
          }}
        />
        <Text style={{ color: '#A0A0A0', fontSize: scaleSize(20) }}>
          {'Example: <server>:<port>/iportal/web'}
        </Text>
        <TextInput
          clearButtonMode={'while-editing'}
          keyboardType={'default'}
          placeholder={getLanguage(this.props.language).Profile.ENTER_USERNAME2}
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
          placeholder={getLanguage(this.props.language).Profile.ENTER_PASSWORD}
          multiline={false}
          password={true}
          style={styles.textInputStyle}
          defaultValue={this.iportalPassword || ''}
          onChangeText={text => {
            this.iportalPassword = text
          }}
        />
      </View>
    )
  }

  render() {
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
          style={{ flex: 1, alignItems: 'center' }}
          contentContainerStyle={{
            flex: 1,
            alignItems: 'center',
            flexDirection: 'column',
          }}
          behavior={this.state.behavior}
        >
          {this._renderIPortal()}

          {/* 登录 */}
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
