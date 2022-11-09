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
		tmpl.oldInfo,
		{ realname: tmpl.uinfo.realname, number: tmpl.uinfo.role.number },
	)
	await clock(form)
	console.log("Clock Success!");

	await logout()
	console.log("Logout Success!");
})()