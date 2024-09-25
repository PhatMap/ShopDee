import axios from "axios";
import {
  MY_CHATS_SUCCESS,
  MY_CHATS_FAIL,
  GET_CHATS_SUCCESS,
  GET_CHATS_FAIL,
  GET_CHAT_DETAIL_SUCCESS,
  SEND_MESSAGE_SUCCESS,
  SEND_MESSAGE_FAIL,
} from "../constants/chatConstants";

export const getUserChats = () => async (dispatch) => {
  try {
    const { data } = await axios.get(`/api/v1/chats/me`);

    dispatch({
      type: MY_CHATS_SUCCESS,
      payload: { chats: data.chats },
    });
  } catch (error) {
    dispatch({
      type: MY_CHATS_FAIL,
      payload: error.response ? error.response.data.message : error.message,
    });
  }
};

export const getChats =
  ({ keyword = "" }) =>
  async (dispatch) => {
    try {
      const { data } = await axios.get(`/api/v1/chats?keyword=${keyword}`);

      dispatch({
        type: GET_CHATS_SUCCESS,
        payload: { chats: data.chats },
      });
    } catch (error) {
      dispatch({
        type: GET_CHATS_FAIL,
        payload: error.response ? error.response.data.message : error.message,
      });
    }
  };

export const getChatDetails =
  ({ participantId }) =>
  async (dispatch) => {
    try {
      const { data } = await axios.get(
        `/api/v1/chats/details?participantId=${participantId}`
      );

      dispatch({
        type: GET_CHAT_DETAIL_SUCCESS,
        payload: { chat: data.chat },
      });
    } catch (error) {
      dispatch({
        type: GET_CHAT_DETAIL_SUCCESS,
        payload: error.response ? error.response.data.message : error.message,
      });
    }
  };

export const sendMessage = (message) => async (dispatch) => {
  try {
    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };

    const { data } = await axios.post(`/api/v1/chats/details`, message, config);

    dispatch({
      type: SEND_MESSAGE_SUCCESS,
    });
    dispatch({
      type: GET_CHAT_DETAIL_SUCCESS,
      payload: { chat: data.chat },
    });
  } catch (error) {
    dispatch({
      type: SEND_MESSAGE_FAIL,
      payload: error.response ? error.response.data.message : error.message,
    });
  }
};
