const common = {
  name: "",
  online: true,
  storage: {
    blobStoreName: "default",
    strictContentTypeValidation: true,
    writePolicy: "allow_once",
  },
}

const proxy = {
  ...common,
  proxy: {
    remoteUrl: "",
    contentMaxAge: 1440,
    metadataMaxAge: 1440,
  },
  negativeCache: {
    enabled: true,
    timeToLive: 1440,
  },
  httpClient: {
    blocked: false,
    autoBlock: true,
    connection: {
      retries: 0,
      userAgentSuffix: "string",
      timeout: 60,
      enableCircularRedirects: false,
      enableCookies: false,
      useTrustStore: false,
    },
  },
}

const hosted = {
  ...common,
  component: {
    proprietaryComponents: true,
  },
}

const apthosted = {
  ...hosted,
  apt: {
    distribution: "bionic",
    flat: false,
  },
  aptSigning: {
    keypair: "string",
    passphrase: "string",
  },
}

const aptproxy = {
  ...proxy,
  apt: {
    distribution: "bionic",
    flat: false,
  },
}

const yumhosted = {
  ...hosted,
  yum: {
    repodataDepth: 5,
    deployPolicy: "STRICT",
  },
}

const yumproxy = {
  ...proxy,
  yumSigning: {
    keypair: "string",
    passphrase: "string",
  },
}

const dockerhosted = {
  ...hosted,
  docker: {
    v1Enabled: true,
    forceBasicAuth: true,
    httpPort: 8082,
    httpsPort: 8083,
    subdomain: "docker-a",
  },
}

const dockerproxy = {
  ...proxy,
  routingRule: "string",
  replication: {
    preemptivePullEnabled: "false",
    assetPathRegex: "string",
  },
  docker: {
    v1Enabled: true,
    forceBasicAuth: true,
    httpPort: 8082,
    subdomain: "docker-a",
  },
  dockerProxy: {
    indexType: "HUB",
    indexUrl: "https://index.docker.io/",
    cacheForeignLayers: true,
    foreignLayerUrlWhitelist: ["string"],
  },
}

export const optionTypes = {
  yumhosted: yumhosted,
  yumproxy: yumproxy,
  apthosted: apthosted,
  aptproxy: aptproxy,
  dockerproxy: dockerproxy,
  dockerhosted: dockerhosted,
}
