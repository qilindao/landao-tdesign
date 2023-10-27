import { request } from "@/landao/utils/request";

const Api = {
  BaseList: "/get-list",
  CardList: "/get-card-list",
};

export function getList() {
  return request.get({
    url: Api.BaseList,
  });
}

export function getCardList() {
  return request.get({
    url: Api.CardList,
  });
}
