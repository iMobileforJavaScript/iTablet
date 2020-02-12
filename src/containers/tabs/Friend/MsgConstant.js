export default {
  //整个message的type
  MSG_SINGLE: 1, //单人消息
  MSG_GROUP: 2, //群组消息
  MSG_ADD_FRIEND: 901, //添加好友
  MSG_DEL_FRIEND: 902, //删除好友关系
  MSG_ACCEPT_FRIEND: 903, //同意添加好友
  MSG_MODIFY_GROUP_NAME: 911, //修改群名
  MSG_CREATE_GROUP: 912, //创建群
  MSG_REMOVE_MEMBER: 913, //退出群
  MSG_DISBAND_GROUP: 914, //解散群
  MSG_REJECT: 920, //拒收
  MSG_LOGOUT: 999, //下线
  //message中的message的type
  MSG_TEXT: 1,
  MSG_PICTURE: 2,
  MSG_FILE: 3, //文件本体
  MSG_MAP: 6, //地图
  MSG_GEOMETRY: 7, //对象
  MSG_DATASET: 8, //数据集
  MSG_LAYER: 9, //图层
  MSG_LOCATION: 10, //位置
}
