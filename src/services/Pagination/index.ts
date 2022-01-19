import {Results} from 'realm';
import {Pagination, ConversationFilter} from '../../model';
import {RealmDB} from '../../storage/realm';

const realm = RealmDB.getInstance();

export const getPagination = (
  currentFilter: ConversationFilter,
  appliedFilters: boolean,
): Pagination | undefined => {
  console.log('getPagination currentFilter', currentFilter);

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
      console.log('no filter getPagi', objects[0]);
      return objects[0];
    }
  }
};
