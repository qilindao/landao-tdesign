import { request } from "@/landao/utils/request";

const Api = {
  PurchaseList: "/get-purchase-list",
  ProjectList: "/get-project-list",
};

export function getPurchaseList() {
  return request.get({
    url: Api.PurchaseList,
  });
}

export function getProjectList() {
  return request.get({
    url: Api.ProjectList,
  });
}
