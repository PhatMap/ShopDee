import {
  MY_CHATS_SUCCESS,
  MY_CHATS_FAIL,
  GET_CHATS_SUCCESS,
  GET_CHATS_FAIL,
  GET_CHAT_DETAIL_SUCCESS,
  GET_CHAT_DETAIL_FAIL,
  SEND_MESSAGE_SUCCESS,
  SEND_MESSAGE_FAIL,
  NEW_MESSAGE,
  GET_CHAT_DETAIL_RESET,
  UPDATE_MESSAGE_SUCCESS,
  UPDATE_MESSAGE_FAIL,
} from "../constants/chatConstants";

export const myChatsReducer = (
  state = {
    chats: [],
  },
  action
) => {
  switch (action.type) {
    case MY_CHATS_SUCCESS:
      return {
        ...state,
        chats: action.payload.chats,
      };

    case MY_CHATS_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    default:
      return state;
  }
};

export const chatsReducer = (
  state = {
    chats: [],
  },
  action
) => {
  switch (action.type) {
    case GET_CHATS_SUCCESS:
      return {
        ...state,
        chats: action.payload.chats,
      };

    case GET_CHATS_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    default:
      return state;
  }
};

export const chatReducer = (
  state = {
    chat: {},
  },
  action
) => {
  switch (action.type) {
    case GET_CHAT_DETAIL_SUCCESS:
    case NEW_MESSAGE:
    case UPDATE_MESSAGE_SUCCESS:
      return {
        ...state,
        chat: action.payload.chat,
      };

    case GET_CHAT_DETAIL_FAIL:
    case UPDATE_MESSAGE_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case SEND_MESSAGE_SUCCESS:
      return {
        ...state,
        success: true,
      };

    case SEND_MESSAGE_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case GET_CHAT_DETAIL_RESET:
      return {
        ...state,
        chat: null,
      };

    default:
      return state;
  }
};
