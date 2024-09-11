class Image {
  url: string | null;
  width: number;
  height: number;
  pixels: number;
  constructor(data: Record<string, any>) {
    this.url = data.url || null;
    this.width = data.width || 0;
    this.height = data.height || 0;
    this.pixels = this.width * this.height;
  }

  toString(): string | null {
    return this.url;
  }
}

export default Image;
