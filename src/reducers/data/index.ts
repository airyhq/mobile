import _, {combineReducers, Reducer} from 'redux';
import test from './test';
export * from './test';

export type DataState = {
  
};

const reducers: Reducer = combineReducers<DataState>({
  test,
});

export default reducers;