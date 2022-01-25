import {Pagination} from '../../model';
import {RealmDB} from '../../storage/realm';

const realm = RealmDB.getInstance();

export const getConversationPagination = (): Pagination | undefined => {
  const pagination: Pagination | undefined =
    realm.objects<Pagination>('Pagination')[0];
  if (pagination) {
    return pagination;
  }
};

export const getFilteredConversationPagination = (): Pagination | undefined => {
  const filteredConversationPagination: Pagination | undefined =
    realm.objects<Pagination>('FilterConversationPagination')[0];

  if (!filteredConversationPagination) {
    realm.write(() => {
      realm.create('FilterConversationPagination', {
        loading: false,
        previousCursor: null,
        nextCursor: null,
        total: null,
      });
    });
  }

  console.log('GET FILTEREDCONVPAGINATION', filteredConversationPagination);

  return filteredConversationPagination;
};
