import { readFile } from "fs-extra";
import { load, YAMLException } from "js-yaml";
import { parse } from "json5";
import { extname } from "path";

import log from "@utils/log";

const parseUserConfig = async (
	configFilePath: string
): Promise<Record<string, unknown> | false> => {
	const ext = extname(configFilePath);

	if (ext.match(/^\.js$/)) {
		try {
			return require(configFilePath);
		} catch (error) {
			log.configJSError(error as Error);
			return false;
		}
	}

	const content = await readFile(configFilePath, "utf8");

	if (ext.match(/^\.ya?ml$/)) {
		try {
			return load(content) as Record<string, unknown>;
		} catch (error) {
			log.configYamlError(error as YAMLException);
			return false;
		}
	}
	if (ext.match(/^\.json[c5]?$/)) {
		try {
			return parse(content);
		} catch (error) {
			log.configJSONError(error as Error);
			return false;
		}
	}

	throw new Error("Unsupported Extension: " + ext);
};

export default parseUserConfig;
