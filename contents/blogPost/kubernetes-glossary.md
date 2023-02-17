---
title: "Kubernetes用語集"
about: " 仕事上kubernetesを学ぶ必要が出てきました。 筆者のレベルは、Docker・kubernetesの概念・必要性をやんわりと理解している状態です。  勉強をすすめる上で、わからない用語が次々と出てきたて頭の中がパンクしそうになったので、簡潔に随時まとめることとしました。"
createdAt: "2021-03-07T00:00+09:00"
updatedAt: "2021-03-07T00:00+09:00"
tags: ["Kubernetes", "Docker"]
published: true
---
# はじめに

仕事上kubernetesを学ぶ必要が出てきました。
筆者のレベルは、Docker・kubernetesの概念・必要性をやんわりと理解している状態です。

勉強をすすめる上で、わからない用語が次々と出てきたて頭の中がパンクしそうになったので、簡潔に随時まとめることとしました。

# 基本用語

## k8s

kubernetesの別名。k + 8文字　+ sから。

## IaC (Infrastructure as Code)

インフラ構成管理をコード化すること。
再利用や自動化につなげる。

## ノード（Node）

実際にコンテナが起動するワーカーマシン。仮想マシン、物理マシンどちらであっても構わない。
ノード上に複数のPodを持つ。

## Pod

1つ以上のアプリケーションコンテナ。
PodはKubernetesプラットフォームの原子単位である。

## マスターノード

APIエンドポイントの提供、コンテナのスケジューリング、コンテナのスケーリングなどを担うノード

## ワーカーノード

実際にコンテナが起動するノード。

## Namespace

仮想的なKubernetesクラスタの分離機能。
1つのKubernetesクラスタを複数チームで利用したり、プロダクション環境/ステージング環境/開発環境などのように環境ごとに分割することが可能。

## レプリカ(replicas)

同じコンテナイメージを持とにした複数のコンテナ。
負荷分散や耐障害性の確保のために通常複数のコンテナをデプロイする。

負荷に応じてコンテナのレプリカ数を自動的に増減（オートスケーリング）することが可能

## スケジューリング

コンテナをデプロイする際にどのノードに配置するかを決定するステップ。

## セルフヒーリング

プロセスの停止を検知すると、　再度コンテナのスケジューリングを実行することで自動的にコンテナを再デプロイする機能。

標準でkubernetesによるコンテナのプロセス監視によって行われる。
また、HTTP/TCPやシェルスクリプトによるヘルスチェックの成否を設定することも可能。

## etcd

オープンソースで分散型のキーバリューストア、
Kubernetes のプライマリーデータストアであり、すべての Kubernetesクラスタの状態を保存および複製する。

