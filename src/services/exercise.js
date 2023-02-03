import axios from "axios";

const baseUrl = "demo4775680.mockable.io";

export const getExercise1 = () => {
  return axios
    .get(`https://${baseUrl}/exercise1`)
    .then((response) => (response.data ? response.data : null));

};

export const getExercise2 = () => {
  return axios
    .get(`https://${baseUrl}/exercise2`)
    .then((response) => (response.data ? response.data : null));
};
