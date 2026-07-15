interface ModifiedServer extends Server {
	hackWeight: number;
	chanceOfHacking: number;
	expectedValuePerHack: number;
	expectedValuePerSec: number;
}
export function serverReset(ns: NS, server: ModifiedServer) {
	server.hostname === "home"
		? ns.tprint("cannot kill scripts on home")
		: ns.killall(server.hostname);
}
