const {all_interfaces} = require('./functions');

console.dir(all_interfaces);
console.dir(all_interfaces.eth0[0]);
console.log(`your eth0 ip : ${all_interfaces.eth0[0].address}`);

const showWlanIp = () => {
	const ip = all_interfaces.eth0 && all_interfaces.eth0[0] && all_interfaces.eth0[0].address || (all_interfaces.WLAN && all_interfaces.WLAN[1] && all_interfaces.WLAN[1].address);
	console.log(`your lan ip is: ${ip}`);
	return ip;
};

showWlanIp();
