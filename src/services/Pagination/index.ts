import {Pagination} from '../../model';
import {RealmDB} from '../../storage/realm';

const realm = RealmDB.getInstance();

export const getFilteredConversationPagination = (): Pagination | undefined => {
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
};

export const getConversationPagination = (): Pagination | undefined => {
  const pagination: Pagination | undefined =
    realm.objects<Pagination>('Pagination')[0];
  if (pagination) {
    return pagination;
  }
};
