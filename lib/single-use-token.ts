/** A token can be handed to exactly one request. Never persist it in storage. */
export class SingleUseToken {
  private token: string | null = null;
  private pending: { resolve: (value: string) => void; reject: (error: Error) => void; timer: ReturnType<typeof setTimeout> } | null = null;

  constructor(private renew: () => void, private timeoutMs = 20_000) {}

  setRenew(renew: () => void) { this.renew = renew; }

  receive(token: string | null) {
    this.token = token;
    if (token && this.pending) {
      const pending = this.pending;
      this.pending = null;
      clearTimeout(pending.timer);
      this.token = null;
      pending.resolve(token);
    }
  }

  take(): Promise<string> {
    if (this.pending) return Promise.reject(new Error("Token request already pending"));
    if (this.token) {
      const token = this.token;
      this.token = null;
      return Promise.resolve(token);
    }
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => this.cancel(), this.timeoutMs);
      this.pending = { resolve, reject, timer };
      this.renew();
    });
  }

  cancel() {
    this.token = null;
    if (!this.pending) return;
    clearTimeout(this.pending.timer);
    this.pending.reject(new Error("Security verification unavailable. Retry the request."));
    this.pending = null;
  }
}
