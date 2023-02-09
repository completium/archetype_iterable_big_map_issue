import * as ex from "@completium/experiment-ts";
import * as att from "@completium/archetype-ts-types";
export const a_key_mich_type: att.MichelineType = att.prim_annot_to_mich_type("nat", []);
export const a_value_mich_type: att.MichelineType = att.prim_annot_to_mich_type("bytes", []);
export type a_container = Array<[
    att.Nat,
    att.Bytes
]>;
export const a_container_mich_type: att.MichelineType = att.pair_annot_to_mich_type("big_map", att.prim_annot_to_mich_type("nat", []), att.prim_annot_to_mich_type("bytes", []), []);
const exec_arg_to_mich = (i: att.Nat): att.Micheline => {
    return i.to_mich();
}
export const deploy_exec_callback = async (params: Partial<ex.Parameters>): Promise<att.DeployResult> => {
    return await ex.deploy_callback("exec", att.prim_annot_to_mich_type("bytes", []), params);
};
export class Good {
    address: string | undefined;
    constructor(address: string | undefined = undefined) {
        this.address = address;
    }
    exec_callback_address: string | undefined;
    get_address(): att.Address {
        if (undefined != this.address) {
            return new att.Address(this.address);
        }
        throw new Error("Contract not initialised");
    }
    async get_balance(): Promise<att.Tez> {
        if (null != this.address) {
            return await ex.get_balance(new att.Address(this.address));
        }
        throw new Error("Contract not initialised");
    }
    async deploy(params: Partial<ex.Parameters>) {
        const address = (await ex.deploy("./contracts/good.arl", {}, params)).address;
        this.address = address;
        this.exec_callback_address = (await deploy_exec_callback(params)).address;
    }
    async exec(i: att.Nat, params: Partial<ex.Parameters>): Promise<att.Bytes> {
        if (this.address != undefined) {
            if (this.exec_callback_address != undefined) {
                const entrypoint = new att.Entrypoint(new att.Address(this.exec_callback_address), "callback");
                await ex.call(this.address, "exec", att.getter_args_to_mich(exec_arg_to_mich(i), entrypoint), params);
                return await ex.get_callback_value<att.Bytes>(this.exec_callback_address, x => { return att.Bytes.from_mich(x); });
            }
        }
        throw new Error("Contract not initialised");
    }
    async get_a_value(key: att.Nat): Promise<att.Bytes | undefined> {
        if (this.address != undefined) {
            const storage = await ex.get_raw_storage(this.address);
            const data = await ex.get_big_map_value(BigInt(att.Int.from_mich(storage).toString()), key.to_mich(), a_key_mich_type);
            if (data != undefined) {
                return att.Bytes.from_mich(data);
            }
            else {
                return undefined;
            }
        }
        throw new Error("Contract not initialised");
    }
    async has_a_value(key: att.Nat): Promise<boolean> {
        if (this.address != undefined) {
            const storage = await ex.get_raw_storage(this.address);
            const data = await ex.get_big_map_value(BigInt(att.Int.from_mich(storage).toString()), key.to_mich(), a_key_mich_type);
            if (data != undefined) {
                return true;
            }
            else {
                return false;
            }
        }
        throw new Error("Contract not initialised");
    }
    errors = {
        OPTION_IS_NONE: att.string_to_mich("\"OPTION_IS_NONE\"")
    };
}
export const good = new Good();
