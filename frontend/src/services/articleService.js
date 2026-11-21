
import api, { apiGet } from "./api";

export function getArticles(params = {}) {
  return apiGet("/api/articles", params);
}

export function getMyArticles() {
  return apiGet("/api/articles/mine");
}

export function getAdminArticles(status = "") {
  return apiGet("/api/articles/admin", {
    status,
  });
}

export function getArticleDetail(id) {
  return apiGet(`/api/articles/${id}`);
}

export async function submitArticle(formData) {
  const response = await api.post(
    "/api/articles",
    formData
  );

  return response.data;
}

export async function reviewArticle(
  id,
  action,
  reason = ""
) {
  const response = await api.patch(
    `/api/articles/${id}/review`,
    { action, reason }
  );

  return response.data;
}

export async function downloadArticlePdf(
  articleId,
  filename = "article.pdf"
) {
  const response = await api.get(
    `/api/articles/${articleId}/pdf`,
    {
      responseType: "blob",
    }
  );

  const url = URL.createObjectURL(
    response.data
  );

  const anchor = document.createElement("a");

  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();

  setTimeout(() => {
    URL.revokeObjectURL(url);
  }, 1000);
}