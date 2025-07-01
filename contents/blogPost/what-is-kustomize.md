---
id: 2kPYTtq7o08cwP6bDfQopm
title: "Kustomizeとは"
slug: "what-is-kustomize"
about: "Kustomizeとは、Kubernetesコミュニティのsig-cliが提供しているマニフェストのテンプレーティングツールです。環境ごとにマニフェストを生成したり特定のフィールドを上書きするといった機能が提供されています。"
createdAt: "2021-03-21T00:00+09:00"
updatedAt: "2021-03-21T00:00+09:00"
tags: ["Kubernetes", "Kustomize"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/4NwI8gjd802es2aMCmWay7/5b1d1468d43c4ffc3623b33decec3eea/k8s.png"
  title: "kubernets"
audio: null
selfAssessment: null
published: true
---
# Kustomizeとは

Kustomize とは、Kubernetes コミュニティの sig-cli が提供しているマニフェストのテンプレーティングツールです。環境ごとにマニフェストを生成したり特定のフィールドを上書きするといった機能が提供されています。

https://kustomize.io/

kubernetes へのデプロイは通常マニフェストを用いて管理することになります。
しかし、実際に利用するにあたっては開発環境・ステージング環境・本番環境などの違いによってそれぞれマニフェストの差分が生じます。

愚直に kubectl コマンドのみを利用する場合には、共通部分も含めて複数の YAML ファイルで管理せざるを得なくなり、共通部分の設定の変更漏れなどが考えられます。

このような問題を解決する手段の 1 つが*kustomize*です。kustomize は、ベースとなるマニフェストに対して環境ごとの設定をパッチとして与えるという形でマニフェストを管理します。

Kubernetes 1.14 から Kustomize が kubectl に統合され、`kubectl apply -k <ディレクトリ>` コマンドとして利用できるようになっています。

 # 試してみる

 kustomize を実際に試してみます。
 こちらの記事のサンプルコードを使わさせていただきました。

 https://www.atmarkit.co.jp/ait/articles/2101/21/news004.html

 https://github.com/cloudnativecheetsheet/kustomize

 ディレクトリの構成は以下のとおりになっています。

 ```sh
├── base
│   ├── deployment.yaml
│   ├── kustomization.yaml
│   └── service.yaml
└── overlays
    └── prod
        ├── kustomization.yaml
        └── patch.yaml
```

`base` フォルダ配下に存在するマニフェストが、ベースとなるマニフェストです。
`overlays` フォルダ配下に環境ごとの差分が配置されます。この例では、`prod` フォルダのみですが、例えば `dev` フォルダ `staging` フォルダのように環境が追加されるごとにフォルダを追加します。

各フォルダに存在する `kustomization.yaml` ファイルが環境ごとのパッチの処理を記述します。

## baseフォルダ

`base` フォルダのマニフェストを見ていきます。`deployment.yaml` と `service.yaml` は通常のマニフェストと代わりありません。

- deployment.yaml

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-deployment
  labels:
    app: nginx
spec:
  replicas: 1
  selector:
    matchLabels:
      app: nginx
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
      - name: nginx
        image: nginx:1.14.2
        ports:
        - containerPort: 80
```

- service.yaml

```yaml
apiVersion: v1
kind: Service
metadata:
  name: nginx-service
spec:
  selector:
    app: nginx
  ports:
  - protocol: TCP
    port: 80
    targetPort: http
```

`kustomize.yaml` は、`resources` に kustomize が対象とするマニフェストを指定します。

- kustomize.yaml

```yaml
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization

resources:
  - deployment.yaml
  - service.yaml
```

`kubectl kustomize ＜ディレクトリ名＞` コマンドによって適用されるマニフェストを標準出力で確認できます。

```sh
$ kubectl kustomize base
apiVersion: v1
kind: Service
metadata:
  name: nginx-service
spec:
  ports:
  - port: 80
    protocol: TCP
    targetPort: http
  selector:
    app: nginx
---
apiVersion: apps/v1
kind: Deployment
metadata:
  labels:
    app: nginx
  name: nginx-deployment
spec:
  replicas: 1
  selector:
    matchLabels:
      app: nginx
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
      - image: nginx:1.14.2
        name: nginx
        ports:
        - containerPort: 80
```

## overlaysフォルダ

`overlays` フォルダを確認します。

`patch.yaml` ファイルには、適用する差分を記述しています。
`base` ディレクトリの `deployment.yaml` では `replicas: 1` に設定されていました、この値を `replicas: 3` に修正します。

- patch.yaml

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-deployment
spec:
  replicas: 3
```

`overlays` フォルダの `kustomization.yaml` の `bases` には `base` フォルダのパスを指定します。
`patches` はさきほどの修正差分を記述したファイルのパスを定義します。

?> サンプルコードでは bases が resources になっていましたが、エラーとなるので修正しています。

- kustomization.yaml

```yaml
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization

bases:
  - ../../base

patches:
  - patch.yaml
```

`kubectl kustomize` コマンドで確認してみます。

```sh
$ kubectl kustomize overlays/prod
apiVersion: v1
kind: Service
metadata:
  name: nginx-service
spec:
  ports:
  - port: 80
    protocol: TCP
    targetPort: http
  selector:
    app: nginx
---
apiVersion: apps/v1
kind: Deployment
metadata:
  labels:
    app: nginx
  name: nginx-deployment
spec:
  replicas: 3
  selector:
    matchLabels:
      app: nginx
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
      - image: nginx:1.14.2
        name: nginx
        ports:
        - containerPort: 80
```

期待通り、`replicas: 3` と変更されていることが確認できます。

# 終わりに

kustomize の良い点として、学習コストが低いことが上げられます。
単純なサンプルを例として使用しましたが、新たに覚えるべき記法はほとんど存在しません。kubectl コマンドにも組み込まれているので、新たにツールをインストールする必要もありません。

このあたりの利点が、Helm と比べたときの利点となるのではないでしょうか？
