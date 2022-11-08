const { argv } = require('yargs')
	.alias('u', 'username').alias('p', 'password')
const axios = require('axios').create({
	baseURL: 'https://app.buaa.edu.cn/',
	headers: { "Content-Type": "application/x-www-form-urlencoded" },
})
function preCheck(res) {
	if (res.status != 200) throw new Error()
	return res.data
}

function login(data) {
	return axios.post("/uc/wap/login/check", data).then(res => {
		axios.defaults.headers.Cookie = res.headers["set-cookie"]
		return res
	}).then(preCheck).then(data => {
		if (![0, 1].includes(data.e)) throw new Error()
		return data
	})
}
function redirect() {
	return axios.get("/buaaxsncov/wap/default/get-info").then(preCheck)
}
function clock(data) {
	return axios.post("/buaaxsncov/wap/default/save", data).then(preCheck)
}
function logout() {
	return axios.get("/uc/wap/login/logout").then(preCheck)
}

(async () => {
	await login({ ...argv })
	console.log("Login Success!");

	let tmpl = (await redirect()).d
	console.log("Redirect Success!");

	// let form = Object.assign(
	// 	{},
	// 	tmpl.oldInfo,
	// 	tmpl.info,
	// 	{ realname: "颜宇琦", number: "19374307", created: Math.floor(Date.now() / 1000), date: tmpl.date.replace("-", ""), id: "?" }
	// )
	let form = Object.assign(
		{
			"sfzs": "",
			"bzxyy": "", "bzxyy_other": "",
			"brsfzc": "1", "tw": "", "sfcxzz": "", "zdjg": "",
			"zdjg_other": "", "sfgl": "", "gldd": "",
			"gldd_other": "", "glyy": "", "glyy_other": "",
			"gl_start": "", "gl_end": "", "sfmqjc": "",
			"sfzc_14": "1", "sfqw_14": "", "sfqw_14_remark": "",
			"sfzgfx": "", "sfzgfx_remark": "",
			"sfjc_14": "", "sfjc_14_remark": "", "sfjcqz_14": "",
			"sfjcqz_14_remark": "", "sfgtjz_14": "",
			"sfgtjz_14_remark": "", "szsqqz": "", "sfyqk": "",
			"szdd": "1", "area": "",
			"city": "", "province": "",
			"address": "",
			"gwdz": "", "is_move": "", "move_reason": "", "move_remark": "",
			"realname": "", "number": "", "uid": "", "created": "",
			"date": "", "id": ""
		},
		{
			"sfzs": "1", "area": "北京市 海淀区",
			"city": "北京市", "province": "北京市",
			"address": "北京市海淀区花园路街道北京航空航天大学大运村学生公寓5号楼"
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
	console.log((await clock(form)))
	console.log("Clock Success!");

	await logout()
	console.log("Logout Success!");
})()