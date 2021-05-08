import { setLocale } from "umi-plugin-react/locale";
setTimeout(() => {
  setLocale("en-US");
}, 500);

export const dva = {
  config: {
    onError(e) {
      e.preventDefault();
      console.error(e.message);
    },
  },
  plugins: [
    require("dva-logger")(),
  ],
};
