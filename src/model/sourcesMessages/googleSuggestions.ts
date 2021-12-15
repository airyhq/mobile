export const GoogleSuggestionsSchema = {
  name: 'GoogleSuggestions',
  properties: {
    suggestions: 'GoogleSuggestionsTypes[]',
  },
};

export const GoogleSuggestionsTypesSchema = {
  name: 'GoogleSuggestionsTypes',
  properties: {
    reply: 'SuggestedReplies?',
    action: 'SuggestedAction?',
    dialAction: 'SuggestedDialAction?',
    authenticationRequest: 'AuthenticationRequest?',
    liveAgentRequest: 'LiveAgentRequest?',
  },
};

export const SuggestedRepliesSchema = {
  name: 'SuggestedReplies',
  properties: {
    text: 'string',
    postbackData: 'string',
  },
};

export const SuggestedActionSchema = {
  name: 'SuggestedAction',
  properties: {
    text: 'string',
    postbackData: 'string',
    openUrlAction: 'OpenUrlAction?',
    dialAction: 'SuggestedDialAction?',
  },
};

export const OpenUrlActionSchema = {
  name: 'OpenUrlAction',
  properties: {
    url: 'string',
  },
};

export const SuggestedDialActionSchema = {
  name: 'SuggestedDialAction',
  properties: {
    phoneNumber: 'string',
  },
};

export const AuthenticationRequestSchema = {
  name: 'AuthenticationRequest',
  properties: {
    oauth: 'OAuth',
  },
};

export const OAuthSchema = {
  name: 'OAuth',
  properties: {
    clientId: 'string',
    codeChallenge: 'string',
    scopes: 'string[]',
  },
};

export const LiveAgentRequestSchema = {
  name: 'LiveAgentRequest',
  properties: {},
};
