import { Configuration, DefaultApi, CounterApi } from "./pek-api";

export class PekApi {
  private readonly root: DefaultApi;
  private readonly counter: CounterApi;

  constructor(config: Configuration) {
    this.root = new DefaultApi(config);
    this.counter = new CounterApi(config);
  }

  ping = async () => await this.root.appControllerPing();
  incrementCounter = async () =>
    await this.counter.counterControllerIncrement();

  getCounter = async () => await this.counter.counterControllerGet();
}

const basePath = window.location.origin.startsWith("http://localhost")
  ? "http://localhost:4000"
  : window.location.origin;

export const api = new PekApi(new Configuration({ basePath }));

export default api;
