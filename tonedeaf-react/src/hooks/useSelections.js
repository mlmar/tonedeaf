import { useReducer } from 'react';

const SET_VIEW_INDEX = 'setViewIndex';
const SET_TIME_FRAME_INDEX = 'setTimeFrameIndex';

export const useSelections = ({ viewIndex, timeFrameIndex }) => {
    const [state, dispatch] = useReducer(reducer, {
        viewIndex,
        timeFrameIndex,
    });

    const setViewIndex = (index) => {
        dispatch({
            type: SET_VIEW_INDEX,
            payload: index,
        });
    };

    const setTimeFrameIndex = (index) => {
        dispatch({
            type: SET_TIME_FRAME_INDEX,
            payload: index,
        });
    };

    return {
        viewIndex: state.viewIndex,
        setViewIndex,
        timeFrameIndex: state.timeFrameIndex,
        setTimeFrameIndex,
    };
};

const reducer = (state, action) => {
    const { type, payload } = action;
    switch (type) {
        case SET_TIME_FRAME_INDEX:
            return { ...state, timeFrameIndex: payload };
        case SET_VIEW_INDEX:
            return { ...state, viewIndex: payload };
        default:
            return state;
    }
};
