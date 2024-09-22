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

    await axios.post(`/api/v1/chats/details`, message, config);

    dispatch({
      type: SEND_MESSAGE_SUCCESS,
    });
  } catch (error) {
    dispatch({
      type: SEND_MESSAGE_FAIL,
      payload: error.response ? error.response.data.message : error.message,
    });
  }
};

// export const getChatDetails = (chatId) => async (dispatch) => {
//   try {
//     dispatch({ type: GET_CHAT_DETAILS_REQUEST });

//     const { data } = await axios.get(`/api/v1/chat/${chatId}`);
//     dispatch({
//       type: GET_CHAT_DETAILS_SUCCESS,
//       payload: data,
//     });
//   } catch (error) {
//     dispatch({
//       type: GET_CHAT_DETAILS_FAIL,
//       payload: error.response ? error.response.data.message : error.message,
//     });
//   }
// };

// export const createOrGetChat = (participantId) => async (dispatch) => {
//   try {
//     dispatch({ type: CREATE_OR_GET_CHAT_REQUEST });

//     const config = {
//       headers: {
//         "Content-Type": "application/json",
//       },
//     };

//     const { data } = await axios.post(
//       "/api/v1/chat/create",
//       { participantId },
//       config
//     );
//     console.log(data);
//     console.log(" console.log(data);", data.chat._id);
//     dispatch({
//       type: CREATE_OR_GET_CHAT_SUCCESS,
//       payload: data.chat._id,
//     });
//   } catch (error) {
//     dispatch({
//       type: CREATE_OR_GET_CHAT_FAIL,
//       payload: error.response ? error.response.data.message : error.message,
//     });
//   }
// };

// export const sendMessage = (chatId, formData) => async (dispatch) => {
//   try {
//     console.log("chatId, formData", chatId, formData);
//     dispatch({ type: SEND_MESSAGE_REQUEST });

//     const config = {
//       headers: {
//         "Content-Type": "multipart/form-data",
//       },
//     };

//     const { data } = await axios.post(`/api/v1/chat/message`, formData, config);

//     dispatch({
//       type: SEND_MESSAGE_SUCCESS,
//       payload: data,
//     });
//   } catch (error) {
//     dispatch({
//       type: SEND_MESSAGE_FAIL,
//       payload: error.response ? error.response.data.message : error.message,
//     });
//   }
// };

// export const getAllUsersInChats =
//   (currentUserId) => async (dispatch, getState) => {
//     try {
//       dispatch({ type: GET_ALL_USERS_IN_CHATS_REQUEST });

//       const { token } = getState().auth;

//       const { data } = await axios.get(`/api/v1/chats/users/${currentUserId}`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       dispatch({
//         type: GET_ALL_USERS_IN_CHATS_SUCCESS,
//         payload: data.users,
//       });
//     } catch (error) {
//       dispatch({
//         type: GET_ALL_USERS_IN_CHATS_FAIL,
//         payload:
//           error.response && error.response.data.message
//             ? error.response.data.message
//             : error.message,
//       });
//     }
//   };

// export const addMessageIcon =
//   (chatId, messageId, icon) => async (dispatch, getState) => {
//     try {
//       dispatch({ type: ADD_MESSAGE_ICON_REQUEST });

//       const { token } = getState().auth;

//       const config = {
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//       };

//       const { data } = await axios.post(
//         "/api/v1/chat/message/add-icon",
//         { chatId, messageId, icon },
//         config
//       );

//       dispatch({
//         type: ADD_MESSAGE_ICON_SUCCESS,
//         payload: data,
//       });
//     } catch (error) {
//       dispatch({
//         type: ADD_MESSAGE_ICON_FAIL,
//         payload: error.response ? error.response.data.message : error.message,
//       });
//     }
//   };

// export const updateMessageIcon =
//   (chatId, messageId, newIcon) => async (dispatch, getState) => {
//     try {
//       dispatch({ type: UPDATE_MESSAGE_ICON_REQUEST });

//       const { token } = getState().auth;

//       const config = {
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//       };

//       const { data } = await axios.put(
//         "/api/v1/chat/message/update-icon",
//         { chatId, messageId, newIcon },
//         config
//       );

//       dispatch({
//         type: UPDATE_MESSAGE_ICON_SUCCESS,
//         payload: data,
//       });
//     } catch (error) {
//       dispatch({
//         type: UPDATE_MESSAGE_ICON_FAIL,
//         payload: error.response ? error.response.data.message : error.message,
//       });
//     }
//   };

// export const removeMessageIcon =
//   (chatId, messageId) => async (dispatch, getState) => {
//     try {
//       dispatch({ type: REMOVE_MESSAGE_ICON_REQUEST });

//       const { token } = getState().auth;

//       const config = {
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//       };

//       const { data } = await axios.delete("/api/v1/chat/message/remove-icon", {
//         data: { chatId, messageId },
//         ...config,
//       });

//       dispatch({
//         type: REMOVE_MESSAGE_ICON_SUCCESS,
//         payload: data,
//       });
//     } catch (error) {
//       dispatch({
//         type: REMOVE_MESSAGE_ICON_FAIL,
//         payload: error.response ? error.response.data.message : error.message,
//       });
//     }
//   };

// export const searchUsers = (query) => async (dispatch) => {
//   try {
//     dispatch({ type: SEARCH_USERS_REQUEST });

//     const { data } = await axios.get(
//       `/api/v1/chats/searchUsersByName?name=${query}`
//     );
//     console.log("data.users", data.users);
//     dispatch({
//       type: SEARCH_USERS_SUCCESS,
//       payload: data.users,
//     });
//   } catch (error) {
//     dispatch({
//       type: SEARCH_USERS_FAIL,
//       payload: error.response.data.message,
//     });
//   }
// };
