import { createParser } from 'eventsource-parser';
export type Dialog = {
  role: 'system' | 'user' | 'assistant';
  content: string;
}
export class Openai {
    key: string;
    gpt35 = ['gpt-3.5-turbo-0301','gpt-3.5-turbo'];
    model = 'gpt-3.5-turbo';
    maxTokens: number;
    constructor(key: string, mode:string, maxTokens: string) {
        this.key = key;
        this.model = mode;
        this.maxTokens = parseInt(maxTokens);
    }
    getUrl() {
      return this.gpt35.includes(this.model) ? 'https://api.openai.com/v1/chat/completions': 'https://api.openai.com/v1/completions' ;
    }
    private async getSSE(resource:string, options: any) {
        const { onData, ...fetchOptions } = options;
        const resp = await fetch(resource, fetchOptions);
        const feeder = createParser((event) => {
            if (event.type === 'event') {
                onData(event.data);
            }
        });
        if(resp.body === null) {
            throw new Error(' Null response body');
        }
        const textDecoder = new TextDecoder();
        const reader = resp.body.getReader();
        try {
            while (true) {
                const { done, value } = await reader.read();
                if (done) {
                    return void 0;
                } else {
                    const info = textDecoder.decode(value);
                    feeder.feed(info);
                }
            }
        } finally {
            reader.releaseLock();
        }
    }
    getBody(question: Dialog[]) {
      return this.gpt35.includes(this.model) ? JSON.stringify({
        model: this.model,
        messages: question,
        stream: true,
        max_tokens: this.maxTokens,
      }) : JSON.stringify({
        prompt: question,
        model: this.model,
        stream: true,
        max_tokens: this.maxTokens,
      });
    }
    parseMessage(data: any) {
      return this.gpt35.includes(this.model) ? (data.choices[0].delta.content || '') : data.choices[0].text;
    }
    async ask(questions: Dialog[], options: { signal?: any; onMessage?: any; }) {
        const { signal,onMessage: onData } = options;
        let message = '';
        const body = this.getBody(questions);
        return new Promise<string>((resolve, reject) => {
          try {
            this.getSSE(this.getUrl(), {
              method: 'POST',
              signal,
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${this.key}`,
              },
              body,
              onData:(str: string) => {
                if (str === '[DONE]') {
                  if(onData) {
                    onData({
                        message,
                        done: true,
                    });
                  }
                  resolve(message);
                  return;
                } else {
                  try {
                    const data = JSON.parse(str);
                    message += this.parseMessage(data);
                    if(onData) {
                      onData({
                          message,
                          done: false,
                      });
                    }
                  } catch (error) {
                    console.error(error);
                  }
                }
              },
            });
          } catch (error) {
            reject(error);
          }
        });
    }
}

