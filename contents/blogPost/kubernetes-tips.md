---
id: 2fMBkMIaClSomYV1a9yhUo
title: "Kubernetes Tips"
slug: "kubernetes-tips"
about: "知っていると時間を短縮できるようなkubectlコマンドのtipsです。"
createdAt: "2021-04-04T00:00+09:00"
updatedAt: "2021-04-04T00:00+09:00"
tags: ["Kubernetes"]
published: true
---
# 現在存在するすべてのリソースの数を得る

```sh
$ kubectl get all --no-headeres | wc -l
```

`get all` コマンドはすべてのリソースを得るコマンド。`--no-headers` オプションを渡すとヘッダーの行が出力されなくなるので、行数を数えればそれがリソースの数と一致することになる。
パイプで `wc` コマンドに渡して行数をカウントを出力する。`-l` オプションは外業の数を表示する。

# 作成するリソースのひな形をyamlとして出力する

```sh
$ kubectl run nginx --image nginx -0=yaml --dry-run=client > nginx.yaml
```

- nginx.yaml

```yaml
apiVersion: v1
kind: Pod
metadata:
  creationTimestamp: null
  labels:
    run: nginx
  name: nginx
spec:
  containers:
  - image: nginx
    name: nginx
    resources: {}
  dnsPolicy: ClusterFirst
  restartPolicy: Always
status: {}
```

ドライラン（`--dry-run=client`）した結果を yaml として出力（`-o=yaml`）して、結果をファイルに保存 `> nginx.yaml` することで簡単に yaml ファイルのひな形を出力できる。

### その他の例

- deployment

```sh
$ kubectl create deployment nginx --image nginx -o=yaml --dry-run=client > deployment.yaml
```

```yaml
piVersion: apps/v1
kind: Deployment
metadata:
  creationTimestamp: null
  labels:
    app: nginx
  name: nginx
spec:
  replicas: 1
  selector:
    matchLabels:
      app: nginx
  strategy: {}
  template:
    metadata:
      creationTimestamp: null
      labels:
        app: nginx
    spec:
      containers:
      - image: nginx
        name: nginx
        resources: {}
status: {}
```

- service

```sh
$ kubectl expose deployment nginx --port=80 --dry-run=client -o=yaml > service.yaml
```

# エイリアス

エイリアスを登録しておくと、コマンドを打つ時間を短縮できる。

```sh
$ alias k="kubectl"
```

# describeの出力結果を絞り込む

例えば、deployment に適用されている Image を出力したいとき。

```sh
$ kubectl describe deployment some-deployment | grep -i image
```

パイプで出力結果を `grep` に渡す。`-i` オプションは、大文字小文字を区別しない。

