import { Configuration, DefaultApi, CountersApi } from "./generated/pek-api";

export class PekApi {
  private readonly root: DefaultApi;
  private readonly counter: CountersApi;

  constructor(config: Configuration) {
    this.root = new DefaultApi(config);
    this.counter = new CountersApi(config);
  }

  ping = async () => await this.root.appControllerPing();
  incrementCounter = async () =>
    await this.counter.countersControllerIncrement();

  getCounter = async () => await this.counter.countersControllerGetCount();
}

const basePath = window.location.origin.startsWith("http://localhost")
  ? "http://localhost:4000"
  : window.location.origin;

export const api = new PekApi(new Configuration({ basePath }));

export default api;
