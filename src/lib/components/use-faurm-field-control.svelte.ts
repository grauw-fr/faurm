import {getContext, setContext} from "svelte";
import {useId} from "../use-id.js";

export const FAURM_FIELD_CONTROL_KEY = Symbol("FAURM_FIELD_CONTROL_KEY")
export const setFaurmFieldControlContext = (id: string) => {
    return setContext(FAURM_FIELD_CONTROL_KEY, new FaurmFieldControlContext(id));
}

export const getFaurmFieldControlContext = () => {
    const state = getContext<FaurmFieldControlContext>(FAURM_FIELD_CONTROL_KEY);
    if (!state) {
        throw new Error("Field not set.")
    }
    return state;
}

class FaurmFieldControlContext {
    id: string;

    constructor(id: string) {
        this.id = useId(id)
    }
}