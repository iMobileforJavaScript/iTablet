export default {
  MSG_IP: '192.168.0.107',
  MSG_Port: 5672,
  MSG_HostName: '/',
  MSG_UserName: 'androidtest',
  MSG_Password: 'androidtest',
  // MSG_IP: '111.202.121.144',
  // MSG_Port: 5672,
  // MSG_HostName: '/',
  // MSG_UserName: 'admin',
  // MSG_Password: 'admin',
  //整个message的type
  MSG_SINGLE: 1, //单人消息
  MSG_GROUP: 2, //群组消息
  MSG_ADD_FRIEND: 901, //添加好友
  MSG_CREATE_GROUP: 912, //创建群
  MSG_REMOVE_MEMBER: 913, //退出群
  MSG_REJECT: 920, //拒收
  //message中的message的type
  MSG_FILE: 3, //文件本体
  MSG_FILE_NOTIFY: 6, //文件接收通知
  MSG_LOCATION: 10, //位置
}
