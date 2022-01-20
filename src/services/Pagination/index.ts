import {Results} from 'realm';
import {Pagination} from '../../model';
import {RealmDB} from '../../storage/realm';

const realm = RealmDB.getInstance();

export const getPagination = (
  appliedFilters: boolean,
): Pagination | undefined => {
  if (appliedFilters) {
    const pagination: Pagination | undefined = realm.objects<Pagination>(
      'FilterConversationPagination',
    )[0];

    if (!pagination) {
      realm.write(() => {
        realm.create('FilterConversationPagination', {
          loading: false,
          previousCursor: null,
          nextCursor: null,
          total: null,
        });
      });

      const pagination: Pagination | undefined = realm.objects<Pagination>(
        'FilterConversationPagination',
      )[0];

      return pagination;
    }
    return pagination;
  } else {
    const objects: Results<Pagination> =
      RealmDB.getInstance()?.objects('Pagination');
    if (objects) {
      return objects[0];
    }
  }
};
