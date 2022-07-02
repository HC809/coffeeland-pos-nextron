module.exports = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.target = "electron-renderer";
    }

    return config;
  },
  images: {
    //loader: "akamai",
    domains: ["localhost", "127.0.0.1:8000"],
    //path: "",
  },
};
