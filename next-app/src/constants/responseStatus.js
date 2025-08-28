import keyMirror from "key-mirror";

export const RESPONSE_STATUS = keyMirror({
    UNFETCHED: null,
    FETCHING: null,
    FETCHED: null,
    FAILED_FETCH: null,
})