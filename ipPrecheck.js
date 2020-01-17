const {all_interfaces} = require('./functions');

console.dir(all_interfaces);
const eth0ip=all_interfaces.eth0 && all_interfaces.eth0[0] && all_interfaces.eth0[0].address ;
console.log(`your eth0 ip : ${eth0ip}`);

const wlanip = all_interfaces.WLAN && all_interfaces.WLAN[1] && all_interfaces.WLAN[1].address;
const showWlanIp = () => {
	const ip = eth0ip || wlanip;
	console.log(`your lan ip is: ${ip}`);
	return ip;
};

showWlanIp();
