
export default {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx,html}","./src/components/**/**/*.{js,ts,jsx,tsx,html}",
    ],
    theme: {
      extend: {
        colors:{
            'custom-pink':'#ffccff',
        }
      },
    },
    plugins: [],
  };