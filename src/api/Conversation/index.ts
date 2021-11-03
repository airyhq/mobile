import {
  filterToLuceneSyntax,
  Conversation,
  ConversationFilter,
  Pagination,
} from '../../model';
import {RealmDB, upsertConversations} from '../../storage/realm';
import {api} from '../../api';

const realm = RealmDB.getInstance();

export const listConversations = (
  appliedFilters: boolean,
  currentFilter: ConversationFilter,
  setLoading: (loading: boolean) => void,
  conversations: Conversation[],
  setConversations: React.Dispatch<React.SetStateAction<Conversation[]>>,
) => {
  api
    .listConversations({
      page_size: 50,
      filters: appliedFilters ? filterToLuceneSyntax(currentFilter) : null,
    })
    .then((response: any) => {
      setLoading(false);

      realm.write(() => {
        realm.create('Pagination', response.paginationData);
      });

      if (conversations.length === 0) {
        setConversations([...response.data]);
        upsertConversations(response.data, realm);
      } else {
        upsertConversations(response.data, realm);
      }
    })
    .catch((error: Error) => {
      console.error(error);
    });
};

export const getNextConversationList = (
  cursor: string,
  appliedFilters: boolean,
  currentFilter: ConversationFilter,
  setConversations: React.Dispatch<React.SetStateAction<Conversation[]>>,
) => {
  api
    .listConversations({
      cursor: cursor,
      page_size: 50,
      filters: appliedFilters ? filterToLuceneSyntax(currentFilter) : null,
    })
    .then((response: any) => {
      upsertConversations(response.data, realm);

      setConversations(prevConversations => [
        ...prevConversations,
        ...response.data,
      ]);

      realm.write(() => {
        const pagination: Pagination | undefined =
          realm.objects<Pagination>('Pagination')[0];
        pagination.previousCursor = response.paginationData.previousCursor;
        pagination.nextCursor = response.paginationData.nextCursor;
        pagination.total = response.paginationData.total;
      });
    })
    .catch((error: Error) => {
      console.error(error);
    });
};
