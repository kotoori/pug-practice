import { defineConfig } from "vite";

export default defineConfig({
  root: "src",  //index.html(index.pug)のあるディレクトリの、作業中ディレクトリからの相対パス
  build:{
    outDir: "../dist",  //ビルド後のディレクトリの、rootからの相対パス
    
    }
});