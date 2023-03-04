---
id: 6gIUwYEpor0pOejMnxBNVz
title: "Kubernetes用語集"
slug: "kubernetes-glossary"
about: " 仕事上kubernetesを学ぶ必要が出てきました。 筆者のレベルは、Docker・kubernetesの概念・必要性をやんわりと理解している状態です。  勉強をすすめる上で、わからない用語が次々と出てきたて頭の中がパンクしそうになったので、簡潔に随時まとめることとしました。"
createdAt: "2021-03-07T00:00+09:00"
updatedAt: "2021-03-07T00:00+09:00"
tags: ["Kubernetes", "Docker"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/4NwI8gjd802es2aMCmWay7/5b1d1468d43c4ffc3623b33decec3eea/k8s.png"
  title: "kubernets"
published: true
---
# はじめに

仕事上 kubernetes を学ぶ必要が出てきた。
筆者のレベルは、Docker・kubernetes の概念・必要性をやんわりと理解している状態である。

勉強をすすめるうえで、わからない用語が次々と出てきたて頭の中がパンクしそうになったので、簡潔に随時まとめることとした。

# 基本用語

## k8s

kubernetes の別名。k + 8 文字　+ s から。

## IaC (Infrastructure as Code)

インフラ構成管理をコード化すること。
再利用や自動化につなげる。

## ノード（Node）

実際にコンテナが起動するワーカーマシン。仮想マシン、物理マシンどちらであっても構わない。
ノード上に複数の Pod を持つ。

## Pod

1 つ以上のアプリケーションコンテナ。
Pod は Kubernetes プラットフォームの原子単位である。

## マスターノード

API エンドポイントの提供、コンテナのスケジューリング、コンテナのスケーリングなどを担うノード。

## ワーカーノード

実際にコンテナが起動するノード。

## Namespace

仮想的な Kubernetes クラスタの分離機能。
1 つの Kubernetes クラスタを複数チームで利用したり、プロダクション環境/ステージング環境/開発環境などのように環境ごとに分割することが可能。

## レプリカ(replicas)

同じコンテナイメージを持とにした複数のコンテナ。
負荷分散や耐障害性の確保のために通常複数のコンテナをデプロイする。

負荷に応じてコンテナのレプリカ数を自動的に増減（オートスケーリング）することが可能。

## スケジューリング

コンテナをデプロイする際にどのノードに配置するかを決定するステップ。

## セルフヒーリング

プロセスの停止を検知すると、　再度コンテナのスケジューリングを実行することで自動的にコンテナを再デプロイする機能。

標準で kubernetes によるコンテナのプロセス監視によって行われる。
また HTTP/TCP やシェルスクリプトによるヘルスチェックの成否を設定することも可能。

## etcd

オープンソースで分散型のキーバリューストア、
Kubernetes のプライマリーデータストアであり、すべての Kubernetes クラスタの状態を保存および複製する。

[etcd とは](https://www.redhat.com/ja/topics/containers/what-is-etcd)

## アノテーション

リソースに付与するメタ情報。
システムコンポーネントが世代情報のために自動保存したり、環境ごとに異なる設定を行う場合に使用する。

## ラベル

アノテーションと同じく、リソースに付与するメタ情報。
開発者がラベルによってフィルタリングを行ったり、システムが使用する。

# kubectl

kubectl は、Kubernetes クラスターを制御するためのコマンドラインツール。
以下の構文を使用する。

```sh
kubectl [command] [TYPE] [NAME] [flags]
```

## command

`create`、`get`、`describe`、`delete` などリソースに対する操作。

### create

リソースの作成。

### apply

リソースの更新。
変更差分がある場合には変更処理を行い、変更差分がない場合には何もしない。

またリソースが存在しない場合には、`create` コマンドと同様に新規作成するので、基本的には `create` コマンドよりも `apply` コマンドを使用するほうが利便性が高いといえる。

### delete

リソースの削除。

### wait

連続的にコマンドを実行する際などに、次のコマンドを実行する前にそれまで操作したリソースが意図する状態になってから次のコマンドを実行したい場合に使用する。

これは、Kubernetes にようる実際のリソースの処理は非同期で実行されるため必要である。

## diff

実際に Kubernetes クラスタに登録されている情報と手元にあるマニフェストの差分を表示。

## api-resources

利用可能なリソース種別の一覧取得。

## get

リソースの情報取得。

## describe

リソースの詳細情報の取得。

## exec

コンテナ上でのコマンドの実行。

## log

コンテナのログの確認。

## cp

コンテナとローカルマシン間でのファイルのコピー。

## --prune

`apply` コマンドで使用可能なオプション。
CI/CD パイプラインなどにおいて、リソースが削除された際に自動的に削除することが可能になる。

## TYPE

`pods`、`services`、'ingresses'などの[リソースタイプ](https://kubernetes.io/ja/docs/reference/kubectl/overview/#resource-types)・

## NAME

リソースの名前。

## flags

`-s` または `--server` などのオプションのフラグ。

## kubeconfig

Kubectl がマスターノードと通信する際に必要な接続先サーバーの情報や認証情報などが書かれるファイル。
デフォルトでは `~/.kube/config` に配置される。

kubeconfig の設定を変更するには直接編集する以外にも、kubectl コマンドを用いることができる。

Context を切り替えることによって、複数の環境で複数の権限で操作できるように設計がされている。

## kubectx/kubens

Context や Namespace の切り替えを楽にしてくれるコマンドラインツール。

# Kubenetes環境

## GKE(Google Container Engine)

Google Cloud Platfformt が提供するマネージド kubernetes サービス。

- 提供開始 2014 年 11 月
- GA(Generally Avaiable) 2015 年 8 月

## AKS(Azure Container Service)

MictosoftAzure が提供するマネージド kubernetes サービス。

- 提供開始 2017 年 2 月
- GA(Generally Avaiable) 2018 年 6 月

## EKS(Elastic Kubernetes Service)

Amazon Web Serices が提供するマネージド kubernetes サービス。

- 提供開始 2017 年 11 月
- GA(Generally Avaiable) 2018 年 6 月

## Minikube

ローカルの kubenetes 環境。
手元のマシン上で気軽に kubenetes を試すことができる。
個人での動作環境や開発環境用。プロダクション環境には適していない。

## kind (Kubernetes in Docker)

Kubernetes の自体の開発のために作られたツール。
ローカル環境でマルチノードクラスタを構築するのに適している。

# Kubenetesのリソース

## Workloads APIsカテゴリ

コンテナの実行に関するリソース。

- Pod
- ReplicaSet
- Deployment
- DaemonSet
- StatefulSet
- Job
- CronJob

## ReplicaSet

Pod のレプリカを作成し、指定した数の Pod を維持し続けるリソース。
Kubenetes の大事なコンセプトの 1 つである「セルフヒーリング」を支える。

ReplicaSet は Pod の監視を行うことで Pod の数を調整し、監視を行う際には特定のラベルが付けられた Pod の数を監視する形で実現する。

## Deployment

複数の ReplicaSet を関することで、ローリングアップデートやろーつバックなどを実現するリソース。
Deployment → ReplicaSet → Pod の 3 層の親子関係になっている。

Deployment は Kubernetes ではもっとも推奨されているコンテナの起動方法とされている。

### Deploymentのアップロード戦略

- Recreate
- RollingUpdate

#### Recreate

一度すべての Pod を削除してから再度 Pod を作成する。

#### RollingUpdate

アップデート中に許容される不足 Pod 数（maxUnavailable）と超過 Pod 数（maxSurge）を設定可能。

## DeamonSet

ReplicaSet の特殊な形とも言えるリソース。
ReplicaSet は各 Kubernetes Node 上の Pod の数がなどしくなるとは限らないうえに、すべての Node 上に確実に配置されるとも限らない。

一方 DeamonSet は、各 Node に 1 つづつ配置するリソースである。
そのため、レプリカ数の指定や 1Node に 2Pod ずつ配置するなどはできない。

fluentd のようなログ収集デーモンなど、全 Node で確実に起動させたいプロセスのために利用される。

## StateFulSet

名前通り、データベースなどステートフルないワークロードに対応するリソース。

作成される Pod 名のサフィックスが連番のインデックスが付与されたもの（0, 1, 2 ...）になり、Pod が順序付けられる。
つまり、スケールアウトさせていく際にはインデックスが一番小さいものから 1 つづつ作成し、スケールインさせる場合には、インデックスが一番大きものから削除する。

0 番目の Pod をマスターノードとするような冗長化構成を持つアプリケーションに適している。

## Job

コンテナを利用して一度限りの処理を実行させるリソース。
ReplicaSet との違いは、起動する Pod が停止することを前提として作られていることである。

## CronJob

スケジュールされた時間に Job を作成する。
CronJob と Job の関係は Deployment と ReplicaSet の関係に似ている。
つまり、CronJob → Job → Pod の 3 層の親子関係である。

## Service APIsカテゴリ

コンテナを外部公開するようなエンドポイントを提供するリソース。

Pod は起動するごとにそれぞれ異なる IP アドレスが割り当てられるため、独自にロードバランシングを実装しようとすると各 Pod の IP アドレスを毎回調べる必要がある。
これに対して Service を利用すると、複数の Pod に対するロードバランシングを自動的に構成できる。また Service はロードバランシングの接続口となるエンドポイントも提供する。

利用者が直接利用するリソースには、L4 ロードバランシングを提供する Service リソースと L7 ロードバランシングを提供する Ingress リソースの 2 種類のリソースがある。

- Service
  - ClusterIP
  - ExternalIP
  - NodePort
  - LoadBalancer
  - Headless
  - ExternalName
  - None-Selector
- Ingress

### ClusterIP Service

Kubernetes のもっとも基本となる Service。
Kubernetes クラスタ内からのみ疎通性がある Internal Network に作り出される仮想 IP が割り当てられる。

Kubernetes クラスタ外からトラフィックを受けつ必要がない箇所などでクラスタ内ロードバランサとして利用される。

ClusterIP は、`kubectl apply` などによって後から設定値を更新できないイミュータブルになっている。
ClusterIP を指定したい場合には、削除してから再作成する必要がある。

### ExternalIP Service

指定した Kubernetes Node の IP アドレス：ポートで受信したトラフィックをコンテナに転送する形で外部疎通性を確立する Service。
特別な事情がない場合には、代わりに NodePort Service の利用を検討する。

### NodePort Service

すべての Kubernetes Node の IP アドレス：ポートで受信したトラフィックをコンテナに転送する形で外部疎通性を確立する Service。

### LoadBalancer Service

Kubernetes クラスタ外のロードバランサに外部疎通性のある仮想 IP あを払い出す。
通常 GCP・AWS・Azure などのクラウドプロパイダのようにインフラがロードバランサの仕組みに対応している必要がある。

### セッションアフィニティ（スティッキーセッション）

Service に紐づくいずれか 1 つの Pod に対して転送された後、その後のトラフィックもずっと同じ Pod に送られるようになる。

### Headless Service

対象となる個々の Pod の IP アドレスが直接帰ってくる Service。
ロードバランシングするための IP アドレスは提供されず、ラウンドロビンを使ったエンドポイントを提供する。

### ExternalName Service

通常の Service リソースとは異なり、Service 名の名前解決に対して外部のドメイン宛の CNAME を返す。

### None-Selector Service

Service 名で名前解決を行うと自分で指定したメンバに対してロードバランシングを行う。
ExternalName Service では CNAME が返るのに対して、None-Selector Service では ClusterIP の A レコードが返る。
そのため、Kubernetes の Service の使用感のまま、外部向けにロードバランシングを行うことが可能になる。

### Ingress

これまでの Service は L4 ロードバランシングを提供するリソースであるのに対し、Ingress は L7 ロードバランシングを提供するリソースであるため、位置づけが大きく異る。
そのため、Service の Type の 1 つではなく、独立したリソースとして実装されている。

Ingress のリソースを作成するだけではなにもしないので、Ingress リソースを処理する Ingress コントローラーを導入する必要がある。

## Config & Storage APIsカテゴリ

設定・機密情報・永続化ボリュームなどに関するリソース。

- Sercret
- ConfigMap
- PersistentVolumeClaim

## Cluster APIsカテゴリ

セキュリティやクォータなどに関するリソース。

## Metadata APIsカテゴリ

クラスタ内の他のリソースを操作するためのリソース。

##

# 参考リンク

[kubenetesドキュメント](https://kubernetes.io/ja/docs/home/)
[Kubernetes完全ガイド 第2版](https://www.amazon.co.jp/dp/4295004804)
[Kubernetes Tutorial for Beginners [FULL COURSE in 4 Hours]
](https://www.youtube.com/watch?v=X48VuDVv0do)