[etcd とは](https://www.redhat.com/ja/topics/containers/what-is-etcd)

## アノテーション

リソースに付与するメタ情報。
システムコンポーネントが世代情報のために自動保存したり、環境ごとに異なる設定を行う場合に使用する。

## ラベル

アノテーションと同じく、リソースに付与するメタ情報。
開発者がラベルによってフィルタリングを行ったり、システムが使用する。

# kubectl

kubectlは、Kubernetesクラスターを制御するためのコマンドラインツール。
以下の構文を使用する。

```sh
kubectl [command] [TYPE] [NAME] [flags]
```

## command

`create`、`get`、`describe`、`delete`などリソースに対する操作。

### create

リソースの作成。

### apply

リソースの更新。
変更差分がある場合には変更処理を行い、変更差分がない場合には何もしない。

また、リソースが存在しない場合には、`create`コマンドと同様に新規作成するので、基本的には`create`コマンドよりも`apply`コマンドを使用するほうが利便性が高いといえる。

### delete

リソースの削除。

### wait

連続的にコマンドを実行する際などに、次のコマンドを実行する前にそれまで操作したリソースが意図する状態になってから次のコマンドを実行したい場合に使用する。

これは、Kubernetesにようる実際のリソースの処理は非同期で実行されるため必要である。

## diff

実際にKubernetesクラスタに登録されている情報と手元にあるマニフェストの差分を表示。

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

`apply`コマンドで使用可能なオプション。
CI/CDパイプラインなどにおいて、リソースが削除された際に自動的に削除することが可能になる。

## TYPE

`pods`、`services`、'ingresses'などの[リソースタイプ](https://kubernetes.io/ja/docs/reference/kubectl/overview/#resource-types)・

## NAME

リソースの名前。

## flags

`-s`または`--server`などのオプションのフラグ。

## kubeconfig

Kubectlがマスターノードと通信する際に必要な接続先サーバの情報や認証情報などが書かれるファイル。
デフォルトでは`~/.kube/config`に配置される。

kubeconfigの設定を変更するには直接編集する以外にも、kubectlコマンドを用いることができる。

Contextを切り替えることによって、複数の環境で複数の権限で操作できるように設計がされている。

## kubectx/kubens

ContextやNamespaceの切り替えを楽にしてくれるコマンドラインツール。

# Kubenetes環境

## GKE(Google Container Engine)

Google Cloud Platfformtが提供するマネージドkubernetesサービス。

- 提供開始 2014年11月
- GA(Generally Avaiable) 2015年8月

## AKS(Azure Container Service)

MictosoftAzureが提供するマネージドkubernetesサービス。

- 提供開始 2017年2月
- GA(Generally Avaiable) 2018年6月

## EKS(Elastic Kubernetes Service)

Amazon Web Sericesが提供するマネージドkubernetesサービス。

- 提供開始 2017年11月
- GA(Generally Avaiable) 2018年6月

## Minikube

ローカルのkubenetes環境。
手元のマシン上で気軽にkubenetesを試すことができる。
個人での動作環境や開発環境用。プロダクション環境には適していない。

## kind (Kubernetes in Docker)

Kubernetesの自体の開発のために作られたツール。
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

Podのレプリカを作成し、指定した数のPodを維持し続けるリソース。
Kubenetesの大事なコンセプトの1つである「セルフヒーリング」を支える。

ReplicaSetはPodの監視を行うことでPodの数を調整し、監視を行う際には特定のラベルが付けられたPodの数を監視する形で実現する。

## Deployment

複数のReplicaSetを関することで、ローリングアップデートやろーつバックなどを実現するリソース。
Deployment → ReplicaSet → Podの3層の親子関係になっている。

DeploymentはKubernetesでは最も推奨されているコンテナの起動方法とされている。

### Deploymentのアップロード戦略

- Recreate
- RollingUpdate

#### Recreate

一度すべてのPodを削除してから再度Podを作成する。

#### RollingUpdate

アップデート中に許容される不足Pod数(maxUnavailable)と超過Pod数(maxSurge)を設定可能。

## DeamonSet

ReplicaSetの特殊な形とも言えるリソース。
ReplicaSetは各Kubernetes Node上のPodの数が等しくなるとは限らない上に、すべてのNode上に確実に配置されるとも限らない。

一方DeamonSetは、各Nodeに1つづつ配置するリソースである。
そのため、レプリカ数の指定や1Nodeに2Podずつ配置するなどはできない。

fluentdのようなログ収集デーモンなど、全Nodeで確実に起動させたいプロセスのために利用される。

## StateFulSet

名前通り、データベースなどステートフルないワークロードに対応するリソース。

作成されるPod名のサフィックスが連番のインデックスが付与されたもの(0, 1, 2 ...)になり、Podが順序付けられる。
つまり、スケールアウトさせていく際にはインデックスが一番小さいものから1つづつ作成し、スケールインさせる場合には、インデックスが一番大きものから削除する。

0番目のPodをマスターノードとするような冗長化構成を持つアプリケーションに適している。

## Job

コンテナを利用して一度限りの処理を実行させるリソース。
ReplicaSetととの違いは、起動するPodが停止することを前提として作られていることである。

## CronJob

スケジュールされた時間にJobを作成する。
CronJobとJobの関係はDeploymentとReplicaSetの関係に似ている。
つまり、CronJob → Job → Podの3層の親子関係である。

## Service APIsカテゴリ

コンテナを外部公開するようなエンドポイントを提供するリソース。

Podは起動するごとにそれぞれ異なるIPアドレスが割り当てられるため、独自にロードバランシングを実装しようとすると各PodのIPアドレスを毎回調べる必要がある。
これに対してServiceを利用すると、複数のPodに対するロードバランシングを自動的に構成できる。また、Serviceはロードバランシングの接続口となるエンドポイントも提供する。

利用者が直接利用するリソースには、L4ロードバランシングを提供するServiceリソースとL7ロードバランシングを提供するIngressリソースの2種類のリソースがある。

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

Kubernetesの最も基本となるService。
Kubernetesクラスタ内からのみ疎通性があるInternal Networkに作り出される仮想IPが割り当てられる。

Kubernetesクラスタ外からトラフィックを受けつ必要がない箇所などでクラスタ内ロードバランサとして利用される。

ClusterIPは、`kubectl apply`などによって後から設定値を更新することができないイミュータブルになっている。
ClusterIPを指定したい場合には、削除してから再作成する必要がある。

### ExternalIP Service

指定したKubernetes NodeのIPアドレス:ポートで受信したトラフィックをコンテナに転送する形で外部疎通性を確立するService。
特別な事情がない場合には、代わりにNodePort Serviceの利用を検討する。

### NodePort Service

すべてのKubernetes NodeのIPアドレス:ポートで受信したトラフィックをコンテナに転送する形で外部疎通性を確立するService。

### LoadBalancer Service

Kubernetesクラスタ外のロードバランサに外部疎通性のある仮想IPあを払い出す。
通常GCP・AWS・Azure等のクラウドプロパイダのようにインフラがロードバランサの仕組みに対応している必要がある。

### セッションアフィニティ（スティッキーセッション）

Serviceに紐づくいずれか一つのPodに対して転送された後、その後のトラフィックもずっと同じPodに送られるようになる。

### Headless Service

対象となる個々のPodのIPアドレスが直接帰ってくるService。
ロードバランシングするためのIPアドレスは提供されず、ラウンドロビンを使ったエンドポイントを提供する。

### ExternalName Service

通常のServiceリソースとは異なり、Service名の名前解決に対して外部のドメイン宛のCNAMEを返す。

### None-Selector Service

Service名で名前解決を行うと自分で指定したメンバに対してロードバランシングを行う。
ExternalName ServiceではCNAMEが返るのに対して、None-Selector ServiceではClusterIPのAレコードが返る。
そのため、KubernetesのServiceの使用感のまま、外部向けにロードバランシングを行うことが可能になる。

### Ingress

これまでのServiceはL4ロードバランシングを提供するリソースであるのに対し、IngressはL7ロードバランシングを提供するリソースであるため、位置づけが大きく異る。
そのため、ServiceのTypeの1つではなく、独立したリソースとして実装されている。

Ingressのリソースを作成するだけではなにもしないので、Ingressリソースを処理するIngressコントローラーを導入する必要がある。

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
