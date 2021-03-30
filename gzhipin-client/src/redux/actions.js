/* 包含n个action creator: 异步action、同步action */
import {
  reqRegister,
  reqLogin,
  reqUpdateUser,
  reqUser,
  reqUserList
} from '../api'
import {
  AUTH_SUCCESS,
  ERROR_MSG,
  RECEIVE_USER,
  RESET_USER,
  RECEIVE_USER_LIST
} from './action-types'

// 授权成功的同步action
const authSuccess = (user) => ({type: AUTH_SUCCESS, data: user})
// 错误提示信息的同步action
const errorMsg = (msg) => ({type: ERROR_MSG, data: msg})
// 接收用户的同步action
const receiveUser = (user) => ({type: RECEIVE_USER, data: user})
// 重置用户的同步action
export const resetUser = (msg) => ({type: RESET_USER, data: msg})
// 接收用户列表的同步action
export const receiveUserList = (userList) => ({type: RECEIVE_USER_LIST, data: userList})

// 注册的异步action
export const register = (user) => {
  const {username, password, password2, type} = user
  // 表单前台验证 如果不通过，则return一个errorMsg的同步的action
  if(!username) {
    return errorMsg('用户名不能为空！')
  } else if(password!==password2) {
    return errorMsg('密码和确认密码不一致！')
  }
  // 表单数据合法，返回一个发ajax请求的异步action函数
  return async dispatch => {
    // 发送注册的异步ajax请求
    /*const promise = reqRegister(user)
    promise.then(response => {
      const result = response.data  // {code: 0/1, data: user, msg: ''}
    })*/
    // 用async和await比promise更方便（同步）
    const response = await reqRegister({username, password, type})
    const result = response.data
    if(result.code===0) {
      // 分发授权成功的同步action
      // dispatch分发的就是action 它会触发reducers的调用
      dispatch(authSuccess(result.data))
    } else {
      // 分发错误提示信息的同步action
      dispatch(errorMsg(result.msg))
    }
  }
}

// 登陆的异步action
export const login = (user) => {
  const {username, password} = user
  // 表单前台验证 如果不通过，则return一个errorMsg的同步的action
  if(!username) {
    return errorMsg('用户名不能为空！')
  } else if(!password) {
    return errorMsg('密码不能为空！')
  }
  // 表单数据合法，返回一个发ajax请求的异步action函数
  return async dispatch => {
    const response = await reqLogin(user)
    const result = response.data
    if(result.code===0) {
      dispatch(authSuccess(result.data))
    } else {
      dispatch(errorMsg(result.msg))
    }
  }
}

// 更新用户的异步action
export const updateUser = (user) => {
  return async dispatch => {
    const response = await reqUpdateUser(user)
    const result = response.data
    if(result.code===0) {
      dispatch(receiveUser(result.data))
    } else {
      dispatch(resetUser(result.msg))
    }
  }
}

// 获取用户信息的异步action
export const getUser = () => {
   // 执行异步ajax请求
  return async dispatch => {
    const response = await reqUser()
    const result = response.data
    if(result.code===0) {
      dispatch(receiveUser(result.data))
    } else {
      dispatch(resetUser(result.msg))
    }
  }
}

// 获取用户列表的异步action
export const getUserList = (type) => {
  return async dispatch => {
    const response = await reqUserList(type)
    const result = response.data
    if(result.code===0) {
      dispatch(receiveUserList(result.data))
    }
  }
}