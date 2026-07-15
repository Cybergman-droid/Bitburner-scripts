import { getServerNames } from "serverutils/server_name_list.ts";
import { getRootAccess } from "serverutils/server_nuke";
import { getServerObjects } from "serverutils/server_obj_list.ts";
/** @param {NS} ns */
export async function main(ns) {
	let scriptToBeRun = "hackLevelGrow.js";
	let scriptRam = ns.getScriptRam(scriptToBeRun);
	let serverNames = getServerNames(ns);
	let servers = [];
	for (let serverName of serverNames) {
		let serverObj = ns.getServer(serverName);
		servers.push(serverObj);
	}
	//ns.tprint(servers.length)
	let hackedServers = ["home"];

	while (hackedServers.length != servers.length) {
		let totalThreads = 0;
		for (let server of servers) {
			if (!server.hasAdminRights) {
				//ns.tprint(` Admin rights on ${server.hostname}: ${server.hasAdminRights}`)
				//ns.tprint(`${server.hostname} has not been hacked`)
				await getRootAccess(ns, server);
				ns.tprint(
					` Admin rights on ${server.hostname}: ${server.hasAdminRights}`,
				);
			}
			if (server.hasAdminRights) {
				ns.tprint(`${server.hostname} has been hacked`);
				//ns.tprint(` Admin rights on ${server.hostname}: ${server.hasAdminRights}`)
				let maxRam = server.maxRam;
				let numOfThreads = Math.floor(maxRam / scriptRam);
				ns.scp(scriptToBeRun, server.hostname, "home");
				if (numOfThreads >= 1) {
					try {
						ns.exec(scriptToBeRun, server.hostname, numOfThreads);
					} catch (e) {
						ns.tprint(e);
						numOfThreads -= 1;
						ns.exec(scriptToBeRun, server.hostname, numOfThreads);
					} finally {
						ns.tprint(
							`${scriptToBeRun} executed on ${server.hostname} with ${numOfThreads} threads`,
						);
						totalThreads += numOfThreads;
					}
				}

				if (hackedServers.includes(server.hostname)) continue;
				hackedServers.push(server.hostname);

				ns.tprint(`Hacked servers: ${hackedServers}`);
			}
		}
		ns.tprint(`${scriptToBeRun} executed with ${totalThreads} threads`);
		await ns.sleep(300000);
		ns.tprint("Checking for extra servers to hack");
		ns.tprint(
			"===============================================================================",
		);
	}
}
