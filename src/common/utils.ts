export class Utils {
    public static createObjWithoutKeys(o: any, blacklist?: Array<string>): Object {
        let result: any = {};
        for (let k in o) {
            if (!blacklist || (blacklist && blacklist.indexOf(k) === -1)) {
                result[k] = o[k];
            }
        }
        return result;
    }
}
