import { GET_VERSIONS } from '../actions/versions';

export default function(state = {}, action) {
    switch(action.type) {
        case GET_VERSIONS:
            return action.payload.data;
        default:
            return state
    }
}