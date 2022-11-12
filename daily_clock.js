const { argv } = require('yargs')
	.alias('u', 'username').alias('p', 'password')
const axios = require('axios').create({
	baseURL: 'https://app.buaa.edu.cn/',
	headers: { "Content-Type": "application/x-www-form-urlencoded" },
})
axios.interceptors.request.use(res => {
	axios.defaults.headers.Cookie ??= res.headers["set-cookie"]
	if (res.status != 200) return Promise.reject(res.statusText)
	return res.data
})

function errorCode(data) {
	if (data.e != 0) throw data.m
	return data
}
function login(data) {
	return axios.post("/uc/wap/login/check", data).then(errorCode)
}
function redirect() {
	return axios.get("/buaaxsncov/wap/default/get-info")
}
function clock(data) {
	return axios.post("/buaaxsncov/wap/default/save", data).then(errorCode)
}
function logout() {
	return axios.get("/uc/wap/login/logout")
}

(async () => {
	try {
		await login({ ...argv })
		console.log("Login Success!");

		let { d: tmpl } = await redirect()
		console.log("Redirect Success!");

		await clock(Object.assign(
			tmpl.oldInfo,
			{ realname: tmpl.uinfo.realname, number: tmpl.uinfo.role.number },
		))
		console.log("Clock Success!");

		await logout()
		console.log("Logout Success!");
	} catch (err) {
		console.error(err)
		process.exit(1)
	}
})()