import { saveAs } from 'file-saver';

export default class Querable {
  baseUrl;

  constructor() {
  }

  client = {
    config: {
      baseUrl: ''
    },

    setConfig(config) {
      this.config = {
        ...this.config,
        ...config
      }
    },

    async get(url, data = {}) {
      return this.execute(url, 'GET', data);
    },

    /**
     * post-запрос
     *
     * @param url
     * @param data
     * @returns {Promise<*>}
     */
    async post(url, data = {}) {
      return this.execute(url, 'POST', data);
    },

    /**
     * put-запрос
     *
     * @param url
     * @param data
     * @returns {Promise<*>}
     */
    async put(url, data = {}) {
      return this.execute(url, 'PUT', data);
    },

    /**
     * delete-запрос
     *
     * @param url
     * @param data
     * @returns {Promise<*>}
     */
    async delete(url, data = {}) {
      return this.execute(url, 'DELETE', data);
    },

    async downloadFile(url, params) {
      const link = this.prepareUrl(url, 'GET', params);

      return fetch(link).then(async (res) => {
        if (res.status === 200) {
          const filename = res.headers.get('Content-Disposition').split("filename=")[1];
          const blob = await res.blob();
          saveAs(blob, filename);
          return { ok: true };
        } else {
          const body = await res.json();
          return { ok: false, error: body.error };
        }
      });
    },

    async execute(url, method, data) {
      const link = this.prepareUrl(url, method, data);
      const params = this.prepareParams(link, method, data);
      const response = await fetch(link, params);

      return this.handleResponse(response);
    },

    prepareUrl(url, method, data) {
      if (method === 'GET') {
        url = `${url}?${new URLSearchParams(data).toString()}`;
      }

      return this.config.baseUrl + url;
    },

    prepareParams(url, method, data) {
      const params = { method };

      if (method !== 'GET') {
        params.body = JSON.stringify(data);
      }

      return params;
    },

    async handleResponse(res) {
      let body;

      if (res.headers.get('Content-Type')?.includes('application/json')) {
        body = await res.json();
      } else {
        body = await res.text();
      }

      if (res.ok) {
        return body;
      }

      throw Error(res.body.error || res.body);
    },
  }
}