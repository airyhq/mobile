import {TEST_ACTION} from '../../actions/index';
import {ActionType, getType} from 'typesafe-actions';
import * as actions from '../../actions';


type Action = ActionType<typeof actions>;

const test = (state = {}, action: any): any => {
  switch (action.type) {
  case TEST_ACTION: {
    return action.payload;
  }
  default:
    return state;
  }
};

export default test;