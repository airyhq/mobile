import {Results} from 'realm';
import {Pagination} from '../../model/Pagination';
import {RealmDB} from '../../storage/realm';

export const getPagination = (): Pagination | undefined => {
  const objects: Results<Pagination> =
    RealmDB.getInstance()?.objects('Pagination');
  if (objects) {
    return objects[0];
  }
};
