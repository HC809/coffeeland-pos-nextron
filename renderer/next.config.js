module.exports = {
  //comment for Next Dev
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.target = "electron-renderer";
    }

    return config;
  },
  images: {
    loader: "akamai", //comment for Next Dev
    domains: ["localhost", "127.0.0.1:8000"],
    path: "", //comment for Next Dev
  },
  //comment for Elctron App
  // ...(process.env.NODE_ENV === 'production' && {
  //   typescript: {
  //     ignoreBuildErrors: true,
  //   },
  //   eslint: {
  //     ignoreDuringBuilds: true,
  //   },
  // }),
};
