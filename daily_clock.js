const { argv } = require('yargs')
	.alias('u', 'username').alias('p', 'password')
const axios = require('axios').create({
	baseURL: 'https://app.buaa.edu.cn/',
	headers: { "Content-Type": "application/x-www-form-urlencoded" },
})
function preCheck(res) {
	if (res.status != 200) throw res.statusText
	return res.data
}
function errorCode(data) {
	if (data.e != 0) throw data.m
	return data
}
function sweep(err) {
	console.error(err)
	process.exit(1)
}

function login(data) {
	return axios.post("/uc/wap/login/check", data).then(res => {
		axios.defaults.headers.Cookie = res.headers["set-cookie"]
		return res
	}).then(preCheck).then(errorCode).catch(sweep)
}
function redirect() {
	return axios.get("/buaaxsncov/wap/default/get-info").then(preCheck).catch(sweep)
}
function clock(data) {
	return axios.post("/buaaxsncov/wap/default/save", data).then(preCheck).then(errorCode).catch(sweep)
}
function logout() {
	return axios.get("/uc/wap/login/logout").then(preCheck).catch(sweep)
}

(async () => {
	await login({ ...argv })
	console.log("Login Success!");

	let tmpl = (await redirect()).d
	console.log("Redirect Success!");

	let form = Object.assign(
		{
			/*"sfzs": "",
			"bzxyy": "", "bzxyy_other": "",*/
			"brsfzc": "1",/* "tw": "", "sfcxzz": "", "zdjg": "",
			"zdjg_other": "", "sfgl": "", "gldd": "",
			"gldd_other": "", "glyy": "", "glyy_other": "",
			"gl_start": "", "gl_end": "", "sfmqjc": "",*/
			"sfzc_14": "1", /*"sfqw_14": "", "sfqw_14_remark": "",
			"sfzgfx": "", "sfzgfx_remark": "",
			"sfjc_14": "", "sfjc_14_remark": "", "sfjcqz_14": "",
			"sfjcqz_14_remark": "", "sfgtjz_14": "",
			"sfgtjz_14_remark": "", "szsqqz": "", "sfyqk": "",*/
			"szdd": "1", /*"area": "",
			"city": "", "province": "",
			"address": "",
			"gwdz": "", "is_move": "", "move_reason": "", "move_remark": "",
			"realname": "", "number": "", "uid": "", "created": "",
			"date": "", "id": ""*/
		},
		{
			"sfzs": "1", "area": "北京市 海淀区",
			"city": "北京市", "province": "北京市",
			"address": "北京市海淀区花园路街道聚湘园北京航空航天大学学院路校区"
		},
		{
			"realname": tmpl.uinfo.realname,
			"number": tmpl.uinfo.role.number,
		},
		{
			"uid": tmpl.info.uid,
			"created": tmpl.info.created,
			"date": tmpl.info.date,
			"id": tmpl.info.id
		}
	)
	await clock(form)
	console.log("Clock Success!");

	await logout()
	console.log("Logout Success!");
})()