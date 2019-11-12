/**
 *  游客用户
 *
 */
const PROBATION_USER = 'probation_user'
/**
 *  普通用户
 *
 */
const COMMON_USER = 'common_user'
/**
 *  所有模块vip用户
 *
 */
const ALL_MODULE_VIP_USER = 'all_module_vip_user'

/**
 *  采集vip用户
 *
 */
const COLLECTION_IVP_USER = 'collection_vip_user'
/**
 *  专题制图vip用户
 *
 */
const THEME_MAP_VIP_USER = 'theme_map_vip_user'
/**
 *  iPortal用户
 *
 */
const IPORTAL_COMMON_USER = 'iPortal_common_user'

function isProbationUser(user) {
  if (user === undefined) {
    return false
  }
  if (user.userType === undefined) {
    return false
  }
  let type = user.userType
  if (type === PROBATION_USER) {
    return true
  }
  return false
}

function isOnlineUser(user) {
  if (user === undefined) {
    return false
  }
  if (user.userType === undefined) {
    return false
  }
  let type = user.userType
  if (
    type === COMMON_USER ||
    type === ALL_MODULE_VIP_USER ||
    type === COLLECTION_IVP_USER ||
    type === THEME_MAP_VIP_USER
  ) {
    return true
  }
  return false
}

function isIPortalUser(user) {
  if (user === undefined) {
    return false
  }
  if (user.userType === undefined) {
    return false
  }
  let type = user.userType
  if (type === IPORTAL_COMMON_USER) {
    return true
  }
  return false
}

export default {
  PROBATION_USER,
  COMMON_USER,
  ALL_MODULE_VIP_USER,
  COLLECTION_IVP_USER,
  THEME_MAP_VIP_USER,
  IPORTAL_COMMON_USER,
  isProbationUser,
  isOnlineUser,
  isIPortalUser,
}
