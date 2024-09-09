class Image {
  url: string;
  width: number;
  height: number;
  constructor(data: Record<string, any>) {
    this.url = data.url;
    this.width = data.width;
    this.height = data.height;
  }

  toString(): string {
    return this.url;
  }

  toJSON(): Record<string, any> {
    return {
      url: this.url,
      width: this.width,
      height: this.height
    };
  }
}

export default Image;
