module.exports = {
  apps: [
    {
      name: "dash", // Uygulamanın ismi
      script: "serve", // serve komutu kullanarak çalıştırıyoruz
      args: "-s build", // React uygulamasının build klasörünü kullanarak sunuyoruz
      env: {
        PORT: 4000, // Uygulamanın çalışacağı port
        NODE_ENV: "development", // Geliştirme ortamı
      },
      env_production: {
        PORT: 4005, // Üretim ortamında farklı bir port kullanabilirsiniz
        NODE_ENV: "production", // Üretim ortamı
      },
    },
  ],
};
