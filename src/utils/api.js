import $http from './request'

/*var qs = require('qs');
fly.post('/foo', qs.stringify({ 'bar': 123 }));*/
export function JsontoForm(params) {
    let str = [];
    for (let key in params) {
        str.push(key + "=" + params[key])
    }
    return str.join('&');

}

export function getmsglist() {
    return $http.get({
        url: '/content/announcement/get'
    })
}

export function getbannerlist() {
    return $http.get({
        url: '/content/carousel/get'
    })
}

export function getbaikelist(data) {
    let params = JsontoForm(data);
    return $http.get({
        url: '/content/article/baike/get?' + params,

    })
}

export function getjiankanglist(data) {
    let params = JsontoForm(data);
    return $http.get({
        url: '/content/article/food/get?' + params,
    })
}

export function getbaike(id) {
    return $http.get({
        url: '/content/article/baike/get/' + id,

    })
}

export function getjiankang(id) {
    return $http.get({
        url: '/content/article/food/get/' + id,
    })
}

export function getwechatlist(data) {
    let params = JsontoForm(data);
    return $http.get({
        url: '/content/wechat_zoom/get?' + params,
    })
}

export function getOpenId(code) {
    return $http.get({
        url: '/api/firm/token/wechat/getOpenId?code=' + code,
    })
}

export function getMember(open_id) {
    let login_code = wx.getStorageSync('login_code');
    return $http.get({
        url: '/api/firm/member/index?open_id=' + open_id + '&login_code=' + login_code,
    })
}

export function addMember(param) {
    let login_code = wx.getStorageSync('login_code');
    return $http.post({
        url: '/api/firm/member/add/one?login_code=' + login_code,
        data: param
    })
}

export function getMemberAddr(memberId) {
    let login_code = wx.getStorageSync('login_code');
    return $http.get({
        url: '/api/firm/member_address/get/' + memberId + '?login_code=' + login_code,
    })
}

export function addAddress(param) {
    let login_code = wx.getStorageSync('login_code');
    return $http.post({
        url: '/api/firm/member_address/add/one?login_code=' + login_code,
        data: param
    })
}

export function editAddress(param, id) {
    let login_code = wx.getStorageSync('login_code');
    return $http.post({
        url: '/api/firm/member_address/update/one/' + id + '?login_code=' + login_code,
        data: param
    })
}

export function delAddress(id) {
    let login_code = wx.getStorageSync('login_code');
    return $http.get({
        url: '/api/firm/member_address/delete/one/' + id + '?login_code=' + login_code,
    })
}

export function sendVerifyCode(cellphone) {
    let login_code = wx.getStorageSync('login_code');
    return $http.get({
        url: '/api/firm/member/getVerificationCode?cellphone=' + cellphone + '&login_code=' + login_code,
    })
}

export function setMemberPhone(param, memberId) {
    let login_code = wx.getStorageSync('login_code');
    return $http.post({
        url: '/api/firm/member/update/phone/' + memberId + '?login_code=' + login_code,
        data: param
    })
}

export function setMemberPayPassword(param, memberId) {
    let login_code = wx.getStorageSync('login_code');
    return $http.post({
        url: '/api/firm/member/update/payPassword/' + memberId + '?login_code=' + login_code,
        data: param
    })
}

export default {
    getmsglist,
    getbannerlist,
    getbaikelist,
    getjiankanglist,
    getwechatlist,
    getbaike,
    getjiankang,
    getOpenId,
    getMember,
    addMember,
    getMemberAddr,
    addAddress,
    editAddress,
    delAddress,
    sendVerifyCode,
    setMemberPhone,
    setMemberPayPassword
}
